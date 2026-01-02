"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Trophy, Star, Target, Shield, Zap } from "lucide-react"

const ICON_MAP = {
  rating: Trophy,
  streak: Zap,
  accuracy: Target,
  opening: Star,
  time_control: Shield,
}

export function AchievementsSlide({ data }: { data: ChessWrapData }) {
  const { achievements } = data

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          Hall of <span className="text-primary">Fame</span>
        </h2>
        <p className="text-muted-foreground text-lg">Your biggest milestones this year.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {achievements.length > 0 ? (
          achievements.slice(0, 4).map((achievement, i) => {
            const Icon = ICON_MAP[achievement.type] || Trophy
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 p-6 rounded-3xl bg-card border border-border/50 text-left"
              >
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-2 p-12 rounded-3xl bg-card border border-border/50 italic text-muted-foreground">
            No specific milestones found this year. Keep playing to earn badges!
          </div>
        )}
      </div>
    </div>
  )
}
