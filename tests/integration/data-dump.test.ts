import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Data Dump Integration', () => {
  let dumpData: any

  beforeAll(async () => {
    try {
      const response = await fetch('http://localhost:3003/__test__/dump')
      dumpData = await response.json()
    } catch (error) {
      console.error('Failed to fetch dump data:', error)
      throw error
    }
  })

  describe('API Response Structure', () => {
    it('should return valid JSON with expected structure', () => {
      expect(dumpData).toBeDefined()
      expect(dumpData.ok).toBe(true)
      expect(dumpData.timestamp).toBeDefined()
      expect(dumpData.env).toBeDefined()
      expect(dumpData.data).toBeDefined()
    })

    it('should have correct environment info', () => {
      expect(dumpData.env.NODE_ENV).toBe('development')
      expect(dumpData.env.PORT).toBeDefined()
    })

    it('should have valid timestamp', () => {
      const timestamp = new Date(dumpData.timestamp)
      expect(timestamp.getTime()).not.toBeNaN()
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('Menu Data Structure', () => {
    it('should have categories array', () => {
      expect(Array.isArray(dumpData.data.categories)).toBe(true)
      expect(dumpData.data.categories.length).toBeGreaterThan(0)
    })

    it('should have dishes array', () => {
      expect(Array.isArray(dumpData.data.dishes)).toBe(true)
      expect(dumpData.data.dishes.length).toBeGreaterThan(0)
    })

    it('should have ads array', () => {
      expect(Array.isArray(dumpData.data.ads)).toBe(true)
    })
  })

  describe('Category Data Validation', () => {
    it('should have valid category objects', () => {
      const categories = dumpData.data.categories
      
      categories.forEach((category: any, index: number) => {
        expect(category, `Category ${index} should have id`).toHaveProperty('id')
        expect(category, `Category ${index} should have name`).toHaveProperty('name')
        expect(category, `Category ${index} should have order`).toHaveProperty('order')
        
        expect(typeof category.id).toBe('string')
        expect(typeof category.name).toBe('string')
        expect(typeof category.order).toBe('number')
        expect(category.order).toBeGreaterThan(0)
      })
    })

    it('should have unique category IDs', () => {
      const categories = dumpData.data.categories
      const ids = categories.map((c: any) => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have categories sorted by order', () => {
      const categories = dumpData.data.categories
      const orders = categories.map((c: any) => c.order)
      const sortedOrders = [...orders].sort((a, b) => a - b)
      expect(orders).toEqual(sortedOrders)
    })
  })

  describe('Dish Data Validation', () => {
    it('should have valid dish objects', () => {
      const dishes = dumpData.data.dishes
      
      dishes.forEach((dish: any, index: number) => {
        expect(dish, `Dish ${index} should have id`).toHaveProperty('id')
        expect(dish, `Dish ${index} should have name`).toHaveProperty('name')
        expect(dish, `Dish ${index} should have categoryId`).toHaveProperty('categoryId')
        expect(dish, `Dish ${index} should have price`).toHaveProperty('price')
        expect(dish, `Dish ${index} should have available`).toHaveProperty('available')
        
        expect(typeof dish.id).toBe('string')
        expect(typeof dish.name).toBe('string')
        expect(typeof dish.categoryId).toBe('string')
        expect(typeof dish.price).toBe('number')
        expect(typeof dish.available).toBe('boolean')
      })
    })

    it('should have unique dish IDs', () => {
      const dishes = dumpData.data.dishes
      const ids = dishes.map((d: any) => d.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid category references', () => {
      const dishes = dumpData.data.dishes
      const categories = dumpData.data.categories
      const categoryIds = new Set(categories.map((c: any) => c.id))
      
      dishes.forEach((dish: any) => {
        expect(categoryIds.has(dish.categoryId), `Dish ${dish.id} has invalid categoryId ${dish.categoryId}`).toBe(true)
      })
    })

    it('should have valid diet tags', () => {
      const dishes = dumpData.data.dishes
      
      dishes.forEach((dish: any) => {
        if (dish.dietTags) {
          expect(Array.isArray(dish.dietTags)).toBe(true)
          dish.dietTags.forEach((tag: any) => {
            expect(typeof tag).toBe('string')
            expect(tag.length).toBeGreaterThan(0)
          })
        }
      })
    })

    it('should have valid allergens', () => {
      const dishes = dumpData.data.dishes
      
      dishes.forEach((dish: any) => {
        if (dish.allergens) {
          expect(Array.isArray(dish.allergens)).toBe(true)
          dish.allergens.forEach((allergen: any) => {
            expect(typeof allergen).toBe('string')
            expect(allergen.length).toBeGreaterThan(0)
          })
        }
      })
    })

    it('should have valid price values', () => {
      const dishes = dumpData.data.dishes
      
      dishes.forEach((dish: any) => {
        if (dish.price !== null) {
          expect(typeof dish.price).toBe('number')
          expect(dish.price).toBeGreaterThan(0)
        }
      })
    })
  })

  describe('Data Completeness', () => {
    it('should have reasonable number of categories', () => {
      const categories = dumpData.data.categories
      expect(categories.length).toBeGreaterThanOrEqual(5)
      expect(categories.length).toBeLessThanOrEqual(20)
    })

    it('should have reasonable number of dishes', () => {
      const dishes = dumpData.data.dishes
      expect(dishes.length).toBeGreaterThanOrEqual(20)
      expect(dishes.length).toBeLessThanOrEqual(200)
    })

    it('should have dishes in each category', () => {
      const dishes = dumpData.data.dishes
      const categories = dumpData.data.categories
      
      categories.forEach((category: any) => {
        const categoryDishes = dishes.filter((d: any) => d.categoryId === category.id)
        expect(categoryDishes.length, `Category ${category.name} should have at least one dish`).toBeGreaterThan(0)
      })
    })
  })

  describe('Data Quality', () => {
    it('should have no missing required fields', () => {
      const dishes = dumpData.data.dishes
      const missingFields: string[] = []
      
      dishes.forEach((dish: any, index: number) => {
        if (!dish.id) missingFields.push(`Dish ${index}: missing id`)
        if (!dish.name) missingFields.push(`Dish ${index}: missing name`)
        if (!dish.categoryId) missingFields.push(`Dish ${index}: missing categoryId`)
        if (dish.price === null || dish.price === undefined) missingFields.push(`Dish ${index}: missing price`)
        if (dish.available === null || dish.available === undefined) missingFields.push(`Dish ${index}: missing available`)
      })
      
      expect(missingFields, `Missing required fields: ${missingFields.join(', ')}`).toHaveLength(0)
    })

    it('should have consistent currency', () => {
      const dishes = dumpData.data.dishes
      const currencies = new Set(dishes.map((d: any) => d.currency).filter(Boolean))
      expect(currencies.size).toBeLessThanOrEqual(1) // Should be consistent
    })

    it('should have valid image paths', () => {
      const dishes = dumpData.data.dishes
      
      dishes.forEach((dish: any) => {
        if (dish.image) {
          expect(typeof dish.image).toBe('string')
          expect(dish.image.startsWith('/')).toBe(true)
        }
      })
    })
  })
})
