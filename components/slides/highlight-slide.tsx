"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Trophy, AlertTriangle, Play, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HighlightSlide({ data }: { data: ChessWrapData }) {
  const bestHighlight = data.highlights.find(h => h.type === "best") || data.highlights[0]
  const highlight = bestHighlight || {
    type: "best",
    reason: "A tactical masterpiece with 98% accuracy.",
    game: {
      opponent: "GrandMaster_2025",
      date: "Oct 12, 2025",
      result: "win",
      gameUrl: "https://www.chess.com/game/live/1",
    },
  }

  const isBest = highlight.type === "best"
  const gameUrl = highlight.game?.gameUrl || `https://www.chess.com/game/live/${Math.random().toString(36).substr(2, 9)}`

  return (
    <div
      className={`h-full flex flex-col justify-center p-8 space-y-8 ${isBest ? "bg-secondary/5" : "bg-destructive/5"}`}
    >
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${isBest ? "bg-secondary/20" : "bg-destructive/20"}`}
          >
            {isBest ? (
              <Trophy className="w-8 h-8 text-secondary" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            )}
          </div>
        </div>
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">
          {isBest ? "Game of the Year" : "Learning Moment"}
        </h2>
        <p className="text-3xl font-black tracking-tight leading-none italic uppercase">
          {isBest ? "A Pure" : "The Ultimate"} <br />
          <span className={`text-5xl ${isBest ? "text-secondary" : "text-destructive"}`}>
            {isBest ? "MASTERPIECE" : "BLUNDER"}
          </span>
        </p>
      </div>

      {/* Board Mockup */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted rounded-xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`w-full h-full ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "bg-[#EBECD0]" : "bg-[#779556]"}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-white" />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              vs {highlight.game.opponent || "Opponent"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">{highlight.game.date || "Date"}</p>
          </div>
          <p className="text-sm font-medium leading-relaxed italic">"{highlight.reason}"</p>
        </div>

        <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full rounded-2xl h-12 border-white/10 hover:bg-white/5 bg-transparent">
            View Full Replay
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </a>
      </div>
    </div>
  )
}
