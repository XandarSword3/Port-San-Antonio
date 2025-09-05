'use client'

import { useEffect, useState } from 'react'

export default function BeachAmbience() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Only enable on user interaction to avoid autoplay issues
    const handleUserInteraction = () => {
      if (!isEnabled && !audioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          setAudioContext(ctx)
          setIsEnabled(true)
        } catch (error) {
          console.log('Audio not supported')
        }
      }
    }

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [isEnabled, audioContext])

  useEffect(() => {
    if (!audioContext || !isEnabled) return

    // Create ocean wave sound using Web Audio API
    const createOceanWave = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      // Configure filter for ocean-like sound
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, audioContext.currentTime)
      filter.Q.setValueAtTime(1, audioContext.currentTime)

      // Configure oscillator for wave sound
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(0.1, audioContext.currentTime)

      // Configure gain for volume control
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3)

      // Connect nodes
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Start and stop
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 3)
    }

    // Play ocean wave sound periodically
    const waveInterval = setInterval(createOceanWave, 8000)

    return () => {
      clearInterval(waveInterval)
    }
  }, [audioContext, isEnabled])

  // Visual beach ambience indicators
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
          isEnabled 
            ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
        }`}
        title={isEnabled ? 'Disable beach ambience' : 'Enable beach ambience'}
      >
        {isEnabled ? '🌊' : '🔇'}
      </button>
    </div>
  )
}
