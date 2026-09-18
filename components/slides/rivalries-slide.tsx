"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Skull, HeartHandshake, Users, Crown, TrendingUp, TrendingDown } from "lucide-react"

export function RivalriesSlide({ data }: { data: ChessWrapData }) {
  const r = data.rivalryStats

  const cards = [
    r.rival && {
      label: "Your Rival",
      sub: `Played ${r.rival.games} times`,
      value: r.rival.name,
      record: `${r.rival.wins}W ${r.rival.losses}L ${r.rival.draws}D`,
      icon: Users,
      color: "text-primary",
    },
    r.nemesis && {
      label: "Nemesis",
      sub: `${r.nemesis.games}+ games, losing record`,
      value: r.nemesis.name,
      record: `${r.nemesis.wins}W ${r.nemesis.losses}L ${r.nemesis.draws}D`,
      icon: Skull,
      color: "text-destructive",
    },
    r.favoriteVictim && {
      label: "Favorite Victim",
      sub: `${r.favoriteVictim.games}+ games, dominant record`,
      value: r.favoriteVictim.name,
      record: `${r.favoriteVictim.wins}W ${r.favoriteVictim.losses}L ${r.favoriteVictim.draws}D`,
      icon: HeartHandshake,
      color: "text-green-400",
    },
    r.highestRatedOpponentBeaten && {
      label: "Giant Slain",
      sub: "Highest-rated opponent you beat",
      value: r.highestRatedOpponentBeaten.name,
      record: `Rated ${r.highestRatedOpponentBeaten.rating}`,
      icon: Crown,
      color: "text-amber-400",
    },
  ].filter(Boolean) as {
    label: string
    sub: string
    value: string
    record: string
    icon: typeof Skull
    color: string
  }[]

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-8 bg-gradient-to-br from-background via-indigo-950/10 to-background overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 text-center">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Opponents & Rivalries</h2>
        <p className="text-4xl font-black tracking-tight leading-none">
          THE PEOPLE YOU <span className="text-primary">FACED</span>
        </p>
      </motion.div>

      {cards.length === 0 ? (
        <p className="text-center text-muted-foreground italic">Not enough repeat opponents yet to crown a rival.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-card border border-border/50 space-y-2"
            >
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${card.color}`}>
                <card.icon className="w-4 h-4" />
                {card.label}
              </div>
              <p className="text-xl font-black truncate">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
              <p className="text-sm font-bold">{card.record}</p>
            </motion.div>
          ))}
        </div>
      )}

      {(r.biggestUpsetWin || r.biggestUpsetLoss) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full"
        >
          {r.biggestUpsetWin && (
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Biggest Upset Win</p>
                <p className="text-sm font-bold">
                  vs {r.biggestUpsetWin.opponent} (+{r.biggestUpsetWin.ratingGap} rating gap)
                </p>
              </div>
            </div>
          )}
          {r.biggestUpsetLoss && (
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-red-400 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Biggest Upset Loss</p>
                <p className="text-sm font-bold">
                  vs {r.biggestUpsetLoss.opponent} ({r.biggestUpsetLoss.ratingGap} rating gap)
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
