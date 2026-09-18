"use client"

import { motion } from "framer-motion"
import type { ChessWrapData } from "@/lib/types"
import { Share2, Download, Trophy, Users, QrCode, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { WRAP_YEAR } from "@/lib/constants"

export function ShareSlide({ data, shareId }: { data: ChessWrapData; shareId: string | null }) {
  const { toast } = useToast()

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?id=${shareId}` : ""

  const handleShare = () => {
    if (!shareId) {
      toast({
        title: "Sharing not ready",
        description: "Please wait while we generate your unique URL.",
        variant: "destructive",
      })
      return
    }

    if (navigator.share) {
      navigator.share({
        title: `My Hamduk Chess Wrap ${WRAP_YEAR} - ${data.player.username}`,
        text: `I played ${data.player.totalGames} games this year with a ${data.player.winRate}% win rate! Check out my full Chess Wrap.`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Your personalized wrap URL is ready to share.",
      })
    }
  }

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-8 bg-gradient-to-t from-secondary/10 to-background">
      <div className="space-y-2 text-center">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">The Grand Finale</h2>
        <p className="text-4xl font-black tracking-tight leading-none italic uppercase">
          SHARE YOUR <br />
          <span className="text-5xl text-secondary">LEGACY</span>
        </p>
      </div>

      {/* Share Card Preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative group cursor-pointer"
        onClick={handleShare}
      >
        <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-3xl" />
        <div className="relative p-6 rounded-3xl bg-card border-2 border-secondary/20 space-y-6 shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Player Profile</p>
              <h3 className="text-2xl font-black italic">{data.player.username}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Games</p>
              <p className="text-2xl font-black">{data.player.totalGames}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Peak</p>
              <p className="text-2xl font-black text-secondary">{data.player.bestRating}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-[8px] text-muted-foreground font-medium uppercase leading-tight">
                Scan to view <br />
                Full Wrap
              </p>
            </div>
            <p className="text-[10px] font-black text-primary tracking-tighter">HAMDUK CHESS {WRAP_YEAR}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleShare} className="rounded-2xl h-12 bg-primary text-primary-foreground font-bold">
          <Share2 className="w-4 h-4 mr-2" />
          Share Link
        </Button>
        <Button variant="outline" className="rounded-2xl h-12 border-white/10 font-bold bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Image
        </Button>
      </div>

      <div className="flex justify-center gap-6 pt-4">
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Compare</span>
        </button>
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PDF Export</span>
        </button>
      </div>
    </div>
  )
}
