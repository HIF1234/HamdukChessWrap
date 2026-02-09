'use client'

import { type RatingProgression, type TimeControl } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface RatingGraphSlideProps {
  ratingProgression: RatingProgression[]
}

export function RatingGraphSlide({ ratingProgression }: RatingGraphSlideProps) {
  // Group progression by time control for separate lines
  const groupedByTimeControl: Record<TimeControl, RatingProgression[]> = {
    bullet: [],
    blitz: [],
    rapid: [],
    classical: [],
  }

  for (const prog of ratingProgression) {
    groupedByTimeControl[prog.timeControl].push(prog)
  }

  // Prepare data for chart - use most recent from each time control per week
  const chartData: {
    date: string
    bullet?: number
    blitz?: number
    rapid?: number
    classical?: number
  }[] = []

  const weekMap = new Map<string, Record<TimeControl, number>>()

  for (const prog of ratingProgression) {
    const date = new Date(prog.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { bullet: 0, blitz: 0, rapid: 0, classical: 0 })
    }

    const weekData = weekMap.get(weekKey)!
    if (prog.rating > (weekData[prog.timeControl] || 0)) {
      weekData[prog.timeControl] = prog.rating
    }
  }

  const sortedWeeks = Array.from(weekMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .forEach(([week, data]) => {
      chartData.push({
        date: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...data,
      })
    })

  const timeControlColors: Record<TimeControl, string> = {
    bullet: '#ef4444',
    blitz: '#f97316',
    rapid: '#0ea5e9',
    classical: '#a855f7',
  }

  const timeControlLabels: Record<TimeControl, string> = {
    bullet: 'Bullet',
    blitz: 'Blitz',
    rapid: 'Rapid',
    classical: 'Classical',
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              RATING PROGRESSION
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Your rating journey throughout 2024</p>
        </div>

        {/* Chart Container */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              {Object.entries(groupedByTimeControl).map(
                ([tc, data]) =>
                  data.length > 0 && (
                    <Line
                      key={tc}
                      type="monotone"
                      dataKey={tc as TimeControl}
                      stroke={timeControlColors[tc as TimeControl]}
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={true}
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend and Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(groupedByTimeControl).map(([tc, data]) => {
            if (data.length === 0) return null

            const sorted = [...data].sort((a, b) => b.date.getTime() - a.date.getTime())
            const current = sorted[0]
            const start = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())[0]
            const gain = current.rating - start.rating

            return (
              <div
                key={tc}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: timeControlColors[tc as TimeControl] }}
                  />
                  <span className="font-semibold text-slate-200">{timeControlLabels[tc as TimeControl]}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current:</span>
                    <span className="text-white font-semibold">{current.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start:</span>
                    <span className="text-slate-300">{start.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Change:</span>
                    <span className={`font-semibold ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {gain >= 0 ? '+' : ''}{gain}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-4">PROGRESSION INSIGHTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <p className="text-cyan-400 font-semibold mb-2">📊 Overall Trend</p>
              <p className="text-sm">
                Track your rating across all time formats to identify your strongest and weakest areas.
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">🎯 Format Performance</p>
              <p className="text-sm">
                Each line represents a different time control, showing how your skill evolves in each format.
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">📈 Growth Potential</p>
              <p className="text-sm">
                Focus on formats where you're gaining rating to maximize your competitive advantage.
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">🔄 Consistency</p>
              <p className="text-sm">
                Smoother curves indicate consistent play; spikes show improvement periods or slumps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
