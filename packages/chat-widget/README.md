# @clicloud/chat-widget

Embeddable Clide-powered chat widget for any website. Drop-in script tag or npm package.

## Install

### Script Tag (CDN)
```html
<script src="https://cdn.cli.cloud/widget.js" data-org="your-org-id"></script>
```

### npm
```bash
npm install @clicloud/chat-widget
```

```ts
import { CliChatSDK } from '@clicloud/chat-widget';

const chat = new CliChatSDK({
  orgId: 'your-org-id',
  assistantName: 'Support',
  themeColor: '#EA5600',
  greeting: 'Hey! How can I help?',
});

chat.mount();
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orgId` | string | required | Your organization ID |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Bubble position |
| `themeColor` | string | `'#EA5600'` | Primary color (hex) |
| `assistantName` | string | `'Clide'` | Display name in header |
| `greeting` | string | `'Hey! How can I help you today?'` | First message |
| `apiUrl` | string | `'https://api.cli.cloud'` | API base URL |
| `autoOpenDelay` | number | `0` | Auto-open after N seconds |
| `showBranding` | boolean | `true` | Show "Powered by CLI" |
| `bubbleIcon` | string | CLI logo | Custom bubble icon URL |
| `locale` | string | `'en'` | Language code |

## Script Tag Data Attributes

All config options are available as `data-*` attributes:

```html
<script
  src="https://cdn.cli.cloud/widget.js"
  data-org="your-org-id"
  data-position="bottom-left"
  data-theme="#3366ff"
  data-name="Acme Support"
  data-greeting="Need help? Ask away!"
  data-auto-open="5"
  data-branding="true"
></script>
```

## API (window.$cliChat)

Crisp-style command queue — call before or after the script loads:

```js
window.$cliChat = window.$cliChat || [];
window.$cliChat.push('open');
window.$cliChat.push('sendMessage', 'Hello!');
window.$cliChat.push('configure', { themeColor: '#0066ff' });
```

### Methods

- `open()` — Open the chat panel
- `close()` — Close the chat panel
- `toggle()` — Toggle open/closed
- `sendMessage(text)` — Send a message programmatically
- `configure(config)` — Update configuration
- `destroy()` — Remove widget from DOM

### Events

```js
window.$cliChat.push('on', 'message:received', (msg) => {
  console.log('Reply:', msg.content);
});
```

| Event | Data |
|-------|------|
| `widget:opened` | — |
| `widget:closed` | — |
| `message:sent` | `ChatMessage` |
| `message:received` | `ChatMessage` |
| `session:created` | `ChatSession` |
| `escalation:requested` | `{ sessionId, lastMessage }` |
| `error` | `{ code, message }` |

## Architecture

- Zero runtime dependencies
- Shadow DOM encapsulation (no CSS conflicts)
- Under 15KB gzipped
- Singleton pattern with command queue
- TypeScript with full type exports

## Build

```bash
npm run build    # ESM + CJS + UMD
npm run dev      # Watch mode
```

## License

MIT
