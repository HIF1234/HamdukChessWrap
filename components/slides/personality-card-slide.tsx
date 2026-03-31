'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Zap, Brain } from 'lucide-react'
import type { ChessWrapData } from '@/lib/types'

interface PersonalityCardSlideProps {
  data: ChessWrapData
}

export function PersonalityCardSlide({ data }: PersonalityCardSlideProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
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

  const playstyle = data.playstyle

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
          className="bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-indigo-900/40 border border-purple-500/40 rounded-3xl p-12 backdrop-blur-md shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Your Chess Persona
              </h1>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-purple-300/60 text-sm uppercase tracking-widest"
            >
              {data.aiInsights.persona}
            </motion.p>
          </div>

          {/* Main Insight */}
          <motion.div
            variants={itemVariants}
            className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-8 mb-8 text-center"
          >
            <p className="text-lg text-purple-100 font-semibold italic">"{data.aiInsights.moodOfYear}"</p>
          </motion.div>

          {/* Personality Traits */}
          <div className="space-y-6 mb-8">
            {/* Aggressive vs Positional */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-gray-200">Playstyle</span>
                </div>
                <span className="text-xs text-gray-400 uppercase">
                  {playstyle.aggressiveScore > playstyle.positionalScore ? 'Aggressive' : 'Positional'}
                </span>
              </div>
              <div className="flex gap-2 h-3 bg-slate-700/50 rounded-full overflow-hidden border border-gray-700">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                  style={{ width: `${playstyle.aggressiveScore}%` }}
                />
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  style={{ width: `${playstyle.positionalScore}%` }}
                />
              </div>
            </motion.div>

            {/* Risk Level */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-semibold text-gray-200">Risk Profile</span>
                </div>
                <span className="text-xs text-gray-400 uppercase">{playstyle.riskLevel}</span>
              </div>
              <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-gray-700">
                <div
                  className={`h-full rounded-full ${
                    playstyle.riskLevel === 'High'
                      ? 'bg-red-500'
                      : playstyle.riskLevel === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: playstyle.riskLevel === 'High' ? '100%' : playstyle.riskLevel === 'Medium' ? '50%' : '33%' }}
                />
              </div>
            </motion.div>

            {/* Clutch Wins */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-gray-200">Clutch Performance</span>
                </div>
                <span className="text-xs text-cyan-400 font-bold">{playstyle.clutchWins} wins</span>
              </div>
              <p className="text-xs text-gray-400">
                {playstyle.clutchWins > 0 ? 'You excel under pressure against stronger opponents' : 'Room to improve against stronger competition'}
              </p>
            </motion.div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              variants={itemVariants}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"
            >
              <p className="text-xs text-emerald-400 font-bold uppercase mb-3">Strengths</p>
              <ul className="space-y-1 text-xs text-gray-300">
                {data.aiInsights.strengths.slice(0, 2).map((str, i) => (
                  <li key={i}>• {str}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
            >
              <p className="text-xs text-red-400 font-bold uppercase mb-3">Focus Areas</p>
              <ul className="space-y-1 text-xs text-gray-300">
                {data.aiInsights.weaknesses.slice(0, 2).map((weak, i) => (
                  <li key={i}>• {weak}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
