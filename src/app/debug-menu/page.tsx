'use client'

import { useMenu } from '@/contexts/MenuContext'
import { useEffect, useState } from 'react'
import { isSupabaseAvailable } from '@/lib/supabase'

export default function DebugMenuPage() {
  const { dishes, categories, loading, error } = useMenu()
  const [logs, setLogs] = useState<string[]>([])
  const [envTest, setEnvTest] = useState({
    url: 'checking...',
    key: 'checking...',
    supabaseAvailable: 'checking...'
  })

  useEffect(() => {
    // Test environment variables directly
    setEnvTest({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'undefined',
      supabaseAvailable: isSupabaseAvailable() ? 'true' : 'false'
    })
  }, [])

  useEffect(() => {
    // Capture console.log output
    const originalLog = console.log
    console.log = (...args) => {
      setLogs(prev => [...prev, args.map(String).join(' ')])
      originalLog(...args)
    }

    return () => {
      console.log = originalLog
    }
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Menu Debug Page</h1>
      
      <h2>Menu State:</h2>
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        <p><strong>Error:</strong> {error || 'null'}</p>
        <p><strong>Dishes Count:</strong> {dishes.length}</p>
        <p><strong>Categories Count:</strong> {categories.length}</p>
      </div>

      <h2>Environment Variables (Client-side):</h2>
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envTest.url}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envTest.key}</p>
        <p><strong>isSupabaseAvailable():</strong> {envTest.supabaseAvailable}</p>
      </div>

      <h2>Console Logs:</h2>
      <div style={{ background: '#000', color: '#0f0', padding: '10px', height: '300px', overflow: 'auto' }}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>

      <h2>Sample Dishes:</h2>
      <div style={{ background: '#f0f0f0', padding: '10px' }}>
        {dishes.slice(0, 3).map((dish, index) => (
          <div key={index}>
            <strong>{dish.name}</strong> - ${dish.price} ({dish.categoryId})
          </div>
        ))}
      </div>
    </div>
  )
}
