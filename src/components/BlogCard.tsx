import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { BlogPost } from '@/types'
import { tapHaptic } from '@/lib/haptics'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

export function BlogCard({ post, onPress }: { post: BlogPost; onPress: () => void }) {
  const { colors } = useTheme()
  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }, cardShadow]}
      onPress={() => {
        tapHaptic()
        onPress()
      }}
    >
      <Image
        source={post.image || undefined}
        style={[styles.image, { backgroundColor: colors.muted }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        {post.category ? (
          <Text style={[styles.category, { color: colors.secondary }]}>{post.category.name}</Text>
        ) : null}
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {post.title}
        </Text>
        {post.excerpt ? (
          <Text style={[styles.excerpt, { color: colors.mutedForeground }]} numberOfLines={2}>
            {post.excerpt}
          </Text>
        ) : null}
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
    height: 150,
  },
  body: {
    padding: spacing.md,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  excerpt: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
})
