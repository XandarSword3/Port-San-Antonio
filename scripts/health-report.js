const fs = require('fs');
const path = require('path');

// Read the dump data
const dumpPath = path.join(__dirname, '..', 'tests', 'artifacts', 'dump.json');
const dumpData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

const { categories, dishes } = dumpData;

// Count categories
const categoryCount = categories.length;

// Count dishes
const dishCount = dishes.length;

// Count dishes per category
const dishesPerCategory = {};
dishes.forEach(dish => {
  dishesPerCategory[dish.categoryId] = (dishesPerCategory[dish.categoryId] || 0) + 1;
});

// Count missing required fields
const missingFields = {
  missingPrice: 0,
  missingName: 0,
  missingCategoryId: 0,
  missingAvailable: 0
};

dishes.forEach(dish => {
  if (!dish.price || dish.price === null) missingFields.missingPrice++;
  if (!dish.name) missingFields.missingName++;
  if (!dish.categoryId) missingFields.missingCategoryId++;
  if (dish.available === null || dish.available === undefined) missingFields.missingAvailable++;
});

// Count available vs unavailable
const availableCount = dishes.filter(d => d.available).length;
const unavailableCount = dishes.filter(d => !d.available).length;

// Count dishes with diet tags
const withDietTags = dishes.filter(d => d.dietTags && d.dietTags.length > 0).length;

// Count dishes with allergens
const withAllergens = dishes.filter(d => d.allergens && d.allergens.length > 0).length;

// Create health report
const healthReport = {
  categories: categoryCount,
  dishes: dishCount,
  available: availableCount,
  unavailable: unavailableCount,
  withDietTags,
  withAllergens,
  dishesPerCategory,
  missingFields,
  dataQuality: {
    completeness: ((dishCount - Object.values(missingFields).reduce((a, b) => a + b, 0)) / dishCount * 100).toFixed(1) + '%',
    coverage: Object.keys(dishesPerCategory).length === categoryCount ? '100%' : 'Partial'
  }
};

console.log('Health Report:');
console.log(JSON.stringify(healthReport, null, 2));

// Save to file
const reportPath = path.join(__dirname, '..', 'tests', 'artifacts', 'health-report.json');
fs.writeFileSync(reportPath, JSON.stringify(healthReport, null, 2));
