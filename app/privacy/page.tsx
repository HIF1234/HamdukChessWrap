import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20 max-w-4xl mx-auto font-sans">
      <Link href="/" className="text-primary hover:underline mb-8 inline-block">
        ← Back to Wrap
      </Link>
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: January 2, 2026</p>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
          <p>
            We only collect your chess platform username (Chess.com or Lichess) to fetch public game data via their
            official APIs. We do not require or store your passwords.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Data</h2>
          <p>
            Data is used solely to generate your "Chess Wrap" and is stored in our secure Supabase database to enable
            sharing via unique URLs.
          </p>
        </section>
        <p>For more information, contact us at hamdukchess.vercel.app</p>
      </div>
    </div>
  )
}
