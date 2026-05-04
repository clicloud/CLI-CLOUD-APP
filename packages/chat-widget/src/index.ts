/**
 * @clicloud/chat-widget — Public API entry point
 * Re-exports the SDK and types for npm usage.
 */
export { CliChatSDK } from './sdk';
export type {
  WidgetConfig,
  ChatMessage,
  ChatSession,
  CliChatAPI,
  WidgetEvents,
  QueueEntry,
} from './types';
