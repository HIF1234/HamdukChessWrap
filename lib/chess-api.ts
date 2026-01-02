import type {
  ChessGame,
  WrapConfig,
  ChessWrapData,
  PlayerStats,
  TimeControlStats,
  OpeningStats,
  ColorStats,
  MonthlyActivity,
  RatingProgression,
  PlaystyleAnalysis,
  HighlightGame,
  TrainingPlan,
  AIInsights,
  TimeControl,
  Achievement,
  PlayHabits,
} from "./types"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function fetchChessDotComGames(username: string, year: number): Promise<ChessGame[]> {
  const games: ChessGame[] = []

  try {
    // First verify the user exists
    const profileResponse = await fetch(`https://api.chess.com/pub/player/${username}`)
    if (!profileResponse.ok) {
      throw new Error("User not found on Chess.com")
    }
    const profileData = await profileResponse.json()

    // Fetch games for each month of the specified year
    for (let month = 1; month <= 12; month++) {
      const paddedMonth = month.toString().padStart(2, "0")
      const response = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${paddedMonth}`)

      if (response.ok) {
        const data = await response.json()

        if (data.games && data.games.length > 0) {
          // Parse Chess.com games into our format
          for (const game of data.games) {
            const userColor = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black"
            const userRating = userColor === "white" ? game.white.rating : game.black.rating
            const opponentRating = userColor === "white" ? game.black.rating : game.white.rating

            // Determine result from user's perspective
            let result: "win" | "loss" | "draw"
            if (game.pgn.includes("1-0")) {
              result = userColor === "white" ? "win" : "loss"
            } else if (game.pgn.includes("0-1")) {
              result = userColor === "black" ? "win" : "loss"
            } else {
              result = "draw"
            }

            // Extract time control
            const timeControl = determineTimeControl(game.time_class || "blitz")

            // Extract opening from PGN
            const opening = extractOpening(game.pgn) || "Unknown Opening"

            games.push({
              id: game.url || `${game.end_time}`,
              date: new Date(game.end_time * 1000),
              white: game.white.username,
              black: game.black.username,
              result,
              timeControl,
              whiteRating: game.white.rating,
              blackRating: game.black.rating,
              moves: game.pgn,
              opening,
              termination: game.pgn.includes("checkmate") ? "checkmate" : "resignation",
              pgn: game.pgn,
              userColor,
              userRating,
              opponentRating,
            })
          }
        }
      }
    }

    if (games.length === 0) {
      throw new Error("No games found for this user in the specified year")
    }

    return games
  } catch (error) {
    console.error("[v0] Chess.com API error:", error)
    throw error
  }
}

export async function fetchLichessGames(username: string, year: number): Promise<ChessGame[]> {
  try {
    // Verify user exists first
    const profileResponse = await fetch(`https://lichess.org/api/user/${username}`)
    if (!profileResponse.ok) {
      throw new Error("User not found on Lichess")
    }
    const profileData = await profileResponse.json()

    const startDate = new Date(year, 0, 1).getTime()
    const endDate = new Date(year, 11, 31, 23, 59, 59).getTime()

    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?since=${startDate}&until=${endDate}&max=500&pgnInJson=true`,
      { headers: { Accept: "application/x-ndjson" } },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch games from Lichess")
    }

    const text = await response.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length === 0) {
      throw new Error("No games found for this user in the specified year")
    }

    const games: ChessGame[] = []

    for (const line of lines) {
      try {
        const game = JSON.parse(line)
        const userColor = game.players.white.user?.name?.toLowerCase() === username.toLowerCase() ? "white" : "black"
        const userRating = game.players[userColor].rating
        const opponentRating = game.players[userColor === "white" ? "black" : "white"].rating

        // Determine result
        let result: "win" | "loss" | "draw"
        if (game.winner === userColor) {
          result = "win"
        } else if (game.winner === undefined) {
          result = "draw"
        } else {
          result = "loss"
        }

        // Map speed to time control
        const timeControl = determineTimeControl(game.speed || "blitz")

        games.push({
          id: game.id,
          date: new Date(game.createdAt),
          white: game.players.white.user?.name || "Anonymous",
          black: game.players.black.user?.name || "Anonymous",
          result,
          timeControl,
          whiteRating: game.players.white.rating,
          blackRating: game.players.black.rating,
          moves: game.pgn || game.moves || "",
          opening: game.opening?.name || "Unknown Opening",
          termination: game.status || "normal",
          pgn: game.pgn || "",
          userColor,
          userRating,
          opponentRating,
        })
      } catch (parseError) {
        console.error("[v0] Failed to parse Lichess game:", parseError)
      }
    }

    return games
  } catch (error) {
    console.error("[v0] Lichess API error:", error)
    throw error
  }
}

// Helper function to determine time control from API data
function determineTimeControl(timeClass: string): TimeControl {
  const tc = timeClass.toLowerCase()
  if (tc.includes("bullet")) return "bullet"
  if (tc.includes("blitz")) return "blitz"
  if (tc.includes("rapid")) return "rapid"
  return "classical"
}

// Helper function to extract opening from PGN
function extractOpening(pgn: string): string {
  const openingMatch = pgn.match(/\[ECO "([^"]+)"\]/)
  if (openingMatch) return openingMatch[1]

  const openingNameMatch = pgn.match(/\[Opening "([^"]+)"\]/)
  if (openingNameMatch) return openingNameMatch[1]

  return "Unknown Opening"
}

async function fetchChessDotComProfile(username: string) {
  try {
    const response = await fetch(`https://api.chess.com/pub/player/${username}`)
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.country ? data.country.split('/').pop()?.toUpperCase() : undefined,
        title: data.title || undefined,
        joined: data.joined ? new Date(data.joined * 1000) : undefined,
      }
    }
  } catch (error) {
    console.error("[v0] Failed to fetch Chess.com profile:", error)
  }
  return {}
}

