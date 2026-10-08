import { Stack, router } from 'expo-router'
import { FlatList, StyleSheet } from 'react-native'
import { DestinationCard } from '@/components/DestinationCard'
import { EmptyView, LoadingView } from '@/components/StateViews'
import { useFavorites } from '@/lib/favorites'
import { useI18n } from '@/lib/i18n/I18nContext'
import { spacing } from '@/lib/theme'

export default function SavedScreen() {
  const { t } = useI18n()
  const { data, isLoading } = useFavorites()

  return (
    <>
      <Stack.Screen options={{ title: t('account_saved') }} />
      {isLoading ? (
        <LoadingView />
      ) : !data?.length ? (
        <EmptyView message={t('no_saved')} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.list}
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
