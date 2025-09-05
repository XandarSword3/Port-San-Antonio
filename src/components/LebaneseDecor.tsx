'use client'

import { useEffect, useState } from 'react'

export default function LebaneseDecor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Mediterranean Elements */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`olive-${i}`}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatingBeach ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          🫒
        </div>
      ))}

      {/* Cedar Trees */}
      <div 
        className="absolute top-10 right-10 text-6xl opacity-25"
        style={{
          animation: 'swayingPalm 4s ease-in-out infinite, floatingBeach 6s ease-in-out infinite'
        }}
      >
        🌲
      </div>

      <div 
        className="absolute top-20 left-10 text-4xl opacity-20"
        style={{
          animation: 'swayingPalm 3s ease-in-out infinite reverse, floatingBeach 5s ease-in-out infinite reverse'
        }}
      >
        🌿
      </div>

      {/* Additional cedar trees for depth */}
      <div 
        className="absolute top-32 right-1/4 text-3xl opacity-15"
        style={{
          animation: 'swayingPalm 5s ease-in-out infinite, floatingBeach 7s ease-in-out infinite'
        }}
      >
        🌲
      </div>

      <div 
        className="absolute top-16 left-1/3 text-2xl opacity-10"
        style={{
          animation: 'swayingPalm 4.5s ease-in-out infinite reverse, floatingBeach 6.5s ease-in-out infinite'
        }}
      >
        🌿
      </div>

      {/* Mediterranean Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
        {/* Lebanese flag colors as subtle accents */}
        <div 
          className="absolute bottom-4 left-10 text-2xl opacity-30"
          style={{ animation: 'floatingBeach 3s ease-in-out infinite' }}
        >
          🇱🇧
        </div>
        
        {/* Olive branches */}
        <div 
          className="absolute bottom-6 right-20 text-xl opacity-25"
          style={{ animation: 'floatingBeach 4s ease-in-out infinite reverse' }}
        >
          🫒
        </div>
        
        <div 
          className="absolute bottom-8 left-1/3 text-lg opacity-20"
          style={{ animation: 'floatingBeach 3.5s ease-in-out infinite' }}
        >
          🌿
        </div>
        
        {/* Mediterranean sea elements */}
        <div 
          className="absolute bottom-5 right-10 text-xl opacity-25"
          style={{ animation: 'floatingBeach 2.5s ease-in-out infinite' }}
        >
          🌊
        </div>
        
        <div 
          className="absolute bottom-7 left-1/4 text-lg opacity-20"
          style={{ animation: 'floatingBeach 4.5s ease-in-out infinite reverse' }}
        >
          🐚
        </div>

        {/* Lebanese architecture elements */}
        <div 
          className="absolute bottom-12 right-1/3 text-2xl opacity-20"
          style={{ animation: 'swayingPalm 6s ease-in-out infinite' }}
        >
          🏛️
        </div>
        
        <div 
          className="absolute bottom-10 left-1/5 text-xl opacity-15"
          style={{ animation: 'swayingPalm 5.5s ease-in-out infinite reverse' }}
        >
          🕌
        </div>

        {/* Gold accents */}
        <div 
          className="absolute bottom-3 right-1/2 text-lg opacity-25"
          style={{ animation: 'floatingBeach 2s ease-in-out infinite' }}
        >
          ✨
        </div>
        
        <div 
          className="absolute bottom-5 left-2/3 text-sm opacity-20"
          style={{ animation: 'floatingBeach 3.2s ease-in-out infinite reverse' }}
        >
          ⭐
        </div>
      </div>

      {/* Wave Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none">
        <div 
          className="w-full h-full bg-gradient-to-t from-blue-200/20 to-transparent"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z' fill='rgba(212,175,55,0.1)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '200px 40px',
            animation: 'waveMotion 4s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}
