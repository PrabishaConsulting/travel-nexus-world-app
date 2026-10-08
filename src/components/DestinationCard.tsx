import { Image } from 'expo-image'
import { Heart } from 'lucide-react-native'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useIsFavorite, useToggleFavorite } from '@/lib/favorites'
import { tapHaptic } from '@/lib/haptics'
import { stripHtml } from '@/lib/html'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

export type DestinationCardData = {
  id: string
  name: string
  slug: string
  city: string
  country: string
  summary: string
  coverImage: string | null
  featured: boolean
}

export function DestinationCard({
  location,
  onPress,
}: {
  location: DestinationCardData
  onPress: () => void
}) {
  const { colors } = useTheme()
  const isFavorite = useIsFavorite(location.slug)
  const toggleFavorite = useToggleFavorite()

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }, cardShadow]}
      onPress={onPress}
    >
      <Image
        source={location.coverImage || undefined}
        style={[styles.image, { backgroundColor: colors.muted }]}
        contentFit="cover"
        transition={200}
      />
      {location.featured ? (
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      ) : null}
      <Pressable
        style={styles.heartButton}
        hitSlop={8}
        onPress={() => {
          tapHaptic()
          toggleFavorite.mutate(location)
        }}
      >
        <Heart
          size={18}
          color={isFavorite ? colors.destructive : '#fff'}
          fill={isFavorite ? colors.destructive : 'transparent'}
        />
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {location.name}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]} numberOfLines={1}>
          {location.city}, {location.country}
        </Text>
        <Text style={[styles.summary, { color: colors.mutedForeground }]} numberOfLines={2}>
          {stripHtml(location.summary)}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 160,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  summary: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
})
