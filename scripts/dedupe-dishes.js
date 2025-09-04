#!/usr/bin/env node

/**
 * dedupe-dishes.js
 * 
 * This script analyzes the dishes.json file and removes duplicate dishes based on ID.
 * It also checks for and warns about potential duplicates with different IDs but similar names.
 */

const fs = require('fs');
const path = require('path');

// Path to the dishes.json file
const dataPath = path.join(process.cwd(), 'data', 'dishes.json');

// Function to deduplicate dishes
function dedupeDishes() {
  console.log('🔍 Analyzing dishes.json for duplicates...');
  
  // Read the data file
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.dishes || !Array.isArray(data.dishes)) {
      console.error('❌ Error: dishes.json does not contain a dishes array');
      process.exit(1);
    }
    
    console.log(`📊 Found ${data.dishes.length} dishes in the file`);
    
    // Track duplicates
    const idMap = new Map();
    const nameMap = new Map();
    const duplicateIds = [];
    const similarNames = [];
    
    // First pass: find duplicates by ID
    data.dishes.forEach((dish, index) => {
      if (!dish.id) {
        console.warn(`⚠️ Warning: Dish at index ${index} has no ID`);
        return;
      }
      
      if (idMap.has(dish.id)) {
        duplicateIds.push(dish.id);
      } else {
        idMap.set(dish.id, index);
      }
      
      // Track names for similarity check
      const normalizedName = dish.name?.toLowerCase().trim();
      if (normalizedName) {
        if (nameMap.has(normalizedName) && nameMap.get(normalizedName) !== dish.id) {
          similarNames.push({
            name: dish.name,
            ids: [nameMap.get(normalizedName), dish.id]
          });
        } else {
          nameMap.set(normalizedName, dish.id);
        }
      }
    });
    
    // Report findings
    if (duplicateIds.length === 0) {
      console.log('✅ No duplicate IDs found!');
    } else {
      console.log(`⚠️ Found ${duplicateIds.length} duplicate IDs: ${duplicateIds.join(', ')}`);
    }
    
    if (similarNames.length > 0) {
      console.log(`⚠️ Found ${similarNames.length} dishes with similar names but different IDs:`);
      similarNames.forEach(item => {
        console.log(`   - "${item.name}" (IDs: ${item.ids.join(', ')})`);
      });
    }
    
    // Remove duplicates if found
    if (duplicateIds.length > 0) {
      // Keep only the first occurrence of each ID
      const uniqueDishes = [];
      const seenIds = new Set();
      
      data.dishes.forEach(dish => {
        if (!seenIds.has(dish.id)) {
          uniqueDishes.push(dish);
          seenIds.add(dish.id);
        }
      });
      
      // Update the data
      const removedCount = data.dishes.length - uniqueDishes.length;
      data.dishes = uniqueDishes;
      
      // Write the updated data back to the file
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      console.log(`✅ Removed ${removedCount} duplicate dishes. New count: ${uniqueDishes.length}`);
      console.log(`💾 Updated dishes.json saved successfully`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the deduplication
dedupeDishes();