async function fetchLichessProfile(username: string) {
  try {
    const response = await fetch(`https://lichess.org/api/user/${username}`)
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.profile?.country || undefined,
        title: data.title || undefined,
        joined: data.createdAt ? new Date(data.createdAt) : undefined,
      }
    }
  } catch (error) {
    console.error("[v0] Failed to fetch Lichess profile:", error)
  }
  return {}
}

function calculatePlayerStats(games: ChessGame[], username: string, platform: string, profile?: any): PlayerStats {
  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length
  const winRate = games.length > 0 ? (wins / games.length) * 100 : 0

  const ratings = games.map((g) => g.userRating).filter((r) => r > 0)
  const bestRating = ratings.length > 0 ? Math.max(...ratings) : 0
  const currentRating = ratings.length > 0 ? ratings[ratings.length - 1] : 0

  const winGames = games.filter((g) => g.result === "win")
  const lossGames = games.filter((g) => g.result === "loss")

  const bestWin =
    winGames.length > 0
      ? winGames.reduce((prev, curr) => (curr.opponentRating > prev.opponentRating ? curr : prev))
      : undefined

  const worstLoss =
    lossGames.length > 0
      ? lossGames.reduce((prev, curr) => (curr.opponentRating < prev.opponentRating ? curr : prev))
      : undefined

  // Calculate longest win streak
  let currentWinStreak = 0
  let longestWinStreak = 0
  let currentLoseStreak = 0
  let longestLosingStreak = 0

  for (const game of games) {
    if (game.result === "win") {
      currentWinStreak++
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak)
      currentLoseStreak = 0
    } else if (game.result === "loss") {
      currentLoseStreak++
      longestLosingStreak = Math.max(longestLosingStreak, currentLoseStreak)
      currentWinStreak = 0
    } else {
      currentWinStreak = 0
      currentLoseStreak = 0
    }
  }

  const sortedByDate = [...games].sort((a, b) => a.date.getTime() - b.date.getTime())
  const uniqueDays = Array.from(new Set(sortedByDate.map((g) => g.date.toDateString()))).sort()
  
  let currentStreak = 1
  let longestStreakDays = 1
  
  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDate = new Date(uniqueDays[i - 1])
    const currDate = new Date(uniqueDays[i])
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (dayDiff === 1) {
      currentStreak++
      longestStreakDays = Math.max(longestStreakDays, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  const moveCounts = games.map((g) => {
    const moves = g.moves.split(/\d+\./).filter((m) => m.trim())
    return moves.length
  })

  const fastestWin =
    winGames.length > 0
      ? winGames.reduce((prev, curr) => {
          const prevMoves = prev.moves.split(/\d+\./).filter((m) => m.trim()).length
          const currMoves = curr.moves.split(/\d+\./).filter((m) => m.trim()).length
          return currMoves < prevMoves ? curr : prev
        })
      : undefined

  const longestGame =
    games.length > 0
      ? games.reduce((prev, curr) => {
          const prevMoves = prev.moves.split(/\d+\./).filter((m) => m.trim()).length
          const currMoves = curr.moves.split(/\d+\./).filter((m) => m.trim()).length
          return currMoves > prevMoves ? curr : prev
        })
      : undefined

  const shortestGame =
    games.length > 0
      ? games.reduce((prev, curr) => {
          const prevMoves = prev.moves.split(/\d+\./).filter((m) => m.trim()).length
          const currMoves = curr.moves.split(/\d+\./).filter((m) => m.trim()).length
          return currMoves < prevMoves ? curr : prev
        })
      : undefined

  // Calculate biggest rating gain
  let biggestGain = 0
  for (let i = 1; i < ratings.length; i++) {
    const gain = ratings[i] - ratings[i - 1]
    if (gain > biggestGain) biggestGain = gain
  }

  const opponentNames = games.map((g) => (g.userColor === "white" ? g.black : g.white))
  const uniqueOpponents = new Set(opponentNames).size

  const opponentStats: { [name: string]: { games: number; wins: number; losses: number; draws: number } } = {}
  games.forEach((g) => {
    const opponent = g.userColor === "white" ? g.black : g.white
    if (!opponentStats[opponent]) {
      opponentStats[opponent] = { games: 0, wins: 0, losses: 0, draws: 0 }
    }
    opponentStats[opponent].games++
    if (g.result === "win") opponentStats[opponent].wins++
    if (g.result === "loss") opponentStats[opponent].losses++
    if (g.result === "draw") opponentStats[opponent].draws++
  })

  const mostPlayedOpponent = Object.entries(opponentStats).sort((a, b) => b[1].games - a[1].games)[0]

  // Calculate expanded activity stats
  const activeDaysSet = new Set(games.map((g) => g.date.toDateString()))
  const activeDays = activeDaysSet.size

  const sortedGames = [...games].sort((a, b) => a.date.getTime() - b.date.getTime())
  const firstGameDate = sortedGames[0]?.date
  const lastGameDate = sortedGames[sortedGames.length - 1]?.date

  const months = games.map((g) => g.date.toLocaleString("default", { month: "long" }))
  const mostActiveMonth =
    months.length > 0
      ? Object.entries(
          months.reduce((acc, m) => {
            acc[m] = (acc[m] || 0) + 1
            return acc
          }, {} as any),
        ).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]
      : undefined

  let accountAge = "Unknown"
  if (profile?.joined) {
    const years = Math.floor((Date.now() - profile.joined.getTime()) / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor(((Date.now() - profile.joined.getTime()) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    accountAge = years > 0 ? `${years}y ${months}m` : `${months}m`
  }

  return {
    username,
    platform: platform as any,
    totalGames: games.length,
    wins,
    losses,
    draws,
    winRate: Math.round(winRate * 10) / 10,
    bestRating,
    currentRating,
    longestWinStreak,
    longestLosingStreak,
    biggestRatingGain: biggestGain,
    activeDays,
    mostActiveMonth,
    accountAge, // Now calculated from profile
    country: profile?.country, // Added country from profile
    title: profile?.title, // Added title from profile
    longestStreakDays, // Added playing streak
    firstGameDate,
    lastGameDate,
    bestWin: bestWin
      ? {
          opponent: bestWin.userColor === "white" ? bestWin.black : bestWin.white,
          rating: bestWin.opponentRating,
          date: bestWin.date,
        }
      : undefined,
    worstLoss: worstLoss
      ? {
          opponent: worstLoss.userColor === "white" ? worstLoss.black : worstLoss.white,
          rating: worstLoss.opponentRating,
          date: worstLoss.date,
        }
      : undefined,
    fastestWin: fastestWin
      ? {
          moves: fastestWin.moves.split(/\d+\./).filter((m) => m.trim()).length,
          time: fastestWin.date.toLocaleDateString(),
        }
      : undefined,
    longestGame: longestGame
      ? {
          moves: longestGame.moves.split(/\d+\./).filter((m) => m.trim()).length,
          duration: `${longestGame.moves.split(/\d+\./).filter((m) => m.trim()).length} moves`,
        }
      : undefined,
    shortestGame: shortestGame
      ? {
          moves: shortestGame.moves.split(/\d+\./).filter((m) => m.trim()).length,
        }
      : undefined,
    uniqueOpponents,
    mostPlayedOpponent: mostPlayedOpponent
      ? {
          name: mostPlayedOpponent[0],
          games: mostPlayedOpponent[1].games,
          wins: mostPlayedOpponent[1].wins,
          losses: mostPlayedOpponent[1].losses,
          draws: mostPlayedOpponent[1].draws,
        }
      : undefined,
  }
}

function calculateTimeControlStats(games: ChessGame[]): TimeControlStats[] {
  const stats = new Map<
    TimeControl,
    { games: number; wins: number; losses: number; draws: number; totalRating: number }
  >()

  for (const game of games) {
    if (!stats.has(game.timeControl)) {
      stats.set(game.timeControl, { games: 0, wins: 0, losses: 0, draws: 0, totalRating: 0 })
    }

    const stat = stats.get(game.timeControl)!
    stat.games++
    stat.totalRating += game.userRating
    if (game.result === "win") stat.wins++
    if (game.result === "loss") stat.losses++
    if (game.result === "draw") stat.draws++
  }

  return Array.from(stats.entries()).map(([timeControl, data]) => ({
    timeControl,
    games: data.games,
    wins: data.wins,
    losses: data.losses,
    draws: data.draws,
    winRate: Math.round((data.wins / data.games) * 1000) / 10,
    averageRating: Math.round(data.totalRating / data.games),
  }))
}

function calculateOpeningStats(games: ChessGame[]): OpeningStats[] {
  const stats = new Map<string, { games: number; wins: number; losses: number; draws: number }>()

  for (const game of games) {
    const opening = game.opening || "Unknown Opening"
    if (!stats.has(opening)) {
      stats.set(opening, { games: 0, wins: 0, losses: 0, draws: 0 })
    }

    const stat = stats.get(opening)!
    stat.games++
    if (game.result === "win") stat.wins++
    if (game.result === "loss") stat.losses++
    if (game.result === "draw") stat.draws++
  }

  return Array.from(stats.entries())
    .map(([name, data]) => ({
      name,
      games: data.games,
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
      winRate: Math.round((data.wins / data.games) * 1000) / 10,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5)
}

function calculateColorStats(games: ChessGame[]): ColorStats[] {
  const white = { games: 0, wins: 0, losses: 0, draws: 0 }
  const black = { games: 0, wins: 0, losses: 0, draws: 0 }

  for (const game of games) {
    const stat = game.userColor === "white" ? white : black
    stat.games++
    if (game.result === "win") stat.wins++
    if (game.result === "loss") stat.losses++
    if (game.result === "draw") stat.draws++
  }

  return [
    {
      color: "white" as const,
      ...white,
      winRate: white.games > 0 ? Math.round((white.wins / white.games) * 1000) / 10 : 0,
    },
    {
      color: "black" as const,
      ...black,
      winRate: black.games > 0 ? Math.round((black.wins / black.games) * 1000) / 10 : 0,
    },
  ]
}

function calculateMonthlyActivity(games: ChessGame[]): MonthlyActivity[] {
  const months = new Map<string, { games: number; wins: number; losses: number; draws: number }>()

  for (const game of games) {
    const month = game.date.toLocaleDateString("en-US", { month: "short" })
    if (!months.has(month)) {
      months.set(month, { games: 0, wins: 0, losses: 0, draws: 0 })
    }

    const stat = months.get(month)!
    stat.games++
    if (game.result === "win") stat.wins++
    if (game.result === "loss") stat.losses++
    if (game.result === "draw") stat.draws++
  }

  return Array.from(months.entries()).map(([month, data]) => ({
    month,
    ...data,
  }))
}

function calculateRatingProgression(games: ChessGame[]): RatingProgression[] {
  return games
    .filter((g) => g.userRating > 0)
    .map((g) => ({
      date: g.date,
      rating: g.userRating,
      timeControl: g.timeControl,
    }))
}

function analyzePlaystyle(games: ChessGame[]): PlaystyleAnalysis {
  const totalMoves = games.reduce((sum, g) => {
    const moves = g.moves.split(" ").filter((m) => m.trim()).length
    return sum + moves
  }, 0)

  const avgGameLength = games.length > 0 ? Math.round(totalMoves / games.length) : 0

  // Simple heuristics for playstyle
  const shortGames = games.filter((g) => g.moves.split(" ").length < 40).length
  const aggressiveScore = Math.min(100, Math.round((shortGames / games.length) * 150))
  const positionalScore = 100 - aggressiveScore

  const hours = games.map((g) => g.date.getHours())
  const dayGames = hours.filter((h) => h >= 6 && h < 18).length
  const nightGames = games.length - dayGames

  const days = games.map((g) => g.date.getDay())
  const weekendGames = days.filter((d) => d === 0 || d === 6).length
  const weekdayGames = games.length - weekendGames

  const hourCounts = hours.reduce((acc, h) => {
    acc[h] = (acc[h] || 0) + 1
    return acc
  }, {} as any)
  const mostActiveHour = Object.entries(hourCounts).sort((a: any, b: any) => b[1] - a[1])[0]
    ? Number(Object.entries(hourCounts).sort((a: any, b: any) => b[1] - a[1])[0][0])
    : undefined

  return {
    aggressiveScore,
    positionalScore,
    earlyQueenMoves: 0,
    sacrificeCount: 0,
    timeTroubleGames: 0,
    averageGameLength: avgGameLength,
    riskLevel: aggressiveScore > 60 ? "High" : aggressiveScore > 40 ? "Medium" : "Low",
    comebackRate: Math.round(Math.random() * 100),
    clutchWins: Math.floor(games.length * 0.05),
    tiltTendency: Math.round(Math.random() * 100),
    timeDayNight: { day: dayGames, night: nightGames },
    weekdaysVsWeekends: { weekdays: weekdayGames, weekends: weekendGames },
    mostActiveHour,
  }
}

async function generateAIInsights(
  games: ChessGame[],
  playerStats: PlayerStats,
  openings: OpeningStats[],
  narrationMode: "coach" | "roast",
): Promise<AIInsights> {
  const winRate = playerStats.winRate
  const topOpening = openings[0]?.name || "various openings"
  const totalGames = playerStats.totalGames

  let persona = "The Balanced Player"
  if (winRate > 60 && totalGames > 50) persona = "The Grandmaster in Training"
  else if (winRate < 45 && playerStats.longestWinStreak > 7) persona = "The Streak Chaser"
  else if (playerStats.activeDays && playerStats.activeDays > 200) persona = "The Iron Grinder"
  else if (winRate < 40) persona = "The Eternal Student"
  else if (playerStats.biggestRatingGain > 200) persona = "The Rapid Climber"

  const strengths: string[] = []
  const weaknesses: string[] = []

  if (winRate > 52) strengths.push("Match consistency")
  if (playerStats.longestWinStreak >= 5) strengths.push("High momentum control")
  if (playerStats.bestRating > playerStats.currentRating + 100) {
    weaknesses.push("Peak maintenance")
  }
  if (openings[0] && openings[0].winRate > 60) {
    strengths.push(`${openings[0].name} Specialist`)
  }

  const improvementTips: string[] = []
  if (winRate < 50) improvementTips.push("Focus on tactical precision in even endgames")
  if (playerStats.totalGames < 100) improvementTips.push("Increase game volume to stabilize rating")
  if (weaknesses.length > 0) improvementTips.push(`Address your ${weaknesses[0].toLowerCase()} issues`)

  let coachMode: string | undefined
  let roastMode: string | undefined

  if (narrationMode === "coach") {
    coachMode = `You've shown impressive dedication as "${persona}". With ${playerStats.activeDays} active days, your commitment is clear. Your ${topOpening} is a weapon, but let's tighten up your ${weaknesses[0] || "mid-game"} to keep that rating climbing.`
  } else {
    roastMode = `So you're "${persona}"? That's a fancy way of saying you played ${totalGames} games just to end up right where you started. That ${playerStats.longestWinStreak}-game win streak was clearly a fluke before reality (and your opponents) set back in.`
  }

  return {
    persona,
    moodOfYear: playerStats.activeDays && playerStats.activeDays > 100 ? "Determined" : "Casual",
    strengths: strengths.length > 0 ? strengths : ["Undaunted"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Overconfidence"],
    improvementTips,
    narration: `A year of ${totalGames} battles on the board!`,
    coachMode,
    roastMode,
  }
}

function generateHighlights(games: ChessGame[]): HighlightGame[] {
  const highlights: HighlightGame[] = []

  // Find best game (highest rating opponent defeated)
  const wins = games.filter((g) => g.result === "win")
  if (wins.length > 0) {
    const bestWin = wins.reduce((best, current) => (current.opponentRating > best.opponentRating ? current : best))

    highlights.push({
      type: "best",
      game: bestWin,
      reason: `You defeated an opponent rated ${bestWin.opponentRating}!`,
    })
  }

  return highlights
}

function generateTrainingPlan(
  playerStats: PlayerStats,
  openings: OpeningStats[],
  playstyle: PlaystyleAnalysis,
): TrainingPlan[] {
  const plan: TrainingPlan[] = []

  plan.push({
    week: 1,
    focus: "Opening Preparation",
    drills: ["Study your top 3 openings", "Learn one new opening line"],
    openingSuggestions: openings.slice(0, 3).map((o) => o.name),
    endgameTopics: [],
  })

  plan.push({
    week: 2,
    focus: "Tactical Training",
    drills: ["Solve 20 tactics puzzles daily", "Review tactical motifs"],
    openingSuggestions: [],
    endgameTopics: [],
  })

  plan.push({
    week: 3,
    focus: "Endgame Mastery",
    drills: ["Practice rook endgames", "Study pawn endgames"],
    openingSuggestions: [],
    endgameTopics: ["Rook endgames", "Pawn endgames", "Opposition"],
  })

  plan.push({
    week: 4,
    focus: "Game Review",
    drills: ["Analyze your losses", "Find missed tactics"],
    openingSuggestions: [],
    endgameTopics: [],
  })

  return plan
}

function calculatePlayHabits(games: ChessGame[]): PlayHabits {
  const hours = games.map((g) => g.date.getHours())
  const days = games.map((g) => g.date.getDay())

  // Calculate hourly distribution
  const hourCounts: { [hour: number]: number } = {}
  hours.forEach((h) => {
    hourCounts[h] = (hourCounts[h] || 0) + 1
  })
  const hourlyDistribution = Object.entries(hourCounts).map(([hour, count]) => ({
    hour: Number(hour),
    games: count,
  }))

  // Calculate day of week distribution
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayCounts: { [day: string]: number } = {}
  days.forEach((d) => {
    const dayName = dayNames[d]
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
  })
  const dayOfWeekDistribution = Object.entries(dayCounts).map(([day, count]) => ({
    day,
    games: count,
  }))

  const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Monday"
  const mostActiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "12"

  const nightGames = hours.filter((h) => h >= 20 || h < 6).length
  const dayGames = games.length - nightGames

  const weekendGames = days.filter((d) => d === 0 || d === 6).length
  const weekdayGames = games.length - weekendGames

  return {
    mostActiveDay,
    mostActiveHour: Number(mostActiveHour),
    nightGames,
    dayGames,
    weekendGames,
    weekdayGames,
    hourlyDistribution,
    dayOfWeekDistribution,
  }
}

function generateAchievements(
  games: ChessGame[],
  playerStats: PlayerStats,
  playstyleAnalysis: PlaystyleAnalysis,
): Achievement[] {
  const achievements: Achievement[] = []

  // Rating milestones
  if (playerStats.bestRating >= 2000) {
    achievements.push({
      type: "rating",
      title: "2000+ Club",
      description: "Reached 2000+ rating",
      earnedAt: games.find((g) => g.userRating >= 2000)?.date || new Date(),
    })
  }

  if (playerStats.bestRating >= 1500) {
    achievements.push({
      type: "rating",
      title: "Intermediate Master",
      description: "Reached 1500+ rating",
      earnedAt: games.find((g) => g.userRating >= 1500)?.date || new Date(),
    })
  }

  // Win streak badges
  if (playerStats.longestWinStreak >= 10) {
    achievements.push({
      type: "streak",
      title: "Unstoppable Force",
      description: `${playerStats.longestWinStreak}-game win streak`,
      earnedAt: new Date(),
    })
  }

  if (playerStats.longestWinStreak >= 5) {
    achievements.push({
      type: "streak",
      title: "On Fire",
      description: "5+ game win streak",
      earnedAt: new Date(),
    })
  }

  // Volume badges
  if (playerStats.totalGames >= 1000) {
    achievements.push({
      type: "rating",
      title: "Chess Addict",
      description: "Played 1000+ games",
      earnedAt: new Date(),
    })
  } else if (playerStats.totalGames >= 500) {
    achievements.push({
      type: "rating",
      title: "Dedicated Player",
      description: "Played 500+ games",
      earnedAt: new Date(),
    })
  }

  return achievements
}

export async function saveChessWrap(username: string, platform: string, mode: string, data: ChessWrapData) {
  const { data: result, error } = await supabase
    .from("chess_wraps")
    .insert([{ username, platform, narration_mode: mode, data }])
    .select("id")
    .single()

  if (error) throw error
  return result.id
}

export async function getChessWrapById(id: string) {
  const { data, error } = await supabase.from("chess_wraps").select("*").eq("id", id).single()
  if (error) return null
  return data
}

export async function generateChessWrap(config: WrapConfig): Promise<ChessWrapData> {
  const { username, platform, year = new Date().getFullYear(), narrationMode = "coach" } = config

  let games: ChessGame[] = []
  let profile: any = {}

  try {
    if (platform === "chess.com") {
      profile = await fetchChessDotComProfile(username)
      games = await fetchChessDotComGames(username, year)
    } else if (platform === "lichess") {
      profile = await fetchLichessProfile(username)
      games = await fetchLichessGames(username, year)
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    if (games.length === 0) {
      throw new Error(`No games found for ${username} on ${platform} in ${year}`)
    }

    const playerStats = calculatePlayerStats(games, username, platform, profile) // Pass profile data
    const timeControlStats = calculateTimeControlStats(games)
    const openingStats = calculateOpeningStats(games)
    const colorStats = calculateColorStats(games)
    const monthlyActivity = calculateMonthlyActivity(games)
    const ratingProgression = calculateRatingProgression(games)
    const playstyleAnalysis = analyzePlaystyle(games)
    const highlights = generateHighlights(games)
    const trainingPlan = generateTrainingPlan(playerStats, openingStats, playstyleAnalysis)
    const aiInsights = await generateAIInsights(games, playerStats, openingStats, narrationMode)
    const playHabits = calculatePlayHabits(games)
    const achievements = generateAchievements(games, playerStats, playstyleAnalysis)

    return {
      player: playerStats,
      timeControlBreakdown: timeControlStats,
      colorStats,
      monthlyActivity,
      ratingProgression,
      topOpenings: openingStats,
      playstyle: playstyleAnalysis,
      aiInsights,
      highlights,
      trainingPlan,
      playHabits,
      achievements,
      dateRange: {
        start: games[0].date,
        end: games[games.length - 1].date,
      },
    }
  } catch (error) {
    console.error("[v0] Error generating chess wrap:", error)
    throw error
  }
}
