'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp, TrendingDown, Flame, Clock, Target } from 'lucide-react'

interface PerformanceHighlightsSlideProps {
  longestWinStreak: number
  longestLosingStreak: number
  fastestWin: { moves: number } | null
  longestGame: { moves: number } | null
  shortestGame: { moves: number } | null
  mostMovesGame: { moves: number } | null
  mostTimeGame: { duration: number } | null
}

export function PerformanceHighlightsSlide(props: PerformanceHighlightsSlideProps) {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const streakCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
          Performance Highlights
        </h1>
        <p className="text-lg text-slate-400">Your greatest moments on the board</p>
      </motion.div>

      {/* Streaks Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-6 mb-8 w-full max-w-2xl"
      >
        {/* Win Streak */}
        <motion.div
          variants={streakCardVariants}
          className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">Longest Win Streak</h3>
          </div>
          <p className="text-4xl font-black text-emerald-400">{props.longestWinStreak}</p>
          <p className="text-xs text-emerald-300/70 mt-2">consecutive victories</p>
        </motion.div>

        {/* Loss Streak */}
        <motion.div
          variants={streakCardVariants}
          className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-400" />
            <h3 className="text-sm font-semibold text-red-300">Longest Losing Streak</h3>
          </div>
          <p className="text-4xl font-black text-red-400">{props.longestLosingStreak}</p>
          <p className="text-xs text-red-300/70 mt-2">tough matches</p>
        </motion.div>
      </motion.div>

      {/* Game Records Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {/* Fastest Win */}
        {props.fastestWin && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-5 backdrop-blur-sm text-center"
          >
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-yellow-300 mb-1">Fastest Win</p>
            <p className="text-2xl font-black text-yellow-400">{props.fastestWin.moves}</p>
            <p className="text-xs text-yellow-300/70">moves</p>
          </motion.div>
        )}

        {/* Longest Game */}
        {props.longestGame && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm text-center"
          >
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-purple-300 mb-1">Longest Game</p>
            <p className="text-2xl font-black text-purple-400">{props.longestGame.moves}</p>
            <p className="text-xs text-purple-300/70">moves</p>
          </motion.div>
        )}

        {/* Shortest Game */}
        {props.shortestGame && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border border-pink-500/30 rounded-xl p-5 backdrop-blur-sm text-center"
          >
            <Flame className="w-5 h-5 text-pink-400 mx-auto mb-2" />
            <p className="text-xs text-pink-300 mb-1">Shortest Game</p>
            <p className="text-2xl font-black text-pink-400">{props.shortestGame.moves}</p>
            <p className="text-xs text-pink-300/70">moves</p>
          </motion.div>
        )}
      </motion.div>

      {/* Additional Stats */}
      {(props.mostMovesGame || props.mostTimeGame) && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-4 mt-6 w-full max-w-2xl"
        >
          {props.mostMovesGame && (
            <motion.div
              variants={itemVariants}
              className="flex-1 bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-500/30 rounded-xl p-5 backdrop-blur-sm text-center"
            >
              <Target className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p className="text-xs text-indigo-300 mb-1">Most Moves</p>
              <p className="text-2xl font-black text-indigo-400">{props.mostMovesGame.moves}</p>
            </motion.div>
          )}

          {props.mostTimeGame && (
            <motion.div
              variants={itemVariants}
              className="flex-1 bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-sm text-center"
            >
              <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs text-cyan-300 mb-1">Most Time Spent</p>
              <p className="text-2xl font-black text-cyan-400">{Math.round(props.mostTimeGame.duration)}</p>
              <p className="text-xs text-cyan-300/70">mins</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Decorative accents */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-cyan-500 rounded-full opacity-60" />
      <div className="absolute bottom-8 left-8 w-3 h-3 bg-amber-500 rounded-full opacity-40" />
    </div>
  )
}
