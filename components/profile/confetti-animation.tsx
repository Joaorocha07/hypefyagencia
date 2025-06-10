'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Confetti {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

export default function ConfettiAnimation() {
  const [confetti, setConfetti] = useState<Confetti[]>([])

  const colors = ['#fbc94c', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']

  useEffect(() => {
    const generateConfetti = () => {
      const newConfetti: Confetti[] = []
      
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
        })
      }
      
      setConfetti(newConfetti)
    }

    generateConfetti()

    // Clear confetti after animation
    const timer = setTimeout(() => {
      setConfetti([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
          }}
          initial={{
            y: -20,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: 'easeOut',
            delay: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  )
}