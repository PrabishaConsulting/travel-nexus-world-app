// Mirrors the brand HSL tokens in src/app/globals.css of the main web app.
export const lightColors = {
  primary: '#2833B1', // Travel Blue
  secondary: '#1CA7A8', // Nexus Teal
  accent: '#F59E0B', // World Orange
  background: '#F7F8FC',
  foreground: '#0F172A',
  muted: '#EEF1F8',
  mutedForeground: '#64748B',
  border: '#E2E8F0',
  destructive: '#EF4444',
  card: '#FFFFFF',
  headerBackground: '#FFFFFF',
  headerForeground: '#0F172A',
} as const

export const darkColors: Record<keyof typeof lightColors, string> = {
  primary: '#5B67E8',
  secondary: '#2DD4CF',
  accent: '#FBBF24',
  background: '#0B1120',
  foreground: '#F1F5F9',
  muted: '#1A2338',
  mutedForeground: '#94A3B8',
  border: '#28324A',
  destructive: '#F87171',
  card: '#141B2E',
  headerBackground: '#141B2E',
  headerForeground: '#F1F5F9',
}

export type ThemeColors = Record<keyof typeof lightColors, string>

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const

// Cross-platform card elevation (shadow on iOS, elevation on Android).
export const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
} as const

// Static defaults kept for any file not yet migrated to useTheme().
export const colors = lightColors
