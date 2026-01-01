"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"

export function OpeningSlide({ data }: { data: ChessWrapData }) {
  const topOpening = data.topOpenings[0] || { name: "The Sicilian Defense", winRate: 64 }

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-12 bg-accent/5">
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Master of Theory</h2>
        <p className="text-4xl font-black tracking-tight leading-none">
          YOUR SECRET <br />
          <span className="text-5xl text-accent">WEAPON</span>
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        <div className="relative p-8 rounded-[2rem] bg-card border-2 border-accent/20 text-center space-y-4">
          <h3 className="text-2xl font-black tracking-tight">{topOpening.name}</h3>
          <div className="space-y-1">
            <p className="text-6xl font-black text-accent">{Math.round(topOpening.winRate)}%</p>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Win Rate</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-muted-foreground">Other Favorites:</p>
        <div className="flex flex-wrap gap-2">
          {data.topOpenings.slice(1, 4).map((op) => (
            <span key={op.name} className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-bold">
              {op.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
