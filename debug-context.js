// Debug script to test actual MenuContext behavior in browser
const debug = async () => {
  console.log('=== MENU CONTEXT DEBUG ===')
  
  // Check if environment variables are available in browser
  console.log('Environment check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process?.env?.NEXT_PUBLIC_SUPABASE_URL || 'undefined')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'defined' : 'undefined')
  
  // Check if we can access the window object
  if (typeof window !== 'undefined') {
    console.log('Running in browser environment')
    
    // Try to access Supabase directly
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      
      console.log('Creating Supabase client...')
      const client = createClient(url, key)
      
      // Test connection
      const { data, error } = await client.from('dishes').select('count').limit(1)
      if (error) {
        console.error('Supabase connection error:', error)
      } else {
        console.log('Supabase connection successful:', data)
      }
      
    } catch (err) {
      console.error('Failed to create Supabase client:', err)
    }
  } else {
    console.log('Running in server environment')
  }
}

// Run debug
debug().catch(console.error)
