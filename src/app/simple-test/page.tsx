'use client'

import { useState } from 'react'

export default function SimpleTestPage() {
  const [testResult, setTestResult] = useState<string>('')
  
  // Test if environment variables are available in the browser
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const handleSupabaseTest = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const client = createClient(
        envUrl || '',
        envKey || ''
      )
      
      const { data, error } = await client
        .from('dishes')
        .select('count', { count: 'exact' })
        .limit(1)
      
      setTestResult(error ? `Error: ${error.message}` : `Success! Data: ${JSON.stringify(data)}`)
    } catch (err) {
      setTestResult(`Exception: ${err}`)
    }
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Simple Environment Test</h1>
      <p>URL: {envUrl ? 'SET' : 'MISSING'}</p>
      <p>Key: {envKey ? 'SET' : 'MISSING'}</p>
      <p>URL Value: {envUrl || 'undefined'}</p>
      <p>Key Length: {envKey?.length || 0}</p>
      
      <hr/>
      <h2>Manual Supabase Test</h2>
      <button onClick={handleSupabaseTest}>
        Test Supabase Connection
      </button>
      
      {testResult && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
          <strong>Result:</strong> {testResult}
        </div>
      )}
    </div>
  )
}
