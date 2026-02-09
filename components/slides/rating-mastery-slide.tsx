'use client'

import { type TimeControlStats } from '@/lib/types'
import { TrendingUp, Target, Zap } from 'lucide-react'

interface RatingMasterySlideProps {
  timeControlStats: TimeControlStats[]
  ratingGain: number
  startRating: number
  endRating: number
}

export function RatingMasterySlide({
  timeControlStats,
  ratingGain,
  startRating,
  endRating,
}: RatingMasterySlideProps) {
  const highestRating = Math.max(...timeControlStats.map((tc) => tc.highestRating || 0))
  const bestTimeControl = timeControlStats.reduce((prev, current) =>
    (current.highestRating || 0) > (prev.highestRating || 0) ? current : prev,
  )

  const formatRating = (rating: number) => rating.toFixed(0)

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              RATING MASTERY
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Your rating progression throughout the year</p>
        </div>

        {/* Main Rating Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Starting Rating */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-0.5 rounded-xl overflow-hidden">
            <div className="bg-slate-900 rounded-xl p-8 h-full flex flex-col justify-center items-center text-center">
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Year Start Rating</p>
              <p className="text-5xl font-bold text-blue-400 mb-2">{formatRating(startRating)}</p>
              <p className="text-slate-500 text-xs">January 1st</p>
            </div>
          </div>

          {/* Rating Gain */}
          <div
            className={`bg-gradient-to-br ${
              ratingGain >= 0
                ? 'from-green-600 to-emerald-600'
                : 'from-red-600 to-rose-600'
            } p-0.5 rounded-xl overflow-hidden`}
          >
            <div className="bg-slate-900 rounded-xl p-8 h-full flex flex-col justify-center items-center text-center">
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Rating Gain</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-5xl font-bold ${ratingGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {ratingGain >= 0 ? '+' : ''}{formatRating(ratingGain)}
                </p>
                <span className={`text-2xl ${ratingGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {ratingGain >= 0 ? '📈' : '📉'}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                {ratingGain >= 0 ? 'Improvement' : 'Decline'}
              </p>
            </div>
          </div>

          {/* Ending Rating */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-0.5 rounded-xl overflow-hidden">
            <div className="bg-slate-900 rounded-xl p-8 h-full flex flex-col justify-center items-center text-center">
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Year End Rating</p>
              <p className="text-5xl font-bold text-purple-400 mb-2">{formatRating(endRating)}</p>
              <p className="text-slate-500 text-xs">December 31st</p>
            </div>
          </div>
        </div>

        {/* Best Time Control and Peak Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Highest Rating Achieved */}
          <div className="bg-slate-800/50 border border-yellow-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Peak Rating</h3>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Your highest rating achieved</p>
              <p className="text-6xl font-bold text-yellow-400 mb-4">{formatRating(highestRating)}</p>
              <p className="text-slate-400">
                In {bestTimeControl.timeControl.charAt(0).toUpperCase() + bestTimeControl.timeControl.slice(1)}
              </p>
            </div>
          </div>

          {/* Best Time Control */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Strongest Format</h3>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-6">
                You excel in {bestTimeControl.timeControl}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-700/50 rounded p-3">
                  <span className="text-slate-400">Games:</span>
                  <span className="text-white font-semibold">{bestTimeControl.games}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-700/50 rounded p-3">
                  <span className="text-slate-400">Win Rate:</span>
                  <span className="text-green-400 font-semibold">{bestTimeControl.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-700/50 rounded p-3">
                  <span className="text-slate-400">Avg Rating:</span>
                  <span className="text-cyan-400 font-semibold">{bestTimeControl.averageRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-6">Rating by Format</h3>
          <div className="space-y-4">
            {timeControlStats
              .sort((a, b) => (b.highestRating || 0) - (a.highestRating || 0))
              .map((stat) => (
                <div key={stat.timeControl}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 capitalize font-medium">{stat.timeControl}</span>
                    <span className="text-cyan-400 font-semibold">{stat.highestRating || stat.averageRating}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{
                        width: `${((stat.highestRating || stat.averageRating) / highestRating) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
