export interface Category {
  id: string
  name: string
  order: number
  description?: string
}

export interface PriceVariant {
  label: string
  price: number
}

export interface Dish {
  id: string
  categoryId: string
  name: string
  shortDesc?: string
  fullDesc?: string
  price?: number
  variants?: PriceVariant[]
  currency: string
  image: string
  imageVariants?: {
    src: string
    srcWebp?: string
    srcAvif?: string
    thumb?: string
    blurDataURL?: string
  }
  dietTags?: string[]
  allergens?: string[]
  ingredients?: string[]
  calories?: number | null
  // popularity: number // Removed - no ordering occurs
  available: boolean
  sponsored: boolean
  rating?: number
  reviewCount?: number
}

export interface Ad {
  id: string
  title: string
  image: string
  url: string
  position: 'side-rail' | 'mobile-banner'
  weight: number
  active?: boolean
}

export interface AppData {
  categories: Category[]
  dishes: Dish[]
  ads: Ad[]
}

export interface DietFilter {
  id: string
  label: string
  active: boolean
}

export interface FilterState {
  search: string
  selectedCategory: string | null
  activeDietFilters: string[]
  availabilityOnly?: boolean
  priceBucket?: 'lte10' | 'btw11_20' | 'gt20' | null
}
