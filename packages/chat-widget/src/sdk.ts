/**
 * @clicloud/chat-widget — Core SDK
 * Singleton pattern with Crisp-style command queue.
 * Zero runtime dependencies. Shadow DOM encapsulation.
 */
import type {
  WidgetConfig,
  ChatMessage,
  ChatSession,
  CliChatAPI,
  WidgetEvents,
} from './types';

const DEFAULT_CONFIG: Required<WidgetConfig> = {
  orgId: '',
  position: 'bottom-right',
  themeColor: '#EA5600',
  assistantName: 'Clide',
  greeting: 'Hey! How can I help you today?',
  apiUrl: 'https://api.cli.cloud',
  autoOpenDelay: 0,
  showBranding: true,
  customClass: '',
  bubbleIcon: '',
  locale: 'en',
};

type EventCallback = (data: unknown) => void;

export class CliChatSDK implements CliChatAPI {
  private config: Required<WidgetConfig>;
  private session: ChatSession | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private host: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private isOpen = false;
  private destroyed = false;

  constructor(config: WidgetConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (!this.config.orgId) {
      throw new Error('[CLI Chat Widget] orgId is required');
    }
  }

  // ─── Public API ────────────────────────────────────────

  configure(config: Partial<WidgetConfig>): void {
    Object.assign(this.config, config);
    if (this.shadow) this.reRender();
  }

  open(): void {
    if (this.destroyed) return;
    this.isOpen = true;
    this.updateVisibility();
    this.emit('widget:opened', undefined);
  }

