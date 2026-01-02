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
}

export interface TimeControlStats {
  timeControl: TimeControl
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageRating: number
}

export interface OpeningStats {
  name: string
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface ColorStats {
  color: "white" | "black"
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface MonthlyActivity {
  month: string
  games: number
  wins: number
  losses: number
  draws: number
}

export interface RatingProgression {
  date: Date
  rating: number
  timeControl: TimeControl
}

export interface PlaystyleAnalysis {
  aggressiveScore: number
  positionalScore: number
  earlyQueenMoves: number
  sacrificeCount: number
  timeTroubleGames: number
  averageGameLength: number
  riskLevel: "Low" | "Medium" | "High"
  comebackRate: number
  clutchWins: number
  tiltTendency: number
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
  type: "best" | "worst" | "brilliant"
  game: ChessGame
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
