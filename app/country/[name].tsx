import { useQuery } from '@tanstack/react-query'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { FlatList, StyleSheet } from 'react-native'
import { DestinationCard } from '@/components/DestinationCard'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export default function CountryDestinationsScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { name } = useLocalSearchParams<{ name: string }>()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['locations-by-country', name],
    queryFn: () => api.locations.getAll({ country: name, limit: 50 }),
    enabled: !!name,
  })

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      {isLoading ? (
        <SkeletonList variant="card" />
      ) : isError ? (
        <ErrorView message={(error as Error)?.message} onRetry={refetch} />
      ) : !data?.locations.length ? (
        <EmptyView message={t('no_destinations')} />
      ) : (
        <FlatList
          data={data.locations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { backgroundColor: colors.background }]}
          renderItem={({ item }) => (
            <DestinationCard
              location={item}
              onPress={() => router.push(`/destination/${item.slug}`)}
            />
          )}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
})
