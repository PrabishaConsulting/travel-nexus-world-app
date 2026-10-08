import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAudioPlayer } from 'expo-audio'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const STORAGE_KEY = 'settings:app-sounds-enabled'

let cachedPlayer: ReturnType<typeof createAudioPlayer> | null = null
let soundsEnabled = true

function getPlayer() {
  if (!cachedPlayer) {
    cachedPlayer = createAudioPlayer(require('../../assets/sounds/tap.wav'))
  }
  return cachedPlayer
}

export async function initSoundSettings() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    soundsEnabled = raw === null ? true : raw === 'true'
  } catch {
    soundsEnabled = true
  }
}

export function playTapSound() {
  if (!soundsEnabled) return
  try {
    const player = getPlayer()
    player.seekTo(0).finally(() => player.play())
  } catch {
    // ignore — tap sound is a nice-to-have, never block the UI
  }
}

export function useAppSoundsEnabled() {
  return useQuery({
    queryKey: ['settings', 'app-sounds'],
    queryFn: async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      return raw === null ? true : raw === 'true'
    },
  })
}

export function useSetAppSoundsEnabled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      await AsyncStorage.setItem(STORAGE_KEY, String(enabled))
      soundsEnabled = enabled
      return enabled
    },
    onSuccess: (enabled) => {
      queryClient.setQueryData(['settings', 'app-sounds'], enabled)
    },
  })
}
