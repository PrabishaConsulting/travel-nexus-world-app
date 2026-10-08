import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { BlogCard } from '@/components/BlogCard'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export default function BlogScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.blog.getAll({ limit: 30 }),
  })

  if (isLoading) return <SkeletonList variant="card" />
  if (isError) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />
  if (!data?.posts.length) return <EmptyView message={t('no_articles')} />

  return (
    <FlatList
      data={data.posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      renderItem={({ item }) => (
        <BlogCard post={item} onPress={() => router.push(`/blog/${item.slug}`)} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
})
