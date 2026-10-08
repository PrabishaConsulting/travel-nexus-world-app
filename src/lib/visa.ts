import type { VisaType } from '@/types'
import { colors } from '@/lib/theme'

export const VISA_TYPE_LABEL: Record<VisaType, string> = {
  VISA_FREE: 'Visa Free',
  VISA_ON_ARRIVAL: 'Visa on Arrival',
  E_VISA: 'E-Visa',
  VISA_REQUIRED: 'Visa Required',
}

export const VISA_TYPE_COLOR: Record<VisaType, string> = {
  VISA_FREE: '#16A34A',
  VISA_ON_ARRIVAL: colors.secondary,
  E_VISA: colors.accent,
  VISA_REQUIRED: colors.destructive,
}

// Converts a two-letter country code (e.g. "th") to its flag emoji.
export function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
