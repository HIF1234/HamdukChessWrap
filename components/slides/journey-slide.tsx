"use client"

import { motion } from "framer-motion"
import { Calendar, Flame, TrendingUp, Clock } from "lucide-react"
import type { ChessWrapData } from "@/lib/types"

interface JourneySlideProps {
  data: ChessWrapData
}

export function JourneySlide({ data }: JourneySlideProps) {
  const { player, dateRange } = data

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-purple-950/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 border-2 border-primary rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 border-2 border-accent rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <h2 className="text-5xl font-bold mb-2 text-balance">Your Chess Journey</h2>
        <p className="text-muted-foreground text-lg">Key moments from your year</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full z-10">
        {/* First Game */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">First Game</p>
              <p className="text-3xl font-bold text-green-400">{formatDate(player.firstGameDate)}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Where it all began this year</p>
        </motion.div>

        {/* Last Game */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Game</p>
              <p className="text-3xl font-bold text-blue-400">{formatDate(player.lastGameDate)}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Your most recent battle</p>
        </motion.div>

        {/* Longest Win Streak */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Win Streak</p>
              <p className="text-5xl font-bold text-amber-400">{player.longestWinStreak}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Consecutive victories</p>
        </motion.div>

        {/* Longest Playing Streak */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Playing Streak</p>
              <p className="text-5xl font-bold text-red-400">{player.longestStreakDays || 0}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Consecutive days played</p>
        </motion.div>
      </div>

      {/* Timeline Indicator */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-12 w-full max-w-4xl h-2 bg-gradient-to-r from-green-500 via-amber-500 to-blue-500 rounded-full z-10"
      />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-500/10 to-transparent" />
    </div>
  )
}
