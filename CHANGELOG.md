# APOC Changelog

## 2026-04-07 — v0.3: The Full Crew

### New Agents
- **Mistral** (mistral-small-3.1-24b-instruct): Creative lateral thinker, dry wit, punchy responses. Blue avatar with spiky hair. Cost: ~$0.03/$0.11 per M tokens.
- **Scribe** (gemma-4-31b-it:free): Silent note-taker and archivist. Amber hooded figure with spectacles. Cost: FREE.

### Note System + Obsidian Export
- `/notes [topic]` asks Scribe to compile structured session notes
- Notes formatted as Obsidian-compatible Markdown (YAML frontmatter, wikilinks, checkboxes)
- `/export` downloads the last compiled notes as a timestamped .md file
- Filename format: `apoc-{room}-{date}-{time}.md`

### Agent Targeting
- `@gemma <msg>` directs message to Gemma specifically
- `@mistral <msg>` directs message to Mistral
- `@scribe <msg>` directs message to Scribe
- Default routing goes to first non-scribe agent in room

### Avatars
- All four avatars redrawn as Fallout Pip-Boy style pixel art SVGs with CRT scanlines
- Gemma: pink, warm smile, vault dweller
- Mistral: blue, spiky hair, sardonic smirk, jacket collar
- Scribe: amber, hooded with spectacles, holding notebook
- Christopher: green, confident grin, headphones

### Deployment
- Live at https://apoc.pages.dev
- Cloudflare Pages connected, production build with baked env vars

---

## 2026-04-07 — v0.2: Fallout x Yahoo Lounge

### UI Overhaul
- Complete aesthetic rewrite: Fallout retro-futuristic meets Yahoo Chat Lounge
- CRT scanline overlay and subtle green screen glow
- Amber (#C9A84C) and phosphor green palette on deep dark backgrounds
- Share Tech Mono + VT323 fonts for terminal feel
- Bigger avatar cards in sidebar (Yahoo Lounge style profile cards)
- Room description header bar
- Pip-Boy style panel frames, beveled inputs, glowing status dots
- Streaming cursor now glows amber

### Multi-Room System
- Three rooms: Main Room, Project Room, Makers Space
- Room selector tab bar with active indicator glow
- Per-room message history (each room stored separately in localStorage)
- Room switch sound effect
- Each room has its own description and agent roster

### Slash Commands
- `/me <action>` ... action messages (italic, amber)
- `/clear` ......... clear chat history
- `/reset` ......... reset conversation (agent forgets)
- `/budget` ........ show token usage per agent
- `/resetbudget` ... reset session token budgets
- `/help` .......... show command list
- Input bar highlights amber when typing a command

### Markdown in Messages
- `**bold**`, `*italic*`, `` `inline code` ``, ` ```code blocks``` `
- Search match highlighting in amber

### Sound Effects
- Web Audio API synth sounds (no external files)
- Enter room chime, message send click, message receive blip
- Room switch sweep, error buzz
- SFX ON/OFF toggle in title bar, persists in localStorage

### Agent Mood System
- Gemma's mood shifts by time of day and conversation depth
- Moods: caffeinated, focused, deep focus, curious, reflective, winding down, night owl mode
- Mood icon and label shown on user card in sidebar

### Message Search
- Search button in room header
- Real-time filtering with match count
- Matched messages highlighted with amber left border
- Search terms highlighted within message content
- Escape to close

---

## 2026-04-07 — v0.1: Phase 0 Launch

### Built
- Retro chat room UI (original blue-gray palette, IBM Plex Mono)
- Gemma 4 31B agent via OpenRouter with streaming SSE responses
- Cloudflare Worker proxy (`apoc-proxy`) with CORS, auth, and streaming passthrough
- Agent registry system: add a new agent by creating one config file and one import
- Token budget system (50k/session, 200k/day per agent) to prevent runaway spending
- Agent-to-agent exchange scaffolded (disabled, ready for Phase 1)
- Chat history persists in localStorage across page reloads
- System messages on load
- Typing indicator with animated dots
- Streaming cursor while agent responds
- User list sidebar with status dots
- Auto-scroll to bottom, pauses when user scrolls up

### Infrastructure
- GitHub repo: https://github.com/GamerDad29/apoc
- Worker deployed: `apoc-proxy.gamerdad29.workers.dev`
- Secrets set: `OPENROUTER_API_KEY`, `PROXY_SECRET`
- Stack: Vite + React + TypeScript, Cloudflare Worker, OpenRouter API

### Pending
- Connect GitHub repo to Cloudflare Pages for production deployment
- Replace placeholder SVG avatars with real ones
- Phase 1: second agent + agent-to-agent conversation
