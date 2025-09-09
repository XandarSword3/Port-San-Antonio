// Test the auto-commit API functionality
async function testAutoCommit() {
  try {
    console.log('🔄 Testing Auto-Commit API...\n');
    
    // Sample menu data for testing
    const testMenuData = {
      dishes: [
        {
          id: "test-dish-1",
          name: "Test Dish",
          description: "A test dish for auto-commit testing",
          price: 12.99,
          category: "appetizers",
          available: true,
          dietary: [],
          image: ""
        }
      ],
      categories: ["appetizers", "mains", "desserts"],
      ads: []
    };

    // Test the auto-commit endpoint
    const response = await fetch('http://localhost:3001/api/auto-commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ menuData: testMenuData })
    });

    console.log('Response Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Auto-commit successful:', result);
    } else {
      const error = await response.json();
      console.log('❌ Auto-commit failed:', error);
      
      // Additional debugging info
      console.log('Response headers:', [...response.headers.entries()]);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testAutoCommit();
