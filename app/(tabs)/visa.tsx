import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { VisaCountryCard } from '@/components/VisaCountryCard'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export default function VisaScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['visa-countries'],
    queryFn: () => api.visa.getAll(),
  })

  if (isLoading) return <SkeletonList variant="row" />
  if (isError) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />
  if (!data?.countries.length) return <EmptyView message={t('no_visa_info')} />

  return (
    <FlatList
      data={data.countries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      renderItem={({ item }) => (
        <VisaCountryCard country={item} onPress={() => router.push(`/visa/${item.slug}`)} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
})
