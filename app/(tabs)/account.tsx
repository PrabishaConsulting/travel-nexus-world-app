import { Image } from 'expo-image'
import { router } from 'expo-router'
import {
  CloudSun,
  Globe,
  Headphones,
  Heart,
  Languages,
  LogIn,
  LogOut,
  LucideIcon,
  Monitor,
  Moon,
  RefreshCw,
  Search,
  Sun,
  TrendingUp,
  Volume2,
} from 'lucide-react-native'
import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import packageJson from '../../package.json'
import { useAuth } from '@/lib/auth/AuthContext'
import { useI18n, LANGUAGES } from '@/lib/i18n/I18nContext'
import { tapHaptic } from '@/lib/haptics'
import { useAppSoundsEnabled, useSetAppSoundsEnabled } from '@/lib/sound'
import { ThemeMode, useTheme } from '@/lib/ThemeContext'
import { cardShadow, radius, spacing } from '@/lib/theme'

interface MenuRow {
  icon: LucideIcon
  title: string
  subtitle?: string
  onPress: () => void
}

export default function AccountScreen() {
  const { colors, mode, setMode } = useTheme()
  const { t, language, setLanguage } = useI18n()
  const { data: soundsEnabled } = useAppSoundsEnabled()
  const setSoundsEnabled = useSetAppSoundsEnabled()
  const { user, isAuthenticating, error: authError, login, logout } = useAuth()
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false)

  const currentLanguage = LANGUAGES.find((l) => l.code === language)!

  const exploreRows: MenuRow[] = [
    {
      icon: Search,
      title: t('account_search'),
      subtitle: t('account_search_subtitle'),
      onPress: () => router.push('/search'),
    },
    {
      icon: Heart,
      title: t('account_saved'),
      subtitle: t('account_saved_subtitle'),
      onPress: () => router.push('/saved'),
    },
    {
      icon: Globe,
      title: t('countries_title'),
      onPress: () => router.push('/countries'),
    },
    {
      icon: CloudSun,
      title: t('account_weather'),
      subtitle: t('account_weather_subtitle'),
      onPress: () => router.push('/tools/weather'),
    },
    {
      icon: TrendingUp,
      title: t('account_currency'),
      subtitle: t('account_currency_subtitle'),
      onPress: () => router.push('/tools/currency'),
    },
  ]

  const supportRows: MenuRow[] = [
    {
      icon: Headphones,
      title: t('account_contact'),
      subtitle: t('account_contact_subtitle'),
      onPress: () => Linking.openURL('https://travelnexusworld.com/contact'),
    },
    {
      icon: Globe,
      title: t('account_website'),
      subtitle: 'travelnexusworld.com',
      onPress: () => Linking.openURL('https://travelnexusworld.com'),
    },
  ]

  const modeOptions: { key: ThemeMode; label: string; icon: LucideIcon }[] = [
    { key: 'system', label: t('appearance_system'), icon: Monitor },
    { key: 'light', label: t('appearance_light'), icon: Sun },
    { key: 'dark', label: t('appearance_dark'), icon: Moon },
  ]

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {user ? (
        <View style={[styles.profileCard, { backgroundColor: colors.card }, cardShadow]}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarInitial}>{(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.textBox}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>
              {user.name ?? user.email}
            </Text>
            {user.email ? (
              <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                {user.email}
              </Text>
            ) : null}
          </View>
          <Pressable
            style={[styles.signOutButton, { backgroundColor: colors.muted }]}
            onPress={() => {
              tapHaptic()
              logout()
            }}
          >
            <LogOut color={colors.destructive} size={18} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.profileCard, { backgroundColor: colors.card }, cardShadow]}
          disabled={isAuthenticating}
          onPress={() => {
            tapHaptic()
            login()
          }}
        >
          <View style={[styles.avatarFallback, { backgroundColor: colors.muted }]}>
            <LogIn color={colors.primary} size={20} />
          </View>
          <View style={styles.textBox}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>
              {isAuthenticating ? t('auth_signing_in') : t('auth_sign_in')}
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
              {authError ?? t('auth_sign_in_subtitle')}
            </Text>
          </View>
          {isAuthenticating ? <ActivityIndicator color={colors.primary} /> : null}
        </Pressable>
      )}

      <Section title={t('account_explore')} colors={colors}>
        {exploreRows.map((row) => (
          <Row key={row.title} row={row} />
        ))}
      </Section>

      <Section title={t('account_preferences')} colors={colors}>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
            <Volume2 color={colors.secondary} size={22} />
          </View>
          <View style={styles.textBox}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t('account_sounds')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
              {t('account_sounds_subtitle')}
            </Text>
          </View>
          <Switch
            value={soundsEnabled ?? true}
            onValueChange={(value) => {
              tapHaptic()
              setSoundsEnabled.mutate(value)
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <Pressable
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => {
            tapHaptic()
            setLanguagePickerOpen(true)
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
            <Languages color={colors.secondary} size={22} />
          </View>
          <View style={styles.textBox}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t('account_language')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
              {currentLanguage.nativeLabel}
            </Text>
          </View>
        </Pressable>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={styles.textBox}>
            <Text style={[styles.rowTitle, { color: colors.foreground, marginBottom: spacing.sm }]}>
              {t('account_appearance')}
            </Text>
            <View style={styles.segmentRow}>
              {modeOptions.map((opt) => {
                const active = mode === opt.key
                return (
                  <Pressable
                    key={opt.key}
                    style={[
                      styles.segment,
                      { backgroundColor: active ? colors.primary : colors.muted },
                    ]}
                    onPress={() => {
                      tapHaptic()
                      setMode(opt.key)
                    }}
                  >
                    <opt.icon size={14} color={active ? '#fff' : colors.mutedForeground} />
                    <Text style={[styles.segmentText, { color: active ? '#fff' : colors.mutedForeground }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </View>
      </Section>

      <Section title={t('account_support')} colors={colors}>
        {supportRows.map((row) => (
          <Row key={row.title} row={row} />
        ))}
      </Section>

      <View style={styles.versionBox}>
        <RefreshCw color={colors.mutedForeground} size={16} />
        <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
          {t('account_version', { version: packageJson.version })}
        </Text>
      </View>

      <Modal
        visible={languagePickerOpen}
        animationType="slide"
        onRequestClose={() => setLanguagePickerOpen(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t('account_language')}</Text>
          <FlatList
            data={LANGUAGES}
            keyExtractor={(l) => l.code}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.modalItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  tapHaptic()
                  setLanguage(item.code)
                  setLanguagePickerOpen(false)
                }}
              >
                <View style={styles.textBox}>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]}>{item.nativeLabel}</Text>
                  <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>{item.label}</Text>
                </View>
                {item.code === language ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
              </Pressable>
            )}
          />
          <Pressable style={styles.closeButton} onPress={() => setLanguagePickerOpen(false)}>
            <Text style={[styles.closeButtonText, { color: colors.primary }]}>{t('action_close')}</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  )
}

function Section({
  title,
  colors,
  children,
}: {
  title: string
  colors: { card: string; mutedForeground: string }
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card }, cardShadow]}>{children}</View>
    </View>
  )
}

function Row({ row }: { row: MenuRow }) {
  const { colors } = useTheme()
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={() => {
        tapHaptic()
        row.onPress()
      }}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
        <row.icon color={colors.secondary} size={22} />
      </View>
      <View style={styles.textBox}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>{row.title}</Text>
        {row.subtitle ? (
          <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>{row.subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  signOutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  versionText: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  closeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
})
