"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"

export function StatsSlide({ data }: { data: ChessWrapData }) {
  const stats = [
    { label: "Wins", value: data.player.wins, color: "text-primary" },
    { label: "Losses", value: data.player.losses, color: "text-destructive" },
    { label: "Draws", value: data.player.draws, color: "text-muted-foreground" },
  ]

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-12 bg-card">
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">The Scoreboard</h2>
        <p className="text-3xl font-black tracking-tight leading-none">
          YOU FACED THE WORLD <br />
          <span className="text-5xl text-primary">{data.player.totalGames} TIMES</span>
        </p>
      </div>

      <div className="space-y-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-end justify-between border-b border-border/50 pb-4"
          >
            <span className="text-xl font-bold">{stat.label}</span>
            <span className={`text-5xl font-black ${stat.color}`}>{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-3xl bg-primary/10 border border-primary/20 text-center"
      >
        <p className="text-sm font-medium text-muted-foreground">Your Win Rate</p>
        <p className="text-4xl font-black text-primary">{data.player.winRate.toFixed(1)}%</p>
      </motion.div>
    </div>
  )
}
