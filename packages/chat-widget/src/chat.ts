import type { CLIChatSDK } from "./index";
import type { Message, ChatEvent } from "./types";

/**
 * CLIChat — chat interaction API
 *
 * Methods for sending messages, reading conversation history,
 * and controlling the chat session.
 */
class CLIChat {
  private sdk: CLIChatSDK;

  constructor(sdk: CLIChatSDK) {
    this.sdk = sdk;
  }

  /**
   * Send a text message from the visitor.
   */
  send(text: string) {
    if (!window.$cliChat) return;
    window.$cliChat.push(["send", text]);
  }

  /**
   * Get the current conversation messages.
   * Returns a promise that resolves with the message array.
   */
  getMessages(): Promise<Message[]> {
    return new Promise((resolve) => {
      if (!window.$cliChat) {
        resolve([]);
        return;
      }
      window.$cliChat.push(["get:messages", resolve]);
    });
  }

  /**
   * Clear the current conversation history.
   */
  clear() {
    if (!window.$cliChat) return;
    window.$cliChat.push(["clear"]);
  }

  /**
   * Set visitor metadata (name, email, custom fields).
   */
  setVisitor(data: { name?: string; email?: string; [key: string]: any }) {
    if (!window.$cliChat) return;
    window.$cliChat.push(["set:visitor", data]);
  }

  /**
   * Trigger the "connect with a human" escalation path.
   */
  escalateToHuman() {
    if (!window.$cliChat) return;
    window.$cliChat.push(["escalate"]);
  }
}

export default CLIChat;
