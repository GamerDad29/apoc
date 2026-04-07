# APOC Changelog

## 2026-04-07 — Phase 0 Launch

### Built
- Full retro 90s chat room UI (dark blue-gray palette, IBM Plex Mono, beveled inputs, window chrome)
- Gemma 4 31B agent via OpenRouter with streaming SSE responses
- Cloudflare Worker proxy (`apoc-proxy`) with CORS, auth, and streaming passthrough
- Agent registry system: add a new agent by creating one config file and one import
- Token budget system (50k/session, 200k/day per agent) to prevent runaway spending
- Agent-to-agent exchange scaffolded (disabled, ready for Phase 1)
- Chat history persists in localStorage across page reloads
- System messages ("[Gemma has entered the room]") on load
- Typing indicator with animated dots
- Streaming cursor (blinking block) while agent responds
- User list sidebar with status dots (online/typing)
- Auto-scroll to bottom on new messages, pauses when user scrolls up

### Infrastructure
- GitHub repo: https://github.com/GamerDad29/apoc
- Worker deployed: `apoc-proxy.gamerdad29.workers.dev`
- Secrets set: `OPENROUTER_API_KEY`, `PROXY_SECRET`
- Stack: Vite + React + TypeScript, Cloudflare Worker, OpenRouter API

### Fixed
- Added localhost:5174 to Worker CORS allowlist
- Health check no longer disables chat input on network errors

### Pending
- Connect GitHub repo to Cloudflare Pages for production deployment
- Replace placeholder SVG avatars with real ones
- Phase 1: agent-to-agent conversation (Gemma + Mistral talking to each other)