  close(): void {
    if (this.destroyed) return;
    this.isOpen = false;
    this.updateVisibility();
    this.emit('widget:closed', undefined);
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  async sendMessage(text: string): Promise<void> {
    if (!text.trim() || this.destroyed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    this.addMessage(userMsg);
    this.emit('message:sent', userMsg);
    this.appendBubble(userMsg.content, 'user');
    this.showTyping();

    try {
      const reply = await this.fetchReply(userMsg);
      this.hideTyping();
      this.addMessage(reply);
      this.emit('message:received', reply);
      this.appendBubble(reply.content, 'assistant');
    } catch (err) {
      this.hideTyping();
      const errorMsg = 'Something went wrong. Please try again.';
      this.appendBubble(errorMsg, 'system');
      this.emit('error', {
        code: 'api_error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  on<K extends keyof WidgetEvents>(
    event: K,
    callback: (data: WidgetEvents[K]) => void,
  ): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback as EventCallback);
  }

  off<K extends keyof WidgetEvents>(
    event: K,
    callback: (data: WidgetEvents[K]) => void,
  ): void {
    this.listeners.get(event)?.delete(callback as EventCallback);
  }

  push(command: string, ...args: unknown[]): void {
    const method = (this as Record<string, unknown>)[command];
    if (typeof method === 'function') {
      (method as (...a: unknown[]) => void).apply(this, args);
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.host?.remove();
    this.host = null;
    this.shadow = null;
    this.session = null;
    this.listeners.clear();
  }

  // ─── Lifecycle ─────────────────────────────────────────

  mount(): void {
    if (this.destroyed || this.host) return;
    this.host = document.createElement('div');
    this.host.id = 'cli-chat-widget';
    if (this.config.customClass) this.host.className = this.config.customClass;
    this.shadow = this.host.attachShadow({ mode: 'open' });
    this.render();
    document.body.appendChild(this.host);
    this.bindEvents();

    if (this.config.autoOpenDelay > 0) {
      setTimeout(() => this.open(), this.config.autoOpenDelay * 1000);
    }
  }

  // ─── Rendering ─────────────────────────────────────────

  private render(): void {
    if (!this.shadow) return;
    this.shadow.innerHTML = this.buildHTML();
    this.injectStyles();
  }

  private reRender(): void {
    this.render();
  }

  private buildHTML(): string {
    const pos = this.config.position === 'bottom-left' ? 'left:20px;' : 'right:20px;';
    const themeColor = this.config.themeColor;

    return `
      <div class="cli-bubble" style="${pos}" title="Chat with ${this.config.assistantName}">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="cli-panel" style="${pos}; display:none;">
        <div class="cli-header" style="background:${themeColor}">
          <span class="cli-title">${this.config.assistantName}</span>
          <button class="cli-close" aria-label="Close chat">&times;</button>
        </div>
        <div class="cli-messages">
          <div class="cli-msg assistant">
            <div class="cli-msg-text">${this.config.greeting}</div>
          </div>
        </div>
        <div class="cli-typing" style="display:none;">
          <span class="cli-dot"></span>
          <span class="cli-dot"></span>
          <span class="cli-dot"></span>
        </div>
        <div class="cli-input-area">
          <input type="text" class="cli-input" placeholder="Type a message..." autocomplete="off" />
          <button class="cli-send" style="background:${themeColor}" aria-label="Send">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
        ${this.config.showBranding ? '<div class="cli-branding">Powered by <a href="https://cli.cloud" target="_blank">CLI</a></div>' : ''}
      </div>
    `;
  }

  private injectStyles(): void {
    if (!this.shadow) return;
    const style = document.createElement('style');
    style.textContent = `
      .cli-bubble {
        position: fixed; bottom: 20px; width: 56px; height: 56px;
        border-radius: 50%; background: ${this.config.themeColor};
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 999999;
        transition: transform 0.2s ease;
      }
      .cli-bubble:hover { transform: scale(1.08); }
      .cli-panel {
        position: fixed; bottom: 90px; width: 380px; max-height: 560px;
        background: #0a0a0a; border-radius: 16px; overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 999998;
        display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .cli-header {
        padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
        color: white; font-size: 15px; font-weight: 600;
      }
      .cli-close {
        background: none; border: none; color: white; font-size: 22px;
        cursor: pointer; padding: 0 4px; line-height: 1;
      }
      .cli-messages {
        flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
        color: #e0e0e0; font-size: 14px; line-height: 1.5;
      }
      .cli-msg { max-width: 85%; }
      .cli-msg.user { align-self: flex-end; }
      .cli-msg.assistant, .cli-msg.system { align-self: flex-start; }
      .cli-msg-text {
        padding: 10px 14px; border-radius: 14px;
      }
      .cli-msg.user .cli-msg-text {
        background: ${this.config.themeColor}; color: white; border-bottom-right-radius: 4px;
      }
      .cli-msg.assistant .cli-msg-text {
        background: #1a1a1a; color: #e0e0e0; border-bottom-left-radius: 4px;
      }
      .cli-msg.system .cli-msg-text {
        background: #2a1a1a; color: #ff8888; font-style: italic;
      }
      .cli-typing {
        padding: 4px 16px 8px; display: flex; gap: 4px; align-items: center;
      }
      .cli-dot {
        width: 7px; height: 7px; border-radius: 50%; background: #666;
        animation: cli-pulse 1.4s infinite ease-in-out;
      }
      .cli-dot:nth-child(2) { animation-delay: 0.2s; }
      .cli-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes cli-pulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1); }
      }
      .cli-input-area {
        display: flex; padding: 12px 14px; gap: 8px; border-top: 1px solid #1a1a1a;
      }
      .cli-input {
        flex: 1; background: #111; border: 1px solid #333; border-radius: 10px;
        color: #e0e0e0; padding: 10px 14px; font-size: 14px; outline: none;
      }
      .cli-input:focus { border-color: ${this.config.themeColor}; }
      .cli-input::placeholder { color: #555; }
      .cli-send {
        width: 42px; height: 42px; border-radius: 10px; border: none;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: opacity 0.15s;
      }
      .cli-send:hover { opacity: 0.85; }
      .cli-branding {
        text-align: center; padding: 6px; font-size: 11px; color: #555;
      }
      .cli-branding a { color: ${this.config.themeColor}; text-decoration: none; }
    `;
    this.shadow.prepend(style);
  }

  // ─── Events ────────────────────────────────────────────

  private bindEvents(): void {
    if (!this.shadow) return;
    const bubble = this.shadow.querySelector('.cli-bubble');
    const closeBtn = this.shadow.querySelector('.cli-close');
    const input = this.shadow.querySelector('.cli-input') as HTMLInputElement | null;
    const sendBtn = this.shadow.querySelector('.cli-send');

    bubble?.addEventListener('click', () => this.toggle());
    closeBtn?.addEventListener('click', () => this.close());
    sendBtn?.addEventListener('click', () => {
      if (input?.value) {
        this.sendMessage(input.value);
        input.value = '';
      }
    });
    input?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && input.value) {
        this.sendMessage(input.value);
        input.value = '';
      }
    });
  }

  private updateVisibility(): void {
    const panel = this.shadow?.querySelector('.cli-panel') as HTMLElement | null;
    const bubble = this.shadow?.querySelector('.cli-bubble') as HTMLElement | null;
    if (panel) panel.style.display = this.isOpen ? 'flex' : 'none';
    if (bubble) bubble.style.display = this.isOpen ? 'none' : 'flex';
  }

  // ─── Chat Logic ────────────────────────────────────────

  private appendBubble(text: string, role: 'user' | 'assistant' | 'system'): void {
    const container = this.shadow?.querySelector('.cli-messages');
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = `cli-msg ${role}`;
    msg.innerHTML = `<div class="cli-msg-text">${this.escapeHTML(text)}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  private showTyping(): void {
    const el = this.shadow?.querySelector('.cli-typing') as HTMLElement | null;
    if (el) el.style.display = 'flex';
  }

  private hideTyping(): void {
    const el = this.shadow?.querySelector('.cli-typing') as HTMLElement | null;
    if (el) el.style.display = 'none';
  }

  private addMessage(msg: ChatMessage): void {
    if (!this.session) {
      this.session = {
        id: crypto.randomUUID(),
        orgId: this.config.orgId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.emit('session:created', this.session);
    }
    this.session.messages.push(msg);
    this.session.updatedAt = Date.now();
  }

  private async fetchReply(userMsg: ChatMessage): Promise<ChatMessage> {
    const res = await fetch(`${this.config.apiUrl}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId: this.config.orgId,
        sessionId: this.session?.id,
        message: userMsg.content,
      }),
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id || crypto.randomUUID(),
      role: 'assistant',
      content: data.content || data.message || data.text || '',
      timestamp: Date.now(),
      metadata: data.metadata,
    };
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((cb) => {
      try { cb(data); } catch { /* swallow listener errors */ }
    });
  }

  private escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
