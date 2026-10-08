import * as Haptics from 'expo-haptics'
import { playTapSound } from './sound'

// Fire-and-forget light tap feedback (vibration + optional click sound) for
// card presses, tab switches, toggles.
export function tapHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
  playTapSound()
}

export function successHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
}
