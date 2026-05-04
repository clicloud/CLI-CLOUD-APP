/**
 * CLI Chat Widget — Inline loader script
 *
 * This is the script served from https://cdn.cli.cloud/widget.js
 * It reads window.CLI_CHAT_ORG_ID and window.CLI_CHAT_CONFIG,
 * then renders the chat bubble and panel directly into the host page.
 *
 * Design principles:
 * - Zero dependencies, vanilla TS/JS
 * - < 15KB gzipped target
 * - Shadow DOM for style encapsulation (no CSS conflicts with host page)
 * - Fetch-based message transport (no WebSocket required for MVP)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface WidgetConfig {
  position?: "left" | "right";
  primaryColor?: string;
  greeting?: string;
  locale?: string;
  theme?: "light" | "dark" | "auto";
}

interface IncomingMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const API_BASE = "https://api.cli.cloud/v1/chat";
const CONTAINER_ID = "cli-chat-container";
const BUBBLE_SIZE = 56;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT = 560;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let orgId = "";
let config: Required<WidgetConfig>;
let open = false;
let sessionToken = "";
let messages: IncomingMessage[] = [];
let container: HTMLDivElement | null = null;

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULTS: Required<WidgetConfig> = {
  position: "right",
  primaryColor: "#EA5600",
  greeting: "Hi! How can we help?",
  locale: "en",
  theme: "dark",
};

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
function init() {
  orgId = (window as any).CLI_CHAT_ORG_ID || "";
  const rawConfig = (window as any).CLI_CHAT_CONFIG || {};
  config = { ...DEFAULTS, ...rawConfig };

  if (!orgId) {
    console.error("CLI Chat: Missing CLI_CHAT_ORG_ID. Add data-org to the script tag.");
    return;
  }

  render();
  (window as any).$cliChat = { is: true, push: handleCommand };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
function render() {
  // Remove existing container if re-rendering
  const existing = document.getElementById(CONTAINER_ID);
  if (existing) existing.remove();

  container = document.createElement("div");
  container.id = CONTAINER_ID;
  container.attachShadow({ mode: "open" });

  container.shadowRoot!.innerHTML = getStyles() + getHTML();

  document.body.appendChild(container);

  // Wire event listeners
  const bubble = container.shadowRoot!.querySelector("#cli-bubble") as HTMLButtonElement;
  const closeBtn = container.shadowRoot!.querySelector("#cli-close") as HTMLButtonElement;
  const input = container.shadowRoot!.querySelector("#cli-input") as HTMLInputElement;
  const sendBtn = container.shadowRoot!.querySelector("#cli-send") as HTMLButtonElement;

  bubble.addEventListener("click", togglePanel);
  closeBtn.addEventListener("click", () => setOpen(false));
  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

// ---------------------------------------------------------------------------
// Panel toggle
// ---------------------------------------------------------------------------
function togglePanel() {
  setOpen(!open);
}

function setOpen(value: boolean) {
  open = value;
  const panel = container?.shadowRoot?.querySelector("#cli-panel") as HTMLElement;
  const bubble = container?.shadowRoot?.querySelector("#cli-bubble") as HTMLElement;
  if (!panel || !bubble) return;

  panel.style.display = open ? "flex" : "none";
  bubble.style.display = open ? "none" : "flex";

  if (open) {
    const input = container?.shadowRoot?.querySelector("#cli-input") as HTMLInputElement;
    input?.focus();
    showGreeting();
  }
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------
let greetingShown = false;
function showGreeting() {
  if (greetingShown) return;
  greetingShown = true;
  appendMessage("assistant", config.greeting);
}

// ---------------------------------------------------------------------------
// Send message
// ---------------------------------------------------------------------------
async function handleSend() {
  const input = container?.shadowRoot?.querySelector("#cli-input") as HTMLInputElement;
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  appendMessage("user", text);

  try {
    const res = await fetch(`${API_BASE}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Org-ID": orgId,
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      },
      body: JSON.stringify({ message: text, locale: config.locale }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.session_token) sessionToken = data.session_token;

    appendMessage("assistant", data.reply || data.message || "Sorry, something went wrong.");
  } catch (err) {
    appendMessage("assistant", "Connection error. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// Message rendering
// ---------------------------------------------------------------------------
function appendMessage(role: "user" | "assistant", content: string) {
  const msg: IncomingMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: Date.now(),
  };
  messages.push(msg);

  const thread = container?.shadowRoot?.querySelector("#cli-thread");
  if (!thread) return;

  const bubble = document.createElement("div");
  bubble.className = `cli-msg cli-msg-${role}`;
  bubble.textContent = content;
  thread.appendChild(bubble);
  thread.scrollTop = thread.scrollHeight;
}

// ---------------------------------------------------------------------------
// Command handler (mirrors window.$cliChat.push pattern)
// ---------------------------------------------------------------------------
function handleCommand(cmd: any[]) {
  const [action, ...args] = cmd;
  switch (action) {
    case "config":
      // ["config", key, [value]]
      if (args[0] === "position") config.position = args[1][0];
      if (args[0] === "primaryColor") config.primaryColor = args[1][0];
      if (args[0] === "greeting") config.greeting = args[1][0];
      break;
    case "show":
      if (container) container.style.display = "block";
      break;
    case "hide":
      if (container) container.style.display = "none";
      break;
    case "open":
      setOpen(true);
      break;
    case "close":
      setOpen(false);
      break;
    case "send":
      if (typeof args[0] === "string") {
        appendMessage("user", args[0]);
      }
      break;
    case "set:visitor":
      // TODO: forward visitor data to API
      break;
    case "clear":
      messages = [];
      greetingShown = false;
      const thread = container?.shadowRoot?.querySelector("#cli-thread");
      if (thread) thread.innerHTML = "";
      break;
    case "on":
    case "off":
      // Event registration — deferred to full implementation
      break;
  }
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------
function getHTML(): string {
  const isLeft = config.position === "left";
  const bubbleRight = isLeft ? "auto" : "24px";
  const bubbleLeft = isLeft ? "24px" : "auto";
  const panelRight = isLeft ? "auto" : "24px";
  const panelLeft = isLeft ? "24px" : "auto";

  const isDark = config.theme === "dark";
  const bgColor = isDark ? "#0a0a0a" : "#ffffff";
  const textColor = isDark ? "#e5e5e5" : "#171717";
  const mutedColor = isDark ? "#737373" : "#a3a3a3";
  const inputBg = isDark ? "#1a1a1a" : "#f5f5f5";
  const inputBorder = isDark ? "#2a2a2a" : "#e5e5e5";

  return `
<div id="cli-bubble" style="position:fixed;bottom:24px;right:${bubbleRight};left:${bubbleLeft};width:${BUBBLE_SIZE}px;height:${BUBBLE_SIZE}px;border-radius:50%;background:${config.primaryColor};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:999999;transition:transform 0.2s;" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform='scale(1)'">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
</div>
<div id="cli-panel" style="display:none;position:fixed;bottom:24px;right:${panelRight};left:${panelLeft};width:${PANEL_WIDTH}px;height:${PANEL_HEIGHT}px;max-height:calc(100vh - 48px);background:${bgColor};border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:999998;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid ${inputBorder};">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:32px;height:32px;border-radius:50%;background:${config.primaryColor};display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <span style="font-weight:600;color:${textColor};font-size:15px;">CLI Chat</span>
    </div>
    <button id="cli-close" style="background:none;border:none;cursor:pointer;padding:4px;color:${mutedColor};" aria-label="Close chat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <div id="cli-thread" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;"></div>
  <div style="padding:12px;border-top:1px solid ${inputBorder};display:flex;gap:8px;">
    <input id="cli-input" type="text" placeholder="Type a message..." style="flex:1;padding:10px 14px;border:1px solid ${inputBorder};border-radius:8px;background:${inputBg};color:${textColor};font-size:14px;outline:none;font-family:inherit;" />
    <button id="cli-send" style="background:${config.primaryColor};color:white;border:none;border-radius:8px;padding:10px 16px;cursor:pointer;font-size:14px;font-weight:600;font-family:inherit;">Send</button>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
function getStyles(): string {
  return `
<style>
  .cli-msg {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    animation: cliFadeIn 0.2s ease-out;
  }
  .cli-msg-user {
    align-self: flex-end;
    background: ${config.primaryColor};
    color: white;
    border-bottom-right-radius: 4px;
  }
  .cli-msg-assistant {
    align-self: flex-start;
    background: ${config.theme === "dark" ? "#1a1a1a" : "#f0f0f0"};
    color: ${config.theme === "dark" ? "#e5e5e5" : "#171717"};
    border-bottom-left-radius: 4px;
  }
  @keyframes cliFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #cli-thread::-webkit-scrollbar { width: 4px; }
  #cli-thread::-webkit-scrollbar-track { background: transparent; }
  #cli-thread::-webkit-scrollbar-thumb { background: ${config.theme === "dark" ? "#333" : "#ccc"}; border-radius: 2px; }
  #cli-input:focus { border-color: ${config.primaryColor}; }
  #cli-send:hover { opacity: 0.9; }
</style>`;
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
