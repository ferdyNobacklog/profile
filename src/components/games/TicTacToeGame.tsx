import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaGamepad, FaRedo } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const TicTacToeGame = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState<'pvp' | 'pvc'>('pvp')
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  // Simple AI: Try to win, then block, then take center, then take corner, else random
  const getComputerMove = (currentBoard: (string | null)[]): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard]
        testBoard[i] = 'O'
        if (calculateWinner(testBoard) === 'O') {
          return i
        }
      }
    }

    // Try to block
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard]
        testBoard[i] = 'X'
        if (calculateWinner(testBoard) === 'X') {
          return i
        }
      }
    }

    // Take center if available
    if (!currentBoard[4]) return 4

    // Take corners
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => !currentBoard[i])
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Take any available spot
    const available = currentBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[]
    return available[Math.floor(Math.random() * available.length)]
  }

  const makeComputerMove = (currentBoard: (string | null)[]) => {
    setIsComputerThinking(true)
    setTimeout(() => {
      const move = getComputerMove(currentBoard)
      const newBoard = [...currentBoard]
      newBoard[move] = 'O'
      setBoard(newBoard)
      setIsXNext(true)
      setWinner(calculateWinner(newBoard))
      setIsComputerThinking(false)
    }, 500)
  }

  const handleClick = (index: number) => {
    if (board[index] || winner || isComputerThinking) return
    if (gameMode === 'pvc' && !isXNext) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    const newWinner = calculateWinner(newBoard)
    setWinner(newWinner)
    
    if (newWinner) {
      setIsXNext(true)
      return
    }

    if (gameMode === 'pvc' && isXNext) {
      setIsXNext(false)
      makeComputerMove(newBoard)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setIsComputerThinking(false)
  }

  const changeMode = (mode: 'pvp' | 'pvc') => {
    setGameMode(mode)
    resetGame()
  }

  const isDraw = !winner && board.every(cell => cell !== null)

  const ticTacToeRef = useRef(null)
  const ticTacToeInView = useInView(ticTacToeRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ticTacToeRef}
      initial={{ opacity: 0, y: 50 }}
      animate={ticTacToeInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaGamepad className="text-elegant-accent text-2xl" />
          <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Tic Tac Toe</h3>
        </div>
        <button
          onClick={resetGame}
          className="p-2 text-elegant-accent hover:text-elegant-accent-dark transition-colors"
          aria-label="Reset game"
          title="Reset Game"
        >
          <FaRedo />
        </button>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-4">
        <p className="text-sm text-elegant-charcoal mb-2">Game Mode:</p>
        <div className="flex gap-2">
          <button
            onClick={() => changeMode('pvp')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              gameMode === 'pvp'
                ? `${theme.button.primary}`
                : `${theme.button.secondary}`
            }`}
          >
            Player vs Player
          </button>
          <button
            onClick={() => changeMode('pvc')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              gameMode === 'pvc'
                ? `${theme.button.primary}`
                : `${theme.button.secondary}`
            }`}
          >
            Player vs Computer
          </button>
        </div>
      </div>

      {isComputerThinking && (
        <div className="mb-4 text-center">
          <p className="text-sm text-elegant-accent animate-pulse">Computer is thinking...</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || isComputerThinking || (gameMode === 'pvc' && !isXNext)}
            className={`aspect-square text-2xl font-bold rounded-lg transition-all duration-200 ${
              cell === 'X'
                ? 'bg-elegant-accent text-white'
                : cell === 'O'
                ? 'bg-elegant-teal text-white'
                : 'bg-elegant-light-gray hover:bg-elegant-accent/10 text-elegant-charcoal'
            } ${winner || cell || isComputerThinking || (gameMode === 'pvc' && !isXNext) ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="text-center">
        {winner ? (
          <p className="text-elegant-accent font-semibold mb-2">
            🎉 {winner === 'X' ? (gameMode === 'pvc' ? 'You' : 'X') : (gameMode === 'pvc' ? 'Computer' : 'O')} wins!
          </p>
        ) : isDraw ? (
          <p className="text-elegant-charcoal font-semibold mb-2">It's a draw!</p>
        ) : (
          <p className="text-elegant-charcoal mb-2">
            {gameMode === 'pvc' 
              ? (isXNext ? 'Your turn (X)' : 'Computer\'s turn (O)')
              : `Next: ${isXNext ? 'X' : 'O'}`
            }
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default TicTacToeGame

