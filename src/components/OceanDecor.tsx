'use client'

import { useEffect, useRef } from 'react'

export default function OceanDecor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = 200)

    const bubbles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: height + Math.random() * 80,
      r: 2 + Math.random() * 3,
      s: 0.3 + Math.random() * 0.7
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const b of bubbles) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.fill()
        b.y -= b.s
        if (b.y < -10) {
          b.y = height + 10
          b.x = Math.random() * width
        }
      }
      raf = requestAnimationFrame(draw)
    }

    draw()
    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = 200
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none w-full select-none">
      <canvas ref={canvasRef} className="w-full h-[200px] block opacity-60 mix-blend-screen" />
    </div>
  )
}


