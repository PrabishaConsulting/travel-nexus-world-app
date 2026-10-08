import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import translations, { LANGUAGES, type LanguageCode, type TranslationKey } from './translations'

const STORAGE_KEY = 'settings:language'

interface I18nContextValue {
  language: LanguageCode
  setLanguage: (code: LanguageCode) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && saved in translations) setLanguageState(saved as LanguageCode)
    })
  }, [])

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code)
    AsyncStorage.setItem(STORAGE_KEY, code).catch(() => {})
    // Note: full RTL layout mirroring (I18nManager.forceRTL) requires an app reload
    // to take effect in React Native, so Arabic currently renders RTL text within
    // the existing LTR layout rather than mirroring the whole screen.
  }

  const t = useMemo(() => {
    return (key: TranslationKey, vars?: Record<string, string | number>) => {
      let str = translations[language][key] ?? translations.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{{${k}}}`, String(v))
        }
      }
      return str
    }
  }, [language])

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t }), [language, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export { LANGUAGES }
export type { LanguageCode, TranslationKey }
