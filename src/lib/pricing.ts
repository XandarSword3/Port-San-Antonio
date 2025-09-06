import { Dish, Promotion } from '@/types'

export interface PriceCalculation {
  originalPrice: number
  discountedPrice: number
  savings: number
  activePromotions: Promotion[]
  hasDiscount: boolean
}

export class PricingService {
  // Calculate final price with promotions
  static calculatePrice(dish: Dish, promotions: Promotion[] = []): PriceCalculation {
    const originalPrice = dish.price || 0
    let bestDiscountedPrice = originalPrice
    let bestSavings = 0
    const activePromotions: Promotion[] = []

    if (!dish.promotions || dish.promotions.length === 0) {
      return {
        originalPrice,
        discountedPrice: originalPrice,
        savings: 0,
        activePromotions: [],
        hasDiscount: false
      }
    }

    // Check each promotion applicable to this dish
    for (const promotionId of dish.promotions) {
      const promotion = promotions.find(p => p.id === promotionId)
      if (!promotion || !this.isPromotionActive(promotion)) {
        continue
      }

      // Check if promotion applies to this dish
      if (this.isPromotionApplicable(promotion, dish)) {
        const discountedPrice = this.applyDiscount(originalPrice, promotion)
        const savings = originalPrice - discountedPrice

        if (savings > bestSavings) {
          bestDiscountedPrice = discountedPrice
          bestSavings = savings
        }

        activePromotions.push(promotion)
      }
    }

    return {
      originalPrice,
      discountedPrice: bestDiscountedPrice,
      savings: bestSavings,
      activePromotions,
      hasDiscount: bestSavings > 0
    }
  }

  // Check if promotion is currently active
  static isPromotionActive(promotion: Promotion): boolean {
    if (!promotion.active) return false
    
    const now = new Date()
    const start = new Date(promotion.startDate)
    const end = new Date(promotion.endDate)
    
    return now >= start && now <= end
  }

  // Check if promotion applies to specific dish
  static isPromotionApplicable(promotion: Promotion, dish: Dish): boolean {
    // If specific dishes are listed, check if this dish is included
    if (promotion.applicableDishes && promotion.applicableDishes.length > 0) {
      return promotion.applicableDishes.includes(dish.id)
    }

    // If categories are listed, check if dish category is included
    if (promotion.applicableCategories && promotion.applicableCategories.length > 0) {
      return promotion.applicableCategories.includes(dish.categoryId)
    }

    // If no specific restrictions, applies to all dishes
    return true
  }

  // Apply discount calculation
  static applyDiscount(originalPrice: number, promotion: Promotion): number {
    if (promotion.discountType === 'percentage') {
      const discountAmount = originalPrice * (promotion.discountValue / 100)
      return Math.max(0, originalPrice - discountAmount)
    } else {
      // Fixed amount discount
      return Math.max(0, originalPrice - promotion.discountValue)
    }
  }

  // Format price for display
  static formatPrice(price: number, currency: string = 'USD'): string {
    if (currency === 'LBP') {
      return `${price.toLocaleString()} LBP`
    }
    return `$${price.toFixed(2)}`
  }

  // Get active promotions for display
  static getActivePromotions(promotions: Promotion[]): Promotion[] {
    return promotions.filter(p => this.isPromotionActive(p))
  }
}
