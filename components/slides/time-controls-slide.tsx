'use client'

import { type TimeControlStats } from '@/lib/types'
import { BarChart3, Trophy } from 'lucide-react'

interface TimeControlsSlideProps {
  timeControlStats: TimeControlStats[]
}

export function TimeControlsSlide({ timeControlStats }: TimeControlsSlideProps) {
  const getIcon = (tc: string) => {
    switch (tc) {
      case 'bullet':
        return '⚡'
      case 'blitz':
        return '🔥'
      case 'rapid':
        return '⚔️'
      case 'classical':
        return '♔'
      default:
        return '♟️'
    }
  }

  const getColor = (tc: string) => {
    switch (tc) {
      case 'bullet':
        return 'from-red-600 to-pink-600'
      case 'blitz':
        return 'from-orange-600 to-red-600'
      case 'rapid':
        return 'from-blue-600 to-cyan-600'
      case 'classical':
        return 'from-purple-600 to-indigo-600'
      default:
        return 'from-gray-600 to-slate-600'
    }
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              TIME CONTROL BREAKDOWN
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Your performance across all formats</p>
        </div>

        {/* Time Control Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {timeControlStats.map((stat) => (
            <div
              key={stat.timeControl}
              className={`relative group bg-gradient-to-br ${getColor(stat.timeControl)} p-0.5 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105`}
            >
              <div className="bg-slate-900 rounded-lg p-6 relative">
                {/* Icon */}
                <div className="text-4xl mb-3 font-bold">{getIcon(stat.timeControl)}</div>

                {/* Time Control Name */}
                <h3 className="text-lg font-bold text-white capitalize mb-4">{stat.timeControl}</h3>

                {/* Statistics */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Games:</span>
                    <span className="text-white font-semibold">{stat.games}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">W/L/D:</span>
                    <span className="text-white font-semibold">
                      {stat.wins}/{stat.losses}/{stat.draws}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Win Rate:</span>
                    <span className={`font-semibold ${stat.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.winRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Avg Rating:</span>
                      <span className="text-cyan-400 font-bold">{stat.averageRating}</span>
                    </div>
                  </div>

                  {stat.highestRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Peak:</span>
                      <span className="text-yellow-400 font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {stat.highestRating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Win Rate Bar */}
                <div className="mt-4 bg-slate-800 rounded h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500`}
                    style={{ width: `${stat.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">OVERALL PERFORMANCE</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Games</p>
              <p className="text-2xl font-bold text-cyan-400">
                {timeControlStats.reduce((sum, stat) => sum + stat.games, 0)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Wins</p>
              <p className="text-2xl font-bold text-green-400">
                {timeControlStats.reduce((sum, stat) => sum + stat.wins, 0)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Avg Win Rate</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(
                  (timeControlStats.reduce((sum, stat) => sum + stat.wins, 0) /
                    timeControlStats.reduce((sum, stat) => sum + stat.games, 0)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
