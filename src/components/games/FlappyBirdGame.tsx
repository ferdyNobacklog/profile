import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { FaGamepad, FaRedo, FaPlayCircle } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const FlappyBirdGame = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [birdY, setBirdY] = useState(150)
  const [pipes, setPipes] = useState<Array<{ x: number; top: number; bottom: number }>>([])
  const [velocity, setVelocity] = useState(0)
  const gameRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  const GRAVITY = 0.5
  const JUMP_STRENGTH = -8
  const PIPE_SPEED = 3
  const PIPE_GAP = 150
  const PIPE_WIDTH = 50

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setBirdY(150)
    setVelocity(0)
    setPipes([])
    // Auto-focus the game area so spacebar works immediately
    setTimeout(() => {
      gameRef.current?.focus()
    }, 100)
  }, [])

  const jump = useCallback(() => {
    if (!gameStarted || gameOver) {
      startGame()
      return
    }
    setVelocity(JUMP_STRENGTH)
  }, [gameStarted, gameOver, startGame])

  const checkCollision = (birdY: number, pipes: Array<{ x: number; top: number; bottom: number }>) => {
    const birdSize = 30
    const birdX = 50

    // Ground collision
    if (birdY + birdSize > 300 || birdY < 0) {
      return true
    }

    // Pipe collision
    for (const pipe of pipes) {
      if (
        birdX + birdSize > pipe.x &&
        birdX < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.top || birdY + birdSize > pipe.bottom)
      ) {
        return true
      }
    }

    return false
  }

  const gameLoop = () => {
    if (!gameStarted || gameOver) return

    setBirdY((prev) => {
      const newY = Math.max(0, Math.min(300 - 30, prev + velocity))
      return newY
    })

    setVelocity((prev) => prev + GRAVITY)

    setPipes((prev) => {
      let newPipes = prev.map((pipe) => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED,
      })).filter((pipe) => pipe.x + PIPE_WIDTH > 0)

      // Add new pipe
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 200) {
        const topHeight = Math.random() * (300 - PIPE_GAP - 50) + 20
        newPipes.push({
          x: 400,
          top: topHeight,
          bottom: topHeight + PIPE_GAP,
        })
      }

      // Check score
      newPipes.forEach((pipe) => {
        if (pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH > 45) {
          setScore((s) => s + 1)
        }
      })

      return newPipes
    })

    // Check collision
    if (checkCollision(birdY, pipes)) {
      setGameOver(true)
      setGameStarted(false)
      return
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameStarted, gameOver, birdY, pipes, velocity])

  // Global keyboard listener - allows spacebar to work immediately without clicking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStarted && !gameOver && (e.key === ' ' || e.key === 'ArrowUp')) {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStarted, gameOver, jump])

  const flappyRef = useRef(null)
  const flappyInView = useInView(flappyRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={flappyRef}
      initial={{ opacity: 0, y: 50 }}
      animate={flappyInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaGamepad className="text-elegant-accent text-2xl" />
          <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Flappy Bird</h3>
        </div>
        <button
          onClick={startGame}
          className="p-2 text-elegant-accent hover:text-elegant-accent-dark transition-colors"
          aria-label="Start/Reset game"
          title="Start/Reset Game"
        >
          <FaRedo />
        </button>
      </div>

      <div
        ref={gameRef}
        onClick={jump}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault()
            jump()
          }
        }}
        tabIndex={0}
        className="relative w-full h-[300px] bg-gradient-to-b from-sky-200 to-sky-400 rounded-lg overflow-hidden border-2 border-elegant-accent/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-elegant-accent"
      >
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-green-400 to-green-600" />

        {/* Bird */}
        <div
          className="absolute w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 transition-transform duration-100"
          style={{
            left: '50px',
            top: `${birdY}px`,
            transform: `rotate(${velocity > 0 ? 20 : -20}deg)`,
          }}
        >
          <div className="absolute top-1 left-2 w-2 h-2 bg-black rounded-full" />
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top Pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: `${pipe.x}px`,
                width: `${PIPE_WIDTH}px`,
                top: '0',
                height: `${pipe.top}px`,
              }}
            />
            {/* Bottom Pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: `${pipe.x}px`,
                width: `${PIPE_WIDTH}px`,
                top: `${pipe.bottom}px`,
                height: `${300 - pipe.bottom}px`,
              }}
            />
          </div>
        ))}

        {/* Game Over / Start Screen */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              {gameOver ? (
                <>
                  <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
                  <p className="text-white mb-4">Score: {score}</p>
                  <button
                    onClick={startGame}
                    className={`px-6 py-2 rounded-lg font-medium ${theme.button.primary}`}
                  >
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <p className="text-white text-xl font-bold mb-2">Click to Start</p>
                  <p className="text-white text-sm mb-4">Click or press space to fly</p>
                  <button
                    onClick={startGame}
                    className={`px-6 py-2 rounded-lg font-medium ${theme.button.primary} flex items-center gap-2 mx-auto`}
                  >
                    <FaPlayCircle /> Start
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Score */}
        {gameStarted && !gameOver && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <p className="text-white text-2xl font-bold drop-shadow-lg">Score: {score}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-elegant-charcoal text-center mt-2">
        Click or press space to fly
      </p>
    </motion.div>
  )
}

export default FlappyBirdGame

