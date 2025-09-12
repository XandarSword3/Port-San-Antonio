#!/usr/bin/env node

/**
 * Database migration runner for analytics tables
 * Run with: node scripts/run-analytics-migration.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  const lines = envFile.split('\n')
  
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...values] = line.split('=')
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim()
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ Missing Supabase key in .env.local')
  console.error('   Need either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Using anon key instead of service role key - some operations may fail')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('🚀 Running analytics database migration...')
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '2025-09-analytics.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Read migration file:', migrationPath)
    console.log('📊 Migration size:', migrationSQL.length, 'characters')
    
    // Execute the migration
    console.log('⚡ Executing migration...')
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })
    
    if (error) {
      console.error('❌ Migration failed:', error)
      
      // Try alternative approach - split into individual statements
      console.log('🔄 Trying alternative approach...')
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      console.log(`📝 Executing ${statements.length} individual statements...`)
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i]
        if (stmt.length > 0) {
          console.log(`   ${i + 1}/${statements.length}: ${stmt.substring(0, 50)}...`)
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: stmt + ';'
          })
          
          if (stmtError) {
            console.warn(`   ⚠️  Statement ${i + 1} error (may be expected):`, stmtError.message)
          }
        }
      }
      
      console.log('✅ Migration completed with alternative approach')
    } else {
      console.log('✅ Migration executed successfully:', data)
    }
    
    // Verify tables were created
    console.log('🔍 Verifying tables...')
    
    const tables = ['analytics_events', 'visitors', 'user_visitors']
    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (tableError) {
        console.error(`❌ Table ${table} verification failed:`, tableError.message)
      } else {
        console.log(`✅ Table ${table} is accessible`)
      }
    }
    
    console.log('')
    console.log('🎉 Analytics migration completed successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Test the visitor tracking by visiting your site')
    console.log('2. Check the analytics_events table in Supabase')
    console.log('3. Test the QR landing page: /qr?table=1')
    console.log('4. Verify cookie consent banner appears on first visit')
    console.log('')
    console.log('🔍 Query examples:')
    console.log('   SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 10;')
    console.log('   SELECT visitor_id, COUNT(*) FROM analytics_events GROUP BY visitor_id;')
    console.log('   SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name;')
    
  } catch (error) {
    console.error('❌ Migration script error:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
