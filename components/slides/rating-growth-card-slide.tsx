'use client'

import { motion } from 'framer-motion'
import { TrendingUp, ArrowUp, Zap } from 'lucide-react'
import type { ChessWrapData } from '@/lib/types'
import { WRAP_YEAR } from '@/lib/constants'

interface RatingGrowthCardSlideProps {
  data: ChessWrapData
}

export function RatingGrowthCardSlide({ data }: RatingGrowthCardSlideProps) {
  const startRating = data.ratingProgression.length > 0 ? data.ratingProgression[0].rating : 0
  const endRating = data.ratingProgression.length > 0 ? data.ratingProgression[data.ratingProgression.length - 1].rating : 0
  const ratingGain = endRating - startRating
  const percentGain = startRating > 0 ? ((ratingGain / startRating) * 100).toFixed(1) : 0

  const highestRating = Math.max(...data.ratingProgression.map(r => r.rating))
  const lowestRating = Math.min(...data.ratingProgression.map(r => r.rating))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/40 rounded-3xl p-12 backdrop-blur-md shadow-2xl mb-8"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Rating Evolution
              </h1>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-emerald-300/60 text-sm uppercase tracking-widest"
            >
              Your growth throughout {WRAP_YEAR}
            </motion.p>
          </div>

          {/* Rating Timeline */}
          <div className="space-y-8">
            {/* Start Rating */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <div className="w-24 text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Start</p>
                <p className="text-3xl font-bold text-blue-400">{startRating}</p>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
            </motion.div>

            {/* Peak Rating */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <div className="w-24 text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Peak</p>
                <p className="text-3xl font-bold text-yellow-400">{highestRating}</p>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full" />
            </motion.div>

            {/* Current Rating */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <div className="w-24 text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Current</p>
                <p className="text-3xl font-bold text-emerald-400">{endRating}</p>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full" />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            <div className="bg-slate-700/30 rounded-lg p-4 border border-emerald-500/20 text-center">
              <p className="text-xs text-gray-400 mb-2 uppercase">Total Gain</p>
              <p className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                <ArrowUp className="w-5 h-5" />
                {ratingGain}
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-blue-500/20 text-center">
              <p className="text-xs text-gray-400 mb-2 uppercase">Percentage</p>
              <p className="text-2xl font-bold text-blue-400">{percentGain}%</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20 text-center">
              <p className="text-xs text-gray-400 mb-2 uppercase">Range</p>
              <p className="text-2xl font-bold text-purple-400">{highestRating - lowestRating}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Insight */}
        <motion.div
          variants={itemVariants}
          className="text-center text-gray-300 text-sm italic"
        >
          <p>Your consistent improvement demonstrates dedication and growth mindset</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
