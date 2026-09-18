"use client"

import { Chess } from "chess.js"

export interface GameAnalysisResult {
  accuracy: number
  acpl: number
  blunders: number
  mistakes: number
  inaccuracies: number
}

// Centipawn-loss thresholds matching the classification lichess/chess.com use.
const BLUNDER_CP = 300
const MISTAKE_CP = 120
const INACCURACY_CP = 50

const SEARCH_DEPTH = 10
const MAX_SAMPLED_PLIES = 24

// Lichess's public win% and move-accuracy formulas (see lichess-org/lila
// scalachess Winner/AccuracyPercent). Reused here so "accuracy" means the
// same thing a player would already recognize from lichess analysis boards.
function winPercent(cp: number): number {
  const chances = 2 / (1 + Math.exp(-0.00368208 * cp)) - 1
  return 50 + 50 * chances
}

function moveAccuracy(winPercentBefore: number, winPercentAfter: number): number {
  const drop = Math.max(0, winPercentBefore - winPercentAfter)
  const accuracy = 103.1668 * Math.exp(-0.04354 * drop) - 3.1668
  return Math.max(0, Math.min(100, accuracy))
}

// Stockfish is loaded as a plain Web Worker against static files served from
// /public/engine (see scripts/copy this package ships) instead of importing
// the npm package directly — its Emscripten build does Node-only `require()`
// calls (worker_threads/perf_hooks) at module scope that break bundling for
// the browser target even behind a dynamic import.
const ENGINE_WORKER_PATH = "/engine/stockfish.js"

let enginePromise: Promise<Worker> | null = null

async function getEngine(): Promise<Worker> {
  if (typeof window === "undefined") {
    throw new Error("Engine analysis is only available in the browser")
  }

  if (!enginePromise) {
    enginePromise = new Promise<Worker>((resolve) => {
      const worker = new Worker(ENGINE_WORKER_PATH)

      const onReady = (event: MessageEvent) => {
        if (event.data === "uciok") {
          worker.removeEventListener("message", onReady)
          worker.postMessage("ucinewgame")
          resolve(worker)
        }
      }

      worker.addEventListener("message", onReady)
      worker.postMessage("uci")
    })
  }

  return enginePromise
}

// Evaluates a position and returns the centipawn score from White's perspective.
function evaluatePosition(engine: Worker, fen: string, depth: number): Promise<number> {
  return new Promise((resolve) => {
    let lastCp = 0
    const sideToMove = fen.split(" ")[1] === "b" ? -1 : 1

    const onMessage = (event: MessageEvent) => {
      const line = event.data
      if (typeof line !== "string") return

      const mateMatch = line.match(/score mate (-?\d+)/)
      const cpMatch = line.match(/score cp (-?\d+)/)
      if (mateMatch) {
        const mateIn = Number(mateMatch[1])
        lastCp = (mateIn > 0 ? 1 : -1) * 10000
      } else if (cpMatch) {
        lastCp = Number(cpMatch[1])
      }

      if (line.startsWith("bestmove")) {
        engine.removeEventListener("message", onMessage)
        // Stockfish reports score relative to the side to move; normalize to White.
        resolve(lastCp * sideToMove)
      }
    }

    engine.addEventListener("message", onMessage)
    engine.postMessage(`position fen ${fen}`)
    engine.postMessage(`go depth ${depth}`)
  })
}

/**
 * Replays a PGN with chess.js, samples a bounded number of positions across
 * the game, and evaluates each with Stockfish (WASM, runs in-browser) to
 * derive real accuracy/ACPL/blunder-mistake-inaccuracy counts for the side
 * the wrap is being generated for. Returns null if the PGN can't be parsed
 * or produces no scoreable positions.
 */
export async function analyzeGameWithEngine(
  pgn: string,
  userColor: "white" | "black",
): Promise<GameAnalysisResult | null> {
  const chess = new Chess()
  try {
    chess.loadPgn(pgn)
  } catch {
    return null
  }

  const history = chess.history()
  if (history.length === 0) return null

  const replay = new Chess()
  const positions: string[] = [replay.fen()]
  for (const san of history) {
    replay.move(san)
    positions.push(replay.fen())
  }

  const step = Math.max(1, Math.floor(positions.length / MAX_SAMPLED_PLIES))
  const sampledIndexes: number[] = []
  for (let i = 0; i < positions.length; i += step) sampledIndexes.push(i)
  if (sampledIndexes[sampledIndexes.length - 1] !== positions.length - 1) {
    sampledIndexes.push(positions.length - 1)
  }

  const engine = await getEngine()
  const evalsByIndex = new Map<number, number>()
  for (const index of sampledIndexes) {
    evalsByIndex.set(index, await evaluatePosition(engine, positions[index], SEARCH_DEPTH))
  }

  const sortedIndexes = [...evalsByIndex.keys()].sort((a, b) => a - b)
  const userIsWhite = userColor === "white"

  let acplSum = 0
  let acplCount = 0
  let blunders = 0
  let mistakes = 0
  let inaccuracies = 0
  let accuracySum = 0
  let accuracyCount = 0

  for (let i = 1; i < sortedIndexes.length; i++) {
    const prevIndex = sortedIndexes[i - 1]
    const currIndex = sortedIndexes[i]
    const before = evalsByIndex.get(prevIndex)!
    const after = evalsByIndex.get(currIndex)!

    // A ply at board index N was played by White if N is odd (index 0 = start position).
    const plyPlayedByWhite = currIndex % 2 === 1
    if (plyPlayedByWhite !== userIsWhite) continue

    const loss = Math.max(0, userIsWhite ? before - after : after - before)
    const cappedLoss = Math.min(1000, loss)

    acplSum += cappedLoss
    acplCount++

    if (cappedLoss >= BLUNDER_CP) blunders++
    else if (cappedLoss >= MISTAKE_CP) mistakes++
    else if (cappedLoss >= INACCURACY_CP) inaccuracies++

    const winBefore = winPercent(userIsWhite ? before : -before)
    const winAfter = winPercent(userIsWhite ? after : -after)
    accuracySum += moveAccuracy(winBefore, winAfter)
    accuracyCount++
  }

  if (accuracyCount === 0) return null

  return {
    accuracy: Math.round((accuracySum / accuracyCount) * 10) / 10,
    acpl: Math.round(acplSum / acplCount),
    blunders,
    mistakes,
    inaccuracies,
  }
}
