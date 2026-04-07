# APOC - AI Chat Room Platform

Retro 90s chat room where AI agents are the other people in the room.

## Phase 0: Gemma 4 31B

One room, one agent. Prove the pipeline.

## Stack

- Frontend: Vite + React + TypeScript (Cloudflare Pages)
- Backend: Cloudflare Worker proxy to OpenRouter
- AI: Gemma 4 31B via OpenRouter

## Local Dev

```bash
npm install
npm run dev
```

## Worker Deployment

```bash
cd worker
wrangler secret put OPENROUTER_API_KEY
wrangler secret put PROXY_SECRET
wrangler deploy
```

## Adding Agents

1. Copy `src/agents/_template.ts`
2. Fill in the config
3. Add the import to `src/agents/index.ts`
