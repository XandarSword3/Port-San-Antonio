#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Verifies all required environment variables are set
 */

const chalk = require('chalk')

console.log(chalk.blue.bold('🔍 Port San Antonio - Environment Variables Check\n'))

// Required environment variables
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

// Optional environment variables
const optional = [
  'JWT_SECRET',
  'ADMIN_USERNAME', 
  'ADMIN_PASSWORD_HASH',
  'NEXT_PUBLIC_SHOW_ADMIN',
  'GITHUB_TOKEN',
  'GITHUB_REPO',
  'GITHUB_BRANCH',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
]

let allGood = true

console.log(chalk.yellow.bold('📋 Required Variables:'))
required.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
      ? `${value.substring(0, 10)}...` 
      : value
    console.log(chalk.green(`  ✅ ${varName}: ${displayValue}`))
  } else {
    console.log(chalk.red(`  ❌ ${varName}: MISSING`))
    allGood = false
  }
})

console.log(chalk.yellow.bold('\n📋 Optional Variables:'))
optional.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') || varName.includes('TOKEN')
      ? `${value.substring(0, 10)}...` 
      : value
    console.log(chalk.green(`  ✅ ${varName}: ${displayValue}`))
  } else {
    console.log(chalk.gray(`  ⚪ ${varName}: not set`))
  }
})

console.log(chalk.blue.bold('\n🔧 Environment Info:'))
console.log(`  📦 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
console.log(`  🚀 Vercel: ${process.env.VERCEL ? 'Yes' : 'No'}`)
console.log(`  🏗️ Build: ${process.env.CI ? 'Yes' : 'No'}`)

if (allGood) {
  console.log(chalk.green.bold('\n🎉 All required environment variables are set!'))
  console.log(chalk.blue('Ready for deployment to Vercel.'))
} else {
  console.log(chalk.red.bold('\n❌ Missing required environment variables!'))
  console.log(chalk.yellow('Please set the missing variables and try again.'))
  console.log(chalk.blue('\nFor Vercel deployment:'))
  console.log(chalk.gray('1. Go to Project Settings > Environment Variables'))
  console.log(chalk.gray('2. Add each missing variable'))
  console.log(chalk.gray('3. Redeploy the project'))
  process.exit(1)
}

// Test Supabase connection if variables are available
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log(chalk.blue.bold('\n🔗 Testing Supabase Connection...'))
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Test connection
    supabase
      .from('dishes')
      .select('count', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.log(chalk.red(`  ❌ Supabase Error: ${error.message}`))
        } else {
          console.log(chalk.green(`  ✅ Supabase Connected: ${count} dishes in database`))
        }
      })
      .catch(err => {
        console.log(chalk.red(`  ❌ Connection Failed: ${err.message}`))
      })
  } catch (err) {
    console.log(chalk.gray('  ⚪ Supabase client not available (install @supabase/supabase-js)'))
  }
}
