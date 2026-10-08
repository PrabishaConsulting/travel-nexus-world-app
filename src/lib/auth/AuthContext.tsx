import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AUTH_CLIENT_ID, AUTH_DISCOVERY, AUTH_REDIRECT_URI, AUTH_SCOPES } from './config'
import { decodeJwtPayload } from './jwt'

WebBrowser.maybeCompleteAuthSession()

export interface AuthUser {
  sub: string
  email?: string
  name?: string
  role?: string
  image?: string
}

interface StoredSession {
  accessToken: string
  idToken: string
  expiresAt: number
  user: AuthUser
}

const STORAGE_KEY = 'auth-session'

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticating: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return
        const parsed: StoredSession = JSON.parse(raw)
        if (parsed.expiresAt > Date.now()) {
          setSession(parsed)
        } else {
          SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const login = async () => {
    setError(null)
    setIsAuthenticating(true)
    try {
      const request = new AuthSession.AuthRequest({
        clientId: AUTH_CLIENT_ID,
        redirectUri: AUTH_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        scopes: AUTH_SCOPES,
        usePKCE: true,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      })

      const result = await request.promptAsync(AUTH_DISCOVERY, {
        preferEphemeralSession: false,
      })

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return
      }
      if (result.type !== 'success') {
        setError(result.type === 'error' ? result.error?.message ?? 'Login failed' : 'Login failed')
        return
      }
      if (result.params.error) {
        setError(result.params.error_description || result.params.error)
        return
      }
      if (!request.codeVerifier) {
        setError('Missing PKCE verifier')
        return
      }

      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: AUTH_CLIENT_ID,
          code: result.params.code,
          redirectUri: AUTH_REDIRECT_URI,
          extraParams: { code_verifier: request.codeVerifier },
        },
        AUTH_DISCOVERY
      )

      if (!tokenResponse.idToken) {
        setError('No profile info returned')
        return
      }

      const claims = decodeJwtPayload<AuthUser>(tokenResponse.idToken)
      if (!claims) {
        setError('Could not read profile info')
        return
      }

      const newSession: StoredSession = {
        accessToken: tokenResponse.accessToken,
        idToken: tokenResponse.idToken,
        expiresAt: Date.now() + (tokenResponse.expiresIn ?? 3600) * 1000,
        user: claims,
      }

      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newSession))
      setSession(newSession)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {})
    setSession(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isLoading,
      isAuthenticating,
      error,
      login,
      logout,
    }),
    [session, isLoading, isAuthenticating, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
