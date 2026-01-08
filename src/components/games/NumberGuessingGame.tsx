import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaDice, FaRedo } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const NumberGuessingGame = () => {
  const [number, setNumber] = useState<number | null>(null)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const startGame = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1
    setNumber(randomNumber)
    setGuess('')
    setMessage('Guess a number between 1 and 100!')
    setAttempts(0)
    setGameStarted(true)
    setShowSuccess(false)
  }

  const resetGame = () => {
    setNumber(null)
    setGuess('')
    setMessage('')
    setAttempts(0)
    setGameStarted(false)
    setShowSuccess(false)
  }

  const handleGuess = () => {
    const guessNum = parseInt(guess)
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage('Please enter a number between 1 and 100!')
      return
    }

    setAttempts(attempts + 1)

    if (guessNum === number) {
      setMessage(`🎉 Correct! You guessed it in ${attempts + 1} attempts!`)
      setShowSuccess(true)
      setGameStarted(false)
    } else if (guessNum < number!) {
      setMessage('Too low! Try again.')
    } else {
      setMessage('Too high! Try again.')
    }
    setGuess('')
  }

  const gameRef = useRef(null)
  const gameInView = useInView(gameRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={gameRef}
      initial={{ opacity: 0, y: 50 }}
      animate={gameInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <FaDice className="text-elegant-accent text-2xl" />
        <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Number Guessing</h3>
      </div>
      <p className="text-elegant-charcoal text-sm mb-4">Guess the number between 1-100</p>
      
      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="mb-4 p-4 bg-elegant-accent/10 border-2 border-elegant-accent rounded-lg"
        >
          <p className="text-elegant-accent font-bold text-center text-lg">
            🎉 Congratulations! 🎉
          </p>
          <p className="text-elegant-dark-charcoal text-center text-sm mt-1">
            You guessed it in {attempts} {attempts === 1 ? 'attempt' : 'attempts'}!
          </p>
        </motion.div>
      )}

      {!gameStarted ? (
        <button
          onClick={startGame}
          className={`w-full py-2 rounded-lg font-medium ${theme.button.primary} mb-4`}
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Enter your guess"
              className="w-full px-4 py-2 border border-elegant-accent/30 rounded-lg focus:outline-none focus:border-elegant-accent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleGuess}
                className={`flex-1 py-2 rounded-lg font-medium ${theme.button.primary}`}
              >
                Guess
              </button>
              <button
                onClick={resetGame}
                className={`px-4 py-2 rounded-lg font-medium ${theme.button.secondary} flex items-center justify-center`}
                title="Reset Game"
              >
                <FaRedo />
              </button>
            </div>
          </div>
          {message && !showSuccess && (
            <p className={`text-sm text-center mb-2 ${message.includes('🎉') ? 'text-elegant-accent font-semibold' : 'text-elegant-charcoal'}`}>
              {message}
            </p>
          )}
          <p className="text-xs text-elegant-charcoal text-center">Attempts: {attempts}</p>
        </>
      )}
    </motion.div>
  )
}

export default NumberGuessingGame

