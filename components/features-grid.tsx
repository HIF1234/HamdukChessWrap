import { BarChart3, Brain, Share2, Target, History, Layout } from "lucide-react"

const features = [
  {
    title: "Performance Analytics",
    description: "Detailed breakdown of wins, losses, and rating progression across all time controls.",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    title: "Opening Mastery",
    description: "Discover your most successful openings and where you struggle the most.",
    icon: Target,
    color: "text-secondary",
  },
  {
    title: "AI Narrator",
    description: "Get a personalized commentary on your year from our AI coach or get roasted.",
    icon: Brain,
    color: "text-accent",
  },
  {
    title: "Social Sharing",
    description: "Share your wrap with beautifully designed cards perfect for social media.",
    icon: Share2,
    color: "text-primary",
  },
  {
    title: "Match Highlights",
    description: "Relive your best wins and analyze your biggest blunders with interactive boards.",
    icon: History,
    color: "text-secondary",
  },
  {
    title: "Training Plans",
    description: "Personalized 4-week training plans generated based on your weaknesses.",
    icon: Layout,
    color: "text-accent",
  },
]

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <div
          key={i}
          className="group p-8 rounded-3xl bg-card border border-border/40 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 space-y-4"
        >
          <div
            className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform`}
          >
            <feature.icon className={`w-6 h-6 ${feature.color}`} />
          </div>
          <h3 className="text-xl font-bold">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
