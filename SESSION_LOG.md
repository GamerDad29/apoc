# APOC Session Log

## 2026-04-10 — Shipment 1: Trust the Runtime

### Accomplished
- Codex deep-review consolidated with existing handoff backlog + Wyrdroom
  rebrand doc into a single t-shirt-sized plan (4 shipments)
- **Shipment 1 shipped in full** (3 commits on `main`, not yet pushed):
  - `82dc2a0` test: Vitest harness + service coverage + review docs
  - `bcb90c8` fix(security): sanitize markdown rendering to prevent XSS
  - `a5e50e1` fix(chat): real cancellation, concurrent streaming, runtime integrity
- 8 backlog items closed: SEC-03, BUG-01, BUG-02, BUG-03, BUG-04, BUG-06,
  BUG-07, TEST-01 extensions
- Test coverage: 10 → 19 tests, all passing; clean `tsc --noEmit`;
  clean `vite build` (352 kB / 112 kB gzip)

### Known Issues / Carry-over
- `VITE_PROXY_SECRET` still shipped in the bundle (SEC-01) — intentional;
  real fix lands with Shipment 2's Worker redeploy alongside strict
  origin validation (SEC-02)
- `useChat` is still a god hook — internal event model (REF-01) is
  Shipment 4
- Shipment 1 not yet pushed to `origin/main` (awaiting user go-ahead)
- Shipment 1 not yet manually smoke-tested in `npm run dev`

### Next Session: Shipment 2 — Wyrdroom + Security Finish
One Worker redeploy, new name, correct CORS from day one. Order:
1. SEC-02 strict origin validation (exact host, no `endsWith`)
2. SEC-01 auth redesign (remove bundled secret)
3. OPS-01 Worker rate limit + abuse protection
4. BUG-05 kill `/api/models` hardcoded drift
5. REF-02 single source of truth for agent metadata
6. REBRAND-01 infra rename (repo, folder, `wyrdroom-proxy`, `wyrdroom.com`)
7. REBRAND-02 branding, copy, palette, typography, room→hall
8. REBRAND-03 agent prompts + runes
9. REBRAND-04 localStorage + Scribe vault path

## 2026-04-08 — The War Room

### Accomplished
- 4 new agents: Cipher, Oracle, Jinx, Sage (v0.7), then Flux, Drift, Patch, Echo (v0.8)
- 11 total agents across 4 rooms (Main, Project, Makers, Vision Space)
- 1,101 ambient emotes (100 per agent)
- Full Vault-Tec UI overhaul (navy/blue/yellow palette)
- 22 expression types, mouse-tracking eyes, Christopher's cape
- 6 new commands: /iterate, /freeform, /mute, /unmute, /stop, /save
- Complete prompt architecture rewrite (prompting guide + interaction tuning)
- CI auto-deploy via GitHub Actions + Cloudflare Pages
- Scribe Notes vault folder for clean Obsidian integration
- Cloudflare Access protecting production
- Multiple model swaps (Mistral, Sage, Cipher) to resolve quality issues

### Known Issues
- Sage and Oracle share same model (Gemma 4 26B), monitor for blending
- Iteration agents still sometimes repeat themes across rounds
- Sidebar gets long with 11 agents + Christopher on smaller screens

### Backlog

**Session: The Intelligence Layer** (M, ~3 hrs)
- Herald agent: News via Brave Search API. New worker route `/api/news`, API key needed, agent fetches before responding.
- Signal agent: Reddit via public JSON API. New worker route `/api/reddit`, subreddits: ClaudeAI, singularity, CoolGithubProjects, LocalLLaMA. No auth needed.
- Both follow the same pattern: worker proxies external API, agent gets context, then responds conversationally.

**Session: The Creator** (L, ~3 hrs)
- Prism agent: Image generation via Cloudflare Workers AI (FLUX.1 Schnell, $0.01/image)
- Add `[ai]` binding to wrangler.toml
- New worker route `/api/image`
- Image rendering in MessageBubble.tsx (detect `![image](data:...)` in agent output)

**Session: The Memory** (XL, full session)
- Persistent cross-session memory via Cloudflare D1 (SQLite on edge)
- Tables: `memories` (agent_id, room_id, content, topic_tags, importance) + `sessions` (summary)
- Worker routes: `/api/memory/store`, `/api/memory/recall`, `/api/session/start`, `/api/session/end`
- On load: inject previous session summary into agent system prompts
- Scribe auto-stores key decisions periodically

**Prompt Strengthening** (S, ~30 min)
- Add "Decider mode" to Gemma: `@gemma decide` triggers her to close debate and pick
- This covers the Architects/Judges/Filters roles the agents suggested without adding new agents
- Strengthen existing agent coverage: Flux=synthesis, Cipher=friction/validation, Oracle=value, Sage=silence/filter

**Polish** (M, ~2 hrs)
- Mobile responsive pass (collapsible sidebar for 11 agents)
- Rebrand from APOC to new name (TBD)
- Review Sage vs Oracle distinctiveness (same model)
- Iteration theme repetition improvements

---

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
