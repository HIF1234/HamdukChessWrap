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

function calculatePlayerStats(games: ChessGame[], username: string, platform: string): PlayerStats {
  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length
  const winRate = games.length > 0 ? (wins / games.length) * 100 : 0

  const ratings = games.map((g) => g.userRating).filter((r) => r > 0)
  const bestRating = ratings.length > 0 ? Math.max(...ratings) : 0
  const currentRating = ratings.length > 0 ? ratings[ratings.length - 1] : 0

  // Calculate longest win streak
  let currentStreak = 0
  let longestStreak = 0
  for (const game of games) {
    if (game.result === "win") {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  // Calculate biggest rating gain
  let biggestGain = 0
  for (let i = 1; i < ratings.length; i++) {
    const gain = ratings[i] - ratings[i - 1]
    if (gain > biggestGain) biggestGain = gain
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
    longestWinStreak: longestStreak,
    biggestRatingGain: biggestGain,
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

  return {
    aggressiveScore,
    positionalScore,
    earlyQueenMoves: 0, // Would need deeper PGN parsing
    sacrificeCount: 0, // Would need deeper PGN parsing
    timeTroubleGames: 0, // Not available from basic API data
    averageGameLength: avgGameLength,
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

  // Generate persona based on real data
  let persona = "The Balanced Player"
  if (winRate > 60) persona = "The Dominator"
  else if (winRate < 40) persona = "The Resilient Fighter"
  else if (playerStats.longestWinStreak > 10) persona = "The Streaker"

  // Generate strengths and weaknesses based on actual stats
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (playerStats.winRate > 55) {
    strengths.push("Consistent performance")
  } else {
    weaknesses.push("Win rate needs improvement")
  }

  if (playerStats.longestWinStreak > 5) {
    strengths.push("Strong momentum when on a streak")
  }

  if (topOpening) {
    strengths.push(`Proficient in ${topOpening}`)
  }

  const improvementTips: string[] = []
  if (playerStats.winRate < 50) {
    improvementTips.push("Focus on converting winning positions")
  }
  if (openings.length < 3) {
    improvementTips.push("Expand your opening repertoire")
  }
  improvementTips.push("Review your losses to identify patterns")

  let coachMode: string | undefined
  let roastMode: string | undefined

  if (narrationMode === "coach") {
    coachMode = `Great work this year! You played ${playerStats.totalGames} games with a ${playerStats.winRate}% win rate. Your ${topOpening} is particularly strong. Focus on ${weaknesses[0] || "consistency"} to reach the next level.`
  } else {
    roastMode = `${playerStats.totalGames} games and you're still at ${playerStats.currentRating}? Your ${topOpening} needs work, and let's not talk about that ${playerStats.longestWinStreak}-game win streak that ended in spectacular fashion.`
  }

  return {
    persona,
    moodOfYear: games.length > 100 ? "Dedicated Grinder" : "Casual Enthusiast",
    strengths: strengths.length > 0 ? strengths : ["You showed up"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Room for growth"],
    improvementTips,
    narration: `You played ${playerStats.totalGames} games this year!`,
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

export async function generateChessWrap(config: WrapConfig): Promise<ChessWrapData | null> {
  const { username, platform, year = 2025, narrationMode = "coach" } = config

  try {
    // Fetch real games from the appropriate platform
    const games =
      platform === "chess.com" ? await fetchChessDotComGames(username, year) : await fetchLichessGames(username, year)

    if (!games || games.length === 0) {
      throw new Error("No games found for this user in 2025")
    }

    // Calculate all statistics from real data
    const playerStats = calculatePlayerStats(games, username, platform)
    const timeControlBreakdown = calculateTimeControlStats(games)
    const colorStats = calculateColorStats(games)
    const monthlyActivity = calculateMonthlyActivity(games)
    const ratingProgression = calculateRatingProgression(games)
    const topOpenings = calculateOpeningStats(games)
    const playstyle = analyzePlaystyle(games)
    const aiInsights = await generateAIInsights(games, playerStats, topOpenings, narrationMode)
    const highlights = generateHighlights(games)
    const trainingPlan = generateTrainingPlan(playerStats, topOpenings, playstyle)

    const wrapData: ChessWrapData = {
      player: playerStats,
      timeControlBreakdown,
      colorStats,
      monthlyActivity,
      ratingProgression,
      topOpenings,
      playstyle,
      aiInsights,
      highlights,
      trainingPlan,
      dateRange: {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      },
    }

    return wrapData
  } catch (error) {
    console.error("[v0] Failed to generate chess wrap:", error)
    return null
  }
}
