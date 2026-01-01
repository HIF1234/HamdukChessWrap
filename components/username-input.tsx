"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WrapConfig, Platform } from "@/lib/types"
import { ChevronRight, Loader2, Search, Brain, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface UsernameInputProps {
  onGenerate: (config: WrapConfig) => void
  isLoading: boolean
}

export function UsernameInput({ onGenerate, isLoading }: UsernameInputProps) {
  const [username, setUsername] = useState("")
  const [platform, setPlatform] = useState<Platform>("chess.com")
  const [narrationMode, setNarrationMode] = useState<"coach" | "roast">("coach") // added narration mode state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return
    onGenerate({ username, platform, year: 2025, narrationMode }) // include narration mode in config
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex justify-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setNarrationMode("coach")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
            narrationMode === "coach"
              ? "bg-primary/20 border-primary text-primary"
              : "bg-muted border-border text-muted-foreground",
          )}
        >
          <Brain className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Coach Mode</span>
        </button>
        <button
          type="button"
          onClick={() => setNarrationMode("roast")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
            narrationMode === "roast"
              ? "bg-destructive/20 border-destructive text-destructive"
              : "bg-muted border-border text-muted-foreground",
          )}
        >
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Roast Mode</span>
        </button>
      </div>

      <div className="w-full bg-card border border-border/50 p-2 rounded-2xl shadow-2xl shadow-primary/10 transition-all focus-within:ring-2 focus-within:ring-primary/20">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="pl-10 h-12 bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex p-1 bg-muted rounded-xl">
              {(["chess.com", "lichess"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                    platform === p
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.split(".")[0]}
                </button>
              ))}
            </div>

            <Button
              disabled={!username || isLoading}
              size="lg"
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Wrap It
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
