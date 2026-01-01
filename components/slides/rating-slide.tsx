"use client"
import type { ChessWrapData } from "@/lib/types"
import { LineChart, Line, ResponsiveContainer } from "recharts"

export function RatingSlide({ data }: { data: ChessWrapData }) {
  // Mock data for the chart since it might be missing in simplified fetch
  const chartData = [
    { month: "Jan", rating: 1200 },
    { month: "Mar", rating: 1250 },
    { month: "Jun", rating: 1220 },
    { month: "Sep", rating: 1350 },
    { month: "Dec", rating: 1420 },
  ]

  return (
    <div className="h-full flex flex-col justify-center p-8 space-y-12 bg-gradient-to-br from-background to-secondary/10">
      <div className="space-y-2">
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Peak Performance</h2>
        <p className="text-4xl font-black tracking-tight italic">
          RISING TO <br />
          <span className="text-6xl text-secondary">THE TOP</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Best Rating</p>
          <p className="text-4xl font-black text-secondary">{data.player.bestRating}</p>
        </div>
        <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Rating Gain</p>
          <p className="text-4xl font-black text-secondary">+{data.player.biggestRatingGain}</p>
        </div>
      </div>

      <div className="h-48 w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="rating"
              stroke="oklch(0.78 0.13 85)"
              strokeWidth={4}
              dot={{ r: 6, fill: "oklch(0.78 0.13 85)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
