import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

const GameModal = ({ isOpen, onClose, children, title }: GameModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-elegant-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-elegant-accent/30">
                  <h3 className="text-2xl font-bold text-elegant-dark-charcoal font-display">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 text-elegant-charcoal hover:text-elegant-accent hover:bg-elegant-accent/10 rounded-lg transition-all"
                    aria-label="Close modal"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 md:p-6">
                <div className="max-w-2xl mx-auto">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default GameModal

