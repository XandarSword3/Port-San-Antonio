import { Dish, Category } from '@/types'
import { Language, getTranslation, TranslationKeys } from './translations'

// Translated dish data - empty by default, should be populated from CMS or database
const translatedDishes: Record<Language, Record<string, Partial<Dish>>> = {
  en: {},
  ar: {},
  fr: {}
}

// Translated category data - empty by default
const translatedCategories: Record<Language, Record<string, Partial<Category>>> = {
  en: {},
  ar: {},
  fr: {}
}

// Diet tag translations
export function translateDietTag(tag: string, language: Language): string {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      'vegetarian': 'Vegetarian',
      'vegan': 'Vegan',
      'gluten-free': 'Gluten Free',
      'dairy-free': 'Dairy Free',
      'nut-free': 'Nut Free',
      'spicy': 'Spicy',
      'halal': 'Halal',
      'kosher': 'Kosher'
    },
    ar: {
      'vegetarian': 'نباتي',
      'vegan': 'نباتي صرف',
      'gluten-free': 'خالي من الغلوتين',
      'dairy-free': 'خالي من الألبان',
      'nut-free': 'خالي من المكسرات',
      'spicy': 'حار',
      'halal': 'حلال',
      'kosher': 'كوشير'
    },
    fr: {
      'vegetarian': 'Végétarien',
      'vegan': 'Végan',
      'gluten-free': 'Sans Gluten',
      'dairy-free': 'Sans Lait',
      'nut-free': 'Sans Noix',
      'spicy': 'Épicé',
      'halal': 'Halal',
      'kosher': 'Casher'
    }
  }
  
  return translations[language]?.[tag] || tag
}

// Allergen translations
export function translateAllergen(allergen: string, language: Language): string {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      'dairy': 'Dairy',
      'eggs': 'Eggs',
      'fish': 'Fish',
      'shellfish': 'Shellfish',
      'tree-nuts': 'Tree Nuts',
      'peanuts': 'Peanuts',
      'wheat': 'Wheat',
      'soybeans': 'Soybeans',
      'gluten': 'Gluten'
    },
    ar: {
      'dairy': 'ألبان',
      'eggs': 'بيض',
      'fish': 'سمك',
      'shellfish': 'محار',
      'tree-nuts': 'مكسرات',
      'peanuts': 'فول سوداني',
      'wheat': 'قمح',
      'soybeans': 'فول الصويا',
      'gluten': 'غلوتين'
    },
    fr: {
      'dairy': 'Lait',
      'eggs': 'Œufs',
      'fish': 'Poisson',
      'shellfish': 'Crustacés',
      'tree-nuts': 'Noix',
      'peanuts': 'Arachides',
      'wheat': 'Blé',
      'soybeans': 'Soja',
      'gluten': 'Gluten'
    }
  }
  
  return translations[language]?.[allergen] || allergen
}

// Get translated dish data
export function getTranslatedDish(dishId: string, language: Language): Partial<Dish> {
  return translatedDishes[language]?.[dishId] || {}
}

// Get translated category data
export function getTranslatedCategory(categoryId: string, language: Language): Partial<Category> {
  return translatedCategories[language]?.[categoryId] || {}
}

// Apply translations to a dish
export function applyDishTranslations(dish: Dish, language: Language): Dish {
  const translations = getTranslatedDish(dish.id, language)
  
  return {
    ...dish,
    name: translations.name || dish.name,
    shortDesc: translations.shortDesc || dish.shortDesc,
    fullDesc: translations.fullDesc || dish.fullDesc,
    ingredients: translations.ingredients || dish.ingredients
  }
}

// Apply translations to a category
export function applyCategoryTranslations(category: Category, language: Language): Category {
  const translations = getTranslatedCategory(category.id, language)
  
  return {
    ...category,
    name: translations.name || category.name,
    description: translations.description || category.description
  }
}

// Legacy function names for backward compatibility
export function translateCategory(categoryOrId: string | Category, language: Language): Category {
  if (typeof categoryOrId === 'string') {
    // If it's just a string ID, return a minimal category object
    return {
      id: categoryOrId,
      name: categoryOrId,
      description: '',
      order: 0
    }
  }
  
  // If it's a full category object, apply translations
  return applyCategoryTranslations(categoryOrId, language)
}

export function translateDish(dishOrId: string | Dish, language: Language): Dish {
  if (typeof dishOrId === 'string') {
    // If it's just a string ID, return a minimal dish object
    return {
      id: dishOrId,
      name: dishOrId,
      categoryId: '',
      currency: 'USD',
      available: true,
      image: ''
    } as Dish
  }
  
  // If it's a full dish object, apply translations
  return applyDishTranslations(dishOrId, language)
}
