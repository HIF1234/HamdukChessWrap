"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingDown, Swords, Target } from "lucide-react"
import type { ChessWrapData } from "@/lib/types"

interface MatchupsSlideProps {
  data: ChessWrapData
}

export function MatchupsSlide({ data }: MatchupsSlideProps) {
  const { player } = data

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-indigo-950/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-amber-500 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-red-500 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <Swords className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-5xl font-bold mb-2 text-balance">Epic Matchups</h2>
        <p className="text-muted-foreground text-lg">Your most memorable battles</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full z-10">
        {/* Best Win */}
        {player.bestWin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-2 border-amber-500/30 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Trophy className="w-12 h-12 text-amber-400 opacity-20" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Target className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold">Best Win</p>
                <h3 className="text-2xl font-bold">Giant Slayed</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Opponent</p>
                <p className="text-2xl font-bold text-amber-400">{player.bestWin.opponent}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-3xl font-bold">{player.bestWin.rating}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-xl font-semibold">{formatDate(player.bestWin.date)}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-4 border-t border-amber-500/20">
                You defeated an opponent {player.bestWin.rating - player.currentRating} points above your current
                rating!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
          </motion.div>
        )}

        {/* Worst Loss */}
        {player.worstLoss && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/30 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <TrendingDown className="w-12 h-12 text-red-400 opacity-20" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-red-400 uppercase tracking-widest font-bold">Worst Loss</p>
                <h3 className="text-2xl font-bold">Learning Moment</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Opponent</p>
                <p className="text-2xl font-bold text-red-400">{player.worstLoss.opponent}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-3xl font-bold">{player.worstLoss.rating}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-xl font-semibold">{formatDate(player.worstLoss.date)}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-4 border-t border-red-500/20">
                A tough loss to rebound from. Every setback is a setup for a comeback!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl" />
          </motion.div>
        )}

        {/* Win/Loss Record Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8"
        >
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Wins</p>
              <p className="text-5xl font-bold text-green-400">{player.wins}</p>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Losses</p>
              <p className="text-5xl font-bold text-red-400">{player.losses}</p>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-5xl font-bold text-primary">{player.winRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/10 to-transparent" />
    </div>
  )
}
