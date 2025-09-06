#!/usr/bin/env node

/**
 * Admin Credential Generator
 * Generates secure admin credentials for production use
 */

const bcrypt = require('bcryptjs')
const crypto = require('crypto')

async function generateCredentials() {
  console.log('🔐 Admin Credential Generator\n')
  
  // Generate secure JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex')
  
  // Generate secure admin password
  const adminPassword = crypto.randomBytes(16).toString('base64').slice(0, 16)
  
  // Hash the password
  const passwordHash = await bcrypt.hash(adminPassword, 12)
  
  console.log('Generated secure credentials:\n')
  console.log('Environment Variables to set:')
  console.log('=' .repeat(50))
  console.log(`JWT_SECRET="${jwtSecret}"`)
  console.log(`ADMIN_USERNAME="admin"`)
  console.log(`ADMIN_PASSWORD_HASH="${passwordHash}"`)
  console.log('\nCredentials for admin login:')
  console.log('=' .repeat(30))
  console.log(`Username: admin`)
  console.log(`Password: ${adminPassword}`)
  console.log('\n⚠️  IMPORTANT: Store these credentials securely!')
  console.log('⚠️  Add the environment variables to your .env.local file')
  console.log('⚠️  Never commit credentials to version control')
}

if (require.main === module) {
  generateCredentials().catch(console.error)
}

module.exports = { generateCredentials }
