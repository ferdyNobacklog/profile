import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaTrophy, FaRedo } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const MemoryGame = () => {
  const [cards, setCards] = useState<number[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const initializeGame = () => {
    const numbers = [1, 1, 2, 2, 3, 3, 4, 4]
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameStarted(true)
  }

  const resetGame = () => {
    setCards([])
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameStarted(false)
  }

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  const isGameWon = matched.length === cards.length && cards.length > 0

  const memoryRef = useRef(null)
  const memoryInView = useInView(memoryRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={memoryRef}
      initial={{ opacity: 0, y: 50 }}
      animate={memoryInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-elegant-accent text-2xl" />
          <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Memory Game</h3>
        </div>
        {gameStarted && (
          <button
            onClick={resetGame}
            className="p-2 text-elegant-accent hover:text-elegant-accent-dark transition-colors"
            aria-label="Reset game"
            title="Reset Game"
          >
            <FaRedo />
          </button>
        )}
      </div>
      <p className="text-elegant-charcoal text-sm mb-4">Match the pairs!</p>

      {!gameStarted ? (
        <button
          onClick={initializeGame}
          className={`w-full py-2 rounded-lg font-medium ${theme.button.primary} mb-4`}
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index)
              return (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  disabled={isFlipped || flipped.length === 2}
                  className={`aspect-square rounded-lg font-bold text-lg transition-all duration-200 ${
                    isFlipped
                      ? 'bg-elegant-accent text-white'
                      : 'bg-elegant-light-gray hover:bg-elegant-accent/20 text-elegant-charcoal hover:scale-105'
                  } ${flipped.length === 2 && !isFlipped ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFlipped ? card : '?'}
                </button>
              )
            })}
          </div>
          <div className="text-center">
            <p className="text-sm text-elegant-charcoal mb-2">Moves: {moves}</p>
            {isGameWon && (
              <p className="text-elegant-accent font-semibold">🎉 You won!</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

export default MemoryGame

