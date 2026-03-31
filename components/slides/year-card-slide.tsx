'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Zap, Award } from 'lucide-react'
import type { ChessWrapData } from '@/lib/types'

interface YearCardSlideProps {
  data: ChessWrapData
}

export function YearCardSlide({ data }: YearCardSlideProps) {
  const ratingGain = data.ratingProgression.length > 1 
    ? data.ratingProgression[data.ratingProgression.length - 1].rating - data.ratingProgression[0].rating
    : 0

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
            >
              {data.player.username}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-sm text-cyan-300/70 uppercase tracking-widest"
            >
              Your Chess Year 2025
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Total Games */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-300/70 uppercase">Games</span>
              </div>
              <p className="text-2xl font-bold text-white">{data.player.totalGames}</p>
            </motion.div>

            {/* Rating Gain */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-700/30 rounded-lg p-4 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300/70 uppercase">Gain</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{ratingGain > 0 ? '+' : ''}{ratingGain}</p>
            </motion.div>

            {/* Win Rate */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-700/30 rounded-lg p-4 border border-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300/70 uppercase">Wins</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{data.player.wins}</p>
            </motion.div>

            {/* Win Streak */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300/70 uppercase">Streak</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{data.player.longestWinStreak}</p>
            </motion.div>
          </div>

          {/* Rating Display */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg p-6 text-center mb-6"
          >
            <p className="text-xs text-cyan-300/70 uppercase tracking-widest mb-2">Current Rating</p>
            <p className="text-5xl font-bold text-cyan-300">{data.player.currentRating}</p>
          </motion.div>

          {/* Personality Insight */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <p className="text-sm text-gray-300 italic">{data.aiInsights.moodOfYear}</p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-gray-500 mt-8 uppercase tracking-widest"
        >
          Share your chess year on social
        </motion.p>
      </motion.div>
    </div>
  )
}
