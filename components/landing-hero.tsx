import { Trophy, Swords, Zap } from "lucide-react"

export function LandingHero() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
        <Zap className="w-4 h-4 fill-primary" />
        <span>Powered by Advanced Chess AI</span>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
        YOUR YEAR IN <br />
        <span className="text-gradient from-primary via-accent to-secondary">CHESS, WRAPPED.</span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Discover your most played openings, your biggest rating gains, and get roasted by our AI coach. Compatible with
        Chess.com and Lichess.
      </p>

      <div className="flex flex-wrap justify-center gap-8 pt-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          <span className="font-semibold">Best Ratings</span>
        </div>
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-accent" />
          <span className="font-semibold">Opening Analysis</span>
        </div>
      </div>
    </div>
  )
}
