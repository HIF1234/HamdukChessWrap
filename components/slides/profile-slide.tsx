"use client"

import { motion } from "framer-motion"
import { User, Globe, Award, Calendar } from "lucide-react"
import type { ChessWrapData } from "@/lib/types"

interface ProfileSlideProps {
  data: ChessWrapData
}

export function ProfileSlide({ data }: ProfileSlideProps) {
  const { player } = data

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 border border-primary rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-accent rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="text-5xl font-bold mb-2 text-balance">Player Profile</h2>
        <p className="text-muted-foreground text-lg">Your chess identity</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full z-10">
        {/* Username Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="text-2xl font-bold">{player.username}</p>
          </div>
        </motion.div>

        {/* Platform Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <Globe className="w-7 h-7 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Platform</p>
            <p className="text-2xl font-bold capitalize">{player.platform}</p>
          </div>
        </motion.div>

        {/* Title Card (if available) */}
        {player.title && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Award className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="text-2xl font-bold">{player.title}</p>
            </div>
          </motion.div>
        )}

        {/* Country Card (if available) */}
        {player.country && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl">
              {player.country}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="text-2xl font-bold">{player.country}</p>
            </div>
          </motion.div>
        )}

        {/* Account Age Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Age</p>
            <p className="text-2xl font-bold">{player.accountAge}</p>
          </div>
        </motion.div>

        {/* Total Games Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-500">{player.totalGames}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Games Played</p>
            <p className="text-2xl font-bold">Total</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
    </div>
  )
}
