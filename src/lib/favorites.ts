import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LocationSummary } from '@/types'

const STORAGE_KEY = 'favorites:destinations'

export type FavoriteDestination = Pick<
  LocationSummary,
  'id' | 'name' | 'slug' | 'city' | 'country' | 'summary' | 'coverImage' | 'featured'
>

async function readFavorites(): Promise<FavoriteDestination[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function writeFavorites(items: FavoriteDestination[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: readFavorites,
    staleTime: 0,
  })
}

export function useIsFavorite(slug: string) {
  const { data } = useFavorites()
  return !!data?.some((f) => f.slug === slug)
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (location: FavoriteDestination) => {
      const current = await readFavorites()
      const exists = current.some((f) => f.slug === location.slug)
      const next = exists
        ? current.filter((f) => f.slug !== location.slug)
        : [location, ...current]
      await writeFavorites(next)
      return next
    },
    onSuccess: (next) => {
      queryClient.setQueryData(['favorites'], next)
    },
  })
}
