'use client'

import { motion, type Variants } from 'framer-motion'
import { ChessWrapData } from '@/lib/types'
import { Zap, TrendingUp, AlertCircle, Target } from 'lucide-react'

interface GameQualitySlideProps {
  data: ChessWrapData
}

export function GameQualitySlide({ data }: GameQualitySlideProps) {
  const accuracy = data.playstyle.averageAccuracy || 0
  const blunders = data.playstyle.totalBlunders || 0
  const mistakes = data.playstyle.totalMistakes || 0
  const inaccuracies = data.playstyle.totalInaccuracies || 0
  const acpl = data.playstyle.averageACPL || 0
  const gamesAnalyzed = data.playstyle.gamesAnalyzed || 0
  const realAccuracyGames = data.playstyle.realAccuracyGames || 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const AccuracyGauge = ({ value }: { value: number }) => {
    const rotation = (value / 100) * 180 - 90
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background arc */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="4"
            strokeDasharray="157 314"
            strokeDashoffset="0"
            transform="rotate(-90 60 60)"
          />
          {/* Progress arc */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#accuracyGradient)"
            strokeWidth="4"
            strokeDasharray={`${(value / 100) * 157} 314`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0099ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{value.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col justify-center">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Game Quality Analysis</h2>
        <p className="text-gray-400">Your precision and decision-making breakdown</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-6 flex-1"
      >
        {/* Accuracy Gauge */}
        <motion.div variants={itemVariants} className="col-span-2 flex justify-center bg-slate-700/30 rounded-xl p-6 backdrop-blur-sm border border-slate-600/50">
          <AccuracyGauge value={accuracy} />
        </motion.div>

        {/* Error Metrics */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-white">Blunders</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">{blunders}</p>
          <p className="text-xs text-gray-400 mt-1">Critical mistakes</p>
        </motion.div>

        {/* Mistakes */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Mistakes</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{mistakes}</p>
          <p className="text-xs text-gray-400 mt-1">Suboptimal moves</p>
        </motion.div>

        {/* Inaccuracies */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Inaccuracies</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{inaccuracies}</p>
          <p className="text-xs text-gray-400 mt-1">Minor imperfections</p>
        </motion.div>

        {/* ACPL */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Avg ACPL</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{acpl}</p>
          <p className="text-xs text-gray-400 mt-1">Centipawn loss</p>
        </motion.div>
      </motion.div>

      {/* Footer insight */}
      <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-400 space-y-1">
        <p>Your accuracy of <span className="text-cyan-400 font-semibold">{accuracy.toFixed(1)}%</span> indicates <span className="text-cyan-400 font-semibold">strong positional understanding</span></p>
        {gamesAnalyzed > 0 && (
          <p className="text-xs text-gray-500">
            Based on {gamesAnalyzed} representative game{gamesAnalyzed === 1 ? "" : "s"} this year
            {realAccuracyGames > 0 &&
              ` — ${realAccuracyGames} from Chess.com's own Game Review, the rest from our Stockfish pass`}
          </p>
        )}
      </motion.div>
    </div>
  )
}
