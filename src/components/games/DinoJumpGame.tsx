import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { FaGamepad, FaRedo, FaPlayCircle } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const DinoJumpGame = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [dinoY, setDinoY] = useState(0)
  const [obstacles, setObstacles] = useState<Array<{ x: number; type: 'cactus' | 'bird' }>>([])
  const [isJumping, setIsJumping] = useState(false)
  const gameRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const stateRef = useRef({ dinoY: 0, velocity: 0, obstacles: [] as Array<{ x: number; type: 'cactus' | 'bird' }> })
  const gameWidthRef = useRef<number>(400) // Default width, will be updated

  const GRAVITY = 0.8
  const JUMP_STRENGTH = 15 // Positive because dinoY increases upward
  const GROUND_HEIGHT = 48 // Height of the ground (h-12 = 48px)
  const MAX_JUMP_HEIGHT = 150 // Maximum jump height
  const OBSTACLE_SPEED = 4
  const DINO_SIZE = 40

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setDinoY(0)
    setObstacles([])
    setIsJumping(false)
    stateRef.current = { dinoY: 0, velocity: 0, obstacles: [] }
    // Update game width
    if (gameRef.current) {
      gameWidthRef.current = gameRef.current.offsetWidth
    }
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
    // Allow jump if dino is on or near the ground (within 5px)
    if (stateRef.current.dinoY <= 5 && stateRef.current.velocity >= 0) {
      stateRef.current.velocity = JUMP_STRENGTH
      setIsJumping(true)
    }
  }, [gameStarted, gameOver, startGame])

  const gameLoop = () => {
    if (!gameStarted || gameOver) return

    const currentState = stateRef.current
    let newY = currentState.dinoY
    let newVel = currentState.velocity

    // Update velocity (subtract gravity - gravity pulls down, so velocity decreases)
    newVel = newVel - GRAVITY
    
    // Update position (dinoY is height above ground, 0 = on ground)
    // Positive velocity means jumping up (dinoY increases), negative means falling (dinoY decreases)
    newY = currentState.dinoY + newVel
    
    // Keep dino on ground if it would go below
    if (newY <= 0) {
      newY = 0
      if (newVel < 0) {
        newVel = 0
        setIsJumping(false)
      }
    }
    
    // Limit max jump height
    if (newY > MAX_JUMP_HEIGHT) {
      newY = MAX_JUMP_HEIGHT
      newVel = 0
    }

    // Update obstacles
    let newObstacles = currentState.obstacles.map((obs) => ({
      ...obs,
      x: obs.x - OBSTACLE_SPEED,
    })).filter((obs) => obs.x > -50)

    // Add new obstacle - spawn at the right edge of the game area
    if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < gameWidthRef.current * 0.5) {
      const type = Math.random() > 0.7 ? 'bird' : 'cactus'
      newObstacles.push({
        x: gameWidthRef.current - 20, // Spawn at right edge minus obstacle width
        type,
      })
    }

    // Check score
    newObstacles.forEach((obs) => {
      if (obs.x + 30 < 50 && obs.x + 30 > 45) {
        setScore((s) => s + 1)
      }
    })

    // Check collision
    const dinoX = 50
    const dinoBottom = GROUND_HEIGHT + newY // Dino bottom position from container bottom
    const collision = newObstacles.some((obstacle) => {
      const obstacleX = obstacle.x
      const obstacleWidth = obstacle.type === 'cactus' ? 20 : 30
      const obstacleHeight = obstacle.type === 'cactus' ? 40 : 25
      const obstacleBottom = obstacle.type === 'cactus' ? GROUND_HEIGHT : GROUND_HEIGHT + 60 // Bird flies above ground

      return (
        dinoX + DINO_SIZE > obstacleX &&
        dinoX < obstacleX + obstacleWidth &&
        dinoBottom < obstacleBottom + obstacleHeight &&
        dinoBottom + DINO_SIZE > obstacleBottom
      )
    })

    if (collision) {
      setGameOver(true)
      setGameStarted(false)
      return
    }

    // Update state
    stateRef.current = { dinoY: newY, velocity: newVel, obstacles: newObstacles }
    setDinoY(newY)
    setObstacles(newObstacles)

    if (gameStarted && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
  }

  // Update game width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (gameRef.current) {
        gameWidthRef.current = gameRef.current.offsetWidth
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const loop = () => {
      gameLoop()
    }
    animationFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [gameStarted, gameOver])

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

  const dinoRef = useRef(null)
  const dinoInView = useInView(dinoRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={dinoRef}
      initial={{ opacity: 0, y: 50 }}
      animate={dinoInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaGamepad className="text-elegant-accent text-2xl" />
          <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Dino Jump</h3>
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
        className="relative w-full h-[250px] bg-gradient-to-b from-sky-100 to-amber-50 rounded-lg overflow-hidden border-2 border-elegant-accent/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-elegant-accent"
      >
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-b from-amber-200 to-amber-400 border-t-2 border-amber-600">
          <div className="absolute top-0 w-full h-1 bg-amber-600/50" />
        </div>

        {/* Dino */}
        <div
          className="absolute w-10 h-10 bg-green-600 rounded-lg border-2 border-green-800 transition-transform duration-100"
          style={{
            left: '50px',
            bottom: `${GROUND_HEIGHT + dinoY}px`,
            transform: `rotate(${isJumping ? -10 : 0}deg)`,
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
          <div className="absolute bottom-0 left-2 right-2 h-2 bg-green-700 rounded-b" />
        </div>

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div key={index}>
            {obstacle.type === 'cactus' ? (
              <div
                className="absolute bg-green-700 border-2 border-green-900"
                style={{
                  left: `${obstacle.x}px`,
                  width: '20px',
                  bottom: `${GROUND_HEIGHT}px`,
                  height: '40px',
                }}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-800 rounded-full" />
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full" />
              </div>
            ) : (
              <div
                className="absolute bg-red-500 border-2 border-red-700 rounded-full"
                style={{
                  left: `${obstacle.x}px`,
                  width: '30px',
                  height: '25px',
                  bottom: `${GROUND_HEIGHT + 60}px`,
                }}
              >
                <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full" />
              </div>
            )}
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
                  <p className="text-white text-sm mb-4">Click or press space/↑ to jump</p>
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
        Click or press space/↑ to jump
      </p>
    </motion.div>
  )
}

export default DinoJumpGame

