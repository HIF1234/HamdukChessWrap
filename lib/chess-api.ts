import type { ChessGame, WrapConfig, ChessWrapData } from "./types"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function fetchChessDotComGames(username: string, startDate: Date, endDate: Date): Promise<ChessGame[]> {
  const games: ChessGame[] = []
  try {
    const year = 2025
    const months = ["10", "11", "12"]

    for (const month of months) {
      const response = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${month}`)
      if (response.ok) {
        const data = await response.json()
        games.push(...data.games)
      }
    }
    return games
  } catch (error) {
    console.error("[v0] Chess.com API error:", error)
    return []
  }
}

export async function fetchLichessGames(username: string, startDate: Date, endDate: Date): Promise<ChessGame[]> {
  try {
    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?since=${startDate.getTime()}&until=${endDate.getTime()}&max=100`,
      { headers: { Accept: "application/x-ndjson" } },
    )
    if (!response.ok) return []
    const text = await response.text()
    return text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
  } catch (error) {
    console.error("[v0] Lichess API error:", error)
    return []
  }
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
  const { username, platform, narrationMode } = config
  const startDate = new Date(2025, 0, 1)
  const endDate = new Date(2025, 11, 31)

  const rawGames =
    platform === "chess.com"
      ? await fetchChessDotComGames(username, startDate, endDate)
      : await fetchLichessGames(username, startDate, endDate)

  // Mock data generation for demo purposes
  const mockData: ChessWrapData = {
    player: {
      username,
      platform,
      totalGames: 1248,
      wins: 612,
      losses: 584,
      draws: 52,
      winRate: 49.0,
      bestRating: 1450,
      currentRating: 1420,
      longestWinStreak: 12,
      biggestRatingGain: 285,
    },
    timeControlBreakdown: [],
    colorStats: [],
    monthlyActivity: [],
    ratingProgression: [],
    topOpenings: [
      { name: "Sicilian Defense", games: 124, wins: 78, losses: 36, draws: 10, winRate: 62.9 },
      { name: "Ruy Lopez", games: 98, wins: 42, losses: 48, draws: 8, winRate: 42.8 },
      { name: "King's Gambit", games: 45, wins: 32, losses: 10, draws: 3, winRate: 71.1 },
    ],
    playstyle: {
      aggressiveScore: 82,
      positionalScore: 18,
      earlyQueenMoves: 45,
      sacrificeCount: 28,
      timeTroubleGames: 112,
      averageGameLength: 32,
    },
    aiInsights: {
      persona: "The Relentless Attacker",
      moodOfYear: "Chaotic Brilliance",
      strengths: ["Tactical vision", "Time pressure performance", "Dynamic pawn play"],
      weaknesses: ["Endgame precision", "Opening prep", "Impulsive decisions"],
      improvementTips: ["Study minor piece endgames", "Slow down in rapid games", "Learn the Caro-Kann"],
      narration: "Your year was a tactical masterclass (and some blunders).",
      coachMode:
        narrationMode === "coach"
          ? "You show incredible promise in tactical positions. Your win rate in the Sicilian is elite, but your endgame technique needs refinement. Focus on Rook endgames to bridge the gap to 1600."
          : undefined,
      roastMode:
        narrationMode === "roast"
          ? "You play chess like you're trying to speedrun a headache. Your 'aggressive' style is just a fancy word for hanging your queen in 40% of your games. Maybe try checkers?"
          : undefined,
    },
    highlights: [
      {
        type: "best",
        reason: "You found the brilliant Rook sacrifice that led to a mate in 4.",
        game: {
          opponent: "Stockfish_Slayer",
          date: "Nov 24, 2025",
          result: "win",
        },
      },
    ],
    trainingPlan: [
      {
        week: 1,
        focus: "Tactical Sharpness",
        drills: ["15 min Puzzle Rush daily", "Study Fork patterns", "Solve 5 Polgar mates"],
      },
      {
        week: 2,
        focus: "Endgame Fundamentals",
        drills: ["Master King + Pawn vs King", "Study Opposition", "Practice Lucena Position"],
      },
    ],
    dateRange: {
      start: startDate,
      end: endDate,
    },
  }

  return mockData
}
