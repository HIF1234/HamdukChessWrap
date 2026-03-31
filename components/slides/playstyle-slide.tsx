"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"

export function PlaystyleSlide({ data }: { data: ChessWrapData }) {
  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-12 bg-gradient-to-t from-primary/10 to-background">
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">The Persona</h2>
        <p className="text-4xl font-black tracking-tight leading-none">
          YOU PLAY LIKE <br />
          <span className="text-6xl text-primary text-gradient from-primary to-accent">A BEAST</span>
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-black uppercase tracking-widest">
            <span>Positional</span>
            <span>Aggressive</span>
          </div>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-white/5">
            <motion.div
              initial={{ width: "50%" }}
              animate={{ width: `${Math.max(0, Math.min(100, data.playstyle.aggressiveScore || 50))}%` }}
              transition={{ duration: 1.5, type: "spring" }}
              className="h-full bg-primary rounded-full shadow-[0_0_15px_oklch(0.75_0.15_195)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div className="space-y-1">
            <p className="text-4xl font-black">{data.playstyle.sacrificeCount}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Sacrifices</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black">{data.playstyle.earlyQueenMoves}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Queen Charges</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-[2rem] bg-black/40 border border-primary/20"
      >
        <p className="text-xs text-primary font-black uppercase tracking-[0.3em] mb-2">Classification</p>
        <p className="text-3xl font-black italic">{data.aiInsights.persona}</p>
      </motion.div>
    </div>
  )
}
