// Simple authentication test without JWT
const bcrypt = require('bcryptjs');

// Test credentials
const testUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'worker', password: 'worker123', role: 'worker' },
  { username: 'owner', password: 'owner123', role: 'owner' }
];

async function testBasicAuth() {
  console.log('🔐 Testing Basic Authentication System...\n');

  for (const user of testUsers) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 12);
      console.log(`✅ ${user.username}: Password hashed successfully`);
      
      // Verify the password
      const isValid = await bcrypt.compare(user.password, hashedPassword);
      console.log(`✅ ${user.username}: Password verification ${isValid ? 'PASSED' : 'FAILED'}`);
      
      if (!isValid) {
        console.log(`❌ Password verification failed for ${user.username}`);
      }
    } catch (error) {
      console.error(`❌ Error testing ${user.username}:`, error);
    }
    console.log('---');
  }

  console.log('🏁 Basic authentication test completed!');
}

testBasicAuth();
