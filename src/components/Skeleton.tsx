import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

function Shimmer({ style }: { style: object }) {
  const { colors } = useTheme()
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return <Animated.View style={[styles.block, { backgroundColor: colors.border }, style, { opacity }]} />
}

export function DestinationCardSkeleton() {
  const { colors } = useTheme()
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Shimmer style={styles.image} />
      <View style={styles.body}>
        <Shimmer style={styles.lineWide} />
        <Shimmer style={styles.lineNarrow} />
        <Shimmer style={styles.lineFull} />
      </View>
    </View>
  )
}

export function ListCardSkeleton() {
  const { colors } = useTheme()
  return (
    <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Shimmer style={styles.thumb} />
      <View style={styles.rowBody}>
        <Shimmer style={styles.lineFull} />
        <Shimmer style={styles.lineNarrow} />
      </View>
    </View>
  )
}

export function SkeletonList({
  variant = 'card',
  count = 4,
}: {
  variant?: 'card' | 'row'
  count?: number
}) {
  const Item = variant === 'card' ? DestinationCardSkeleton : ListCardSkeleton
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
  block: {
    borderRadius: radius.sm,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 0,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  lineWide: {
    height: 16,
    width: '70%',
  },
  lineNarrow: {
    height: 12,
    width: '40%',
  },
  lineFull: {
    height: 12,
    width: '90%',
  },
  rowCard: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  rowBody: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
})
