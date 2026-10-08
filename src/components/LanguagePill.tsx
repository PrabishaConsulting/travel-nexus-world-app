import { Languages } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useI18n, LANGUAGES } from '@/lib/i18n/I18nContext'
import { tapHaptic } from '@/lib/haptics'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

export function LanguagePill() {
  const { colors } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === language)!

  return (
    <>
      <Pressable
        style={[styles.pill, { backgroundColor: colors.muted }]}
        onPress={() => {
          tapHaptic()
          setOpen(true)
        }}
      >
        <Languages size={14} color={colors.primary} />
        <Text style={[styles.text, { color: colors.foreground }]}>{current.label}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{t('language_modal_title')}</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(l) => l.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.item, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    tapHaptic()
                    setLanguage(item.code)
                    setOpen(false)
                  }}
                >
                  <View>
                    <Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.nativeLabel}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.mutedForeground }]}>{item.label}</Text>
                  </View>
                  {item.code === language ? (
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  ) : null}
                </Pressable>
              )}
            />
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
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
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
    maxHeight: '70%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
