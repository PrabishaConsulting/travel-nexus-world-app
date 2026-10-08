import { useQuery } from '@tanstack/react-query'
import { FlatList, Linking, RefreshControl, StyleSheet } from 'react-native'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { NewsCard } from '@/components/NewsCard'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export default function NewsScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.news.getAll({ limit: 30 }),
  })

  if (isLoading) return <SkeletonList variant="row" />
  if (isError) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />
  if (!data?.news.length) return <EmptyView message={t('no_news')} />

  return (
    <FlatList
      data={data.news}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      renderItem={({ item }) => (
        <NewsCard item={item} onPress={() => Linking.openURL(item.sourceUrl)} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
})
