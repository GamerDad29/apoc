# APOC Changelog

## 2026-04-07 — v0.5: Living Room

### Animated SVG Avatars
- All avatars converted from static SVGs to inline React components
- Composable parts: head, eyes, mouth, eyebrows, body per agent
- Expression engine detects keywords in messages:
  - "lol/haha" = laugh, "hmm/interesting" = think, "whoa/wow" = surprised
  - "honestly/actually" = smirk, "plan/deploy/build" = focused
  - Questions = think, "really/you sure" = eyebrow raise
- 12 expression states: idle, blink, talk, laugh, think, surprised, smirk, focused, look-left, look-right, nod, eyebrow-raise
- Per-agent idle animation patterns with weighted randomness:
  - Gemma: blinks slower, stays focused, occasional nod
  - Mistral: fidgets more, smirks, raises eyebrows
  - Scribe: steady focus, minimal movement, adjusts glasses
- Typing state triggers "think" expression
- Large animated avatar (112px) in profile modal

### Ambient Emotes (70+ unique, zero API cost)
- Agents perform small actions every 30-90 seconds
- **Gemma** (24 emotes): adjusts notes, sips coffee, reorganizes tabs, steeples fingers, catches herself staring, quietly closes 14 browser tabs
- **Mistral** (28 emotes): drums fingers, flips pen (and drops it), tilts chair dangerously, smirks at nothing, air quotes, slow claps sarcastically, types furiously then deletes all of it
- **Scribe** (20 emotes): twiddles pen, adjusts glasses, turns pages, underlines something twice, traces a wikilink bracket in the air, opens a fresh page
- Weighted probability so favorites appear more often

### Obsidian Vault Integration
- Uses Obsidian "Local REST API" community plugin
- Auto-discovers HTTP (port 27123) and HTTPS (port 27124)
- `/vault key <key>` -- set API key
- `/vault search <query>` -- search vault for notes
- `/vault read <path>` -- read a note into chat
- `/vault write <path>` -- write Scribe notes to vault
- `/vault list [folder]` -- browse vault structure
- `/vault save` -- auto-save notes to `APOC/` folder with date
- Graceful fallback when Obsidian not running

### Scribe Model Upgrade
- Switched from Gemma 4 31B (free, rate-limited) to NVIDIA Nemotron 3 Nano 30B (free, better quality)
- Produces tables, structured headers, key takeaways in notes

---

## 2026-04-07 — v0.4: The Crew Comes Alive

### Bug Fix
- Unaddressed messages no longer auto-route to Gemma
- Must @mention an agent or say "hey all" to trigger a response

### Sound Overhaul
- Different tones per room:
  - Main Room: warm open chord
  - Project Room: focused two-note
  - Makers Space: playful descending bounce
- Different tones per agent:
  - Gemma: confident double-ping
  - Mistral: quick sharp triplet
  - Scribe: soft pen-scratch
- Agent enter sounds (ascending vault-door chime, colored by agent)
- Agent leave sounds (descending departure tone)
- "Hey all" broadcast chime
- Idle chatter murmur sound

### "Hey All" Command
- Say "hey all", "hey everyone", "hey team", "hey crew", etc.
- All non-scribe agents respond sequentially with different sounds

### Agent Profile Modal (Fallout Terminal Card)
- Click any agent name in chat or sidebar
- Opens Fallout-style personnel file with:
  - Large avatar, name, title, model, cost
  - Personality description and backstory
  - Strengths list (green bullets)
  - Weaknesses list (red bullets)
- CRT scanline overlay on avatar
- Escape or click outside to close

### Resizable Sidebar
- Drag the left edge to resize between 150-400px
- Width persists in localStorage across sessions

### Idle Agent-to-Agent Chatter
- After 3+ minutes of user inactivity, agents occasionally chat
- 4-7 minutes between attempts, 40% chance to skip
- Max 3 idle messages per session (hard cap)
- Prompts limited to one short sentence

### Agent Personality Upgrades
- Richer system prompts with inter-agent awareness
- Gemma/Mistral friendly rivalry dynamics
- Agents only respond when addressed (room etiquette)
- Scribe personality: quiet professional with notebook

---

## 2026-04-07 — v0.3: The Full Crew

### New Agents
- **Mistral** (mistral-small-3.1-24b): Creative lateral thinker, dry wit, punchy responses. $0.03/$0.11 per M tokens.
- **Scribe** (nemotron-3-nano-30b:free): Silent note-taker and archivist. FREE.

### Note System + Obsidian Export
- `/notes [topic]` asks Scribe to compile structured session notes
- Notes formatted as Obsidian-compatible Markdown (YAML frontmatter, wikilinks, checkboxes)
- `/export` downloads the last compiled notes as a timestamped .md file

### Agent Targeting
- `@gemma`, `@mistral`, `@scribe` to direct messages
- Default: unaddressed messages go to chat only

### Avatars
- All four avatars as Fallout Pip-Boy style pixel art SVGs with CRT scanlines

### Deployment
- Live at https://apoc.pages.dev
- Cloudflare Pages with baked production env vars

---

## 2026-04-07 — v0.2: Fallout x Yahoo Lounge

### UI Overhaul
- Fallout retro-futuristic meets Yahoo Chat Lounge aesthetic
- CRT scanline overlay and subtle green screen glow
- Amber (#C9A84C) and phosphor green palette
- Share Tech Mono + VT323 fonts
- Bigger avatar cards in sidebar, room description header
- Pip-Boy style panel frames, glowing status dots

### Multi-Room System
- Main Room, Project Room, Makers Space
- Per-room message history in localStorage

### Slash Commands
- `/me`, `/clear`, `/reset`, `/budget`, `/resetbudget`, `/help`
- Input highlights amber in command mode

### Markdown, Sound Effects, Agent Mood, Message Search
- Markdown rendering (bold, italic, code)
- Web Audio API synth sounds with SFX toggle
- Agent mood shifts by time of day and conversation depth
- Search with match count and amber highlighting

---

## 2026-04-07 — v0.1: Phase 0 Launch

### Built
- Retro chat room UI, Gemma 4 31B via OpenRouter, streaming SSE
- Cloudflare Worker proxy with CORS and auth
- Agent registry, token budget system, localStorage persistence
- System messages, typing indicator, auto-scroll

### Infrastructure
- GitHub: https://github.com/GamerDad29/apoc
- Worker: `apoc-proxy.gamerdad29.workers.dev`
- Stack: Vite + React + TypeScript, Cloudflare Worker, OpenRouter API

---

## Backlog (Next Session)

### Quick Wins
- **Cloudflare Pages CI** -- hook up GitHub auto-deploy so every push goes live
- **Timestamp grouping on emotes** -- dim or collapse rapid emotes
- **Agent memory across sessions** -- persist last N messages per room to Cloudflare KV

### Medium Lifts
- **Agent-to-agent debate mode** -- `/discuss <topic>` and watch Gemma and Mistral go back and forth (scaffolding already exists)
- **More agents** -- add a coder (Devstral), a researcher, or a wild card personality
- **Notification system** -- subtle ping when activity happens in another room
- **Theme switcher** -- Fallout green (default), blue Vault-Tec variant, amber-only Pip-Boy mode

### Bigger Plays
- **Persistent memory via Cloudflare KV** -- agents remember across sessions
- **File/image sharing in chat** -- drop images, agents can reference them
- **Mobile responsive polish** -- works on mobile but could be tighter
- **Custom agent builder** -- `/agent create` to spin up a new agent with a custom persona on the fly
