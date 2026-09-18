# Feature Ideas Backlog

Raw list of potential wrap stats/features, saved for future triage. Not yet
prioritized, scoped, or scheduled — see conversation history for the
transparency/real-data context (✅ = PGN-only/no engine needed, 📊 = requires a
platform API field we may not be pulling yet, 💰 = needs a Stockfish pass).

## Volume & Activity (1–20)
1. Total games played
2. Games by time control breakdown
3. Games by variant (standard/Chess960/etc.)
4. Rated vs. casual split
5. Total hours/minutes played 📊 (from clock data)
6. Average game duration
7. Longest single game (moves)
8. Longest single game (time)
9. Shortest decisive game
10. Games per month (bar chart)
11. Games per week heatmap (GitHub-contribution style)
12. Most active single day (game count)
13. Most active month
14. Quietest month
15. First game of the year
16. Last game of the year
17. Milestone games (100th/500th/1000th, with date)
18. Total moves played across all games
19. Total pieces captured across all games ✅
20. Total checks delivered ✅

## Rating & Progress (21–38)
21. Start-of-year rating
22. End-of-year rating
23. Net rating change
24. Peak rating + date reached
25. Lowest rating + date
26. Rating graph (full year, per time control)
27. Biggest single-game rating gain
28. Biggest single-game rating loss
29. Biggest single-day net change
30. Days spent at a new personal best
31. Rating volatility score (std deviation)
32. Time-to-recover after a big drop
33. Percentile rank vs. all Chess.com/Lichess users 📊 (chess.com exposes leaderboard percentile data)
34. Year-over-year rating comparison (needs prior year's wrap saved)
35. Projected rating trajectory (linear extrapolation, labeled as a fun guess, not a promise)
36. Rating gained per 100 games played
37. "Rating efficiency" — gain per hour played
38. Title progress if applicable (Lichess titles are public)

## Openings (39–58)
39. Most-played opening as White
40. Most-played opening as Black
41. Best win-rate opening (min. game threshold)
42. Worst win-rate opening ("maybe retire this")
43. Opening diversity score (# distinct ECOs)
44. New opening tried for the first time this year
45. Opening abandoned this year (played early, not late)
46. Gambit usage rate ✅ (already flagged with `isGambit()` in your repo)
47. Deepest into "book" before deviating (avg. moves matching known theory)
48. Fastest deviation from known theory
49. Response to 1.e4 breakdown (Sicilian/French/Caro-Kann/etc. as Black)
50. Response to 1.d4 breakdown
51. Your White repertoire pie chart
52. Your Black repertoire pie chart
53. Opening you're statistically weakest against (as opponent's choice)
54. Opening ECO category spread (A/B/C/D/E)
55. Win rate in your top-5 openings side by side
56. Opening that improved most in win-rate over the year
57. Longest same-opening streak (played it X games in a row)
58. "Signature opening" badge — statistically over-represented vs. average player

## Playstyle & Personality (59–80)
59. Aggressiveness score (real: captures/move ratio, piece activity — not random)
60. Positional vs. tactical classification
61. Trade-happiness score (how often you initiate trades)
62. Endgame reach rate (% of games reaching <10 pieces)
63. Castling speed (avg. move castled)
64. Kingside vs. queenside castling split
65. Uncastled-king games count
66. Queen trade frequency
67. Favorite piece by activation/capture count ✅
68. "Chess personality" archetype matched to famous players (like Chessigma, but make it multi-platform)
69. Risk tolerance (sac frequency, gambit rate)
70. Attacking vs. defensive game ratio
71. Material-down win rate (fighting spirit metric)
72. Perpetual-check/repetition-draw tendency
73. Underpromotion count ✅ (rare, fun flex stat)
74. En passant captures made/received ✅
75. Fastest checkmate delivered ✅
76. Most moves in a single game before resigning
77. "Clutch factor" — win rate in must-win/low-time situations
78. Time-pressure performance (win rate with <10% clock left, if clocks available)
79. Premove-style inference (very fast consecutive moves, if move-timestamps available)
80. Opening-to-personality correlation ("You play like a [Sicilian] player")

## Accuracy & Game Quality — real data only (81–92)
81. Average accuracy 📊 (only from Chess.com `accuracies` field or Lichess `accuracy=true`, never invented)
82. Best-accuracy game of the year 📊
83. Worst-accuracy game of the year 📊
84. Accuracy trend across the year (improving/declining) 📊
85. % of games with accuracy data available (transparency stat — "we only have real data for X% of your games")
86. Real blunder count 💰 (requires Stockfish pass on flagged highlight games)
87. Real ACPL (average centipawn loss) 💰 on analyzed games only
88. "Cleanest game" (lowest ACPL) 💰
89. "Most costly blunder" with eval swing + link to exact move 💰
90. Missed-win detector — had winning eval, drew or lost 💰
91. Brilliant-move count 📊 (Chess.com already flags "brilliant" moves in Game Review; surface it, don't recompute)
92. Comeback win detector (was losing on move-count/heuristic proxy, ended up winning) ✅ lightweight version without engine

## Legal-move / PGN-only achievements — zero engine cost (93–112)
93. Missed mate-in-1 by opponent (you didn't find it) ✅
94. Missed mate-in-1 by you (opponent didn't find it, you escaped) ✅
95. Stalemate tricks — escaped a lost position via stalemate ✅
96. Fastest forced checkmate sequence delivered ✅
97. Longest forced mate sequence you found ✅
98. Underpromotion trick pulled off ✅
99. En passant decider — game turned on an en passant capture ✅
100. Threefold repetition draws claimed ✅
101. 50-move rule draws ✅
102. Insufficient material draws ✅
103. Games won on time (flagging) vs. checkmate vs. resignation — full breakdown ✅
104. Longest "dead drawn but played on" game ✅
105. Piece sacrifice frequency (material given up without immediate recapture) ✅
106. Queen sacrifice count specifically ✅
107. Back-rank mate deliveries/receipts ✅
108. Smothered mate deliveries ✅ (fun, rare)
109. Discovered check count ✅
110. Double-check deliveries ✅ (very rare, great flex stat)
111. Castling into a mating net (funny "self-own" stat) ✅
112. Games decided in under 10 moves (either direction) ✅

## Opponents & Rivalries (113–128)
113. Nemesis (worst record against, min. 3 games)
114. Favorite victim (best record against)
115. Most-played opponent overall ("The Rival")
116. Highest-rated opponent faced
117. Highest-rated opponent beaten
118. Biggest upset win (rating gap)
119. Biggest upset loss
120. Head-to-head history with your top rival (W-L-D)
121. Titled opponents faced (IM/GM/FM — public on both platforms)
122. Opponent country distribution (flag map) 📊
123. Rematch same-day frequency (played same person multiple times in one sitting)
124. Longest rivalry (played across most months)
125. "Grudge match" detector — played same person right after a loss to them
126. New opponents faced this year (unique player count)
127. Bot games vs. human games split (Chess.com has bots)
128. Streamers/titled players you've played against, named

## Highlights & Standout Games (129–142)
129. "Game of the Year" algorithmic pick (highest combination of rating-gap + quality + drama)
130. Fastest win (moves)
131. Longest survived loss
132. Best comeback (biggest eval/material swing recovered) 💰
133. First win of the year
134. Last win of the year
135. Most-liked/most-viewed game if platform exposes it (Lichess doesn't publicly expose view counts; skip unless available)
136. Tournament/Arena performances if participated 📊 (Lichess tournament API)
137. Best Arena/tournament finish 📊
138. Puzzle Rush / Puzzle Battle results if played 📊 (Chess.com exposes some stats)
139. Direct links to every highlighted game (both platforms give permanent URLs)
140. "Most-watched-worthy" game — longest game with a decisive swing
141. Game with most total captures
142. Game with longest opening theory line held

## Time & Habits (143–158)
143. Favorite day of week to play
144. Favorite hour of day to play
145. Weekday vs. weekend split
146. "Night owl" vs. "early bird" classification
147. Longest single-sitting session ("chess binge")
148. Most games in one sitting
149. Average session length
150. Breaks/hiatus periods detected (gaps of 2+ weeks)
151. Longest break of the year
152. "Welcome back" games — performance right after a break
153. Time-of-year seasonality (which month you played most)
154. Weekend warrior vs. daily grinder classification
155. Total time "wasted" (viral hook from the Reddit version — total minutes spent, framed cheekily)
156. Fastest time between two games (back-to-back)
157. Slowest-to-return after a loss (tilt-break behavior, framed gently — see caution below)
158. Time-control switching pattern (do you jump between bullet/blitz/rapid same session)

## Streaks & Records (159–168)
159. Longest win streak
160. Longest loss streak
161. Longest draw streak
162. Longest daily-play streak (consecutive days with ≥1 game)
163. Best week (highest win rate, min. games)
164. Worst week
165. Biggest single-day rating swing
166. Most games in a single day
167. Comeback streak after a loss streak
168. "Revenge win" — beat someone right after losing to them

## Time Controls & Formats (169–178)
169. Full breakdown: bullet/blitz/rapid/classical/daily
170. Win rate per time control
171. Rating per time control (start/end/peak)
172. Preferred time control (most games)
173. Best-performing time control (highest win rate)
174. Time control you should maybe try (statistically strong in one similar to your best)
175. Daily/correspondence chess specific stats if played (Chess.com has this)
176. Variant games if played (Chess960, King of the Hill, etc. — both platforms expose these)
177. Variant-specific win rates
178. Cross-platform time control comparison (if merging Chess.com + Lichess)

## Multi-Platform Merge — your differentiator (179–186)
179. Combined Chess.com + Lichess game count
180. Combined total time played across both
181. Platform preference split (% games on each)
182. Cross-platform rating comparison (different scales, shown side by side, clearly labeled as non-equivalent)
183. Best platform for you (higher win rate)
184. Unified rival across both platforms
185. Unified opening repertoire across both
186. "Most improved platform" this year

## Social, Comparison & Virality (187–200)
187. Shareable summary card sized for Instagram Story (9:16)
188. Shareable summary card sized for X/Twitter (1:1 or 16:9)
189. Animated slide-by-slide reveal, Spotify-Wrapped-style
190. One-tap "download as image"
191. One-tap "download as video" 💰 (e.g. via Remotion — heavier to build)
192. Public shareable link with OG image preview (so the link itself looks good unshared)
193. "Compare with a friend" — two wraps side by side
194. Friend leaderboard within your existing chess app's user base (your real edge over standalone competitors)
195. Referral tracking (who shared to whom)
196. Embed widget for personal sites/blogs
197. QR code version for in-person sharing (event/club use case)
198. "Roast me" optional humor mode toggle (like the viral Reddit version, but opt-in so it doesn't feel mean by default)
199. Personality badge shareable separately from full wrap
200. Club/team aggregate wrap (if your app has clubs — sum/average member stats)

## Transparency, Trust & Technical (201–212)
201. Clear "real data" vs. "estimated" labeling on every stat (your key differentiator after the accuracy bug)
202. Data-source disclosure footer (Chess.com public API / Lichess public API)
203. "As of [date]" freshness stamp
204. Graceful handling when a platform API is down
205. Rate-limit-aware fetching with backoff (Chess.com explicitly asks for serial requests + a descriptive User-Agent)
206. Caching so regenerating the same user's wrap is instant
207. Background job queue for users with thousands of games (don't block UI)
208. Handles variant/aborted/abandoned games without crashing
209. Handles users with zero games gracefully (funny empty-state, not an error)
210. Privacy note: you're only using publicly-available game data, no login required for basic version
211. Accessibility pass — screen-reader labels, contrast on every slide
212. Mobile-first check on every single slide (you're already handling overflow — good foundation)

## Nice-to-have / Longer-term (213–220)
213. Monthly "mini-wraps" (not just annual) since you already have the pipeline
214. Push notification/email when a friend's wrap is ready to view (tied to your app)
215. Historical wraps archive (view your 2025, 2026, 2027... side by side)
216. Localization (multi-language slides, since a free product benefits from reach)
217. "Print my wrap" PDF export for people who want a physical keepsake
218. Voice-over/narrated version (accessibility + novelty)
219. API/webhook so power users can pull their own wrap data programmatically
220. Opt-in dataset for aggregate "state of chess" trends across your whole app's userbase (fun content marketing, with privacy safeguards)

## Tactical Patterns — PGN/legal-move only, no engine (221–238)
221. Fork count landed ✅
222. Pin count landed ✅
223. Skewer count landed ✅ (harder heuristic, doable)
224. Discovered attack count ✅
225. Windmill/see-saw tactic detector ✅ (rare, fun)
226. X-ray attack count ✅
227. Zwischenzug (in-between move) detector ✅
228. Removing-the-defender tactic count ✅
229. Battery formation count (queen+rook/bishop stacked) ✅
230. Trapped-piece count (yours or opponent's) ✅
231. In-between check count (checks that don't lead to mate but gain tempo) ✅
232. Piece sacrifice that led to a win (vs. one that didn't) ✅
233. "Greek gift" bishop sac pattern (Bxh7+) ✅
234. Fried Liver-style early sac pattern ✅
235. Windmill checkmate pattern specifically ✅
236. Anastasia's mate / Arabian mate / other named-mate pattern detection ✅
237. Boden's mate pattern ✅
238. Legall's mate pattern ✅

## Endgame Specifics (239–254)
239. King & pawn endgame win rate
240. Rook endgame win rate
241. Queen endgame win rate
242. Bishop-pair-retained win rate
243. Opposite-colored-bishops endgame record
244. Same-colored-bishops endgame record
245. Knight-vs-bishop endgame record
246. Two-knights endgame record
247. Won/lost a theoretically drawn endgame (K+R vs K+R, etc.) ✅
248. Missed a winning endgame technique (simplified heuristic)
249. Pawn-race endgames won/lost
250. Zugzwang moments (very hard, optional/skip if too complex)
251. Underpromotion in an endgame specifically ✅
252. Stalemate traps set successfully ✅
253. Fortress draws held ✅
254. King activity score in endgames (king moved toward center = engaged)

## Pawn Structure & Positional (255–266)
255. Isolated pawn frequency
256. Doubled pawn frequency
257. Passed pawn creation rate
258. Passed pawn promotion success rate
259. Pawn storm attacks launched (kingside pawn advances while attacking)
260. En prise piece frequency (pieces left hanging) ✅ lightweight heuristic
261. Space advantage tendency (central pawn advances)
262. Fianchetto usage rate (bishop development pattern) ✅
263. Opposite-side castling games (race-the-king dynamic) ✅
264. Same-side castling games
265. Symmetrical opening games (mirrored first N moves) ✅
266. Color preference in outcome (do you genuinely do better as White or Black, statistically significant or just noise — label honestly)

## First-Move & Repertoire Depth (267–276)
267. 1.e4 vs 1.d4 vs 1.Nf3 vs other first-move split (White)
268. Win rate by first move choice
269. Most common 2nd move follow-up per first move
270. Repertoire "width" score — how many distinct 3-move sequences played
271. Repertoire "depth" score — how far into known theory on average
272. Anti-repertoire — openings you consistently avoid facing well
273. Novelty move count (deviated from all known ECO lines) ✅
274. Home-prep detector — same exact opening sequence played 5+ times (signals actual study)
275. Opening trend across the year (did your repertoire shift month to month)
276. "Opening you were tilted into" — abandoned prep after a bad experience with it

## Percentile & Comparison (277–286)
277. Percentile rank vs. all users on that platform 📊 (Chess.com/Lichess leaderboard-adjacent public data)
278. Percentile rank within your rating band
279. How your win rate compares to platform average at your rating
280. How your game volume compares to platform average
281. "Top X% most active player this year" badge
282. Comparison to your own prior-year self (needs saved history)
283. Comparison to friends inside your existing app (your real differentiator — internal data, not external API)
284. Club/team-average comparison if user belongs to a Lichess team or Chess.com club 📊
285. National/regional average comparison if country data available 📊
286. Age-of-account-adjusted comparison ("for someone who's played chess online for 3 years...")

## Platform-Specific Extras (287–300)
287. Lichess: Puzzle Storm/Racer results if available 📊
288. Lichess: Berserk games in Arena tournaments (speed-for-rating trade) 📊
289. Lichess: Titled-player games faced, verified via title field 📊
290. Lichess: Study count created (public studies only) 📊
291. Lichess: Team membership 📊
292. Chess.com: "Brilliant"/"Great"/"Best" move tags already computed by their Game Review — surface, don't recompute 📊
293. Chess.com: Daily/Correspondence chess separate stats 📊
294. Chess.com: Variant games (Chess960, Bughouse if applicable) 📊
295. Account age on each platform ("member since") 📊
296. Verification/title badge display if titled 📊
297. Country flag display 📊
298. Bot-game filter toggle (separate human-only stats from bot-inflated ones)
299. Cross-platform username matching confidence (if same person, different usernames, only if user confirms both)
300. Data completeness score per user — "we found real accuracy data for 340 of your 512 games" (ties back to the transparency fix)
