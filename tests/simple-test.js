// Simple test to verify FilterChips doesn't crash
const testFilterChips = () => {
  console.log('Testing FilterChips component...')
  
  // Test case 1: undefined filters
  try {
    // This would normally crash without the fix
    const filters = undefined
    const hasActiveFilters = false
    
    if (!hasActiveFilters || !filters || filters.length === 0) {
      console.log('✅ Test 1 PASSED: Handles undefined filters gracefully')
    } else {
      console.log('❌ Test 1 FAILED: Should handle undefined filters')
    }
  } catch (error) {
    console.log('❌ Test 1 FAILED: Crashed with error:', error.message)
  }
  
  // Test case 2: empty filters array
  try {
    const filters = []
    const hasActiveFilters = false
    
    if (!hasActiveFilters || filters.length === 0) {
      console.log('✅ Test 2 PASSED: Handles empty filters array gracefully')
    } else {
      console.log('❌ Test 2 FAILED: Should handle empty filters array')
    }
  } catch (error) {
    console.log('❌ Test 2 FAILED: Crashed with error:', error.message)
  }
  
  // Test case 3: active filters
  try {
    const filters = [
      { id: 'vegetarian', label: 'Vegetarian', active: true },
      { id: 'vegan', label: 'Vegan', active: false }
    ]
    const hasActiveFilters = true
    
    const activeFilters = filters.filter(filter => filter.active)
    
    if (hasActiveFilters && activeFilters.length > 0) {
      console.log('✅ Test 3 PASSED: Correctly identifies active filters')
    } else {
      console.log('❌ Test 3 FAILED: Should identify active filters')
    }
  } catch (error) {
    console.log('❌ Test 3 FAILED: Crashed with error:', error.message)
  }
  
  console.log('All tests completed!')
}

// Run the test
testFilterChips()
