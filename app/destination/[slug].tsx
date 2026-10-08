import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Heart, Share2 } from 'lucide-react-native'
import { Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { ErrorView, LoadingView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useIsFavorite, useToggleFavorite } from '@/lib/favorites'
import { tapHaptic } from '@/lib/haptics'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export default function DestinationDetailScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { width } = useWindowDimensions()
  const isFavorite = useIsFavorite(slug ?? '')
  const toggleFavorite = useToggleFavorite()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['location', slug],
    queryFn: () => api.locations.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <LoadingView />
  if (isError || !data) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: data.name,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                hitSlop={8}
                onPress={() => {
                  Share.share({
                    message: `${data.name}, ${data.country} — check it out on TravelNexus World!`,
                  }).catch(() => {})
                }}
              >
                <Share2 size={20} color={colors.foreground} />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={() => {
                  tapHaptic()
                  toggleFavorite.mutate({
                    id: data.id,
                    name: data.name,
                    slug: data.slug,
                    city: data.city,
                    country: data.country,
                    summary: data.summary,
                    coverImage: data.coverImage,
                    featured: data.featured,
                  })
                }}
              >
                <Heart
                  size={20}
                  color={isFavorite ? colors.destructive : colors.foreground}
                  fill={isFavorite ? colors.destructive : 'transparent'}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      <Image source={data.coverImage || undefined} style={[styles.hero, { backgroundColor: colors.muted }]} contentFit="cover" />

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.foreground }]}>{data.name}</Text>
        <Text style={[styles.location, { color: colors.secondary }]}>
          {data.city}, {data.country} · {data.continent}
        </Text>

        <View style={styles.metaRow}>
          {data.recommendedStay ? (
            <MetaChip label={t('destination_recommended_stay')} value={data.recommendedStay} colors={colors} />
          ) : null}
          {data.bestTimeToVisit ? (
            <MetaChip label={t('destination_best_time')} value={data.bestTimeToVisit} colors={colors} />
          ) : null}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('destination_overview')}</Text>
        <RenderHtml
          contentWidth={width - spacing.lg * 2}
          source={{ html: data.description }}
          baseStyle={{ fontSize: 14, lineHeight: 21, color: colors.mutedForeground }}
        />

        {data.tips?.length ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('destination_tips')}</Text>
            {data.tips.map((tip, i) => (
              <Text key={i} style={[styles.listItem, { color: colors.mutedForeground }]}>
                • {tip}
              </Text>
            ))}
          </>
        ) : null}

        {data.pros?.length ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('destination_why_visit')}</Text>
            {data.pros.map((pro, i) => (
              <Text key={i} style={[styles.listItem, { color: colors.mutedForeground }]}>
                • {pro}
              </Text>
            ))}
          </>
        ) : null}
      </View>
    </ScrollView>
  )
}

function MetaChip({
  label,
  value,
  colors,
}: {
  label: string
  value: string
  colors: { muted: string; mutedForeground: string; foreground: string }
}) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.muted }]}>
      <Text style={[styles.chipLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.chipValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginRight: spacing.md,
  },
  hero: {
    width: '100%',
    height: 240,
  },
  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  chipValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
})
