'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const SandParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([])

  useEffect(() => {
    const particleCount = 8
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y + 20}vh`, `${particle.y}vh`],
            x: [`${particle.x}vw`, `${particle.x + 5}vw`, `${particle.x - 3}vw`, `${particle.x}vw`],
            opacity: [0, 0.3, 0.1, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-yellow-200/40"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: '0 0 4px rgba(251, 191, 36, 0.3)'
          }}
        />
      ))}
    </div>
  )
}

export default SandParticles
