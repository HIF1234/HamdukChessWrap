export type Platform = "chess.com" | "lichess" | "pgn"

export type TimeControl = "bullet" | "blitz" | "rapid" | "classical"

export type GameResult = "win" | "loss" | "draw"

export interface ChessGame {
  id: string
  date: Date
  white: string
  black: string
  result: GameResult
  timeControl: TimeControl
  whiteRating: number
  blackRating: number
  moves: string
  opening: string
  termination: string
  pgn: string
  userColor: "white" | "black"
  userRating: number
  opponentRating: number
  accuracy?: number // Added accuracy field for game quality
  moveCount?: number // Added move count for game length analysis
  ecoCode?: string // Added ECO code for opening classification
  rated?: boolean // Real "rated" flag from Chess.com/Lichess API
}

export interface PlayerStats {
  username: string
  platform: Platform
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
  bestRating: number
  currentRating: number
  longestWinStreak: number
  biggestRatingGain: number
  accountAge?: string
  country?: string
  title?: string
  activeDays?: number
  mostActiveMonth?: string
  longestStreakDays?: number
  firstGameDate?: Date
  lastGameDate?: Date
  bestWin?: { opponent: string; rating: number; date: Date }
  worstLoss?: { opponent: string; rating: number; date: Date }
  longestLosingStreak?: number
  // Added comprehensive stats from requirements
  fastestWin?: { moves: number; time: string }
  longestGame?: { moves: number; duration: string }
  shortestGame?: { moves: number }
  uniqueOpponents?: number
  mostPlayedOpponent?: { name: string; games: number; wins: number; losses: number; draws: number }
}

export interface TimeControlStats {
  timeControl: TimeControl
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageRating: number
  highestRating?: number // Added highest rating per time control
}

export interface OpeningStats {
  name: string
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  ecoCode?: string // Added ECO code
  asWhite?: number // Games played as white with this opening
  asBlack?: number // Games played as black with this opening
  isGambit?: boolean // Whether this opening is classified as a gambit
}

// Real first-move breakdown as White, parsed directly from each game's PGN.
export interface FirstMoveStat {
  move: string
  games: number
  winRate: number
}

export interface ColorStats {
  color: "white" | "black"
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  favoriteOpening?: string // Added favorite opening per color
}

export interface MonthlyActivity {
  month: string
  games: number
  wins: number
  losses: number
  draws: number
}

// Added new interface for time-based play habits
export interface PlayHabits {
  mostActiveDay: string
  mostActiveHour: number
  nightGames: number // 8PM - 6AM
  dayGames: number
  weekendGames: number
  weekdayGames: number
  hourlyDistribution: { hour: number; games: number }[]
  dayOfWeekDistribution: { day: string; games: number }[]
}

export interface RatingProgression {
  date: Date
  rating: number
  timeControl: TimeControl
}

export interface PlaystyleAnalysis {
  aggressiveScore: number
  positionalScore: number
  averageGameLength: number
  riskLevel: "Low" | "Medium" | "High"
  comebackRate: number
  clutchWins: number
  tiltTendency: number
  // Added game quality metrics (real Stockfish analysis over a sampled subset of games)
  averageAccuracy?: number
  averageACPL?: number
  totalBlunders?: number
  totalMistakes?: number
  totalInaccuracies?: number
  gamesAnalyzed?: number
}

export interface AIInsights {
  persona: string
  moodOfYear: string
  strengths: string[]
  weaknesses: string[]
  improvementTips: string[]
  narration: string
  coachMode?: string
  roastMode?: string
}

export interface HighlightGame {
  type: "best" | "worst" | "brilliant" | "fastest" | "longest" | "most_moves" | "most_time"
  game: ChessGame & { gameUrl?: string }
  reason: string
  keyPosition?: string
  criticalMove?: string
}

export interface TrainingPlan {
  week: number
  focus: string
  drills: string[]
  openingSuggestions: string[]
  endgameTopics: string[]
}

// Added new interface for achievements and milestones
export interface Achievement {
  type: "rating" | "streak" | "accuracy" | "opening" | "time_control"
  title: string
  description: string
  earnedAt: Date
  icon?: string
}

// Real activity stats counted directly from the fetched games (dates,
// rated flag, move counts already returned by the platform APIs).
export interface ActivityStats {
  mostActiveDay: { date: string; games: number } | null
  quietestMonth: string | null
  quietestMonthGames: number
  milestoneGames: { milestone: number; date: Date }[]
  totalMovesPlayed: number
  ratedGames: number
  casualGames: number
  bestWeek: { weekStart: string; winRate: number; games: number } | null
  worstWeek: { weekStart: string; winRate: number; games: number } | null
}

// Real opponent/rivalry stats, computed directly from fetched game results
// (no estimation).
export interface RivalryStats {
  nemesis: { name: string; games: number; wins: number; losses: number; draws: number } | null
  favoriteVictim: { name: string; games: number; wins: number; losses: number; draws: number } | null
  rival: { name: string; games: number; wins: number; losses: number; draws: number } | null
  highestRatedOpponentFaced: { name: string; rating: number } | null
  highestRatedOpponentBeaten: { name: string; rating: number } | null
  biggestUpsetWin: { opponent: string; ratingGap: number; opponentRating: number } | null
  biggestUpsetLoss: { opponent: string; ratingGap: number; opponentRating: number } | null
  revengeWins: number
}

// Real, zero-cost stats derived purely from legal-move search over each
// game's actual PGN (chess.js only — no engine, no paid API). See
// lib/pgn-analysis.ts.
export interface TacticalStats {
  totalPiecesCaptured: number
  totalChecksDelivered: number
  enPassantCaptures: number
  underpromotions: number
  fastestCheckmate: { moves: number; gameId: string } | null
  missedMateInOneByUser: number
  missedMateInOneByOpponent: number
  stalemateDraws: number
  threefoldDraws: number
  insufficientMaterialDraws: number
  fiftyMoveDraws: number
  shortDecisiveGames: number
  longestDrawStreak: number
  kingsideCastles: number
  queensideCastles: number
  uncastledGames: number
  avgCastlingMove: number | null
}

export interface ChessWrapData {
  player: PlayerStats
  timeControlBreakdown: TimeControlStats[]
  colorStats: ColorStats[]
  monthlyActivity: MonthlyActivity[]
  ratingProgression: RatingProgression[]
  topOpenings: OpeningStats[]
  playstyle: PlaystyleAnalysis
  aiInsights: AIInsights
  highlights: HighlightGame[]
  trainingPlan: TrainingPlan[]
  playHabits: PlayHabits // Added play habits
  achievements: Achievement[] // Added achievements
  tacticalStats: TacticalStats
  activityStats: ActivityStats
  rivalryStats: RivalryStats
  firstMoveStats: FirstMoveStat[]
  dateRange: {
    start: Date
    end: Date
  }
}

export interface WrapConfig {
  username: string
  platform: Platform
  year?: number
  startDate?: Date
  endDate?: Date
  narrationMode?: "coach" | "roast" | "neutral"
}
