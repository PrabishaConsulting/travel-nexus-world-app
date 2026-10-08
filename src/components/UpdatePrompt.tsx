import { useEffect, useState } from 'react'
import { Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { checkForUpdate, skipVersion, type UpdateInfo } from '@/lib/updater'
import { useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

/** Checks GitHub Releases on launch and shows an update popup when a newer version exists. */
export function UpdatePrompt() {
  const { colors } = useTheme()
  const [update, setUpdate] = useState<UpdateInfo | null>(null)

  useEffect(() => {
    // iOS builds can't sideload an APK; this flow is Android-only.
    if (Platform.OS !== 'android') return
    checkForUpdate().then(setUpdate).catch(() => {})
  }, [])

  if (!update) return null

  const dismiss = () => setUpdate(null)

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Update available</Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>
            Version {update.version} is ready to install.
          </Text>
          {update.notes ? (
            <ScrollView style={styles.notes}>
              <Text style={{ color: colors.foreground }}>{update.notes}</Text>
            </ScrollView>
          ) : null}
          <Pressable
            style={[styles.primary, { backgroundColor: colors.primary }]}
            onPress={() => {
              Linking.openURL(update.url).catch(() => {})
              dismiss()
            }}
          >
            <Text style={styles.primaryText}>Update now</Text>
          </Pressable>
          <View style={styles.row}>
            <Pressable onPress={dismiss} style={styles.secondary}>
              <Text style={{ color: colors.mutedForeground }}>Later</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                skipVersion(update.version)
                dismiss()
              }}
              style={styles.secondary}
            >
              <Text style={{ color: colors.mutedForeground }}>Skip this version</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.xl },
  card: { borderRadius: radius.lg, padding: spacing.xl, ...cardShadow },
  title: { fontSize: 20, fontWeight: '700' },
  version: { marginTop: spacing.xs, marginBottom: spacing.md },
  notes: { maxHeight: 160, marginBottom: spacing.md },
  primary: { borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  secondary: { paddingVertical: spacing.sm },
})
