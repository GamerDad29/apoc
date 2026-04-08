# APOC Session Log

## 2026-04-07 — Launch Day

### Accomplished
- Built APOC from scratch: spec to deployed product in one session
- v0.1: Core chat room with Gemma 4 31B, Cloudflare Worker proxy, streaming SSE
- v0.2: Complete UI overhaul to Fallout x Yahoo Lounge aesthetic (CRT scanlines, amber/green phosphor, 3 rooms, slash commands, markdown, sounds, mood, search)
- v0.3: Added Mistral (creative agent) and Scribe (free note-taker on Nemotron 3 Nano 30B), Obsidian export, @agent targeting
- v0.4: Bug fixes (no auto-route to Gemma), sound overhaul (per-room/per-agent tones), hey-all command, agent profile modal, resizable sidebar, idle chatter, personality upgrades
- v0.5: Animated SVG avatars with expression engine (12 states, per-agent idle patterns), 70+ ambient emotes, Obsidian vault integration via Local REST API
- Deployed to Cloudflare Pages (apoc.pages.dev) + Worker proxy
- Also: Downloads folder audit and reorganization (Phase 1-3)

### Known Issues
- Cloudflare Pages deploys are manual (no CI from GitHub yet)
- Free model rate limits on OpenRouter can cause 429s
- Obsidian vault integration requires Local REST API plugin with HTTP enabled (port 27123)
- Idle chatter system prompt sometimes leaks into visible messages

### Next Steps (Backlog)
- Cloudflare Pages CI (auto-deploy on push)
- Agent-to-agent debate mode (`/discuss`)
- More agents (coder, researcher)
- Persistent memory via Cloudflare KV
- Theme switcher
- Notification system for cross-room activity
- Custom agent builder
- Mobile polish
