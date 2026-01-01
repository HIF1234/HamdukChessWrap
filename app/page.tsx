"use client"

import { useState } from "react"
import { LandingHero } from "@/components/landing-hero"
import { UsernameInput } from "@/components/username-input"
import { FeaturesGrid } from "@/components/features-grid"
import { WrapPreview } from "@/components/wrap-preview"
import { ComparisonSection } from "@/components/comparison-section" // added comparison section import
import type { ChessWrapData, WrapConfig } from "@/lib/types"
import { generateChessWrap } from "@/lib/chess-api"

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [wrapData, setWrapData] = useState<ChessWrapData | null>(null)

  const handleGenerateWrap = async (config: WrapConfig) => {
    setLoading(true)
    try {
      const data = await generateChessWrap(config)
      setWrapData(data)
    } catch (error) {
      console.error("Failed to generate wrap:", error)
    } finally {
      setLoading(false)
    }
  }

  if (wrapData) {
    return <WrapPreview data={wrapData} onReset={() => setWrapData(null)} />
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24 space-y-24">
        <section className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <LandingHero />
          <UsernameInput onGenerate={handleGenerateWrap} isLoading={loading} />
        </section>

        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient from-primary to-accent">
              Master Your Game
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unlock deep insights into your chess performance with AI-powered analysis and beautiful visualizations.
            </p>
          </div>
          <FeaturesGrid />
        </section>

        <ComparisonSection />
      </div>

      <footer className="border-t border-border/40 py-12 bg-card/50">
        <div className="container mx-auto px-4 text-center space-y-4 text-muted-foreground">
          <p>© 2026 Hamduk Chess. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
