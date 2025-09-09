#!/usr/bin/env ts-node

/**
 * Comprehensive seed script for Port Antonio Resort Menu
 * Generates missing images, thumbnails, and LQIP placeholders
 */

import fs from 'fs';
import path from 'path';

// Sample data structure with all Port Antonio menu items
const sampleData = {
  categories: [
    { id: "starters", name: "Starters", order: 1 },
    { id: "salads", name: "Salads", order: 2 },
    { id: "pizza", name: "Pizza", order: 3 },
    { id: "burgers", name: "Burgers", order: 4 },
    { id: "sandwiches", name: "Sandwiches", order: 5 },
    { id: "platters", name: "Platters", order: 6 },
    { id: "drinks", name: "Drinks", order: 7 },
    { id: "beers", name: "Beers", order: 8 },
    { id: "arak", name: "Arak", order: 9 },
    { id: "prosecco", name: "Prosecco & Couvent", order: 10 },
    { id: "wine", name: "Wine", order: 11 },
    { id: "cocktails", name: "Signature Cocktails", order: 12 }
  ],
  dishes: [
    { "id": "edamame", "categoryId": "starters", "name": "Edamame", "shortDesc": "Steamed soybeans, sea salt.", "price": 5, "currency": "USD", "image": "/seed/edamame.jpg", "dietTags": ["vegetarian","vegan"], "allergens": [], "calories": null, "popularity": 40, "available": true, "sponsored": false },
    { "id": "mozz-sticks", "categoryId": "starters", "name": "Mozzarella Sticks (5pcs)", "shortDesc": "Crispy battered mozzarella.", "price": 6, "currency": "USD", "image": "/seed/mozz-sticks.jpg", "dietTags": ["vegetarian"], "allergens": ["dairy","gluten"], "calories": null, "popularity": 70, "available": true, "sponsored": false },
    { "id": "chicken-strips", "categoryId": "starters", "name": "Chicken Strips (4pcs)", "shortDesc": "Served with fries.", "fullDesc": "Breaded chicken strips served with house fries and dipping sauce.", "price": 12, "currency": "USD", "image": "/seed/chicken-strips.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 80, "available": true, "sponsored": false },
    { "id": "nuggets-6", "categoryId": "starters", "name": "Nuggets (6pcs)", "shortDesc": "Golden chicken nuggets.", "price": 6, "currency": "USD", "image": "/seed/nuggets.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 65, "available": true, "sponsored": false },
    { "id": "curly-fries", "categoryId": "starters", "name": "Curly Fries", "shortDesc": "Seasoned curly fries.", "price": 7, "currency": "USD", "image": "/seed/curly-fries.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 50, "available": true, "sponsored": false },
    { "id": "fries", "categoryId": "starters", "name": "Fries", "shortDesc": "Classic fries.", "price": 5, "currency": "USD", "image": "/seed/fries.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 60, "available": true, "sponsored": false },

    { "id": "chicken-caesar", "categoryId": "salads", "name": "Chicken Caesar", "shortDesc": "Lettuce, Parmesan, Chicken Breast, Croutons, Caesar Dressing", "price": 12, "currency": "USD", "image": "/seed/chicken-caesar.jpg", "dietTags": [], "allergens": ["dairy","gluten"], "calories": null, "popularity": 75, "available": true, "sponsored": false },
    { "id": "crab-salad", "categoryId": "salads", "name": "Crab Salad", "shortDesc": "Lettuce, Crab Sticks, Cherry Tomatoes, Cucumbers, Mushroom, Corn, Carrots, Cocktail Dressing", "price": 12, "currency": "USD", "image": "/seed/crab-salad.jpg", "dietTags": [], "allergens": ["shellfish"], "calories": null, "popularity": 55, "available": true, "sponsored": false },
    { "id": "tuna-pasta", "categoryId": "salads", "name": "Tuna Pasta", "shortDesc": "Penne, Cherry Tomato, Olives, Corn, Carrots, Tuna, Lemon Mayo", "price": 13, "currency": "USD", "image": "/seed/tuna-pasta.jpg", "dietTags": [], "allergens": ["fish","gluten"], "calories": null, "popularity": 60, "available": true, "sponsored": false },
    { "id": "greek-fusion", "categoryId": "salads", "name": "Greek Fusion", "shortDesc": "Lettuce, Green Peppers, Cherry Tomatoes, Cucumbers, Olives, Feta, Lemon Mustard", "price": 10, "currency": "USD", "image": "/seed/greek-fusion.jpg", "dietTags": ["vegetarian"], "allergens": ["dairy"], "calories": null, "popularity": 58, "available": true, "sponsored": false },
    { "id": "seasonal-mix", "categoryId": "salads", "name": "Seasonal Mix", "shortDesc": "Lettuce, Rocca, Cucumbers, Cherry Tomatoes, Lemon Oil", "price": 8, "currency": "USD", "image": "/seed/seasonal-mix.jpg", "dietTags": ["vegetarian","vegan"], "allergens": [], "calories": null, "popularity": 40, "available": true, "sponsored": false },

    { "id": "pizza-cheese", "categoryId": "pizza", "name": "Cheese Pizza", "shortDesc": "Marinara, Mozzarella, Oregano", "price": 8, "currency": "USD", "image": "/seed/pizza-cheese.jpg", "dietTags": ["vegetarian"], "allergens": ["gluten","dairy"], "calories": null, "popularity": 85, "available": true, "sponsored": false },
    { "id": "pizza-veg", "categoryId": "pizza", "name": "Vegetarian Pizza", "shortDesc": "Veggies, Mozzarella, Marinara", "price": 10, "currency": "USD", "image": "/seed/pizza-veg.jpg", "dietTags": ["vegetarian"], "allergens": ["gluten","dairy"], "calories": null, "popularity": 70, "available": true, "sponsored": false },
    { "id": "pizza-ham", "categoryId": "pizza", "name": "Cheese & Ham Pizza", "shortDesc": "Ham, Mozzarella, Marinara", "price": 12, "currency": "USD", "image": "/seed/pizza-ham.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 65, "available": true, "sponsored": false },
    { "id": "pizza-pepperoni", "categoryId": "pizza", "name": "Pepperoni Pizza", "shortDesc": "Pepperoni, Mozzarella, Marinara", "price": 12, "currency": "USD", "image": "/seed/pizza-pepperoni.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 90, "available": true, "sponsored": false },

    { "id": "classic-burger", "categoryId": "burgers", "name": "Classic Burger", "shortDesc": "Beef Patty, Lettuce, Pickles, Tomato, Cocktail Sauce", "price": 9, "currency": "USD", "image": "/seed/classic-burger.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 85, "available": true, "sponsored": false },
    { "id": "cheese-burger", "categoryId": "burgers", "name": "Cheese Burger", "shortDesc": "Beef Patty, Cheddar, Lettuce, Pickles, Tomato", "price": 10, "currency": "USD", "image": "/seed/cheese-burger.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 88, "available": true, "sponsored": false },
    { "id": "mozz-beef-melt", "categoryId": "burgers", "name": "Mozzarella Beef Melt", "shortDesc": "Beef Patty, Breaded Mozzarella, Lettuce", "price": 12, "currency": "USD", "image": "/seed/mozz-beef-melt.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 62, "available": true, "sponsored": false },
    { "id": "chicken-burger", "categoryId": "burgers", "name": "Chicken Burger", "shortDesc": "Chicken Breast, Lettuce, Tomato, Garlic Mayo", "price": 8, "currency": "USD", "image": "/seed/chicken-burger.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 70, "available": true, "sponsored": false },
    { "id": "mozz-chicken-melt", "categoryId": "burgers", "name": "Mozzarella Chicken Melt", "shortDesc": "Chicken Breast, Breaded Mozzarella", "price": 11, "currency": "USD", "image": "/seed/mozz-chicken-melt.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 67, "available": true, "sponsored": false },
    { "id": "crispy-chicken", "categoryId": "burgers", "name": "Crispy Chicken", "shortDesc": "Breaded Chicken (plain / honey mustard / BBQ), Lettuce, Chips", "price": 10, "currency": "USD", "image": "/seed/crispy-chicken.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 72, "available": true, "sponsored": false },

    { "id": "tuna-sub", "categoryId": "sandwiches", "name": "Tuna Sub", "shortDesc": "Soft Bun, Tuna, Lettuce, Pickles, Corn, Mayo", "price": 8, "currency": "USD", "image": "/seed/tuna-sub.jpg", "dietTags": [], "allergens": ["fish"], "calories": null, "popularity": 50, "available": true, "sponsored": false },
    { "id": "taouk-sandwich", "categoryId": "sandwiches", "name": "Taouk", "shortDesc": "Lebanese Bread, Marinated Chicken, Fries, Garlic Paste, Pickles, Coleslaw", "price": 7, "currency": "USD", "image": "/seed/taouk.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 80, "available": true, "sponsored": false },
    { "id": "chicken-sub", "categoryId": "sandwiches", "name": "Chicken Sub", "shortDesc": "Soft Bun, Grilled Chicken, Lettuce, Pickles, Tomato, Garlic Mayo", "price": 9, "currency": "USD", "image": "/seed/chicken-sub.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 68, "available": true, "sponsored": false },
    { "id": "chicken-melt", "categoryId": "sandwiches", "name": "Chicken Melt", "shortDesc": "Soft Bun, Grilled Chicken, Mozzarella Sticks, Lettuce", "price": 11, "currency": "USD", "image": "/seed/chicken-melt.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 59, "available": true, "sponsored": false },
    { "id": "fajita-fusion", "categoryId": "sandwiches", "name": "Fajita Fusion", "shortDesc": "Seasoned Chicken, Mozzarella, Peppers, Onions, Corn, Secret Sauce", "price": 11, "currency": "USD", "image": "/seed/fajita-fusion.jpg", "dietTags": [], "allergens": ["gluten","dairy"], "calories": null, "popularity": 61, "available": true, "sponsored": false },

    { "id": "beef-burger-platter", "categoryId": "platters", "name": "Beef Burger Platter", "shortDesc": "Beef Patty, Fries, Coleslaw, Cocktail Sauce (Add cheese $1)", "price": 14, "currency": "USD", "image": "/seed/beef-burger-platter.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 66, "available": true, "sponsored": false },
    { "id": "chicken-burger-platter", "categoryId": "platters", "name": "Chicken Burger Platter", "shortDesc": "Chicken Patty, Fries, Coleslaw, Cocktail Sauce", "price": 12, "currency": "USD", "image": "/seed/chicken-burger-platter.jpg", "dietTags": [], "allergens": ["gluten"], "calories": null, "popularity": 54, "available": true, "sponsored": false },
    { "id": "taouk-platter", "categoryId": "platters", "name": "Taouk Platter", "shortDesc": "2 Skewers, Coleslaw, Fries, Garlic Paste, Hummus, Pickles, Lebanese Bread", "price": 14, "currency": "USD", "image": "/seed/taouk-platter.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 77, "available": true, "sponsored": false },
    { "id": "chicken-delight", "categoryId": "platters", "name": "Chicken Delight", "shortDesc": "Grilled Chicken Breast, Curly Fries, Broccoli, Carrots, Garlic Mayo", "price": 16, "currency": "USD", "image": "/seed/chicken-delight.jpg", "dietTags": [], "allergens": [], "calories": null, "popularity": 71, "available": true, "sponsored": false },

    {
      "id": "vodka-russian-standard",
      "categoryId": "drinks",
      "name": "Vodka — Russian Standard",
      "variants": [
        { "label": "Single", "price": 5 },
        { "label": "Double", "price": 8 },
        { "label": "Bottle", "price": 65 }
      ],
      "currency": "USD",
      "image": "/seed/vodka-russian.jpg",
      "dietTags": [],
      "allergens": [],
      "available": true
    },
    {
      "id": "vodka-absolut",
      "categoryId": "drinks",
      "name": "Vodka — Absolut",
      "variants": [{ "label": "Single", "price": 5 }, { "label": "Double", "price": 8 }, { "label": "Bottle", "price": 65 }],
      "currency": "USD",
      "image": "/seed/vodka-absolut.jpg",
      "available": true
    },
    {
      "id": "vodka-stoli",
      "categoryId": "drinks",
      "name": "Vodka — Stolichnaya",
      "variants": [{ "label": "Single", "price": 5 }, { "label": "Double", "price": 8 }, { "label": "Bottle", "price": 65 }],
      "currency": "USD",
      "image": "/seed/vodka-stoli.jpg",
      "available": true
    },
    {
      "id": "vodka-grey-goose",
      "categoryId": "drinks",
      "name": "Vodka — Grey Goose",
      "variants": [{ "label": "Single", "price": 8 }, { "label": "Double", "price": 12 }, { "label": "Bottle", "price": 100 }],
      "currency": "USD",
      "image": "/seed/vodka-greygoose.jpg",
      "available": true
    },

    {
      "id": "gin-gordons",
      "categoryId": "drinks",
      "name": "Gin — Gordons",
      "variants": [{ "label": "Single", "price": 5 }, { "label": "Double", "price": 8 }, { "label": "Bottle", "price": 65 }],
      "currency": "USD",
      "image": "/seed/gin-gordons.jpg"
    },
    {
      "id": "tequila-jose-white",
      "categoryId": "drinks",
      "name": "Tequila — Jose Cuervo White",
      "variants": [{ "label": "Single", "price": 5 }, { "label": "Double", "price": 8 }, { "label": "Bottle", "price": 75 }],
      "currency": "USD",
      "image": "/seed/tequila-jose-white.jpg"
    },

    { "id": "sangria-pitcher", "categoryId": "drinks", "name": "Sangria (Pitcher)", "shortDesc": "", "price": 40, "currency": "USD", "image": "/seed/sangria.jpg", "available": true },
    { "id": "margarita-pitcher", "categoryId": "drinks", "name": "Margarita (Pitcher)", "price": 40, "currency": "USD", "image": "/seed/margarita-pitcher.jpg", "available": true },

    { "id": "perrier", "categoryId": "drinks", "name": "Perrier / Soda Water", "price": 5, "currency": "USD", "image": "/seed/perrier.jpg", "available": true },
    { "id": "ice-tea", "categoryId": "drinks", "name": "Ice Tea", "price": 4, "currency": "USD", "image": "/seed/ice-tea.jpg", "available": true },
    { "id": "soft-drinks", "categoryId": "drinks", "name": "Soft Drinks", "price": 4, "currency": "USD", "image": "/seed/soft-drinks.jpg", "available": true },
    { "id": "juices", "categoryId": "drinks", "name": "Juices", "price": 3, "currency": "USD", "image": "/seed/juices.jpg", "available": true },
    { "id": "fresh-orange", "categoryId": "drinks", "name": "Fresh Orange Juice", "price": 5, "currency": "USD", "image": "/seed/fresh-orange.jpg", "available": true },
    { "id": "fresh-lemonade", "categoryId": "drinks", "name": "Fresh Lemonade", "price": 5, "currency": "USD", "image": "/seed/lemonade.jpg", "available": true },
    { "id": "small-water", "categoryId": "drinks", "name": "Small Water", "price": 1, "currency": "USD", "image": "/seed/small-water.jpg", "available": true },
    { "id": "large-water", "categoryId": "drinks", "name": "Large Water", "price": 3, "currency": "USD", "image": "/seed/large-water.jpg", "available": true },

    { "id": "lebanese-coffee", "categoryId": "drinks", "name": "Lebanese Coffee", "price": 3, "currency": "USD", "image": "/seed/lebanese-coffee.jpg", "available": true },
    { "id": "espresso", "categoryId": "drinks", "name": "Espresso", "price": 4, "currency": "USD", "image": "/seed/espresso.jpg", "available": true },

    { "id": "arguileh-mouassal", "categoryId": "drinks", "name": "Arguileh — Mouassal", "price": 12, "currency": "USD", "image": "/seed/arguileh-mouassal.jpg", "available": true },
    { "id": "arguileh-ras", "categoryId": "drinks", "name": "Arguileh — Ras", "price": 6, "currency": "USD", "image": "/seed/arguileh-ras.jpg", "available": true },

    { "id": "beirut-beer", "categoryId": "beers", "name": "Beirut", "variants": [{ "label": "Small", "price": 6 }, { "label": "Large", "price": 8 }], "currency": "USD", "image": "/seed/beirut.jpg", "available": true },
    { "id": "almaza", "categoryId": "beers", "name": "Almaza", "variants": [{ "label": "Small", "price": 6 }, { "label": "Large", "price": 8 }], "currency": "USD", "image": "/seed/beirut.jpg", "available": true },

    { "id": "arak-na", "categoryId": "arak", "name": "Arak (N/A)", "variants": [{ "label": "1/4", "price": 1 }], "currency": "USD", "image": "/seed/arak.jpg", "available": true },

    { "id": "prosecco", "categoryId": "prosecco", "name": "Prosecco", "price": 35, "currency": "USD", "image": "/seed/prosecco.jpg", "available": true },
    { "id": "couvent", "categoryId": "prosecco", "name": "Couvent", "price": 25, "currency": "USD", "image": "/seed/couvent.jpg", "available": true },

    { "id": "ksara-reserve", "categoryId": "wine", "name": "Ksara Reserve", "price": 7, "currency": "USD", "image": "/seed/ksara-reserve.jpg", "available": true },
    { "id": "white-chardonnay", "categoryId": "wine", "name": "White Chardonnay", "price": 18, "currency": "USD", "image": "/seed/white-chardonnay.jpg", "available": true },

    { "id": "lemon-drop", "categoryId": "cocktails", "name": "Lemon Drop", "price": 12, "currency": "USD", "image": "/seed/lemon-drop.jpg", "available": true },
    { "id": "passion-fruit-martini", "categoryId": "cocktails", "name": "Passion Fruit Martini", "price": 12, "currency": "USD", "image": "/seed/passion-fruit.jpg", "available": true },
    { "id": "signature-margarita", "categoryId": "cocktails", "name": "Signature Margarita", "price": 12, "currency": "USD", "image": "/seed/signature-margarita.jpg", "available": true }
  ],
  ads: [
    { "id": "spa", "title": "Spa Relax Package", "image": "/seed/spa.jpg", "url": "/spa", "position": "side-rail", "weight": 1 }
  ]
};

// Function to generate SVG placeholder for a dish
function generateSVGPlaceholder(dishName: string, category: string, width: number = 400, height: number = 300): string {
  const colors = {
    starters: { bg: '#fef3c7', text: '#d97706', accent: '#f59e0b' },
    salads: { bg: '#ecfdf5', text: '#059669', accent: '#10b981' },
    pizza: { bg: '#fce7f3', text: '#be185d', accent: '#ec4899' },
    burgers: { bg: '#f3e8ff', text: '#7c3aed', accent: '#a855f7' },
    sandwiches: { bg: '#fff7ed', text: '#ea580c', accent: '#fb923c' },
    platters: { bg: '#f0f9ff', text: '#0369a1', accent: '#0ea5e9' },
    drinks: { bg: '#fef2f2', text: '#dc2626', accent: '#ef4444' },
    beers: { bg: '#fef3c7', text: '#d97706', accent: '#f59e0b' },
    arak: { bg: '#f0fdf4', text: '#16a34a', accent: '#22c55e' },
    prosecco: { bg: '#fdf2f8', text: '#be185d', accent: '#ec4899' },
    wine: { bg: '#fef2f2', text: '#dc2626', accent: '#ef4444' },
    cocktails: { bg: '#f0f9ff', text: '#0369a1', accent: '#0ea5e9' }
  };

  const colorScheme = colors[category as keyof typeof colors] || colors.starters;
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colorScheme.accent};stop-opacity:0.3" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad-${category})"/>
    <circle cx="${width * 0.2}" cy="${height * 0.2}" r="20" fill="${colorScheme.accent}" opacity="0.2"/>
    <circle cx="${width * 0.8}" cy="${height * 0.8}" r="30" fill="${colorScheme.accent}" opacity="0.1"/>
    <text x="${width/2}" y="${height * 0.4}" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="${colorScheme.text}" font-weight="bold">
      ${dishName}
    </text>
    <text x="${width/2}" y="${height * 0.6}" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="${colorScheme.text}" opacity="0.8">
      ${category.charAt(0).toUpperCase() + category.slice(1)}
    </text>
    <text x="${width/2}" y="${height * 0.8}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${colorScheme.text}" opacity="0.6">
      Placeholder
    </text>
  </svg>`;
}

// Function to generate base64 LQIP placeholder
function generateBase64LQIP(dishName: string, category: string): string {
  const svg = generateSVGPlaceholder(dishName, category, 20, 15);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Function to create all image files
async function createImageFiles() {
  const publicSeedDir = path.join(__dirname, '..', 'public', 'seed');
  
  // Ensure directories exist
  if (!fs.existsSync(publicSeedDir)) {
    fs.mkdirSync(publicSeedDir, { recursive: true });
  }

  console.log('🖼️  Creating image placeholders...');

  // Create images for all dishes
  for (const dish of sampleData.dishes) {
    const imagePath = dish.image.replace('/seed/', '');
    const fullPath = path.join(publicSeedDir, imagePath);
    
    if (!fs.existsSync(fullPath)) {
      const category = sampleData.categories.find(c => c.id === dish.categoryId)?.name.toLowerCase() || 'starters';
      const svg = generateSVGPlaceholder(dish.name, category);
      fs.writeFileSync(fullPath, svg);
      console.log(`  ✅ Created ${imagePath}`);
    }
  }

  // Create hero image
  const heroPath = path.join(publicSeedDir, 'resort-hero.jpg.svg');
  if (!fs.existsSync(heroPath)) {
    const heroSvg = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#heroGradient)"/>
      <text x="600" y="300" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="white" font-weight="bold">
        Port Antonio Resort
      </text>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">
        Luxury Dining Experience
      </text>
      <text x="600" y="400" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#bfdbfe">
        Hero Image Placeholder
      </text>
    </svg>`;
    fs.writeFileSync(heroPath, heroSvg);
    console.log('  ✅ Created resort-hero.jpg.svg');
  }

  console.log('🖼️  All image placeholders created successfully!');
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting Port Antonio Resort Menu seed...\n');

    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create image files
    await createImageFiles();

    // Write sample data to file
    const dataPath = path.join(dataDir, 'dishes.json');
    fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));

    console.log('\n✅ Sample data seeded successfully!');
    console.log(`📁 Data written to: ${dataPath}`);
    console.log(`🍽️  ${sampleData.dishes.length} dishes added`);
    console.log(`📂 ${sampleData.categories.length} categories added`);
    console.log(`📢 ${sampleData.ads.length} advertisements added`);
    console.log('\n🚀 You can now run the application with: npm run dev');
    console.log('🔑 Admin login: admin123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the main function
main();
