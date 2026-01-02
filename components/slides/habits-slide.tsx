"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Clock, Calendar, Moon, Sun } from "lucide-react"

export function HabitsSlide({ data }: { data: ChessWrapData }) {
  const habits = [
    {
      label: "Most Active Month",
      value: data.player.mostActiveMonth || "N/A",
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      label: "Active Days",
      value: data.player.activeDays || 0,
      icon: Clock,
      color: "text-green-400",
    },
    {
      label: "Risk Level",
      value: data.playstyle.riskLevel,
      icon: data.playstyle.riskLevel === "High" ? Moon : Sun,
      color: data.playstyle.riskLevel === "High" ? "text-purple-400" : "text-yellow-400",
    },
  ]

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          Your <span className="text-primary">Habits</span>
        </h2>
        <p className="text-muted-foreground text-lg">How you spent your time on the board.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {habits.map((habit, i) => (
          <motion.div
            key={habit.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-card border border-border/50 space-y-4 flex flex-col items-center"
          >
            <div className={`p-4 rounded-full bg-white/5 ${habit.color}`}>
              <habit.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">{habit.label}</p>
              <p className="text-3xl font-bold">{habit.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-primary/10 border border-primary/20 max-w-lg"
      >
        <p className="text-sm italic">
          "You tend to play your best games in the {data.player.mostActiveMonth}, showing a{" "}
          {data.playstyle.riskLevel.toLowerCase()} risk tolerance."
        </p>
      </motion.div>
    </div>
  )
}
