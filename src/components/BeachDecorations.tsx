'use client'

import { useEffect, useState } from 'react'

interface BubbleProps {
  id: number
  delay: number
  size: number
  left: number
}

interface SeagullProps {
  id: number
  delay: number
  top: number
}

export default function BeachDecorations() {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([])
  const [seagulls, setSeagulls] = useState<SeagullProps[]>([])

  useEffect(() => {
    // Create floating bubbles
    const bubbleInterval = setInterval(() => {
      if (bubbles.length < 8) {
        const newBubble: BubbleProps = {
          id: Date.now() + Math.random(),
          delay: Math.random() * 2,
          size: Math.random() * 20 + 10,
          left: Math.random() * 100
        }
        setBubbles(prev => [...prev, newBubble])
      }
    }, 2000)

    // Create seagulls
    const seagullInterval = setInterval(() => {
      if (seagulls.length < 2) {
        const newSeagull: SeagullProps = {
          id: Date.now() + Math.random(),
          delay: Math.random() * 3,
          top: Math.random() * 30 + 10
        }
        setSeagulls(prev => [...prev, newSeagull])
      }
    }, 8000)

    // Clean up bubbles after animation
    const bubbleCleanup = setInterval(() => {
      setBubbles(prev => prev.filter(bubble => 
        Date.now() - bubble.id < 10000
      ))
    }, 1000)

    // Clean up seagulls after animation
    const seagullCleanup = setInterval(() => {
      setSeagulls(prev => prev.filter(seagull => 
        Date.now() - seagull.id < 15000
      ))
    }, 2000)

    return () => {
      clearInterval(bubbleInterval)
      clearInterval(seagullInterval)
      clearInterval(bubbleCleanup)
      clearInterval(seagullCleanup)
    }
  }, [bubbles.length, seagulls.length])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-20px',
            animation: `floatingBubbles 8s ease-in-out ${bubble.delay}s infinite`,
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
          }}
        />
      ))}

      {/* Seagulls */}
      {seagulls.map((seagull) => (
        <div
          key={seagull.id}
          className="absolute text-white/30 text-2xl"
          style={{
            top: `${seagull.top}%`,
            left: '-50px',
            animation: `seagullFly 12s linear ${seagull.delay}s infinite`,
            fontSize: '24px'
          }}
        >
          🕊️
        </div>
      ))}

      {/* Palm Trees with more dynamic movement */}
      <div 
        className="absolute top-10 right-10 text-6xl opacity-25"
        style={{
          animation: 'swayingPalm 4s ease-in-out infinite, floatingBeach 6s ease-in-out infinite'
        }}
      >
        🌴
      </div>

      <div 
        className="absolute top-20 left-10 text-4xl opacity-20"
        style={{
          animation: 'swayingPalm 3s ease-in-out infinite reverse, floatingBeach 5s ease-in-out infinite reverse'
        }}
      >
        🌿
      </div>

      {/* Additional palm trees for depth */}
      <div 
        className="absolute top-32 right-1/4 text-3xl opacity-15"
        style={{
          animation: 'swayingPalm 5s ease-in-out infinite, floatingBeach 7s ease-in-out infinite'
        }}
      >
        🌴
      </div>

      <div 
        className="absolute top-16 left-1/3 text-2xl opacity-10"
        style={{
          animation: 'swayingPalm 4.5s ease-in-out infinite reverse, floatingBeach 6.5s ease-in-out infinite'
        }}
      >
        🌿
      </div>

      {/* Beach Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
        {/* Seashells with floating animation */}
        <div 
          className="absolute bottom-4 left-10 text-2xl opacity-30"
          style={{ animation: 'floatingBeach 3s ease-in-out infinite' }}
        >
          🐚
        </div>
        <div 
          className="absolute bottom-6 right-20 text-xl opacity-25"
          style={{ animation: 'floatingBeach 4s ease-in-out infinite reverse' }}
        >
          🐚
        </div>
        <div 
          className="absolute bottom-8 left-1/3 text-lg opacity-20"
          style={{ animation: 'floatingBeach 3.5s ease-in-out infinite' }}
        >
          🐚
        </div>
        
        {/* Starfish */}
        <div 
          className="absolute bottom-5 right-10 text-xl opacity-25"
          style={{ animation: 'floatingBeach 2.5s ease-in-out infinite' }}
        >
          ⭐
        </div>
        <div 
          className="absolute bottom-7 left-1/4 text-lg opacity-20"
          style={{ animation: 'floatingBeach 4.5s ease-in-out infinite reverse' }}
        >
          ⭐
        </div>

        {/* Beach umbrellas */}
        <div 
          className="absolute bottom-12 right-1/3 text-2xl opacity-20"
          style={{ animation: 'swayingPalm 6s ease-in-out infinite' }}
        >
          🏖️
        </div>
        <div 
          className="absolute bottom-10 left-1/5 text-xl opacity-15"
          style={{ animation: 'swayingPalm 5.5s ease-in-out infinite reverse' }}
        >
          🏖️
        </div>

        {/* Flip-flops */}
        <div 
          className="absolute bottom-3 right-1/2 text-lg opacity-25"
          style={{ animation: 'floatingBeach 2s ease-in-out infinite' }}
        >
          🩴
        </div>
        <div 
          className="absolute bottom-5 left-2/3 text-sm opacity-20"
          style={{ animation: 'floatingBeach 3.2s ease-in-out infinite reverse' }}
        >
          🩴
        </div>
      </div>

      {/* Wave Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none">
        <div 
          className="w-full h-full bg-gradient-to-t from-blue-200/20 to-transparent"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100px 20px',
            animation: 'waveMotion 3s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}
