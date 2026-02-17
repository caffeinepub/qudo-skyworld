# Specification

## Summary
**Goal:** Build a relaxing, pastel-sky themed Telegram Mini App mini-game where players run short sessions to collect items, grow a persistent “Sky World,” and earn tamper-evident internal Qudo rewards with anti-cheat protections.

**Planned changes:**
- Create a playable mini-game loop that starts immediately on load: guide a cloud avatar through a sky lane to collect flowers and sparkles, with rare glowing Qudo-symbol timed boosts and an end-of-session summary.
- Implement persistent progression: collected items convert into visible decorations in the player’s Sky World plus at least three progression systems (e.g., sets/streaks/quests/cosmetic unlocks) while keeping onboarding simple.
- Add Telegram Mini App compatibility: responsive mobile-first layout, safe-area handling, touch + mouse controls, Telegram WebApp init support with a guest/local fallback outside Telegram.
- Implement internal Qudo rewards: verified session-based reward issuance, per-user balance, and append-only reward ledger with last-N events visible in UI; include an interface layer for future real token wiring.
- Add anti-cheat: client heartbeats + interaction proofs, server-side thresholds/limits (e.g., max rewarded minutes/day), anomaly flags, and UI messaging when rewards are reduced/blocked.
- Add time-of-day visuals: 4 local-time themes (night/morning/afternoon/evening) affecting gradients, cloud tint, sparkle density, and glow; include a settings/debug preview switcher.
- Add relaxing audio: start after first interaction, looping ambient layers (wind/chimes) + soft melody, with mute/volume controls persisted per user.
- Add social visiting: shareable friend code/link, visit a friend’s Sky World snapshot by code/link, and leave a lightweight reaction stored in the friend’s inbox; ensure no reward exploits from visits.
- Define Motoko canister data structures and stable persistence for: profiles, world state/decorations, sessions, reward ledger, anti-cheat flags, friends/visits, reactions/inbox; expose query endpoints needed by the frontend.
- Add Help/Commands UI mapping bot-style commands (/start, /play, /world, /visit <code>, /balance, /help) to in-app navigation and shareable deep links; include local documentation text describing how a real bot would forward into the Mini App.
- Implement cohesive pastel UI styling across gameplay HUD and all screens (world view, rewards, social, shop), avoiding default/template look.
- Add a Cosmetics Shop UI with soft-currency-only cosmetic items (≥12 across categories), preview/equip flow, and clearly labeled placeholders for future paid upgrades (no payment integration).
- Bundle required static art assets under `frontend/public/assets/generated` and use them in-game (no runtime image generation or external URLs).

**User-visible outcome:** Players can open the Mini App in Telegram and immediately play short relaxing sessions, see their Sky World grow persistently, view and earn internal Qudo rewards after verified play, switch/preview time-of-day themes, control audio, browse/equip cosmetics, and visit friends’ worlds via shareable codes with simple reactions.
