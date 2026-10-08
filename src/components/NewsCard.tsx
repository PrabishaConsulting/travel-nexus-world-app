import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { NewsItem } from '@/types'
import { tapHaptic } from '@/lib/haptics'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const hours = Math.floor(diffMs / 3_600_000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function NewsCard({ item, onPress }: { item: NewsItem; onPress: () => void }) {
  const { colors } = useTheme()
  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }, cardShadow]}
      onPress={() => {
        tapHaptic()
        onPress()
      }}
    >
      {item.imageUrl ? (
        <Image
          source={item.imageUrl}
          style={[styles.image, { backgroundColor: colors.muted }]}
          contentFit="cover"
          transition={200}
        />
      ) : null}
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={3}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          {item.sourceName ? (
            <Text style={[styles.source, { color: colors.secondary }]} numberOfLines={1}>
              {item.sourceName}
            </Text>
          ) : null}
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{timeAgo(item.publishedAt)}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: 100,
    height: 100,
  },
  body: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  source: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: spacing.xs,
  },
  time: {
    fontSize: 11,
  },
})
