import Constants from 'expo-constants'
import type {
  BlogPost,
  CountrySummary,
  LocationDetail,
  LocationsResponse,
  NewsResponse,
  SearchResponse,
  VisaCountryDetail,
  VisaCountrySummary,
  WeatherCurrent,
  WeatherForecast,
} from '@/types'

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'https://api.travelnexusworld.com/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiClient<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new ApiError(error.message || `HTTP ${response.status}`, response.status)
  }

  return response.json()
}

function toQueryString(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return ''
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

// The backend groups countries by exact string match, so casing differences
// (e.g. "india" vs "India") show up as separate entries. Merge them here.
function mergeCountriesByName(countries: CountrySummary[]): CountrySummary[] {
  const groups = new Map<string, CountrySummary[]>()
  for (const country of countries) {
    const key = country.name.trim().toLowerCase()
    const group = groups.get(key)
    if (group) group.push(country)
    else groups.set(key, [country])
  }

  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0]
    const [primary] = [...group].sort((a, b) => b.locationCount - a.locationCount)
    return {
      ...primary,
      locationCount: group.reduce((sum, c) => sum + c.locationCount, 0),
      image: group.find((c) => c.image)?.image ?? primary.image,
    }
  })
}

export const api = {
  locations: {
    getAll: (params?: {
      featured?: boolean
      page?: number
      limit?: number
      search?: string
      continent?: string
      country?: string
    }) => apiClient<LocationsResponse>(`/locations${toQueryString(params)}`),
    getBySlug: (slug: string) => apiClient<LocationDetail>(`/locations/slug/${slug}`),
    getCountries: () =>
      apiClient<CountrySummary[]>('/locations/countries/all').then(mergeCountriesByName),
  },
  visa: {
    getAll: (params?: { type?: string; continent?: string; search?: string }) =>
      apiClient<{ countries: VisaCountrySummary[]; pagination: { total: number } }>(
        `/visa/countries${toQueryString({ ...params, limit: 100 })}`
      ),
    getBySlug: (slug: string) => apiClient<VisaCountryDetail>(`/visa/countries/india/${slug}`),
  },
  blog: {
    getAll: (params?: { page?: number; limit?: number }) =>
      apiClient<{ posts: BlogPost[]; total: number; page: number; limit?: number }>(
        `/blog/posts${toQueryString(params)}`
      ),
    getBySlug: (slug: string) => apiClient<BlogPost>(`/blog/posts/slug/${slug}`),
  },
  search: {
    query: (q: string) => apiClient<SearchResponse>(`/search${toQueryString({ q })}`),
    filters: () => apiClient<Record<string, unknown>>('/search/filters'),
  },
  news: {
    getAll: (params?: { page?: number; limit?: number }) =>
      apiClient<NewsResponse>(`/news${toQueryString(params)}`),
  },
  weather: {
    current: (city: string) => apiClient<WeatherCurrent>(`/weather/current${toQueryString({ city })}`),
    forecast: (city: string, days = 7) =>
      apiClient<WeatherForecast>(`/weather/forecast${toQueryString({ city, days })}`),
  },
}

export { API_URL }
