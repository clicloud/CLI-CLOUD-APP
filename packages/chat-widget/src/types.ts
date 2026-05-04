/**
 * CLI Chat Widget — Type definitions
 */

export enum Position {
  Left = "left",
  Right = "right",
}

export type Theme = "light" | "dark" | "auto";

export type Options = {
  /** Override the default widget loader URL (for self-hosted deployments) */
  widgetUrl?: string;
  /** Auto-load the widget on configure() — default: true */
  autoload?: boolean;
  /** Widget position on the page — default: "right" */
  position?: Position;
  /** Primary brand color — default: "#EA5600" (CLI orange) */
  primaryColor?: string;
  /** Greeting message shown when chat opens — default: "Hi! How can we help?" */
  greeting?: string;
  /** Language locale — default: "en" */
  locale?: string;
  /** Color theme — default: "dark" */
  theme?: Theme;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

export type ChatEvent = {
  type: "message" | "open" | "close" | "ready" | "error";
  payload?: any;
};
