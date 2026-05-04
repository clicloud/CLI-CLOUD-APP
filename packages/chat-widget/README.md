# @clicloud/chat-widget

Embeddable CLI chat widget — drop-in script tag or npm package for AI-powered support chat on any website.

## Install

### Script tag (CDN)

```html
<script src="https://cdn.cli.cloud/widget.js" data-org="your-org-id"></script>
```

### npm

```bash
npm install @clicloud/chat-widget
```

```ts
import { CLIChat, Position } from "@clicloud/chat-widget";

CLIChat.configure("your-org-id", {
  position: Position.Right,
  primaryColor: "#EA5600",
  greeting: "Hi! How can we help?",
  theme: "dark",
});
```

## Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `position` | `"left"` or `"right"` | `"right"` | Widget position on the page |
| `primaryColor` | `string` | `"#EA5600"` | Brand color (CLI orange) |
| `greeting` | `string` | `"Hi! How can we help?"` | First message shown |
| `locale` | `string` | `"en"` | Language locale |
| `theme` | `"light"` or `"dark"` or `"auto"` | `"dark"` | Color theme |
| `autoload` | `boolean` | `true` | Auto-load on configure |
| `widgetUrl` | `string` | CDN URL | Override loader URL for self-hosted |

## API

```ts
// Show/hide the entire widget
CLIChat.show();
CLIChat.hide();

// Open/close the chat panel
CLIChat.open();
CLIChat.close();

// Send a message programmatically
CLIChat.chat.send("Hello!");

// Set visitor metadata
CLIChat.chat.setVisitor({ name: "John", email: "john@example.com" });

// Escalate to human support
CLIChat.chat.escalateToHuman();

// Clear conversation
CLIChat.chat.clear();

// Event listeners
CLIChat.on("message", (msg) => console.log(msg));
CLIChat.on("open", () => console.log("Chat opened"));
CLIChat.off("message");
```

## Architecture

```
Browser (Widget JS — this package)
  ↕ HTTPS
CLI Chat Gateway API (api.cli.cloud/v1/chat)
  ↕
Clide Engine (LLM, context, knowledge base)
  ↕
Escalation Router → Telegram / Dashboard / Email
```

### Package structure

```
packages/chat-widget/
├── src/
│   ├── index.ts      # SDK class, singleton, DOM injection
│   ├── types.ts      # TypeScript types and enums
│   ├── chat.ts       # Chat interaction API
│   └── loader.ts     # Inline loader (served from CDN)
├── dist/             # Built output (ESM + UMD)
├── package.json
├── tsconfig.json
├── rollup.config.mjs
└── README.md
```

### Design decisions

- **Singleton pattern** — mirrors Crisp SDK convention (`window.$cliChat`)
- **Shadow DOM** — style encapsulation, no CSS conflicts with host page
- **Dual build** — ESM for bundlers, UMD for script tags
- **Zero dependencies** — vanilla TypeScript, < 15KB gzipped target
- **Fetch transport** — no WebSocket dependency for MVP; upgrade path to WSS

## Build

```bash
npm install
npm run build
```

Outputs:
- `dist/cli-chat.esm.js` — ES module build
- `dist/cli-chat.umd.cjs` — UMD build (works in browsers via script tag)
- `dist/index.d.ts` — TypeScript declarations

## Development

```bash
npm run dev        # Watch mode
npm run typecheck  # Type checking
npm run lint       # ESLint
```

## License

MIT — cli.cloud
