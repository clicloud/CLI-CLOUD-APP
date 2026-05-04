/**
 * @clicloud/chat-widget — CDN/Script-tag Loader
 * Self-executing loader that reads data attributes from the script tag,
 * initializes the SDK, and processes any queued commands from window.$cliChat.
 */
import { CliChatSDK } from './sdk';
import type { WidgetConfig, QueueEntry } from './types';

declare global {
  interface Window {
    $cliChat?: {
      push: (...args: unknown[]) => void;
      _q?: QueueEntry[];
    };
  }
}

function getScriptConfig(): Partial<WidgetConfig> {
  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) return {};
  return {
    orgId: script.dataset.org || script.dataset.orgId || '',
    position: (script.dataset.position as WidgetConfig['position']) || undefined,
    themeColor: script.dataset.theme || script.dataset.color || undefined,
    assistantName: script.dataset.name || undefined,
    greeting: script.dataset.greeting || undefined,
    apiUrl: script.dataset.api || undefined,
    autoOpenDelay: script.dataset.autoOpen ? Number(script.dataset.autoOpen) : undefined,
    showBranding: script.dataset.branding !== 'false',
    locale: script.dataset.locale || undefined,
    bubbleIcon: script.dataset.icon || undefined,
  };
}

function bootstrap(): void {
  const scriptConfig = getScriptConfig();
  if (!scriptConfig.orgId) {
    console.error('[CLI Chat Widget] data-org attribute is required on the script tag');
    return;
  }

  const sdk = new CliChatSDK(scriptConfig as WidgetConfig);

  // Process command queue
  const queue = window.$cliChat?._q || [];
  for (const entry of queue) {
    sdk.push(entry.command, ...entry.args);
  }

  // Replace queue with live API
  window.$cliChat = {
    push: (...args: unknown[]) => {
      const command = args[0] as string;
      const rest = args.slice(1);
      sdk.push(command, ...rest);
    },
  };

  // Mount if not already told not to
  if (!scriptConfig.apiUrl || scriptConfig.apiUrl !== 'defer') {
    sdk.mount();
  }
}

// Auto-bootstrap when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

export { bootstrap };
