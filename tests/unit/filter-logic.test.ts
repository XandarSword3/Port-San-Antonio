import { describe, it, expect, beforeEach } from 'vitest'
import { Dish, FilterState } from '@/types'

// Mock data for testing
const mockDishes: Dish[] = [
  {
    id: 'edamame',
    categoryId: 'starters',
    name: 'Edamame',
    shortDesc: 'Steamed soybeans, sea salt.',
    price: 5,
    currency: 'USD',
    image: '/seed/edamame.jpg',
    dietTags: ['vegetarian', 'vegan'],
    allergens: [],
    calories: null,
    available: true,
    sponsored: false
  },
  {
    id: 'chicken-strips',
    categoryId: 'starters',
    name: 'Chicken Strips (4pcs)',
    shortDesc: 'Served with fries.',
    fullDesc: 'Breaded chicken strips served with house fries and dipping sauce.',
    price: 12,
    currency: 'USD',
    image: '/seed/chicken-strips.jpg',
    dietTags: [],
    allergens: ['gluten'],
    calories: null,
    available: true,
    sponsored: false
  },
  {
    id: 'greek-fusion',
    categoryId: 'salads',
    name: 'Greek Fusion',
    shortDesc: 'Lettuce, Green Peppers, Cherry Tomatoes, Cucumbers, Olives, Feta, Lemon Mustard',
    price: 10,
    currency: 'USD',
    image: '/seed/greek-fusion.jpg',
    dietTags: ['vegetarian'],
    allergens: ['dairy'],
    calories: null,
    available: true,
    sponsored: false
  },
  {
    id: 'unavailable-dish',
    categoryId: 'starters',
    name: 'Unavailable Dish',
    shortDesc: 'This dish is not available',
    price: 8,
    currency: 'USD',
    image: '/seed/unavailable.jpg',
    dietTags: ['vegetarian'],
    allergens: [],
    calories: null,
    available: false,
    sponsored: false
  }
]

// Filter function implementation (extracted from menu page logic)
function filterDishes(dishes: Dish[], filters: FilterState): Dish[] {
  return dishes.filter(dish => {
    // Search filter
    const q = filters.search?.trim().toLowerCase()
    if (q) {
      const name = (dish.name ?? '').toString().toLowerCase()
      const shortDesc = (dish.shortDesc ?? '').toString().toLowerCase()
      const fullDesc = (dish.fullDesc ?? '').toString().toLowerCase()
      const allergens = (dish.allergens ?? []).join(' ').toLowerCase()
      const variants = (dish.variants ?? []).map(v => (v.label ?? '') + ' ' + (v.price ?? '')).join(' ').toLowerCase()
      if (!name.includes(q) && !shortDesc.includes(q) && !fullDesc.includes(q) && !allergens.includes(q) && !variants.includes(q)) {
        return false
      }
    }

    // Category filter
    if (filters.selectedCategory && dish.categoryId !== filters.selectedCategory) {
      return false
    }

    // Diet filter - require ALL selected diet tags (AND logic)
    if (filters.activeDietFilters.length > 0) {
      const hasAllDietTags = filters.activeDietFilters.every(tag => 
        dish.dietTags && dish.dietTags.includes(tag)
      )
      if (!hasAllDietTags) {
        return false
      }
    }

    // Availability
    if (filters.availabilityOnly && !dish.available) {
      return false
    }

    // Price buckets
    if (filters.priceBucket) {
      const priceValues = dish.variants && dish.variants.length > 0
        ? dish.variants.map(v => v.price)
        : (dish.price ? [dish.price] : [])

      if (priceValues.length === 0) return false

      const min = Math.min(...priceValues)
      const max = Math.max(...priceValues)

      switch (filters.priceBucket) {
        case 'lte10':
          if (!(min <= 10)) return false
          break
        case 'btw11_20':
          if (!(max >= 11 && min <= 20)) return false
          break
        case 'gt20':
          if (!(max > 20)) return false
          break
      }
    }

    return true
  })
}

describe('Filter Logic', () => {
  describe('Category Filter', () => {
    it('should filter by category correctly', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: 'starters',
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(3) // edamame, chicken-strips, unavailable-dish
      expect(result.every(dish => dish.categoryId === 'starters')).toBe(true)
    })

    it('should return all dishes when no category selected', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(4)
    })
  })

  describe('Diet Filter', () => {
    it('should filter by single diet tag', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: ['vegetarian'],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(3) // edamame, greek-fusion, unavailable-dish
      expect(result.every(dish => dish.dietTags?.includes('vegetarian'))).toBe(true)
    })

    it('should filter by multiple diet tags (AND logic)', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: ['vegetarian', 'vegan'],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1) // only edamame has both vegetarian and vegan
      expect(result[0].id).toBe('edamame')
    })

    it('should return no results for non-existent diet tag', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: ['gluten-free'],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(0)
    })
  })

  describe('Availability Filter', () => {
    it('should filter available dishes only', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: true,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(3) // all except unavailable-dish
      expect(result.every(dish => dish.available)).toBe(true)
    })

    it('should return all dishes when availability filter is off', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(4)
    })
  })

  describe('Price Filter', () => {
    it('should filter by price <= $10', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: 'lte10'
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(3) // edamame ($5), greek-fusion ($10), unavailable-dish ($8)
      expect(result.every(dish => dish.price != null && dish.price <= 10)).toBe(true)
    })

    it('should filter by price $11-$20', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: 'btw11_20'
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1) // chicken-strips ($12)
      expect(result[0].id).toBe('chicken-strips')
    })

    it('should filter by price > $20', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: 'gt20'
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(0) // no dishes over $20
    })
  })

  describe('Search Filter', () => {
    it('should search by dish name', () => {
      const filters: FilterState = {
        search: 'chicken',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('chicken-strips')
    })

    it('should search by description', () => {
      const filters: FilterState = {
        search: 'soybeans',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('edamame')
    })

    it('should be case insensitive', () => {
      const filters: FilterState = {
        search: 'CHICKEN',
        selectedCategory: null,
        activeDietFilters: [],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('chicken-strips')
    })
  })

  describe('Combined Filters', () => {
    it('should combine category and diet filters', () => {
      const filters: FilterState = {
        search: '',
        selectedCategory: 'starters',
        activeDietFilters: ['vegetarian'],
        availabilityOnly: false,
        priceBucket: null
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(2) // edamame, unavailable-dish
      expect(result.every(dish => dish.categoryId === 'starters' && dish.dietTags?.includes('vegetarian'))).toBe(true)
    })

    it('should combine all filters', () => {
      const filters: FilterState = {
        search: 'edamame',
        selectedCategory: 'starters',
        activeDietFilters: ['vegan'],
        availabilityOnly: true,
        priceBucket: 'lte10'
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('edamame')
    })

    it('should return no results when filters are too restrictive', () => {
      const filters: FilterState = {
        search: 'nonexistent',
        selectedCategory: 'starters',
        activeDietFilters: ['gluten-free'],
        availabilityOnly: true,
        priceBucket: 'gt20'
      }

      const result = filterDishes(mockDishes, filters)
      expect(result).toHaveLength(0)
    })
  })
})
