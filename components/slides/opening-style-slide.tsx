'use client'

import { motion } from 'framer-motion'
import type { ChessWrapData } from '@/lib/types'
import { TrendingUp, Zap, Shield } from 'lucide-react'

export function OpeningStyleSlide({ data }: { data: ChessWrapData }) {
  const topOpenings = data.topOpenings || []
  const whiteOpenings = topOpenings.filter((o) => o.asWhite && o.asWhite > 0)
  const blackOpenings = topOpenings.filter((o) => o.asBlack && o.asBlack > 0)
  const gambits = topOpenings.filter((o) => o.isGambit)
  const rareOpenings = topOpenings.slice(5, 10) || []

  const bestOpening = topOpenings[0]
  const favoriteAsWhite = whiteOpenings[0]
  const favoriteAsBlack = blackOpenings[0]

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-8 bg-gradient-to-br from-accent/5 to-primary/5 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Opening Mastery</h2>
        <p className="text-4xl font-black tracking-tight leading-none">
          YOUR CHESS <br />
          <span className="text-accent">PERSONALITY</span>
        </p>
      </div>

      {/* Best Opening */}
      {bestOpening && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <div className="relative p-6 rounded-2xl bg-card border-2 border-accent/30 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Favorite Opening</p>
                <h3 className="text-2xl font-black tracking-tight mb-2">{bestOpening.name}</h3>
                {bestOpening.ecoCode && (
                  <p className="text-sm text-muted-foreground font-mono">ECO: {bestOpening.ecoCode}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-accent">{bestOpening.winRate}%</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">{bestOpening.games} games</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-bold">
                {bestOpening.wins}W
              </span>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold">
                {bestOpening.losses}L
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                {bestOpening.draws}D
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* White vs Black Openings */}
      <div className="grid grid-cols-2 gap-4">
        {favoriteAsWhite && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-white/70" />
              <p className="text-xs font-bold text-muted-foreground uppercase">as White</p>
            </div>
            <p className="text-sm font-black line-clamp-2">{favoriteAsWhite.name}</p>
            <p className="text-lg font-black text-accent">{favoriteAsWhite.winRate}%</p>
          </motion.div>
        )}
        
        {favoriteAsBlack && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-black/5 border border-black/10 space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-black/70 dark:text-white/70" />
              <p className="text-xs font-bold text-muted-foreground uppercase">as Black</p>
            </div>
            <p className="text-sm font-black line-clamp-2">{favoriteAsBlack.name}</p>
            <p className="text-lg font-black text-accent">{favoriteAsBlack.winRate}%</p>
          </motion.div>
        )}
      </div>

      {/* Gambits & Rare Openings */}
      <div className="space-y-4">
        {gambits.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300 uppercase">Gambits Played</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gambits.slice(0, 3).map((gambit) => (
                <span key={gambit.name} className="text-xs font-bold px-2 py-1 rounded bg-yellow-500/20">
                  {gambit.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {rareOpenings.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Rare Openings</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {rareOpenings.slice(0, 3).map((rare) => (
                <span key={rare.name} className="text-xs font-bold px-2 py-1 rounded bg-purple-500/20">
                  {rare.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ECO Codes */}
      {topOpenings.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-muted space-y-3"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ECO Codes Played</p>
          <div className="grid grid-cols-3 gap-2">
            {topOpenings
              .filter((o) => o.ecoCode)
              .slice(0, 6)
              .map((opening) => (
                <div
                  key={opening.ecoCode}
                  className="p-2 rounded bg-background border border-border text-center"
                >
                  <p className="text-sm font-black text-accent">{opening.ecoCode}</p>
                  <p className="text-xs text-muted-foreground">{opening.games} games</p>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
