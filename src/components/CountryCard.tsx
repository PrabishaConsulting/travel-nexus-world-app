import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { CountrySummary } from '@/types'
import { tapHaptic } from '@/lib/haptics'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

export function CountryCard({ country, onPress }: { country: CountrySummary; onPress: () => void }) {
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
        source={country.image || undefined}
        style={[styles.image, { backgroundColor: colors.muted }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={1}>
          {country.name.trim()}
        </Text>
        <Text style={styles.count}>
          {country.locationCount} {country.locationCount === 1 ? 'place' : 'places'}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 110,
    margin: spacing.xs,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  count: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.9,
    marginTop: 1,
  },
})
