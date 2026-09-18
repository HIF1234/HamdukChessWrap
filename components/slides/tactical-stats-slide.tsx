"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Swords, Zap, Crown, ArrowUpCircle, ShieldAlert, Handshake, Timer } from "lucide-react"

export function TacticalStatsSlide({ data }: { data: ChessWrapData }) {
  const t = data.tacticalStats

  const stats = [
    {
      label: "Pieces Captured",
      value: t.totalPiecesCaptured,
      icon: Swords,
      color: "text-red-400",
    },
    {
      label: "Checks Delivered",
      value: t.totalChecksDelivered,
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      label: "En Passant Captures",
      value: t.enPassantCaptures,
      icon: ArrowUpCircle,
      color: "text-blue-400",
    },
    {
      label: "Underpromotions",
      value: t.underpromotions,
      icon: Crown,
      color: "text-purple-400",
    },
  ]

  const totalDraws = t.stalemateDraws + t.threefoldDraws + t.insufficientMaterialDraws + t.fiftyMoveDraws

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-10 bg-gradient-to-b from-background to-card overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          On The <span className="text-primary">Board</span>
        </h2>
        <p className="text-muted-foreground text-lg">Real numbers, counted straight from every move you played.</p>
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
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {t.fastestCheckmate && (
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
            <Timer className="w-8 h-8 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase">Fastest Checkmate</p>
              <p className="text-2xl font-black">{t.fastestCheckmate.moves} moves</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/20 flex items-center gap-4">
          <ShieldAlert className="w-8 h-8 text-destructive shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Mates You Missed</p>
            <p className="text-2xl font-black">{t.missedMateInOneByUser}</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-accent/5 border border-accent/20 flex items-center gap-4">
          <Handshake className="w-8 h-8 text-accent shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase">Draws (of {totalDraws})</p>
            <p className="text-sm font-bold">
              {t.threefoldDraws} repetition · {t.fiftyMoveDraws} 50-move · {t.stalemateDraws} stalemate
            </p>
          </div>
        </div>
      </motion.div>

      {t.missedMateInOneByOpponent > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-muted-foreground italic"
        >
          Your opponents missed a mate-in-1 against you {t.missedMateInOneByOpponent} time
          {t.missedMateInOneByOpponent === 1 ? "" : "s"} this year. Lucky.
        </motion.p>
      )}
    </div>
  )
}
