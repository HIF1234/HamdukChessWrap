"use client"

import { motion } from "framer-motion"
import { Users, Swords, Globe, Trophy } from "lucide-react"

const categories = [
  {
    title: "Global Leaderboards",
    description: "See where you rank against players from your country and worldwide.",
    icon: Globe,
    color: "text-primary",
  },
  {
    title: "Rival Comparison",
    description: "Compare your year head-to-head with your most frequent opponents.",
    icon: Swords,
    color: "text-secondary",
  },
  {
    title: "Club Rankings",
    description: "Show off your stats within your Chess.com or Lichess clubs.",
    icon: Users,
    color: "text-accent",
  },
]

export function ComparisonSection() {
  return (
    <section className="space-y-12 pt-12 border-t border-border/40">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Social & Comparison</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Chess is better with friends. Compare your progress and climb the global leaderboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-card border border-border/40 space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <cat.icon className="w-24 h-24" />
            </div>

            <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center`}>
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{cat.description}</p>
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary cursor-pointer hover:translate-x-1 transition-transform">
              Explore Now <Trophy className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
