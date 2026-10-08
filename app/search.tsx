import { useQuery } from '@tanstack/react-query'
import { Stack, router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { BlogCard } from '@/components/BlogCard'
import { DestinationCard } from '@/components/DestinationCard'
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews'
import { VisaCountryCard } from '@/components/VisaCountryCard'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export default function SearchScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(text.trim()), 400)
    return () => clearTimeout(timer)
  }, [text])

  const active = debounced.length > 1

  const destinationsQuery = useQuery({
    queryKey: ['search-destinations', debounced],
    queryFn: () => api.search.query(debounced),
    enabled: active,
  })

  const visaQuery = useQuery({
    queryKey: ['search-visa', debounced],
    queryFn: () => api.visa.getAll({ search: debounced }),
    enabled: active,
  })

  // Blog has no server-side search endpoint yet, so we filter a larger page client-side.
  const blogAllQuery = useQuery({
    queryKey: ['search-blog-source'],
    queryFn: () => api.blog.getAll({ limit: 200 }),
    enabled: active,
    staleTime: 10 * 60 * 1000,
  })

  const blogResults = useMemo(() => {
    if (!blogAllQuery.data || !active) return []
    const q = debounced.toLowerCase()
    return blogAllQuery.data.posts
      .filter((p) => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q))
      .slice(0, 10)
  }, [blogAllQuery.data, debounced, active])

  const isLoading = destinationsQuery.isLoading || visaQuery.isLoading || blogAllQuery.isLoading
  const isError = destinationsQuery.isError || visaQuery.isError
  const totalResults =
    (destinationsQuery.data?.results.length || 0) + (visaQuery.data?.countries.length || 0) + blogResults.length

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t('account_search') }} />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t('search_placeholder')}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
        autoCorrect={false}
        autoFocus
      />

      {!active ? (
        null
      ) : isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView
          message={(destinationsQuery.error as Error)?.message}
          onRetry={() => {
            destinationsQuery.refetch()
            visaQuery.refetch()
          }}
        />
      ) : totalResults === 0 ? (
        <EmptyView message={t('no_results_for', { query: debounced })} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {destinationsQuery.data && destinationsQuery.data.results.length > 0 ? (
            <Section title={t('search_section_destinations')} colors={colors}>
              {destinationsQuery.data.results.map((item) => (
                <DestinationCard
                  key={item.id}
                  location={item}
                  onPress={() => router.push(`/destination/${item.slug}`)}
                />
              ))}
            </Section>
          ) : null}

          {visaQuery.data && visaQuery.data.countries.length > 0 ? (
            <Section title={t('search_section_visa')} colors={colors}>
              {visaQuery.data.countries.map((item) => (
                <VisaCountryCard key={item.id} country={item} onPress={() => router.push(`/visa/${item.slug}`)} />
              ))}
            </Section>
          ) : null}

          {blogResults.length > 0 ? (
            <Section title={t('search_section_blog')} colors={colors}>
              {blogResults.map((item) => (
                <BlogCard key={item.id} post={item} onPress={() => router.push(`/blog/${item.slug}`)} />
              ))}
            </Section>
          ) : null}
        </ScrollView>
      )}
    </View>
  )
}

function Section({
  title,
  colors,
  children,
}: {
  title: string
  colors: { mutedForeground: string }
  children: React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 15,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
})
