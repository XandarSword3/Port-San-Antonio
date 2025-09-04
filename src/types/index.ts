export interface Category {
  id: string
  name: string
  order: number
}

export interface PriceVariant {
  label: string
  price: number
}

export interface Dish {
  id: string
  categoryId: string
  name: string
  shortDesc: string
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
  dietTags: string[]
  allergens: string[]
  calories?: number | null
  popularity: number
  available: boolean
  sponsored: boolean
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
}
