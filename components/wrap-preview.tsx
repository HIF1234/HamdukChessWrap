"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause, Share2, Volume2, VolumeX } from "lucide-react"
import type { ChessWrapData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { IntroSlide } from "@/components/slides/intro-slide"
import { ProfileSlide } from "@/components/slides/profile-slide"
import { JourneySlide } from "@/components/slides/journey-slide"
import { MatchupsSlide } from "@/components/slides/matchups-slide"
import { StatsSlide } from "@/components/slides/stats-slide"
import { TimeControlsSlide } from "@/components/slides/time-controls-slide"
import { RatingMasterySlide } from "@/components/slides/rating-mastery-slide"
import { RatingGraphSlide } from "@/components/slides/rating-graph-slide"
import { RatingSlide } from "@/components/slides/rating-slide"
import { OpeningSlide } from "@/components/slides/opening-slide"
import { OpeningStyleSlide } from "@/components/slides/opening-style-slide"
import { PlaystyleSlide } from "@/components/slides/playstyle-slide"
import { HabitsSlide } from "@/components/slides/habits-slide"
import { AchievementsSlide } from "@/components/slides/achievements-slide"
import { InsightsSlide } from "@/components/slides/insights-slide"
import { HighlightSlide } from "@/components/slides/highlight-slide"
import { CoachingSlide } from "@/components/slides/coaching-slide"
import { ShareSlide } from "@/components/slides/share-slide"

interface WrapPreviewProps {
  data: ChessWrapData
  shareId: string | null
  onReset: () => void
}

export function WrapPreview({ data, shareId, onReset }: WrapPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const bgMusic = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
  const roastMusic = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"

  const slides = [
    { id: "intro", component: IntroSlide },
    { id: "profile", component: ProfileSlide },
    { id: "journey", component: JourneySlide },
    { id: "matchups", component: MatchupsSlide },
    { id: "stats", component: StatsSlide },
    { id: "time-controls", component: TimeControlsSlide },
    { id: "rating-mastery", component: RatingMasterySlide },
    { id: "rating-graph", component: RatingGraphSlide },
    { id: "rating", component: RatingSlide },
    { id: "opening", component: OpeningSlide },
    { id: "opening-style", component: OpeningStyleSlide },
    { id: "playstyle", component: PlaystyleSlide },
    { id: "habits", component: HabitsSlide },
    { id: "achievements", component: AchievementsSlide },
    { id: "insights", component: InsightsSlide },
    { id: "highlights", component: HighlightSlide },
    { id: "coaching", component: CoachingSlide },
    { id: "share", component: ShareSlide },
  ]

  const totalSlides = slides.length
  const duration = 6000

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide((s) => s + 1)
            return 0
          } else {
            setIsPaused(true)
            return 100
          }
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentSlide, totalSlides, isPaused])

  useEffect(() => {
    const ambientAudio = new Audio(data.aiInsights.roastMode ? roastMusic : bgMusic)
    ambientAudio.volume = isMuted ? 0 : 0.2
    ambientAudio.loop = true

    const playAudio = async () => {
      try {
        if (!isPaused && !isMuted) {
          const playPromise = ambientAudio.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay prevented, user interaction required
            })
          }
        } else {
          ambientAudio.pause()
        }
      } catch (err) {
        // Silently fail if autoplay is not allowed
      }
    }

    playAudio()

    // Allow user interaction to enable autoplay
    const handleUserInteraction = () => {
      if (!isPaused && !isMuted) {
        ambientAudio.play().catch(() => {})
      }
    }

    document.addEventListener("click", handleUserInteraction, { once: true })
    document.addEventListener("touchstart", handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      ambientAudio.pause()
      ambientAudio.currentTime = 0
    }
  }, [isMuted, isPaused, data.aiInsights.roastMode])

  useEffect(() => {
    if (currentSlide > 0 && !isMuted) {
      const transitionSfx = new Audio("https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3")
      transitionSfx.volume = 0.15
      transitionSfx.play().catch(() => {})
    }
  }, [currentSlide, isMuted])

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
      setProgress(0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
      setProgress(0)
    }
  }

  const CurrentSlideComponent = slides[currentSlide].component

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{
                width: i < currentSlide ? "100%" : i === currentSlide ? `${progress}%` : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Header Controls */}
      <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
            {data.player.username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm">{data.player.username}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Chess Wrap 2025</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40"
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-full w-full"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {slides[currentSlide].id === "time-controls" && (
              <TimeControlsSlide timeControlStats={data.timeControlBreakdown} />
            )}
            {slides[currentSlide].id === "rating-mastery" && (
              <RatingMasterySlide 
                timeControlStats={data.timeControlBreakdown}
                ratingGain={data.ratingProgression.length > 0 ? 
                  data.ratingProgression[data.ratingProgression.length - 1].rating - data.ratingProgression[0].rating : 0}
                startRating={data.ratingProgression.length > 0 ? data.ratingProgression[0].rating : 0}
                endRating={data.ratingProgression.length > 0 ? data.ratingProgression[data.ratingProgression.length - 1].rating : 0}
              />
            )}
            {slides[currentSlide].id === "rating-graph" && (
              <RatingGraphSlide ratingProgression={data.ratingProgression} />
            )}
            {!["time-controls", "rating-mastery", "rating-graph"].includes(slides[currentSlide].id) && (
              <CurrentSlideComponent data={data} shareId={shareId} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={prevSlide} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" onClick={nextSlide} />
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4">
        <Button className="rounded-full px-8 bg-white text-black hover:bg-white/90">
          <Share2 className="w-4 h-4 mr-2" />
          Share Your Year
        </Button>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
