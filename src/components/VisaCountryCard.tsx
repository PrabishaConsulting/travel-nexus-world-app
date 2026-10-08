import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { VisaCountrySummary } from '@/types'
import { tapHaptic } from '@/lib/haptics'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'
import { VISA_TYPE_COLOR, VISA_TYPE_LABEL, flagEmoji } from '@/lib/visa'

export function VisaCountryCard({
  country,
  onPress,
}: {
  country: VisaCountrySummary
  onPress: () => void
}) {
  const { colors } = useTheme()
  const badgeColor = VISA_TYPE_COLOR[country.visaType]

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }, cardShadow]}
      onPress={() => {
        tapHaptic()
        onPress()
      }}
    >
      <Text style={styles.flag}>{flagEmoji(country.countryCode)}</Text>
      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {country.name}
        </Text>
        <Text style={[styles.region, { color: colors.mutedForeground }]} numberOfLines={1}>
          {country.region ? `${country.region} · ` : ''}
          {country.continent}
        </Text>
        <View style={styles.metaRow}>
          {country.durationText ? (
            <Text style={[styles.meta, { color: colors.secondary }]} numberOfLines={1}>
              {country.durationText}
            </Text>
          ) : null}
          {country.visaFee ? (
            <Text style={[styles.meta, { color: colors.secondary }]} numberOfLines={1}>
              · {country.visaFee}
            </Text>
          ) : null}
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColor + '1A', borderColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{VISA_TYPE_LABEL[country.visaType]}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  flag: {
    fontSize: 32,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  region: {
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
    flexShrink: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
})
