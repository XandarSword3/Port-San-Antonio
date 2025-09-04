#!/usr/bin/env node

/**
 * fix-unique-ids.js
 * 
 * This script fixes duplicate IDs in dishes.json by making each ID unique.
 * Instead of removing duplicates, it appends a suffix to make each ID unique.
 */

const fs = require('fs');
const path = require('path');

// Path to the dishes.json file
const dataPath = path.join(process.cwd(), 'data', 'dishes.json');

// Function to fix duplicate IDs
function fixDuplicateIds() {
  console.log('🔍 Analyzing dishes.json for duplicate IDs...');
  
  // Read the data file
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.dishes || !Array.isArray(data.dishes)) {
      console.error('❌ Error: dishes.json does not contain a dishes array');
      process.exit(1);
    }
    
    console.log(`📊 Found ${data.dishes.length} dishes in the file`);
    
    // Track IDs and their occurrences
    const idOccurrences = {};
    const duplicateIds = new Set();
    
    // First pass: count occurrences of each ID
    data.dishes.forEach(dish => {
      if (!dish.id) return;
      
      idOccurrences[dish.id] = (idOccurrences[dish.id] || 0) + 1;
      
      if (idOccurrences[dish.id] > 1) {
        duplicateIds.add(dish.id);
      }
    });
    
    // Report findings
    if (duplicateIds.size === 0) {
      console.log('✅ No duplicate IDs found!');
      return;
    }
    
    console.log(`⚠️ Found ${duplicateIds.size} duplicate IDs: ${Array.from(duplicateIds).join(', ')}`);
    
    // Second pass: fix duplicate IDs
    const idCounters = {};
    let modifiedCount = 0;
    
    data.dishes.forEach(dish => {
      if (!dish.id || !duplicateIds.has(dish.id)) return;
      
      // Initialize counter if not exists
      if (!idCounters[dish.id]) {
        idCounters[dish.id] = 0;
      }
      
      // Increment counter
      idCounters[dish.id]++;
      
      // Only modify IDs after the first occurrence
      if (idCounters[dish.id] > 1) {
        const originalId = dish.id;
        dish.id = `${dish.id}-${idCounters[dish.id]}`;
        console.log(`   - Changed ID: ${originalId} → ${dish.id}`);
        modifiedCount++;
      }
    });
    
    // Write the updated data back to the file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Modified ${modifiedCount} duplicate IDs to make them unique`);
    console.log(`💾 Updated dishes.json saved successfully`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the ID fix
fixDuplicateIds();