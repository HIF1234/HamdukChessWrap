"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { CalendarDays, Trophy, Swords, Flag } from "lucide-react"

export function ActivitySlide({ data }: { data: ChessWrapData }) {
  const { monthlyActivity, activityStats } = data

  const chartData = monthlyActivity.map((m) => ({ month: m.month, games: m.games }))

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-8 bg-gradient-to-b from-background to-card overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Your Year, By The Numbers</h2>
        <p className="text-4xl font-black tracking-tight leading-none">
          A YEAR OF <span className="text-primary">CHESS</span>
        </p>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-40 w-full bg-card/50 border border-border/50 rounded-2xl p-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" fontSize={10} stroke="currentColor" opacity={0.5} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
              />
              <Bar dataKey="games" fill="oklch(0.75 0.15 195)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {activityStats.mostActiveDay && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-card border border-border/50 flex items-center gap-3"
          >
            <CalendarDays className="w-6 h-6 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Busiest Day</p>
              <p className="text-lg font-bold">{activityStats.mostActiveDay.games} games</p>
              <p className="text-xs text-muted-foreground">{activityStats.mostActiveDay.date}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-card border border-border/50 flex items-center gap-3"
        >
          <Swords className="w-6 h-6 text-accent shrink-0" />
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Total Moves Played</p>
            <p className="text-lg font-bold">{activityStats.totalMovesPlayed.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-card border border-border/50 flex items-center gap-3"
        >
          <Flag className="w-6 h-6 text-secondary shrink-0" />
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Rated vs Casual</p>
            <p className="text-lg font-bold">
              {activityStats.ratedGames} / {activityStats.casualGames}
            </p>
          </div>
        </motion.div>

        {activityStats.quietestMonth && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-5 rounded-2xl bg-card border border-border/50 flex items-center gap-3"
          >
            <CalendarDays className="w-6 h-6 text-muted-foreground shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Quietest Month</p>
              <p className="text-lg font-bold">{activityStats.quietestMonth}</p>
              <p className="text-xs text-muted-foreground">{activityStats.quietestMonthGames} games</p>
            </div>
          </motion.div>
        )}

        {activityStats.bestWeek && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-3"
          >
            <Trophy className="w-6 h-6 text-green-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Best Week</p>
              <p className="text-lg font-bold">{activityStats.bestWeek.winRate.toFixed(0)}% win rate</p>
              <p className="text-xs text-muted-foreground">
                {activityStats.bestWeek.games} games, week of{" "}
                {new Date(activityStats.bestWeek.weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </motion.div>
        )}

        {activityStats.worstWeek && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.68 }}
            className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3"
          >
            <Flag className="w-6 h-6 text-red-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Worst Week</p>
              <p className="text-lg font-bold">{activityStats.worstWeek.winRate.toFixed(0)}% win rate</p>
              <p className="text-xs text-muted-foreground">
                {activityStats.worstWeek.games} games, week of{" "}
                {new Date(activityStats.worstWeek.weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {activityStats.milestoneGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            Milestones Reached
          </div>
          <div className="flex flex-wrap gap-2">
            {activityStats.milestoneGames.map((m) => (
              <span key={m.milestone} className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                Game #{m.milestone} · {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
