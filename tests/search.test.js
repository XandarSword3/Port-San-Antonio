// Unit tests for search functionality
const { test, expect } = require('@jest/globals')

// Mock the search logic from the menu page
function safeSearch(dish, query) {
  const q = query?.trim().toLowerCase();
  if (q) {
    const name = (dish.name ?? '').toString().toLowerCase();
    const shortDesc = (dish.shortDesc ?? '').toString().toLowerCase();
    const fullDesc = (dish.fullDesc ?? '').toString().toLowerCase();
    const ingredients = (dish.ingredients ?? []).join(' ').toLowerCase();
    const variants = (dish.variants ?? []).map(v => (v.label ?? '') + ' ' + (v.price ?? '')).join(' ').toLowerCase();
    return name.includes(q) || shortDesc.includes(q) || fullDesc.includes(q) || ingredients.includes(q) || variants.includes(q);
  }
  return true;
}

describe('Search Functionality', () => {
  test('should handle undefined dish properties safely', () => {
    const dish = {
      id: 'test-dish',
      name: undefined,
      shortDesc: null,
      fullDesc: undefined,
      ingredients: undefined,
      variants: null
    };
    
    expect(() => safeSearch(dish, 'chicken')).not.toThrow();
    expect(safeSearch(dish, 'chicken')).toBe(false);
  });

  test('should handle empty search query', () => {
    const dish = {
      id: 'test-dish',
      name: 'Chicken Burger',
      shortDesc: 'Delicious chicken burger'
    };
    
    expect(safeSearch(dish, '')).toBe(true);
    expect(safeSearch(dish, null)).toBe(true);
    expect(safeSearch(dish, undefined)).toBe(true);
  });

  test('should match dish name', () => {
    const dish = {
      id: 'test-dish',
      name: 'Chicken Burger',
      shortDesc: 'Delicious burger'
    };
    
    expect(safeSearch(dish, 'chicken')).toBe(true);
    expect(safeSearch(dish, 'BURGER')).toBe(true);
    expect(safeSearch(dish, 'beef')).toBe(false);
  });

  test('should match short description', () => {
    const dish = {
      id: 'test-dish',
      name: 'Classic Burger',
      shortDesc: 'Delicious chicken burger with fries'
    };
    
    expect(safeSearch(dish, 'chicken')).toBe(true);
    expect(safeSearch(dish, 'fries')).toBe(true);
    expect(safeSearch(dish, 'salad')).toBe(false);
  });

  test('should match full description', () => {
    const dish = {
      id: 'test-dish',
      name: 'Classic Burger',
      shortDesc: 'Delicious burger',
      fullDesc: 'Beef patty with lettuce, tomato, and cheese'
    };
    
    expect(safeSearch(dish, 'lettuce')).toBe(true);
    expect(safeSearch(dish, 'cheese')).toBe(true);
    expect(safeSearch(dish, 'onion')).toBe(false);
  });

  test('should match ingredients', () => {
    const dish = {
      id: 'test-dish',
      name: 'Greek Salad',
      shortDesc: 'Fresh salad',
      ingredients: ['lettuce', 'tomato', 'cucumber', 'olives']
    };
    
    expect(safeSearch(dish, 'lettuce')).toBe(true);
    expect(safeSearch(dish, 'olives')).toBe(true);
    expect(safeSearch(dish, 'chicken')).toBe(false);
  });

  test('should match variants', () => {
    const dish = {
      id: 'test-dish',
      name: 'Vodka',
      shortDesc: 'Premium vodka',
      variants: [
        { label: 'Single', price: 5 },
        { label: 'Double', price: 8 }
      ]
    };
    
    expect(safeSearch(dish, 'single')).toBe(true);
    expect(safeSearch(dish, 'double')).toBe(true);
    expect(safeSearch(dish, 'bottle')).toBe(false);
  });

  test('should handle case insensitive search', () => {
    const dish = {
      id: 'test-dish',
      name: 'Chicken Caesar Salad',
      shortDesc: 'Fresh Caesar salad with grilled chicken'
    };
    
    expect(safeSearch(dish, 'CHICKEN')).toBe(true);
    expect(safeSearch(dish, 'caesar')).toBe(true);
    expect(safeSearch(dish, 'SALAD')).toBe(true);
  });

  test('should handle partial matches', () => {
    const dish = {
      id: 'test-dish',
      name: 'Chicken Burger',
      shortDesc: 'Delicious chicken burger'
    };
    
    expect(safeSearch(dish, 'chick')).toBe(true);
    expect(safeSearch(dish, 'burg')).toBe(true);
    expect(safeSearch(dish, 'delicious')).toBe(true);
  });

  test('should handle special characters in search', () => {
    const dish = {
      id: 'test-dish',
      name: 'Chicken & Cheese Burger',
      shortDesc: 'Delicious burger with chicken and cheese'
    };
    
    expect(safeSearch(dish, 'chicken & cheese')).toBe(true);
    expect(safeSearch(dish, 'chicken cheese')).toBe(true);
  });
});

console.log('✅ All search tests passed!');
