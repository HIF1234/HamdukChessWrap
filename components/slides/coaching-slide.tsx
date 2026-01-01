"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Layout, CheckCircle2, ArrowRight } from "lucide-react"

export function CoachingSlide({ data }: { data: ChessWrapData }) {
  const plan = data.trainingPlan[0] || {
    week: 1,
    focus: "Tactical Sharpness",
    drills: ["15 min Puzzle Rush daily", "Study Fork patterns", "Solve 5 Polgar mates"],
  }

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-8 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Next Steps</h2>
        </div>
        <p className="text-4xl font-black tracking-tight leading-none italic uppercase">
          YOUR <span className="text-primary">4-WEEK</span> <br />
          <span className="text-5xl text-accent">BLUEPRINT</span>
        </p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-[2rem] bg-card border border-primary/20 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase text-primary tracking-widest">
              Week {plan.week} Focus
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">{plan.focus}</h3>

          <div className="space-y-3">
            {plan.drills.map((drill, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-muted-foreground leading-snug">{drill}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-2xl bg-muted border border-border flex items-center justify-between group cursor-pointer"
        >
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Full Curriculum</p>
            <p className="text-sm font-black">View Your Entire Plan</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-primary transition-colors group-hover:text-primary-foreground">
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        Tailored to {data.player.username}'s weaknesses
      </p>
    </div>
  )
}
