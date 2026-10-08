import { Tabs } from 'expo-router'
import { BookOpen, Compass, Newspaper, Stamp, User } from 'lucide-react-native'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'

export default function TabsLayout() {
  const { colors } = useTheme()
  const { t } = useI18n()

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerForeground,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.headerBackground, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_destinations'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: t('tab_news'),
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: t('tab_blog'),
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="visa"
        options={{
          title: t('tab_visa'),
          tabBarIcon: ({ color, size }) => <Stamp color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tab_account'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
