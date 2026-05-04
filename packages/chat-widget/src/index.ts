import { CLIChat } from "./chat";
import { Options, Position } from "./types";

/**
 * CLI Chat Widget SDK
 *
 * Embeddable support chat widget for cli.cloud.
 * Usage — script tag:
 *   <script src="https://cdn.cli.cloud/widget.js" data-org="your-org-id"></script>
 *
 * Usage — npm:
 *   import { CLIChat } from "@clicloud/chat-widget";
 *   CLIChat.configure("your-org-id", { position: Position.Right });
 */

declare global {
  var $cliChat: any;
  var CLI_CHAT_ORG_ID: string;
  var CLI_CHAT_CONFIG: any;
}

class CLIChatSDK {
  private widgetUrl: string = "https://widget.cli.cloud/loader.js";
  private orgId: string = "";
  private autoload: boolean = true;
  private position: Position = Position.Right;
  private primaryColor: string = "#EA5600";
  private greeting: string = "Hi! How can we help?";
  private locale: string = "en";
  private theme: "light" | "dark" | "auto" = "dark";

  private injected: boolean = false;

  chat: CLIChat;

  constructor() {
    this.chat = new CLIChat(this);
  }

  /**
   * Configure the CLI chat widget.
   *
   * @param orgId — Your CLI organization ID (required)
   * @param options — Widget configuration options
   */
  configure(orgId: string, options: Options = {}) {
    this.orgId = orgId;

    if (options.widgetUrl !== undefined) {
      this.widgetUrl = options.widgetUrl;
    }
    if (options.autoload !== undefined) {
      this.autoload = options.autoload;
    }
    if (options.position !== undefined) {
      this.position = options.position;
    }
    if (options.primaryColor !== undefined) {
      this.primaryColor = options.primaryColor;
    }
    if (options.greeting !== undefined) {
      this.greeting = options.greeting;
    }
    if (options.locale !== undefined) {
      this.locale = options.locale;
    }
    if (options.theme !== undefined) {
      this.theme = options.theme;
    }

    if (this.autoload) {
      this.load();
    }
  }

  /**
   * Load the widget client script into the page.
   * Called automatically when autoload is true (default).
   */
  load() {
    this.createSingletonIfNecessary();

    if (this.isInjected()) {
      return;
    }

    if (!this.orgId) {
      throw new Error("CLI Chat: orgId must be set before loading. Call CLIChat.configure('your-org-id') first.");
    }

    // Set globals for the loader script to read
    window.CLI_CHAT_ORG_ID = this.orgId;
    window.CLI_CHAT_CONFIG = {
      position: this.position,
      primaryColor: this.primaryColor,
      greeting: this.greeting,
      locale: this.locale,
      theme: this.theme,
    };

    // Inject the loader script
    const head = document.getElementsByTagName("head")[0];
    if (!head) {
      this.deferredLoading();
      return;
    }

    const script = document.createElement("script");
    script.src = this.widgetUrl;
    script.async = true;
    script.id = "cli-chat-widget-script";
    head.appendChild(script);

    this.injected = true;
  }

  /**
   * Unload the widget from the page.
   */
  unload() {
    const existing = document.getElementById("cli-chat-widget-script");
    if (existing) {
      existing.remove();
    }

    const container = document.getElementById("cli-chat-container");
    if (container) {
      container.remove();
    }

    this.injected = false;
    delete window.CLI_CHAT_ORG_ID;
    delete window.CLI_CHAT_CONFIG;
  }

  /**
   * Set the widget position.
   */
  setPosition(position: Position) {
    this.position = position;
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["config", "position", [position]]);
  }

  /**
   * Set the primary color theme.
   */
  setPrimaryColor(color: string) {
    this.primaryColor = color;
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["config", "primaryColor", [color]]);
  }

  /**
   * Set the greeting message shown when the chat opens.
   */
  setGreeting(message: string) {
    this.greeting = message;
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["config", "greeting", [message]]);
  }

  /**
   * Show the chat widget.
   */
  show() {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["show"]);
  }

  /**
   * Hide the chat widget.
   */
  hide() {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["hide"]);
  }

  /**
   * Open the chat panel.
   */
  open() {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["open"]);
  }

  /**
   * Close the chat panel.
   */
  close() {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["close"]);
  }

  /**
   * Register an event callback.
   */
  on(event: string, callback: (...args: any[]) => void) {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["on", event, callback]);
  }

  /**
   * Unregister an event callback.
   */
  off(event: string) {
    this.createSingletonIfNecessary();
    window.$cliChat?.push?.(["off", event]);
  }

  /**
   * Check if the widget is currently injected into the page.
   */
  isInjected(): boolean {
    return this.injected || !!window.$cliChat?.is;
  }

  /**
   * Auto-inject if not already loaded.
   */
  autoInjectIfNecessary() {
    if (!this.isInjected()) {
      this.load();
    }
  }

  private createSingletonIfNecessary() {
    if (window.$cliChat === undefined) {
      window.$cliChat = [];
    }
  }

  private deferredLoading() {
    document.addEventListener("DOMContentLoaded", () => {
      this.load();
    });
  }
}

// Singleton export — mirrors Crisp SDK pattern
const singleton = new CLIChatSDK();

export { singleton as CLIChat, CLIChatSDK as CLIChatClass };
export { CLIChat } from "./chat";
export { Options, Position, Theme } from "./types";
