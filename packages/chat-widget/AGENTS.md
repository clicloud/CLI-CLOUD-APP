# Chat Widget Package — AI Agent Notes

This package is the embeddable CLI chat widget SDK.

## Key files
- `src/index.ts` — Main SDK singleton, configure/load API, DOM injection
- `src/loader.ts` — Inline loader script (served from CDN as widget.js)
- `src/types.ts` — TypeScript type definitions
- `src/chat.ts` — Chat interaction methods (send, clear, escalate)

## Patterns
- Follows Crisp SDK convention: singleton class, `window.$cliChat` global, `.push()` command queue
- Shadow DOM for style isolation from host page
- Dual build: ESM (npm) + UMD (CDN script tag)
- Fetch-based transport for MVP; WebSocket upgrade path planned

## API endpoint
- `POST https://api.cli.cloud/v1/chat/message` — send message, receive reply
- Headers: `X-Org-ID`, `Authorization: Bearer <session_token>`
- Response: `{ reply: string, session_token?: string }`

## Constraints
- Zero runtime dependencies
- Target < 15KB gzipped
- Must work on any HTML page without build tools
