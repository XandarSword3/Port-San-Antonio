// Simple test script to verify admin authentication
// Using built-in fetch for Node.js 18+

async function testAdminAuth() {
  try {
    console.log('Testing admin authentication...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Admin authentication successful!');
      return data;
    } else {
      console.log('❌ Admin authentication failed:', data.error);
    }
  } catch (error) {
    console.error('Error testing authentication:', error);
  }
}

async function testWorkerAuth() {
  try {
    console.log('Testing worker authentication...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'worker',
        password: 'worker123'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Worker authentication successful!');
      return data;
    } else {
      console.log('❌ Worker authentication failed:', data.error);
    }
  } catch (error) {
    console.error('Error testing worker authentication:', error);
  }
}

async function testOwnerAuth() {
  try {
    console.log('Testing owner authentication...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'owner',
        password: 'owner123'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Owner authentication successful!');
      return data;
    } else {
      console.log('❌ Owner authentication failed:', data.error);
    }
  } catch (error) {
    console.error('Error testing owner authentication:', error);
  }
}

async function testInvalidAuth() {
  try {
    console.log('Testing invalid credentials...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'invalid',
        password: 'invalid'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      console.log('✅ Invalid credentials properly rejected!');
    } else {
      console.log('❌ Invalid credentials incorrectly accepted!');
    }
  } catch (error) {
    console.error('Error testing invalid authentication:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting admin authentication tests...\n');
  
  await testAdminAuth();
  console.log('\n');
  
  await testWorkerAuth();
  console.log('\n');
  
  await testOwnerAuth();
  console.log('\n');
  
  await testInvalidAuth();
  console.log('\n');
  
  console.log('🏁 All tests completed!');
}

runAllTests();
