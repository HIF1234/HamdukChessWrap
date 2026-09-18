"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Clock, Calendar, Moon, Sun, Coffee, Zap, TrendingDown, Handshake } from "lucide-react"

export function HabitsSlide({ data }: { data: ChessWrapData }) {
  const { playHabits } = data

  const stats = [
    {
      label: "Most Active Day",
      value: playHabits.mostActiveDay,
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      label: "Peak Hour",
      value: `${playHabits.mostActiveHour}:00`,
      icon: Clock,
      color: "text-green-400",
    },
    {
      label: "Day vs Night",
      value: `${playHabits.dayGames} / ${playHabits.nightGames}`,
      icon: playHabits.dayGames > playHabits.nightGames ? Sun : Moon,
      color: playHabits.dayGames > playHabits.nightGames ? "text-yellow-400" : "text-purple-400",
    },
    {
      label: "Work vs Play",
      value: `${playHabits.weekdayGames} / ${playHabits.weekendGames}`,
      icon: Coffee,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          Your <span className="text-primary">Chess Life</span>
        </h2>
        <p className="text-muted-foreground text-lg">A deep dive into your playing patterns.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-card border border-border/50 space-y-4 flex flex-col items-center justify-center"
          >
            <div className={`p-4 rounded-full bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
          <Zap className="w-8 h-8 text-primary shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Win Streak</p>
            <p className="text-2xl font-black">{data.player.longestWinStreak}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/20 flex items-center gap-4">
          <TrendingDown className="w-8 h-8 text-destructive shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Loss Streak</p>
            <p className="text-2xl font-black">{data.player.longestLosingStreak || 0}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-4">
          <Handshake className="w-8 h-8 text-blue-400 shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Draw Streak</p>
            <p className="text-2xl font-black">{data.tacticalStats.longestDrawStreak}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-accent/5 border border-accent/20 flex items-center gap-4">
          <Calendar className="w-8 h-8 text-accent shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Active Days</p>
            <p className="text-2xl font-black">{data.player.activeDays}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
