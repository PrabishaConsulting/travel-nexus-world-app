import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Share2 } from 'lucide-react-native'
import { Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { ErrorView, LoadingView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

export default function BlogDetailScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { width } = useWindowDimensions()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => api.blog.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <LoadingView />
  if (isError || !data) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: data.title,
          headerRight: () => (
            <Pressable
              hitSlop={8}
              onPress={() => {
                Share.share({ message: `${data.title} — TravelNexus World` }).catch(() => {})
              }}
            >
              <Share2 size={20} color={colors.foreground} />
            </Pressable>
          ),
        }}
      />
      <Image source={data.image || undefined} style={[styles.hero, { backgroundColor: colors.muted }]} contentFit="cover" />

      <View style={styles.body}>
        {data.category ? (
          <Text style={[styles.category, { color: colors.secondary }]}>{data.category.name}</Text>
        ) : null}
        <Text style={[styles.title, { color: colors.foreground }]}>{data.title}</Text>
        {data.author?.name ? (
          <Text style={[styles.author, { color: colors.mutedForeground }]}>
            {t('blog_by_author', { name: data.author.name })}
          </Text>
        ) : null}

        {data.content ? (
          <View style={styles.content}>
            <RenderHtml
              contentWidth={width - spacing.lg * 2}
              source={{ html: data.content }}
              baseStyle={{ fontSize: 15, lineHeight: 23, color: colors.foreground }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: spacing.lg,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  author: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
  content: {
    marginTop: spacing.lg,
  },
})
