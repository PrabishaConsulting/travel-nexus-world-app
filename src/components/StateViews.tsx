import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export function LoadingView() {
  const { colors } = useTheme()
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export function ErrorView({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { colors } = useTheme()
  const { t } = useI18n()
  return (
    <View style={styles.center}>
      <Text style={[styles.errorTitle, { color: colors.foreground }]}>{t('state_error_title')}</Text>
      <Text style={[styles.errorMessage, { color: colors.mutedForeground }]}>
        {message || t('state_error_message')}
      </Text>
      {onRetry ? (
        <Text style={[styles.retry, { color: colors.primary }]} onPress={onRetry}>
          {t('state_retry')}
        </Text>
      ) : null}
    </View>
  )
}

export function EmptyView({ message }: { message: string }) {
  const { colors } = useTheme()
  return (
    <View style={styles.center}>
      <Text style={[styles.errorMessage, { color: colors.mutedForeground }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.md,
    fontWeight: '600',
  },
})
