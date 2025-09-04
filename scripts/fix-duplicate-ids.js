// Script to fix duplicate IDs in dishes.json
const fs = require('fs');
const path = require('path');

// Read the dishes.json file
const dishesPath = path.join(__dirname, '..', 'data', 'dishes.json');
const dishesData = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));

// Track IDs that have been seen
const seenIds = new Set();
const duplicateIds = new Set();

// First pass: identify duplicate IDs
dishesData.dishes.forEach(dish => {
  if (seenIds.has(dish.id)) {
    duplicateIds.add(dish.id);
  } else {
    seenIds.add(dish.id);
  }
});

console.log(`Found ${duplicateIds.size} duplicate IDs:`, Array.from(duplicateIds));

// Second pass: fix duplicate IDs
const idCounters = {};

dishesData.dishes.forEach(dish => {
  if (duplicateIds.has(dish.id)) {
    // Initialize counter if not exists
    if (!idCounters[dish.id]) {
      idCounters[dish.id] = 1;
    }
    
    // Create a new unique ID by appending a counter
    const newId = `${dish.id}-${idCounters[dish.id]}`;
    console.log(`Changing duplicate ID: ${dish.id} -> ${newId}`);
    
    // Update the dish ID
    dish.id = newId;
    
    // Increment the counter for this ID
    idCounters[dish.id]++;
  }
});

// Write the updated data back to the file
fs.writeFileSync(dishesPath, JSON.stringify(dishesData, null, 2));

console.log('Duplicate IDs have been fixed and saved to dishes.json');