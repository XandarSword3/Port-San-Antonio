const fs = require('fs')
const path = require('path')

// Check both data files
const dataFile = path.join(__dirname, '..', 'data', 'dishes.json')
const publicFile = path.join(__dirname, '..', 'public', 'menu-data.json')

console.log('📁 Checking data files...')

if (fs.existsSync(dataFile)) {
  const dataContent = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  console.log(`📊 data/dishes.json: ${dataContent.dishes?.length || 0} dishes`)
}

if (fs.existsSync(publicFile)) {
  const publicContent = JSON.parse(fs.readFileSync(publicFile, 'utf8'))
  console.log(`📊 public/menu-data.json: ${publicContent.dishes?.length || 0} dishes`)
  
  // Show some sample IDs
  if (publicContent.dishes && publicContent.dishes.length > 50) {
    console.log('🔍 Sample dish IDs:')
    publicContent.dishes.slice(0, 10).forEach((dish, i) => {
      console.log(`  ${i+1}. ${dish.id}: ${dish.name}`)
    })
    console.log(`  ... and ${publicContent.dishes.length - 10} more`)
  }
}
