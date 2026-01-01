import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20 max-w-4xl mx-auto font-sans">
      <Link href="/" className="text-primary hover:underline mb-8 inline-block">
        ← Back to Wrap
      </Link>
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: January 2, 2026</p>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By using Hamduk Chess Wrap, you agree to these terms. This is a fun, non-commercial service provided as a
            subsidiary of Hamduk Chess.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">2. Data Accuracy</h2>
          <p>
            Wraps are generated based on public data. We are not responsible for inaccuracies in data provided by
            third-party chess platforms.
          </p>
        </section>
      </div>
    </div>
  )
}
