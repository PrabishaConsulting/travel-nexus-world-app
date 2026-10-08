import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Share2 } from 'lucide-react-native'
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { ErrorView, LoadingView } from '@/components/StateViews'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'
import { VISA_TYPE_COLOR, VISA_TYPE_LABEL, flagEmoji } from '@/lib/visa'

export default function VisaDetailScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const { slug } = useLocalSearchParams<{ slug: string }>()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['visa-country', slug],
    queryFn: () => api.visa.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <LoadingView />
  if (isError || !data) return <ErrorView message={(error as Error)?.message} onRetry={refetch} />

  const badgeColor = VISA_TYPE_COLOR[data.visaType]

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: data.name,
          headerRight: () => (
            <Pressable
              hitSlop={8}
              onPress={() => {
                Share.share({
                  message: `Visa info for ${data.name} — ${data.durationText || ''} — via TravelNexus World`,
                }).catch(() => {})
              }}
            >
              <Share2 size={20} color={colors.foreground} />
            </Pressable>
          ),
        }}
      />

      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <Text style={styles.flag}>{flagEmoji(data.countryCode)}</Text>
        <Text style={styles.title}>{data.name}</Text>
        {data.toCountryOfficial ? <Text style={styles.official}>{data.toCountryOfficial}</Text> : null}
        <View style={[styles.badge, { backgroundColor: badgeColor + '1A', borderColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{VISA_TYPE_LABEL[data.visaType]}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.metaRow}>
          {data.durationText ? (
            <MetaChip label={t('visa_stay_duration')} value={data.durationText} colors={colors} />
          ) : null}
          {data.visaFee ? <MetaChip label={t('visa_fee')} value={data.visaFee} colors={colors} /> : null}
          {data.processingTime ? (
            <MetaChip label={t('visa_processing_time')} value={data.processingTime} colors={colors} />
          ) : null}
          {data.passportValidity ? (
            <MetaChip label={t('visa_passport_validity')} value={data.passportValidity} colors={colors} />
          ) : null}
        </View>

        {data.specialNotes ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('destination_overview')}</Text>
            <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{data.specialNotes}</Text>
          </>
        ) : null}

        {data.requiredDocuments?.length ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('visa_required_documents')}</Text>
            {data.requiredDocuments.map((doc, i) => (
              <Text key={i} style={[styles.listItem, { color: colors.mutedForeground }]}>
                • {doc}
              </Text>
            ))}
          </>
        ) : null}

        {data.travelTips?.length ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('destination_tips')}</Text>
            {data.travelTips.map((tip, i) => (
              <Text key={i} style={[styles.listItem, { color: colors.mutedForeground }]}>
                • {tip}
              </Text>
            ))}
          </>
        ) : null}

        {data.restrictions ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('visa_restrictions')}</Text>
            <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{data.restrictions}</Text>
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
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  flag: {
    fontSize: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: spacing.sm,
  },
  official: {
    fontSize: 13,
    color: '#E0E4FF',
    marginTop: 2,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
    backgroundColor: '#fff',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: '45%',
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
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
})
