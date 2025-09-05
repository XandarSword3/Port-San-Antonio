'use client'

import { useEffect, useRef } from 'react'

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.2}px)`
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = `${0.8 + Math.min(scrolled * 0.001, 0.2)}`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-h-[calc(100%+100px)] min-w-full object-cover transition-transform duration-200 will-change-transform"
        style={{ filter: 'brightness(0.6) contrast(1.1) saturate(1.2)' }}
      >
        <source src="/videos/resort-waves.mp4" type="video/mp4" />
      </video>

      {/* Mediterranean-themed Gradient Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-yellow-900/30 transition-opacity duration-200"
      />

      {/* Mediterranean Wave Overlay Pattern */}
      <div className="absolute inset-0 opacity-20">
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

      {/* Floating Mediterranean Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle bubbles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-200/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Cedar tree silhouettes */}
        <div className="absolute bottom-0 right-10 text-6xl opacity-10" style={{ animation: 'swayingPalm 6s ease-in-out infinite' }}>🌲</div>
        <div className="absolute bottom-0 left-10 text-4xl opacity-8" style={{ animation: 'swayingPalm 8s ease-in-out infinite reverse' }}>🌿</div>
      </div>
    </div>
  )
}
