import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaHandRock, FaRedo } from 'react-icons/fa'
import { theme } from '../../theme/theme'

const RockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null)
  const [computerChoice, setComputerChoice] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  const choices = [
    { name: 'rock', icon: '🪨', label: 'Rock' },
    { name: 'paper', icon: '📄', label: 'Paper' },
    { name: 'scissors', icon: '✂️', label: 'Scissors' },
  ]

  const getComputerChoice = (): string => {
    const random = Math.floor(Math.random() * 3)
    return choices[random].name
  }

  const determineWinner = (player: string, computer: string): string => {
    if (player === computer) return 'draw'

    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'player'
    }

    return 'computer'
  }

  const handlePlayerChoice = (choice: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)
    setResult(null)

    setTimeout(() => {
      const compChoice = getComputerChoice()
      setComputerChoice(compChoice)
      const winner = determineWinner(choice, compChoice)
      
      if (winner === 'player') {
        setResult('win')
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
      } else if (winner === 'computer') {
        setResult('lose')
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
      } else {
        setResult('draw')
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }))
      }
      
      setIsAnimating(false)
    }, 500)
  }

  const resetScore = () => {
    setScore({ player: 0, computer: 0, draws: 0 })
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
  }

  const getChoiceIcon = (choice: string | null) => {
    if (!choice) return '?'
    const choiceObj = choices.find(c => c.name === choice)
    return choiceObj ? choiceObj.icon : '?'
  }

  const getChoiceLabel = (choice: string | null) => {
    if (!choice) return 'Waiting...'
    const choiceObj = choices.find(c => c.name === choice)
    return choiceObj ? choiceObj.label : ''
  }

  const rpsRef = useRef(null)
  const rpsInView = useInView(rpsRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={rpsRef}
      initial={{ opacity: 0, y: 50 }}
      animate={rpsInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`${theme.card} p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaHandRock className="text-elegant-accent text-2xl" />
          <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display">Rock Paper Scissors</h3>
        </div>
        <button
          onClick={resetScore}
          className="p-2 text-elegant-accent hover:text-elegant-accent-dark transition-colors"
          aria-label="Reset score"
          title="Reset Score"
        >
          <FaRedo />
        </button>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-3 bg-elegant-accent/10 rounded-lg border border-elegant-accent/30">
          <p className="text-xs text-elegant-charcoal mb-1">You</p>
          <p className="text-2xl font-bold text-elegant-accent">{score.player}</p>
        </div>
        <div className="text-center p-3 bg-elegant-light-gray rounded-lg">
          <p className="text-xs text-elegant-charcoal mb-1">Draws</p>
          <p className="text-2xl font-bold text-elegant-charcoal">{score.draws}</p>
        </div>
        <div className="text-center p-3 bg-elegant-teal/10 rounded-lg border border-elegant-teal/30">
          <p className="text-xs text-elegant-charcoal mb-1">Computer</p>
          <p className="text-2xl font-bold text-elegant-teal">{score.computer}</p>
        </div>
      </div>

      {/* Choices Display */}
      {(playerChoice || computerChoice) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-elegant-charcoal mb-2">You</p>
            <div className={`text-6xl p-4 rounded-lg transition-all duration-300 ${
              result === 'win' ? 'bg-elegant-accent/20 scale-110' : 'bg-elegant-light-gray'
            }`}>
              {getChoiceIcon(playerChoice)}
            </div>
            <p className="text-xs text-elegant-charcoal mt-2">{getChoiceLabel(playerChoice)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-elegant-charcoal mb-2">Computer</p>
            <div className={`text-6xl p-4 rounded-lg transition-all duration-300 ${
              result === 'lose' ? 'bg-elegant-teal/20 scale-110' : 'bg-elegant-light-gray'
            }`}>
              {isAnimating ? '...' : getChoiceIcon(computerChoice)}
            </div>
            <p className="text-xs text-elegant-charcoal mt-2">
              {isAnimating ? 'Choosing...' : getChoiceLabel(computerChoice)}
            </p>
          </div>
        </div>
      )}

      {/* Result Message */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-4 p-3 rounded-lg text-center font-semibold ${
            result === 'win'
              ? 'bg-elegant-accent/10 text-elegant-accent border border-elegant-accent/30'
              : result === 'lose'
              ? 'bg-elegant-teal/10 text-elegant-teal border border-elegant-teal/30'
              : 'bg-elegant-light-gray text-elegant-charcoal'
          }`}
        >
          {result === 'win' && '🎉 You Win!'}
          {result === 'lose' && '😔 Computer Wins!'}
          {result === 'draw' && '🤝 It\'s a Draw!'}
        </motion.div>
      )}

      {/* Player Choice Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => handlePlayerChoice(choice.name)}
            disabled={isAnimating}
            className={`py-4 px-2 rounded-lg font-medium transition-all duration-200 border-2 ${
              isAnimating
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:border-elegant-accent'
            } ${
              playerChoice === choice.name
                ? 'bg-elegant-accent/10 border-elegant-accent'
                : 'bg-elegant-light-gray border-elegant-accent/30'
            }`}
          >
            <div className="text-3xl mb-1">{choice.icon}</div>
            <div className="text-xs text-elegant-dark-charcoal">{choice.label}</div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default RockPaperScissorsGame

