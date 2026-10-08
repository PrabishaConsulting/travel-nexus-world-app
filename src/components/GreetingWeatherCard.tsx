import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { api } from '@/lib/api'
import { useI18n, type TranslationKey } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

function getGreetingKey(hour: number): TranslationKey {
  if (hour < 12) return 'greeting_morning'
  if (hour < 17) return 'greeting_afternoon'
  return 'greeting_evening'
}

export function GreetingWeatherCard({ city }: { city: string | null }) {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const weatherQuery = useQuery({
    queryKey: ['home-weather', city],
    queryFn: () => api.weather.current(city!),
    enabled: !!city,
    staleTime: 10 * 60 * 1000,
    retry: 0,
  })

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }, cardShadow]}
      onPress={() => router.push('/tools/weather')}
    >
      <View style={styles.left}>
        <Text style={[styles.greeting, { color: colors.primary }]} numberOfLines={1}>
          {t(getGreetingKey(now.getHours()))} · {date}
        </Text>
        <Text style={[styles.time, { color: colors.foreground }]}>{time}</Text>
      </View>

      {weatherQuery.data ? (
        <View style={[styles.right, { borderLeftColor: colors.border }]}>
          <Text style={styles.weatherIcon}>{weatherQuery.data.current.icon}</Text>
          <View>
            <Text style={[styles.temp, { color: colors.foreground }]}>
              {Math.round(weatherQuery.data.current.temperature)}°
            </Text>
            <Text style={[styles.city, { color: colors.mutedForeground }]} numberOfLines={1}>
              {city}
            </Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  left: {
    flex: 1,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '700',
  },
  time: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderLeftWidth: 1,
    paddingLeft: spacing.md,
    marginLeft: spacing.sm,
  },
  weatherIcon: {
    fontSize: 22,
  },
  temp: {
    fontSize: 16,
    fontWeight: '800',
  },
  city: {
    fontSize: 10,
    marginTop: 1,
  },
})
