import { ChevronDown, LocateFixed, MapPin } from 'lucide-react-native'
import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { tapHaptic } from '@/lib/haptics'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export function LocationPill({
  city,
  isDetecting,
  onSelectCity,
  onUseCurrentLocation,
}: {
  city: string | null
  isDetecting: boolean
  onSelectCity: (city: string) => void
  onUseCurrentLocation: () => void
}) {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  return (
    <>
      <Pressable
        style={[styles.pill, { backgroundColor: colors.muted }]}
        onPress={() => {
          tapHaptic()
          setOpen(true)
        }}
      >
        <MapPin size={14} color={colors.primary} />
        <Text style={[styles.text, { color: colors.foreground }]} numberOfLines={1}>
          {isDetecting ? t('location_detecting') : city || t('location_set')}
        </Text>
        <ChevronDown size={14} color={colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{t('location_change_title')}</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t('location_placeholder')}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.muted }]}
              onSubmitEditing={() => {
                if (text.trim()) {
                  onSelectCity(text.trim())
                  setOpen(false)
                  setText('')
                }
              }}
              returnKeyType="search"
            />
            <Pressable
              style={[styles.optionRow, { borderTopColor: colors.border }]}
              onPress={() => {
                tapHaptic()
                onUseCurrentLocation()
                setOpen(false)
                setText('')
              }}
            >
              <LocateFixed size={16} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.primary }]}>{t('location_use_current')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    maxWidth: 150,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
