import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { UpdatePrompt } from '@/components/UpdatePrompt'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { I18nProvider, useI18n } from '@/lib/i18n/I18nContext'
import { initSoundSettings } from '@/lib/sound'
import { ThemeProvider, useTheme } from '@/lib/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

function RootStack() {
  const { colors, resolvedScheme } = useTheme()
  const { t } = useI18n()

  return (
    <>
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.headerForeground,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="destination/[slug]" options={{ title: 'Destination' }} />
        <Stack.Screen name="blog/[slug]" options={{ title: 'Article' }} />
        <Stack.Screen name="visa/[slug]" options={{ title: t('tab_visa') }} />
        <Stack.Screen name="search" options={{ title: t('account_search') }} />
        <Stack.Screen name="saved" options={{ title: t('account_saved') }} />
        <Stack.Screen name="tools/weather" options={{ title: t('account_weather') }} />
        <Stack.Screen name="tools/currency" options={{ title: t('account_currency') }} />
        <Stack.Screen name="countries" options={{ title: t('countries_title') }} />
        <Stack.Screen name="country/[name]" options={{ title: 'Country' }} />
      </Stack>
      <UpdatePrompt />
    </>
  )
}

export default function RootLayout() {
  useEffect(() => {
    initSoundSettings()
  }, [])

  return (
    <ThemeProvider>
      <I18nProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SafeAreaProvider>
                <RootStack />
              </SafeAreaProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </I18nProvider>
    </ThemeProvider>
  )
}
