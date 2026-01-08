import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  FaDice, 
  FaGamepad, 
  FaTrophy, 
  FaHandRock
} from 'react-icons/fa'
import { theme } from '../theme/theme'
import GameModal from './GameModal'
import NumberGuessingGame from './games/NumberGuessingGame'
import TicTacToeGame from './games/TicTacToeGame'
import MemoryGame from './games/MemoryGame'
import RockPaperScissorsGame from './games/RockPaperScissorsGame'
import FlappyBirdGame from './games/FlappyBirdGame'
import DinoJumpGame from './games/DinoJumpGame'

interface GameWidget {
  id: string
  name: string
  icon: React.ReactNode
  component: React.ReactNode
  description: string
}

const Games = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const games: GameWidget[] = [
    {
      id: 'number-guessing',
      name: 'Number Guessing',
      icon: <FaDice className="text-4xl" />,
      component: <NumberGuessingGame />,
      description: 'Guess the number between 1-100'
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      icon: <FaGamepad className="text-4xl" />,
      component: <TicTacToeGame />,
      description: 'Classic X and O game'
    },
    {
      id: 'memory',
      name: 'Memory Game',
      icon: <FaTrophy className="text-4xl" />,
      component: <MemoryGame />,
      description: 'Match the pairs'
    },
    {
      id: 'rock-paper-scissors',
      name: 'Rock Paper Scissors',
      icon: <FaHandRock className="text-4xl" />,
      component: <RockPaperScissorsGame />,
      description: 'Play against the computer'
    },
    {
      id: 'flappy-bird',
      name: 'Flappy Bird',
      icon: <FaGamepad className="text-4xl" />,
      component: <FlappyBirdGame />,
      description: 'Fly through the pipes'
    },
    {
      id: 'dino-jump',
      name: 'Dino Jump',
      icon: <FaGamepad className="text-4xl" />,
      component: <DinoJumpGame />,
      description: 'Jump over obstacles'
    }
  ]

  const selectedGameData = games.find(game => game.id === selectedGame)

  return (
    <section ref={ref} className="min-h-screen section-padding bg-elegant-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-elegant-dark-charcoal font-display">
            Game <span className="text-elegant-accent">Corner</span>
          </h2>
          <div className="w-24 h-1 bg-elegant-accent mx-auto mb-6" />
          <p className="text-elegant-charcoal text-base md:text-lg max-w-2xl mx-auto">
            Take a break and enjoy some fun games!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedGame(game.id)}
              className={`${theme.card} p-6 text-center hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-elegant-accent group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-elegant-dark-charcoal font-display mb-1">
                    {game.name}
                  </h3>
                  <p className="text-sm text-elegant-charcoal">
                    {game.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      <GameModal
        isOpen={selectedGame !== null}
        onClose={() => setSelectedGame(null)}
        title={selectedGameData?.name}
      >
        {selectedGameData?.component}
      </GameModal>
    </section>
  )
}

export default Games
