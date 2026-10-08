import { useQuery } from '@tanstack/react-query'
import { Stack, router } from 'expo-router'
import { useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text } from 'react-native'
import { CountryCard } from '@/components/CountryCard'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { tapHaptic } from '@/lib/haptics'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export default function CountriesScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.locations.getCountries(),
    staleTime: 10 * 60 * 1000,
  })

  const sortedData = useMemo(
    () => (data ? [...data].sort((a, b) => a.name.trim().localeCompare(b.name.trim())) : data),
    [data]
  )

  const letters = useMemo(() => {
    if (!sortedData) return []
    const set = new Set(sortedData.map((c) => c.name.trim().charAt(0).toUpperCase()))
    return Array.from(set).sort()
  }, [sortedData])

  const filteredData = useMemo(() => {
    if (!sortedData || !activeLetter) return sortedData
    return sortedData.filter((c) => c.name.trim().toUpperCase().startsWith(activeLetter))
  }, [sortedData, activeLetter])

  return (
    <>
      <Stack.Screen options={{ title: t('countries_title') }} />
      {isLoading ? (
        <SkeletonList variant="row" />
      ) : isError ? (
        <ErrorView message={(error as Error)?.message} onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyView message={t('no_countries')} />
      ) : (
        <>
          <FlatList
            data={['All', ...letters]}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.letterBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
            contentContainerStyle={styles.letterBarContent}
            renderItem={({ item }) => {
              const active = item === 'All' ? !activeLetter : activeLetter === item
              return (
                <Pressable
                  style={[styles.letterChip, { backgroundColor: active ? colors.primary : colors.muted }]}
                  onPress={() => {
                    tapHaptic()
                    setActiveLetter(item === 'All' ? null : item)
                  }}
                >
                  <Text style={[styles.letterChipText, { color: active ? '#fff' : colors.foreground }]}>
                    {item}
                  </Text>
                </Pressable>
              )
            }}
          />
          {filteredData?.length ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.name}
              numColumns={2}
              contentContainerStyle={[styles.list, { backgroundColor: colors.background }]}
              renderItem={({ item }) => (
                <CountryCard
                  country={item}
                  onPress={() => router.push(`/country/${encodeURIComponent(item.name.trim())}`)}
                />
              )}
            />
          ) : (
            <EmptyView message={t('no_countries')} />
          )}
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  letterBar: {
    height: 56,
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  letterBarContent: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  letterChip: {
    minWidth: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  letterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    padding: spacing.sm,
  },
})
