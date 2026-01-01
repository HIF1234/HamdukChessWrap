"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"

export function IntroSlide({ data }: { data: ChessWrapData }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 bg-gradient-to-b from-background to-card">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="w-48 h-48 rounded-3xl gradient-chess rotate-12 flex items-center justify-center shadow-2xl">
          <div className="w-40 h-40 rounded-2xl bg-black/20 backdrop-blur-sm -rotate-12 flex items-center justify-center">
            <span className="text-6xl font-black text-white italic">25</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-black tracking-tighter"
        >
          YOU'VE HAD QUITE <br />A YEAR, <span className="text-primary">{data.player.username.toUpperCase()}</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-lg font-medium"
        >
          Let's take a look at your {data.player.totalGames} battles across the board.
        </motion.p>
      </div>
    </div>
  )
}
