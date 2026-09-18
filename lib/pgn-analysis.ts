import { Chess } from "chess.js"
import type { ChessGame, TacticalStats } from "./types"

const EMPTY_STATS: TacticalStats = {
  totalPiecesCaptured: 0,
  totalChecksDelivered: 0,
  enPassantCaptures: 0,
  underpromotions: 0,
  fastestCheckmate: null,
  missedMateInOneByUser: 0,
  missedMateInOneByOpponent: 0,
  stalemateDraws: 0,
  threefoldDraws: 0,
  insufficientMaterialDraws: 0,
  fiftyMoveDraws: 0,
  shortDecisiveGames: 0,
  longestDrawStreak: 0,
  kingsideCastles: 0,
  queensideCastles: 0,
  uncastledGames: 0,
  avgCastlingMove: null,
}

// Does the side to move in this position have a checkmating move available?
// Pure legal-move search via chess.js — no engine, no network, no cost.
function hasMateInOne(chess: Chess): boolean {
  const moves = chess.moves()
  for (const move of moves) {
    chess.move(move)
    const isMate = chess.isCheckmate()
    chess.undo()
    if (isMate) return true
  }
  return false
}

/**
 * Derives real, zero-cost stats directly from each game's PGN using chess.js
 * move generation only (no Stockfish, no paid APIs). Every number here is
 * either counted directly from the actual moves played or determined by
 * brute-force legal-move search on the actual position reached.
 */
export function computeTacticalStats(games: ChessGame[]): TacticalStats {
  if (games.length === 0) return { ...EMPTY_STATS }

  const stats: TacticalStats = { ...EMPTY_STATS }
  let currentDrawStreak = 0
  let castlingMoveSum = 0
  let castlingMoveCount = 0

  for (const game of games) {
    if (game.result === "draw") {
      currentDrawStreak++
      stats.longestDrawStreak = Math.max(stats.longestDrawStreak, currentDrawStreak)
    } else {
      currentDrawStreak = 0
    }

    if (!game.pgn) continue

    const parser = new Chess()
    try {
      parser.loadPgn(game.pgn)
    } catch {
      continue
    }

    const history = parser.history({ verbose: true })
    if (history.length === 0) continue

    const userIsWhite = game.userColor === "white"

    if (history.length < 20 && game.result !== "draw") {
      stats.shortDecisiveGames++
    }

    let userCastled = false

    const replay = new Chess()
    for (let i = 0; i < history.length; i++) {
      const move = history[i]
      const movedByWhite = i % 2 === 0
      const movedByUser = movedByWhite === userIsWhite

      // A mate existed on the board before this move but wasn't the move played.
      if (hasMateInOne(replay) && !move.san.endsWith("#")) {
        if (movedByUser) stats.missedMateInOneByUser++
        else stats.missedMateInOneByOpponent++
      }

      replay.move(move.san)

      if (move.captured) stats.totalPiecesCaptured++
      if (move.flags.includes("e")) stats.enPassantCaptures++
      if (move.promotion && move.promotion !== "q") stats.underpromotions++
      if (movedByUser && (move.san.includes("+") || move.san.endsWith("#"))) stats.totalChecksDelivered++

      if (movedByUser && (move.flags.includes("k") || move.flags.includes("q"))) {
        userCastled = true
        if (move.flags.includes("k")) stats.kingsideCastles++
        else stats.queensideCastles++
        const moveNumber = Math.floor(i / 2) + 1
        castlingMoveSum += moveNumber
        castlingMoveCount++
      }
    }

    if (!userCastled) stats.uncastledGames++

    const lastMove = history[history.length - 1]
    if (game.result === "win" && lastMove.san.endsWith("#")) {
      const moveCount = Math.ceil(history.length / 2)
      if (!stats.fastestCheckmate || moveCount < stats.fastestCheckmate.moves) {
        stats.fastestCheckmate = { moves: moveCount, gameId: game.id }
      }
    }

    if (game.result === "draw") {
      if (replay.isStalemate()) stats.stalemateDraws++
      else if (replay.isThreefoldRepetition()) stats.threefoldDraws++
      else if (replay.isInsufficientMaterial()) stats.insufficientMaterialDraws++
      else if (replay.isDraw()) stats.fiftyMoveDraws++
    }
  }

  stats.avgCastlingMove = castlingMoveCount > 0 ? Math.round((castlingMoveSum / castlingMoveCount) * 10) / 10 : null

  return stats
}
