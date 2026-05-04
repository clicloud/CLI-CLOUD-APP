/**
 * @clicloud/chat-widget — Type definitions
 * Embeddable Clide-powered chat widget for any website.
 */

/** Configuration passed to the widget */
export interface WidgetConfig {
  /** Organization ID from CLI dashboard */
  orgId: string;
  /** Where to position the chat bubble */
  position?: 'bottom-right' | 'bottom-left';
  /** Theme color for the bubble and header (hex) */
  themeColor?: string;
  /** Assistant display name */
  assistantName?: string;
  /** Greeting message shown when chat opens */
  greeting?: string;
  /** API base URL (defaults to https://api.cli.cloud) */
  apiUrl?: string;
  /** Auto-open after N seconds (0 = disabled) */
  autoOpenDelay?: number;
  /** Show "Powered by CLI" branding */
  showBranding?: boolean;
  /** Custom CSS class for the host element */
  customClass?: string;
  /** Icon URL for the chat bubble (defaults to CLI logo) */
  bubbleIcon?: string;
  /** Locale for i18n (defaults to 'en') */
  locale?: string;
}

/** A single chat message */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Session state for the current conversation */
export interface ChatSession {
  id: string;
  orgId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/** Events emitted by the widget */
export interface WidgetEvents {
  'widget:opened': void;
  'widget:closed': void;
  'message:sent': ChatMessage;
  'message:received': ChatMessage;
  'session:created': ChatSession;
  'escalation:requested': { sessionId: string; lastMessage: string };
  'error': { code: string; message: string };
}

/** Command queue entry (Crisp-style) */
export interface QueueEntry {
  command: string;
  args: unknown[];
}

/** Widget API surface exposed via window.$cliChat */
export interface CliChatAPI {
  configure: (config: Partial<WidgetConfig>) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  sendMessage: (text: string) => void;
  on: <K extends keyof WidgetEvents>(
    event: K,
    callback: (data: WidgetEvents[K]) => void
  ) => void;
  off: <K extends keyof WidgetEvents>(
    event: K,
    callback: (data: WidgetEvents[K]) => void
  ) => void;
  push: (command: string, ...args: unknown[]) => void;
  destroy: () => void;
}
