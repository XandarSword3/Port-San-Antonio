import { getFoodPlaceholderImage as getSVGPlaceholder } from './placeholderImages'

export interface ImagePlaceholders {
  [category: string]: string[] | string
}

// Map dish names to their corresponding image files in the seed directory
const dishImageMap: Record<string, string> = {
  'edamame': '/seed/edamame.jpg',
  'mozzarella-sticks': '/seed/mozz-sticks.jpg',
  'caesar-salad': '/seed/chicken-caesar.jpg',
  'chicken-strips': '/seed/chicken-strips.jpg',
  'nuggets': '/seed/nuggets.jpg',
  'curly-fries': '/seed/curly-fries.jpg',
  'fries': '/seed/fries.jpg',
  'greek-fusion': '/seed/greek-fusion.jpg',
  'tuna-pasta': '/seed/tuna-pasta.jpg',
  'crab-salad': '/seed/crab-salad.jpg',
  'chicken-caesar': '/seed/chicken-caesar.jpg',
  'seasoned-mix': '/seed/seasonal-mix.jpg',
  'pepperoni-pizza': '/seed/pizza-pepperoni.jpg',
  'cheese-ham-pizza': '/seed/pizza-ham.jpg',
  'vegetarian-pizza': '/seed/pizza-veg.jpg',
  'cheese-pizza': '/seed/pizza-cheese.jpg',
  'chicken-melt': '/seed/chicken-melt.jpg',
  'mozzarella-beef-melt': '/seed/mozz-beef-melt.jpg',
  'cheese-burger': '/seed/cheese-burger.jpg',
  'classic-burger': '/seed/classic-burger.jpg',
  'chicken-sub': '/seed/chicken-sub.jpg',
  'tawouk': '/seed/taouk.jpg',
  'tuna-sub': '/seed/tuna-sub.jpg',
  'chicken-delight': '/seed/chicken-delight.jpg',
  'tawouk-platter': '/seed/taouk-platter.jpg',
  'chicken-burger-platter': '/seed/chicken-burger-platter.jpg',
  'beef-burger-platter': '/seed/beef-burger-platter.jpg',
  'vodka-grey-goose': '/seed/vodka-greygoose.jpg',
  'vodka-stolichnaya': '/seed/vodka-stoli.jpg',
  'vodka-absolut': '/seed/vodka-absolut.jpg',
  'vodka-russian-standard': '/seed/vodka-russian.jpg',
  'sangria-pitcher': '/seed/sangria.jpg',
  'tequila-jose-cuervo': '/seed/tequila-jose-white.jpg',
  'gin-gordons': '/seed/gin-gordons.jpg',
  'jame': '/seed/gin-gordons.jpg', // Using gin image as fallback
  'soft-drink': '/seed/soft-drinks.jpg',
  'ice-tea': '/seed/ice-tea.jpg',
  'perrier-water': '/seed/perrier.jpg',
  'fresh-orange-juice': '/seed/fresh-orange.jpg',
  'almaza': '/seed/almaza.jpg',
  'beirut': '/seed/beirut.jpg',
  'arak': '/seed/arak.jpg',
  'couvent': '/seed/couvent.jpg',
  'prosecco': '/seed/prosecco.jpg',
  'white-chardonnay': '/seed/white-chardonnay.jpg',
  'ksar-reserve': '/seed/ksara-reserve.jpg',
  'signature-margarita': '/seed/signature-margarita.jpg',
  'passion-fruit-martini': '/seed/passion-fruit.jpg',
  'lemon-drop': '/seed/lemon-drop.jpg'
}

/**
 * Get a high-quality food image for a dish based on its ID
 */
export function getFoodImage(dishId: string): string {
  // First try to get the specific dish image
  if (dishImageMap[dishId]) {
    return dishImageMap[dishId]
  }
  
  // Fallback to SVG placeholder
  return getSVGPlaceholder(dishId)
}

/**
 * Get a food-appropriate placeholder image for a dish based on its category
 */
export function getFoodPlaceholderImage(categoryId: string, dishName: string): string {
  // Legacy signature kept for compatibility; delegate to SVG placeholder map
  // We ignore categoryId and just use dishName/id to fetch a deterministic SVG
  return getSVGPlaceholder(dishName || categoryId)
}

/**
 * Generate responsive image srcset for better performance
 */
export function generateImageSrcSet(baseUrl: string): string {
  const sizes = [400, 600, 800, 1200]
  return sizes
    .map(size => `${baseUrl}?w=${size}&h=${Math.round(size * 0.75)}&fit=crop&crop=center&auto=format&q=80 ${size}w`)
    .join(', ')
}

/**
 * Check if an image URL is a placeholder (beach/resort image)
 */
export function isPlaceholderImage(url: string): boolean {
  return url.includes('resort-hero') || url.includes('beach') || url.includes('spa.jpg')
}

/**
 * Get optimized image URL with proper parameters
 */
export function getOptimizedImageUrl(url: string, width: number = 400, height: number = 300): string {
  if (url.startsWith('http')) {
    // For external images, add optimization parameters
    const urlObj = new URL(url)
    urlObj.searchParams.set('w', width.toString())
    urlObj.searchParams.set('h', height.toString())
    urlObj.searchParams.set('fit', 'crop')
    urlObj.searchParams.set('crop', 'center')
    urlObj.searchParams.set('auto', 'format')
    urlObj.searchParams.set('q', '80')
    return urlObj.toString()
  }
  return url
}

/**
 * Get image dimensions for responsive design
 */
export function getImageDimensions(dishId: string): { width: number; height: number } {
  // Standard aspect ratio for food images
  return { width: 400, height: 300 }
}
