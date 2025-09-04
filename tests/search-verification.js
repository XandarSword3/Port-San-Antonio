// Simple verification test for search functionality
console.log('🧪 Testing search functionality...')

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

// Test 1: Handle undefined dish properties safely
function testUndefinedProperties() {
  console.log('Test 1: Testing undefined dish properties...')
  
  const dish = {
    id: 'test-dish',
    name: undefined,
    shortDesc: null,
    fullDesc: undefined,
    ingredients: undefined,
    variants: null
  };
  
  try {
    const result = safeSearch(dish, 'chicken')
    if (result === false) {
      console.log('✅ PASS: Handles undefined properties safely')
      return true
    } else {
      console.log('❌ FAIL: Should return false for undefined properties')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: Crashed with error:', error.message)
    return false
  }
}

// Test 2: Handle empty search query
function testEmptyQuery() {
  console.log('Test 2: Testing empty search query...')
  
  const dish = {
    id: 'test-dish',
    name: 'Chicken Burger',
    shortDesc: 'Delicious chicken burger'
  };
  
  try {
    const result1 = safeSearch(dish, '')
    const result2 = safeSearch(dish, null)
    const result3 = safeSearch(dish, undefined)
    
    if (result1 === true && result2 === true && result3 === true) {
      console.log('✅ PASS: Handles empty queries correctly')
      return true
    } else {
      console.log('❌ FAIL: Should return true for empty queries')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: Crashed with error:', error.message)
    return false
  }
}

// Test 3: Match dish name
function testNameMatching() {
  console.log('Test 3: Testing name matching...')
  
  const dish = {
    id: 'test-dish',
    name: 'Chicken Burger',
    shortDesc: 'Delicious burger'
  };
  
  try {
    const result1 = safeSearch(dish, 'chicken')
    const result2 = safeSearch(dish, 'BURGER')
    const result3 = safeSearch(dish, 'beef')
    
    if (result1 === true && result2 === true && result3 === false) {
      console.log('✅ PASS: Matches dish names correctly')
      return true
    } else {
      console.log('❌ FAIL: Name matching not working correctly')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: Crashed with error:', error.message)
    return false
  }
}

// Test 4: Match short description
function testShortDescMatching() {
  console.log('Test 4: Testing short description matching...')
  
  const dish = {
    id: 'test-dish',
    name: 'Classic Burger',
    shortDesc: 'Delicious chicken burger with fries'
  };
  
  try {
    const result1 = safeSearch(dish, 'chicken')
    const result2 = safeSearch(dish, 'fries')
    const result3 = safeSearch(dish, 'salad')
    
    if (result1 === true && result2 === true && result3 === false) {
      console.log('✅ PASS: Matches short descriptions correctly')
      return true
    } else {
      console.log('❌ FAIL: Short description matching not working correctly')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: Crashed with error:', error.message)
    return false
  }
}

// Test 5: Match variants
function testVariantsMatching() {
  console.log('Test 5: Testing variants matching...')
  
  const dish = {
    id: 'test-dish',
    name: 'Vodka',
    shortDesc: 'Premium vodka',
    variants: [
      { label: 'Single', price: 5 },
      { label: 'Double', price: 8 }
    ]
  };
  
  try {
    const result1 = safeSearch(dish, 'single')
    const result2 = safeSearch(dish, 'double')
    const result3 = safeSearch(dish, 'bottle')
    
    if (result1 === true && result2 === true && result3 === false) {
      console.log('✅ PASS: Matches variants correctly')
      return true
    } else {
      console.log('❌ FAIL: Variants matching not working correctly')
      return false
    }
  } catch (error) {
    console.log('❌ FAIL: Crashed with error:', error.message)
    return false
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting search functionality tests...\n')
  
  const tests = [
    testUndefinedProperties,
    testEmptyQuery,
    testNameMatching,
    testShortDescMatching,
    testVariantsMatching
  ]
  
  let passed = 0
  let total = tests.length
  
  tests.forEach((test, index) => {
    const result = test()
    if (result) passed++
    console.log('') // Empty line for readability
  })
  
  console.log(`📊 Test Results: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Search functionality is working correctly.')
  } else {
    console.log('⚠️  Some tests failed. Please check the search implementation.')
  }
}

// Run the tests
runAllTests()
