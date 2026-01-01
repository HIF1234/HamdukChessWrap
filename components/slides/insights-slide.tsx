"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Brain, Flame, Zap, ShieldAlert } from "lucide-react"

export function InsightsSlide({ data }: { data: ChessWrapData }) {
  const isRoast = data.aiInsights.roastMode !== undefined

  return (
    <div
      className={`h-full flex flex-col justify-center p-8 space-y-8 ${isRoast ? "bg-destructive/10" : "bg-primary/5"}`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {isRoast ? <Flame className="w-5 h-5 text-destructive" /> : <Brain className="w-5 h-5 text-primary" />}
          <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">
            {isRoast ? "The Brutal Truth" : "AI Master Analysis"}
          </h2>
        </div>
        <p className="text-3xl font-black tracking-tight leading-none italic">
          {isRoast ? "PREPARE TO" : "THE PATH TO"} <br />
          <span className={`text-5xl ${isRoast ? "text-destructive" : "text-primary"}`}>
            {isRoast ? "CRY" : "MASTERY"}
          </span>
        </p>
      </div>

      {/* Narration Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${isRoast ? "bg-destructive/5 border-destructive/20" : "bg-primary/5 border-primary/20"}`}
      >
        <p className="text-lg font-medium leading-relaxed italic">
          "{isRoast ? data.aiInsights.roastMode : data.aiInsights.coachMode || data.aiInsights.narration}"
        </p>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            Strengths
          </div>
          <div className="flex flex-wrap gap-2">
            {data.aiInsights.strengths.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-widest">
            <ShieldAlert className="w-3 h-3" />
            Weaknesses
          </div>
          <div className="flex flex-wrap gap-2">
            {data.aiInsights.weaknesses.map((w) => (
              <span
                key={w}
                className="px-3 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-[10px] font-bold"
              >
                {w}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mood of the Year */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-4 text-center"
      >
        <div className="inline-block px-6 py-3 rounded-2xl bg-muted border border-border">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Mood of the Year</p>
          <p className="text-xl font-black italic text-gradient from-primary to-accent">
            {data.aiInsights.moodOfYear.toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
