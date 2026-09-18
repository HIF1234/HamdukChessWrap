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
  ActivityStats,
} from "./types"
import { createBrowserClient } from "@supabase/ssr"
import ecoCodesData from "./eco-codes.json"
import { analyzeGameWithEngine } from "./engine-analysis"
import { computeTacticalStats } from "./pgn-analysis"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Load ECO codes mapping
const ECO_CODES: Record<string, string> = ecoCodesData

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

            // Extract ECO code and opening from PGN
            const ecoCode = extractEcoCode(game.pgn)
            const openingName = ecoCode ? getOpeningFromEco(ecoCode) : extractOpening(game.pgn) || "Unknown Opening"
            
            // Calculate move count
            const moveCount = (game.pgn.match(/\d+\./g) || []).length

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
              opening: openingName,
              termination: game.pgn.includes("checkmate") ? "checkmate" : "resignation",
              pgn: game.pgn,
              userColor,
              userRating,
              opponentRating,
              ecoCode,
              moveCount,
              rated: game.rated !== false,
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

// Calculate detailed time control statistics
export function calculateTimeControlStats(games: ChessGame[]): TimeControlStats[] {
  const timeControls: Record<TimeControl, TimeControlStats> = {
    bullet: { timeControl: "bullet", games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
    blitz: { timeControl: "blitz", games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
    rapid: { timeControl: "rapid", games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
    classical: { timeControl: "classical", games: 0, wins: 0, losses: 0, draws: 0, winRate: 0, averageRating: 0 },
  }

  const ratingTracking: Record<TimeControl, number[]> = {
    bullet: [],
    blitz: [],
    rapid: [],
    classical: [],
  }

  // Process each game
  for (const game of games) {
    const tc = timeControls[game.timeControl]
    tc.games++

    if (game.result === "win") tc.wins++
    else if (game.result === "loss") tc.losses++
    else tc.draws++

    ratingTracking[game.timeControl].push(game.userRating)
  }

  // Calculate statistics for each time control
  for (const tc of Object.values(timeControls)) {
    if (tc.games > 0) {
      tc.winRate = (tc.wins / tc.games) * 100
      const ratings = ratingTracking[tc.timeControl]
      tc.averageRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
      tc.highestRating = Math.max(...ratings)
    }
  }

  return Object.values(timeControls).filter((tc) => tc.games > 0)
}

// Calculate rating progression with start/end ratings
export function calculateRatingProgression(games: ChessGame[]): { start: number; end: number; gain: number } {
  if (games.length === 0) {
    return { start: 0, end: 0, gain: 0 }
  }

  const sortedByDate = [...games].sort((a, b) => a.date.getTime() - b.date.getTime())
  const startRating = sortedByDate[0].userRating
  const endRating = sortedByDate[sortedByDate.length - 1].userRating
  const gain = endRating - startRating

  return { start: startRating, end: endRating, gain }
}

// Get rating progression timeline
export function getRatingTimeline(games: ChessGame[]): RatingProgression[] {
  const progressionMap = new Map<string, RatingProgression>()

  // Group games by date and track rating changes
  const sortedGames = [...games].sort((a, b) => a.date.getTime() - b.date.getTime())

  for (const game of sortedGames) {
    const dateStr = game.date.toISOString().split("T")[0]
    const key = `${dateStr}-${game.timeControl}`

    if (!progressionMap.has(key) || progressionMap.get(key)!.rating < game.userRating) {
      progressionMap.set(key, {
        date: game.date,
        rating: game.userRating,
        timeControl: game.timeControl,
      })
    }
  }

  return Array.from(progressionMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Get highest rated opponent per time control
export function getHighestRatedWin(games: ChessGame[]): { opponent: string; rating: number; timeControl: TimeControl } | null {
  const wins = games.filter((g) => g.result === "win")
  if (wins.length === 0) return null

  let best = wins[0]
  for (const game of wins) {
    if (game.opponentRating > best.opponentRating) {
      best = game
    }
  }

  return {
    opponent: best.userColor === "white" ? best.black : best.white,
    rating: best.opponentRating,
    timeControl: best.timeControl,
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
        
        // Extract ECO code and opening
        const ecoCode = extractEcoCode(game.pgn || "")
        const openingName = ecoCode ? getOpeningFromEco(ecoCode) : (game.opening?.name || "Unknown Opening")
        
        // Calculate move count
        const moveCount = (game.pgn?.match(/\d+\./g) || []).length

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
          opening: openingName,
          termination: game.status || "normal",
          pgn: game.pgn || "",
          userColor,
          userRating,
          opponentRating,
          ecoCode,
          moveCount,
          rated: game.rated !== false,
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
  const openingNameMatch = pgn.match(/\[Opening "([^"]+)"\]/)
  if (openingNameMatch) return openingNameMatch[1]

  const openingMatch = pgn.match(/\[ECO "([^"]+)"\]/)
  if (openingMatch) return openingMatch[1]

  return "Unknown Opening"
}

// Helper function to extract ECO code from PGN
function extractEcoCode(pgn: string): string | undefined {
  const ecoMatch = pgn.match(/\[ECO "([^"]+)"\]/)
  return ecoMatch ? ecoMatch[1] : undefined
}

// ECO Code to Human Readable Opening Name - now uses the complete eco-codes.json
const ECO_TO_OPENING: Record<string, string> = ECO_CODES

function getOpeningName(ecoCode?: string): string {
  if (!ecoCode) return "Unknown Opening"
  
  // Check for exact match
  if (ECO_TO_OPENING[ecoCode]) return ECO_TO_OPENING[ecoCode]
  
  // Check for range match (first 2 chars)
  const prefix = ecoCode.substring(0, 3)
  if (ECO_TO_OPENING[prefix]) return ECO_TO_OPENING[prefix]
  
  return ecoCode
}

// Detect gambits from opening
function isGambit(opening: string, ecoCode?: string): boolean {
  const gambitKeywords = [
    "gambit",
    "sacrifice",
    "evan's",
    "king's gambit",
    "queen's gambit",
    "danish",
    "acceptance",
    "declined",
  ]

  const lowerOpening = opening.toLowerCase()
  return (
    gambitKeywords.some((keyword) => lowerOpening.includes(keyword)) ||
    Boolean(ecoCode && (ecoCode.startsWith("C3") || ecoCode.startsWith("C4") || ecoCode.startsWith("C5")))
  )
}

// Get opening name from ECO code
function getOpeningFromEco(ecoCode?: string): string {
  if (!ecoCode) return "Unknown Opening"
  return ECO_CODES[ecoCode] || ecoCode
}

// Calculate comeback rate (wins after losses in sequence)
function calculateComebackRate(games: ChessGame[]): number {
  if (games.length < 2) return 0
  
  let comebackWins = 0
  let comebackOpportunities = 0
  
  for (let i = 1; i < games.length; i++) {
    if (games[i - 1].result === "loss") {
      comebackOpportunities++
      if (games[i].result === "win") {
        comebackWins++
      }
    }
  }
  
  return comebackOpportunities > 0 ? (comebackWins / comebackOpportunities) * 100 : 0
}

// Calculate clutch wins (wins when opponent is higher rated)
function calculateClutchWins(games: ChessGame[]): number {
  let clutchWins = 0
  
  for (const game of games) {
    if (game.result === "win" && game.opponentRating > game.userRating) {
      clutchWins++
    }
  }
  
  return clutchWins
}

// Calculate tilt tendency (losing streak frequency and severity)
function calculateTiltTendency(games: ChessGame[]): number {
  let maxLossStreak = 0
  let currentStreak = 0
  let totalStreaks = 0
  
  for (const game of games) {
    if (game.result === "loss") {
      currentStreak++
      maxLossStreak = Math.max(maxLossStreak, currentStreak)
    } else {
      if (currentStreak > 0) totalStreaks++
      currentStreak = 0
    }
  }
  
  // Tilt tendency score: higher streaks + more frequent streaks = higher tilt tendency
  const streakSeverity = (maxLossStreak / 10) * 50 // Max 50 points
  const streakFrequency = (totalStreaks / (games.length / 10)) * 50 // Max 50 points
  
  return Math.min(100, streakSeverity + streakFrequency)
}

// Calculate achievements based on milestones
function calculateAchievements(games: ChessGame[], stats: PlayerStats, playstyle: PlaystyleAnalysis): Achievement[] {
  const achievements: Achievement[] = []
  
  // Rating milestones
  if (stats.currentRating >= 2000) {
    achievements.push({
      type: "rating",
      title: "Master Level",
      description: "Reached 2000+ rating",
      earnedAt: new Date(),
    })
  }
  if (stats.currentRating >= 1800) {
    achievements.push({
      type: "rating",
      title: "Expert",
      description: "Reached 1800+ rating",
      earnedAt: new Date(),
    })
  }
  
  // Win streak badges
  if (stats.longestWinStreak >= 10) {
    achievements.push({
      type: "streak",
      title: "Unstoppable",
      description: `${stats.longestWinStreak} game win streak`,
      earnedAt: new Date(),
    })
  }
  if (stats.longestWinStreak >= 5) {
    achievements.push({
      type: "streak",
      title: "Hot Hand",
      description: `${stats.longestWinStreak} game win streak`,
      earnedAt: new Date(),
    })
  }
  
  // Accuracy badges
  if (playstyle.averageAccuracy && playstyle.averageAccuracy >= 90) {
    achievements.push({
      type: "accuracy",
      title: "Precision Master",
      description: `${Math.round(playstyle.averageAccuracy)}% average accuracy`,
      earnedAt: new Date(),
    })
  }
  
  return achievements
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

function calculateOpeningStats(games: ChessGame[]): OpeningStats[] {
  const stats = new Map<
    string,
    {
      name: string
      games: number
      wins: number
      losses: number
      draws: number
      ecoCode?: string
      asWhite?: number
      asBlack?: number
      isGambit?: boolean
    }
  >()

  for (const game of games) {
    const ecoCode = extractEcoCode(game.pgn)
    const opening = game.opening || getOpeningName(ecoCode) || "Unknown Opening"
    
    if (!stats.has(opening)) {
      stats.set(opening, {
        name: opening,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        ecoCode,
        asWhite: 0,
        asBlack: 0,
        isGambit: isGambit(opening, ecoCode),
      })
    }

    const stat = stats.get(opening)!
    stat.games++
    if (game.result === "win") stat.wins++
    if (game.result === "loss") stat.losses++
    if (game.result === "draw") stat.draws++
    
    if (game.userColor === "white") {
      stat.asWhite = (stat.asWhite || 0) + 1
    } else {
      stat.asBlack = (stat.asBlack || 0) + 1
    }
  }

  return Array.from(stats.values())
    .map((data) => ({
      ...data,
      winRate: Math.round((data.wins / data.games) * 1000) / 10,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 10)
}

// Real Stockfish accuracy/blunder analysis is expensive (each position needs
// an engine search), so we only run it over a bounded, representative sample
// of the season rather than every game, then scale the counts up to the full
// season size. `gamesAnalyzed` on the result tells the UI how big that sample
// was so it can be honest about it instead of implying an exhaustive review.
const MAX_GAMES_TO_ANALYZE = 12

function pickAnalysisSample(games: ChessGame[]): ChessGame[] {
  const priorityIds = new Set<string>()

  const highestRatedWin = games
    .filter((g) => g.result === "win")
    .sort((a, b) => b.opponentRating - a.opponentRating)[0]
  if (highestRatedWin) priorityIds.add(highestRatedWin.id)

  const worstLoss = games
    .filter((g) => g.result === "loss")
    .sort((a, b) => a.opponentRating - b.opponentRating)[0]
  if (worstLoss) priorityIds.add(worstLoss.id)

  const remainingSlots = Math.max(0, MAX_GAMES_TO_ANALYZE - priorityIds.size)
  if (remainingSlots > 0) {
    const step = Math.max(1, Math.floor(games.length / remainingSlots))
    for (let i = 0; i < games.length && priorityIds.size < MAX_GAMES_TO_ANALYZE; i += step) {
      priorityIds.add(games[i].id)
    }
  }

  return games.filter((g) => priorityIds.has(g.id))
}

async function calculateGameQualityMetrics(games: ChessGame[]): Promise<{
  averageAccuracy: number
  totalBlunders: number
  totalMistakes: number
  totalInaccuracies: number
  averageACPL: number
  gamesAnalyzed: number
}> {
  const empty = { averageAccuracy: 0, totalBlunders: 0, totalMistakes: 0, totalInaccuracies: 0, averageACPL: 0, gamesAnalyzed: 0 }
  if (games.length === 0) return empty

  const sample = pickAnalysisSample(games)

  let accuracySum = 0
  let acplSum = 0
  let blunderSum = 0
  let mistakeSum = 0
  let inaccuracySum = 0
  let analyzed = 0

  for (const game of sample) {
    if (!game.pgn) continue
    let result: Awaited<ReturnType<typeof analyzeGameWithEngine>> = null
    try {
      result = await analyzeGameWithEngine(game.pgn, game.userColor)
    } catch (error) {
      console.error("[v0] Engine analysis failed for game", game.id, error)
    }
    if (!result) continue

    accuracySum += result.accuracy
    acplSum += result.acpl
    blunderSum += result.blunders
    mistakeSum += result.mistakes
    inaccuracySum += result.inaccuracies
    analyzed++
  }

  if (analyzed === 0) return empty

  const scale = games.length / analyzed

  return {
    averageAccuracy: Math.round((accuracySum / analyzed) * 10) / 10,
    averageACPL: Math.round((acplSum / analyzed) * 10) / 10,
    totalBlunders: Math.round((blunderSum / analyzed) * scale),
    totalMistakes: Math.round((mistakeSum / analyzed) * scale),
    totalInaccuracies: Math.round((inaccuracySum / analyzed) * scale),
    gamesAnalyzed: analyzed,
  }
}

// Calculate performance highlights
function calculatePerformanceHighlights(games: ChessGame[]): {
  longestWinStreak: number
  longestLosingStreak: number
  fastestWin: { moves: number; game: ChessGame } | null
  longestGame: { moves: number; game: ChessGame } | null
  shortestGame: { moves: number; game: ChessGame } | null
  mostMovesGame: { moves: number; game: ChessGame } | null
  mostTimeGame: { game: ChessGame; duration: number } | null
} {
  let maxWinStreak = 0
  let currentWinStreak = 0
  let maxLossStreak = 0
  let currentLossStreak = 0

  let fastestWinMoves = Infinity
  let fastestWinGame: ChessGame | null = null

  let longestGameMoves = 0
  let longestGameObj: ChessGame | null = null

  let shortestGameMoves = Infinity
  let shortestGameObj: ChessGame | null = null

  let mostMovesCount = 0
  let mostMovesGame: ChessGame | null = null

  let maxGameTime = 0
  let maxTimeGame: ChessGame | null = null

  for (const game of games) {
    // Track win/loss streaks
    if (game.result === "win") {
      currentWinStreak++
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak)
      currentLossStreak = 0
    } else if (game.result === "loss") {
      currentLossStreak++
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak)
      currentWinStreak = 0
    } else {
      // Draw resets both streaks
      currentWinStreak = 0
      currentLossStreak = 0
    }

    // Extract move count from PGN
    const moveCount = extractMoveCount(game.pgn)

    // Track fastest win
    if (game.result === "win" && moveCount < fastestWinMoves) {
      fastestWinMoves = moveCount
      fastestWinGame = game
    }

    // Track longest and shortest games
    if (moveCount > longestGameMoves) {
      longestGameMoves = moveCount
      longestGameObj = game
    }

    if (moveCount < shortestGameMoves && moveCount > 0) {
      shortestGameMoves = moveCount
      shortestGameObj = game
    }

    // Track most moves in a game
    if (moveCount > mostMovesCount) {
      mostMovesCount = moveCount
      mostMovesGame = game
    }

    // Track most time spent in one game (estimate from move count)
    const estimatedTime = estimateGameDuration(moveCount, game.timeControl)
    if (estimatedTime > maxGameTime) {
      maxGameTime = estimatedTime
      maxTimeGame = game
    }
  }

  return {
    longestWinStreak: maxWinStreak,
    longestLosingStreak: maxLossStreak,
    fastestWin: fastestWinGame ? { moves: fastestWinMoves, game: fastestWinGame } : null,
    longestGame: longestGameObj ? { moves: longestGameMoves, game: longestGameObj } : null,
    shortestGame: shortestGameObj ? { moves: shortestGameMoves, game: shortestGameObj } : null,
    mostMovesGame: mostMovesGame ? { moves: mostMovesCount, game: mostMovesGame } : null,
    mostTimeGame: maxTimeGame ? { game: maxTimeGame, duration: maxGameTime } : null,
  }
}

// Extract move count from PGN
function extractMoveCount(pgn: string): number {
  // Find the move count from the end of PGN (format: "1. e4 e5 2. ...")
  const movesMatch = pgn.match(/(\d+)\.\s+\S+/)
  if (!movesMatch) return 0

  // Count the total moves (rough estimate: count all space-separated tokens after first move)
  const movesSection = pgn.split("\n\n").pop() || ""
  const moves = movesSection.split(/\s+/).filter((m) => !m.includes(".") && m.length > 1)
  return Math.ceil(moves.length / 2) // Each full round has 2 half-moves
}

// Estimate game duration in minutes
function estimateGameDuration(moveCount: number, timeControl: TimeControl): number {
  const averageMoveTime: Record<TimeControl, number> = {
    bullet: 0.5,
    blitz: 1.5,
    rapid: 3,
    classical: 5,
  }

  return moveCount * averageMoveTime[timeControl]
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

const MILESTONE_THRESHOLDS = [100, 250, 500, 1000, 1500, 2000, 5000, 10000]

// Real activity stats — all counted directly from the fetched games, nothing estimated.
function calculateActivityStats(games: ChessGame[]): ActivityStats {
  const dayCount = new Map<string, number>()
  for (const game of games) {
    const key = game.date.toDateString()
    dayCount.set(key, (dayCount.get(key) || 0) + 1)
  }

  let mostActiveDay: ActivityStats["mostActiveDay"] = null
  for (const [dateStr, count] of dayCount.entries()) {
    if (!mostActiveDay || count > mostActiveDay.games) {
      mostActiveDay = { date: dateStr, games: count }
    }
  }

  const monthCount = new Map<string, number>()
  for (const game of games) {
    const month = game.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    monthCount.set(month, (monthCount.get(month) || 0) + 1)
  }
  let quietestMonth: string | null = null
  let quietestMonthGames = Infinity
  for (const [month, count] of monthCount.entries()) {
    if (count < quietestMonthGames) {
      quietestMonthGames = count
      quietestMonth = month
    }
  }

  const sortedByDate = [...games].sort((a, b) => a.date.getTime() - b.date.getTime())
  const milestoneGames = MILESTONE_THRESHOLDS.filter((n) => n <= sortedByDate.length).map((milestone) => ({
    milestone,
    date: sortedByDate[milestone - 1].date,
  }))

  const totalMovesPlayed = games.reduce((sum, g) => sum + (g.moveCount || 0), 0)
  const ratedGames = games.filter((g) => g.rated !== false).length
  const casualGames = games.length - ratedGames

  return {
    mostActiveDay,
    quietestMonth,
    quietestMonthGames: quietestMonth ? quietestMonthGames : 0,
    milestoneGames,
    totalMovesPlayed,
    ratedGames,
    casualGames,
  }
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

async function generateAIInsights(
  games: ChessGame[],
  playerStats: PlayerStats,
  openings: OpeningStats[],
  narrationMode: "coach" | "roast" | "neutral",
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

  if (narrationMode === "roast") {
    roastMode = `So you're "${persona}"? That's a fancy way of saying you played ${totalGames} games just to end up right where you started. That ${playerStats.longestWinStreak}-game win streak was clearly a fluke before reality (and your opponents) set back in.`
  } else {
    coachMode = `You've shown impressive dedication as "${persona}". With ${playerStats.activeDays} active days, your commitment is clear. Your ${topOpening} is a weapon, but let's tighten up your ${weaknesses[0] || "mid-game"} to keep that rating climbing.`
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
    const gameUrl = bestWin.id.includes("http") ? bestWin.id : `https://www.chess.com/game/live/${bestWin.id}`

    highlights.push({
      type: "best",
      game: { ...bestWin, gameUrl },
      reason: `A masterpiece! You defeated an opponent rated ${bestWin.opponentRating} with precision!`,
    })
  }

  // Find longest game
  const sortedByLength = [...games].sort((a, b) => (b.moveCount || 0) - (a.moveCount || 0))
  if (sortedByLength.length > 0) {
    const longestGame = sortedByLength[0]
    const gameUrl = longestGame.id.includes("http") ? longestGame.id : `https://www.chess.com/game/live/${longestGame.id}`
    highlights.push({
      type: "longest",
      game: { ...longestGame, gameUrl },
      reason: `Your longest battle - ${longestGame.moveCount || 0} moves of intense chess!`,
    })
  }

  // Find fastest win
  const fastWins = wins.sort((a, b) => (a.moveCount || Infinity) - (b.moveCount || Infinity))
  if (fastWins.length > 0) {
    const fastest = fastWins[0]
    const gameUrl = fastest.id.includes("http") ? fastest.id : `https://www.chess.com/game/live/${fastest.id}`
    highlights.push({
      type: "fastest",
      game: { ...fastest, gameUrl },
      reason: `Lightning quick! Victory in just ${fastest.moveCount || 0} moves!`,
    })
  }

  // Find most moves game
  if (sortedByLength.length > 1) {
    const mostMoves = sortedByLength[0]
    const gameUrl = mostMoves.id.includes("http") ? mostMoves.id : `https://www.chess.com/game/live/${mostMoves.id}`
    highlights.push({
      type: "most_moves",
      game: { ...mostMoves, gameUrl },
      reason: `Your battle of endurance - ${mostMoves.moveCount || 0} moves!`,
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
    const ratingProgression = getRatingTimeline(games)
    const playstyleAnalysis = await analyzePlaystyle(games)
    const highlights = generateHighlights(games)
    const trainingPlan = generateTrainingPlan(playerStats, openingStats, playstyleAnalysis)
    const aiInsights = await generateAIInsights(games, playerStats, openingStats, narrationMode)
    const playHabits = calculatePlayHabits(games)
    const achievements = generateAchievements(games, playerStats, playstyleAnalysis)
    const tacticalStats = computeTacticalStats(games)
    const activityStats = calculateActivityStats(games)

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
      tacticalStats,
      activityStats,
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

// Analyze playstyle
async function analyzePlaystyle(games: ChessGame[]): Promise<PlaystyleAnalysis> {
  const totalMoves = games.reduce((sum, g) => {
    const moves = g.moves.split(" ").filter((m) => m.trim()).length
    return sum + moves
  }, 0)

  const avgGameLength = games.length > 0 ? Math.round(totalMoves / games.length) : 0

  // Simple heuristics for playstyle
  const shortGames = games.filter((g) => g.moves.split(" ").length < 40).length
  const aggressiveScore = Math.min(100, Math.round((shortGames / games.length) * 150))
  const positionalScore = 100 - aggressiveScore

  // Get game quality metrics
  const qualityMetrics = await calculateGameQualityMetrics(games)

  return {
    aggressiveScore,
    positionalScore,
    earlyQueenMoves: 0,
    sacrificeCount: 0,
    timeTroubleGames: 0,
    averageGameLength: avgGameLength,
    riskLevel: aggressiveScore > 60 ? "High" : aggressiveScore > 40 ? "Medium" : "Low",
    comebackRate: Math.round(calculateComebackRate(games) * 10) / 10,
    clutchWins: calculateClutchWins(games),
    tiltTendency: Math.round(calculateTiltTendency(games) * 10) / 10,
    averageAccuracy: qualityMetrics.averageAccuracy,
    totalBlunders: qualityMetrics.totalBlunders,
    totalMistakes: qualityMetrics.totalMistakes,
    totalInaccuracies: qualityMetrics.totalInaccuracies,
    averageACPL: qualityMetrics.averageACPL,
    gamesAnalyzed: qualityMetrics.gamesAnalyzed,
  }
}

// Generate achievements
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
