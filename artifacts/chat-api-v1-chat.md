/**
 * CLI Chat Widget Backend — Vercel Serverless Function
 * POST /v1/chat
 *
 * Receives widget messages, processes them through an LLM with CLI knowledge,
 * and returns structured responses.
 *
 * Deploy as: api/v1/chat.ts in a Vercel project, or as a standalone function.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Types ───────────────────────────────────────────────────────────

interface ChatRequest {
  orgId: string;
  sessionId?: string;
  message: string;
}

interface ChatResponse {
  id: string;
  content: string;
  metadata?: {
    model?: string;
    latencyMs?: number;
    escalation?: boolean;
  };
}

// ─── CLI Knowledge Base ──────────────────────────────────────────────

const CLI_SYSTEM_PROMPT = `You are Clide, the AI assistant for CLI (cli.cloud). You help users understand and use the CLI platform.

Key facts about CLI:
- CLI is a deploy-first cloud platform. Users deploy containers with one command or one click.
- CLI runs on dedicated cloud infrastructure (DigitalOcean hypervisor). Zero telemetry by default.
- Every deployment is signed with cosign for tamper evidence.
- Agent-first workflow: designed for Claude Code, Cursor, and coding agents.
- SOC 2 Type II validated, FedRAMP-ready, Zero Trust networking.
- 47-second deploys from git push to live URL.
- Zero telemetry — CLI does not collect analytics or tracking data.
- Two service paths: bespoke software engineering services (CLI engineers build custom solutions), and self-service container deployment.
- Templates available: Next.js, FastAPI, Telegram Bot, Express, Static HTML, and custom Docker images.
- CLI tokens are optional — stake for discounted compute, or pay with card/USDC.
- Atomic rollback: if a new deployment fails health checks, traffic never moves.

Response rules:
- Be concise and helpful. 1-3 sentences for most questions.
- If asked about pricing, direct them to the CLI website or say "contact the team for custom pricing."
- If asked about token allocation, migration, roadmap details, or anything you're unsure about, say: "Thanks for asking — the team will follow up with an official update on that."
- Never invent features, pricing, or technical details.
- For support inquiries beyond basic questions, offer to escalate to the CLI team.
- For bespoke engineering inquiries, confirm it's a service CLI offers and suggest contacting the team.`;

// ─── Rate Limiting (in-memory, per-instance) ─────────────────────────

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 messages per minute per session

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ─── LLM Integration ────────────────────────────────────────────────

async function getLLMResponse(message: string): Promise<{ content: string; model: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback: return a helpful deflection when no LLM key is configured
    return {
      content: "Thanks for reaching out! A team member will follow up with you shortly. You can also reach us at @svgops or @selIthenews on Telegram.",
      model: "fallback",
    };
  }

  // Prefer Anthropic Claude if both keys exist
  if (process.env.ANTHROPIC_API_KEY) {
    return await callAnthropic(message);
  }

  return await callOpenAI(message);
}

async function callAnthropic(message: string): Promise<{ content: string; model: string }> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 512,
      system: CLI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Anthropic API error:', res.status, err);
    throw new Error(`LLM API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { content: text, model: 'claude-3-5-haiku' };
}

async function callOpenAI(message: string): Promise<{ content: string; model: string }> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [
        { role: 'system', content: CLI_SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenAI API error:', res.status, err);
    throw new Error(`LLM API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { content: text, model: 'gpt-4o-mini' };
}

// ─── Handler ─────────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Parse body
  const { orgId, sessionId, message }: ChatRequest = req.body;

  if (!orgId || !message) {
    res.status(400).json({ error: 'orgId and message are required' });
    return;
  }

  // Rate limit
  const sid = sessionId || orgId;
  if (!checkRateLimit(sid)) {
    res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment.' });
    return;
  }

  const start = Date.now();

  try {
    const { content, model } = await getLLMResponse(message);
    const latencyMs = Date.now() - start;

    const response: ChatResponse = {
      id: crypto.randomUUID(),
      content,
      metadata: {
        model,
        latencyMs,
        escalation: content.includes('team will follow up'),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Chat handler error:', error);
    res.status(500).json({
      error: 'Internal error. Please try again.',
    });
  }
}
