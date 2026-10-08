import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export default function WeatherScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')

  const currentQuery = useQuery({
    queryKey: ['weather-current', query],
    queryFn: () => api.weather.current(query),
    enabled: !!query,
  })

  const forecastQuery = useQuery({
    queryKey: ['weather-forecast', query],
    queryFn: () => api.weather.forecast(query, 7),
    enabled: !!query,
  })

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: t('account_weather') }} />

      <View style={styles.searchRow}>
        <TextInput
          value={city}
          onChangeText={setCity}
          onSubmitEditing={() => setQuery(city.trim())}
          placeholder={t('search_city_placeholder')}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
          returnKeyType="search"
        />
      </View>

      {!query ? (
        <EmptyView message={t('search_weather_prompt')} />
      ) : currentQuery.isLoading ? (
        <LoadingView />
      ) : currentQuery.isError ? (
        <ErrorView message={(currentQuery.error as Error)?.message} onRetry={currentQuery.refetch} />
      ) : currentQuery.data ? (
        <View style={styles.body}>
          <Text style={[styles.location, { color: colors.foreground }]}>{currentQuery.data.location}</Text>
          <View style={[styles.currentCard, { backgroundColor: colors.muted }]}>
            <Text style={styles.icon}>{currentQuery.data.current.icon}</Text>
            <Text style={[styles.temp, { color: colors.foreground }]}>
              {Math.round(currentQuery.data.current.temperature)}°C
            </Text>
            <Text style={[styles.condition, { color: colors.mutedForeground }]}>
              {currentQuery.data.current.condition}
            </Text>
            <Text style={[styles.feelsLike, { color: colors.mutedForeground }]}>
              {t('weather_feels_like', { temp: Math.round(currentQuery.data.current.feelsLike) })}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Stat label={t('weather_humidity')} value={`${currentQuery.data.current.humidity}%`} colors={colors} />
            <Stat
              label={t('weather_wind')}
              value={`${Math.round(currentQuery.data.current.windSpeed)} km/h`}
              colors={colors}
            />
            <Stat
              label={t('weather_visibility')}
              value={`${Math.round(currentQuery.data.current.visibility / 1000)} km`}
              colors={colors}
            />
          </View>

          {forecastQuery.data ? (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('weather_forecast_title')}</Text>
              {forecastQuery.data.forecast.map((day) => (
                <View key={day.date} style={[styles.forecastRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.forecastDate, { color: colors.foreground }]}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.forecastIcon}>{day.icon}</Text>
                  <Text style={[styles.forecastCondition, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {day.condition}
                  </Text>
                  <Text style={[styles.forecastTemp, { color: colors.foreground }]}>
                    {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                  </Text>
                </View>
              ))}
            </>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  )
}

function Stat({
  label,
  value,
  colors,
}: {
  label: string
  value: string
  colors: { foreground: string; mutedForeground: string }
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  searchRow: {
    padding: spacing.lg,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 15,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  location: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  currentCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  icon: {
    fontSize: 56,
  },
  temp: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  condition: {
    fontSize: 15,
    marginTop: 2,
  },
  feelsLike: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  forecastDate: {
    width: 56,
    fontSize: 13,
    fontWeight: '600',
  },
  forecastIcon: {
    fontSize: 20,
    width: 30,
  },
  forecastCondition: {
    flex: 1,
    fontSize: 13,
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '600',
  },
})
