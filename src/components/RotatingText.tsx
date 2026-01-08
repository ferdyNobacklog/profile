import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Role {
  text: string
  color: string
  glowColor: string
}

const roles: Role[] = [
  {
    text: 'FULLSTACK DEVELOPER',
    color: 'text-elegant-accent',
    glowColor: '',
  },
  {
    text: 'FRONTEND DEVELOPER',
    color: 'text-elegant-teal',
    glowColor: '',
  },
  {
    text: 'BACKEND DEVELOPER',
    color: 'text-elegant-accent-dark',
    glowColor: '',
  },
  {
    text: 'SOFTWARE DEVELOPER',
    color: 'text-elegant-teal',
    glowColor: '',
  },
]

interface RotatingTextProps {
  showPrefix?: boolean
  prefix?: string
}

const RotatingText = ({ showPrefix = true, prefix = "I'm a " }: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const currentRole = roles[currentIndex]

  return (
    <div className="inline-block">
      {showPrefix && <span className="text-elegant-charcoal">{prefix}</span>}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${currentRole.color} ${currentRole.glowColor} font-semibold`}
        >
          {currentRole.text}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default RotatingText

