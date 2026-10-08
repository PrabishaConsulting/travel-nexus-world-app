export interface CountrySummary {
  name: string
  continent: string
  locationCount: number
  image: string
}

export interface LocationSummary {
  id: string
  name: string
  slug: string
  country: string
  city: string
  continent: string
  summary: string
  coverImage: string | null
  published: boolean
  featured: boolean
  tags: string[] | null
  bestTimeToVisit: string | null
  recommendedStay: string | null
  createdAt: string
  updatedAt: string
  author: { id: string; name: string | null; image: string | null }
}

export interface LocationDetail extends LocationSummary {
  description: string
  images: string[] | null
  pros: string[] | null
  cons: string[] | null
  tips: string[] | null
  localCuisine?: unknown
  faqs?: { id: string; question: string; answer: string }[]
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface LocationsResponse {
  locations: LocationSummary[]
  pagination: Pagination
}

export type VisaType = 'VISA_FREE' | 'VISA_ON_ARRIVAL' | 'E_VISA' | 'VISA_REQUIRED'

export interface VisaCountrySummary {
  id: string
  name: string
  slug: string
  countryCode: string
  flagCode: string
  continent: string
  region: string | null
  visaType: VisaType
  durationDays: number | null
  durationText: string | null
  visaFee: string | null
  featured: boolean
  popularityScore: number
  views: number
  passportCountry: string
  passportCountrySlug: string
}

export interface VisaCountryDetail extends VisaCountrySummary {
  toCountryOfficial: string | null
  applicationProcess: string | null
  processingTime: string | null
  validityPeriod: string | null
  entryType: string | null
  requiredDocuments: string[] | null
  passportValidity: string | null
  blankPages: number | null
  travelTips: string[] | null
  restrictions: string | null
  specialNotes: string | null
  eVisaUrl: string | null
  faqs?: { id: string; question: string; answer: string }[]
}

export interface SearchResult {
  id: string
  name: string
  slug: string
  city: string
  country: string
  continent: string
  summary: string
  coverImage: string | null
  views: number
  featured: boolean
  createdAt: string
  tags: string[] | null
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalResults: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  content?: string
  publishedAt: string | null
  author?: { id: string; name: string | null; image: string | null } | null
  category?: { id: string; name: string; slug: string } | null
}

export interface NewsItem {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  sourceUrl: string
  sourceName: string | null
  publishedAt: string
  category: string | null
}

export interface NewsResponse {
  news: NewsItem[]
  total: number
  page: number
  totalPages: number
}

export interface WeatherCurrent {
  location: string
  lat: number
  lng: number
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: number
    visibility: number
    isDaytime: boolean
    condition: string
    icon: string
    weatherCode: number
  }
}

export interface WeatherForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  rainChance: number
  maxWindSpeed: number
  condition: string
  icon: string
  weatherCode: number
}

export interface WeatherForecast {
  location: string
  lat: number
  lng: number
  forecast: WeatherForecastDay[]
}
