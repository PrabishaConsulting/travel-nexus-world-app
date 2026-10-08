import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { ChevronRight, Globe, Search } from 'lucide-react-native'
import { DestinationCard } from '@/components/DestinationCard'
import { GreetingWeatherCard } from '@/components/GreetingWeatherCard'
import { LanguagePill } from '@/components/LanguagePill'
import { LocationPill } from '@/components/LocationPill'
import { SkeletonList } from '@/components/Skeleton'
import { EmptyView, ErrorView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { tapHaptic } from '@/lib/haptics'
import { useI18n } from '@/lib/i18n/I18nContext'
import { getCurrentCityName } from '@/lib/location'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

const CONTINENTS = ['All', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania']

export default function DestinationsScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [continent, setContinent] = useState('All')
  const [cityOverride, setCityOverride] = useState<string | null>(null)

  const detectedCityQuery = useQuery({
    queryKey: ['current-city'],
    queryFn: getCurrentCityName,
    staleTime: 15 * 60 * 1000,
    retry: 0,
  })

  const city = cityOverride ?? detectedCityQuery.data ?? null

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['locations', continent],
    queryFn: () => api.locations.getAll({ limit: 30, continent: continent === 'All' ? undefined : continent }),
  })

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
        <View style={styles.pillRow}>
          <LocationPill
            city={city}
            isDetecting={!cityOverride && detectedCityQuery.isLoading}
            onSelectCity={setCityOverride}
            onUseCurrentLocation={() => {
              setCityOverride(null)
              detectedCityQuery.refetch()
            }}
          />
          <LanguagePill />
        </View>

        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <GreetingWeatherCard city={city} />

        <Pressable
          style={[styles.searchBar, { backgroundColor: colors.muted, borderColor: colors.border }]}
          onPress={() => {
            tapHaptic()
            router.push('/search')
          }}
        >
          <Search size={16} color={colors.mutedForeground} />
          <Text style={[styles.searchPlaceholder, { color: colors.mutedForeground }]}>
            {t('search_placeholder')}
          </Text>
        </Pressable>

        <FlatList
          data={CONTINENTS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => {
            const active = continent === item
            return (
              <Pressable
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.primary : colors.muted },
                ]}
                onPress={() => {
                  tapHaptic()
                  setContinent(item)
                }}
              >
                <Text style={[styles.chipText, { color: active ? '#fff' : colors.foreground }]}>{item}</Text>
              </Pressable>
            )
          }}
        />

        <Pressable
          style={[styles.countriesRow, { backgroundColor: colors.muted }]}
          onPress={() => {
            tapHaptic()
            router.push('/countries')
          }}
        >
          <Globe size={16} color={colors.primary} />
          <Text style={[styles.countriesText, { color: colors.foreground }]}>{t('countries_title')}</Text>
          <ChevronRight size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

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
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <DestinationCard
              location={item}
              onPress={() => router.push(`/destination/${item.slug}`)}
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 220,
    height: 49,
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  chipRow: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  countriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  countriesText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    padding: spacing.lg,
  },
})
