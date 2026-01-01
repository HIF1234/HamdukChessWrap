import type { ChessGame, WrapConfig, ChessWrapData } from "./types"

export async function fetchChessDotComGames(username: string, startDate: Date, endDate: Date): Promise<ChessGame[]> {
  // Mock implementation - will be replaced with actual API calls
  const games: ChessGame[] = []

  try {
    // Fetch archives for the date range
    const year = startDate.getFullYear()
    const month = String(startDate.getMonth() + 1).padStart(2, "0")

    const response = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${month}`)

    if (!response.ok) {
      throw new Error("Failed to fetch games")
    }

    const data = await response.json()

    // Process games and filter by date range
    // This is a simplified version - actual implementation would process all months

    return games
  } catch (error) {
    console.error("Error fetching Chess.com games:", error)
    return []
  }
}

export async function fetchLichessGames(username: string, startDate: Date, endDate: Date): Promise<ChessGame[]> {
  const games: ChessGame[] = []

  try {
    const since = Math.floor(startDate.getTime() / 1000)
    const until = Math.floor(endDate.getTime() / 1000)

    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?since=${since}&until=${until}&pgnInJson=true`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch games")
    }

    // Process NDJSON stream
    // This is a simplified version

    return games
  } catch (error) {
    console.error("Error fetching Lichess games:", error)
    return []
  }
}

export async function generateChessWrap(config: WrapConfig): Promise<ChessWrapData | null> {
  const { username, platform, narrationMode } = config // destructure narrationMode

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

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
      start: new Date(2025, 0, 1),
      end: new Date(2025, 11, 31),
    },
  }

  return mockData
}
