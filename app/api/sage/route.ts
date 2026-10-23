/**
 * "Ask the Sage": server endpoint for the sanctuary’s AI character.
 *
 * - Provider credentials stay here (ANTHROPIC_API_KEY); nothing is exposed to the browser.
 * - No tools are attached: the character can only talk.
 * - Visitor input is untrusted: validated, length-capped, context-capped, rate-limited.
 * - Conversations are not stored or logged by this route.
 * - Without a key, GET reports `live: false` and the page shows authored “House tales”.
 *
 * Env:
 *   ANTHROPIC_API_KEY      enables live answers
 *   SAGE_MODEL             optional model id (default claude-opus-5-5)
 *   SAGE_PER_MINUTE / SAGE_PER_DAY / SAGE_GLOBAL_PER_DAY   rate limits (see lib/sage/limits.ts)
 *   SAGE_PROVIDER=mock     local testing only: canned streaming answers, no API calls
 */
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/sage/knowledge";
import { checkRate } from "@/lib/sage/limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION = 500;
const MAX_ANSWER_ECHO = 1500;
const MAX_TURNS = 8;
const MAX_TOKENS = 1500;
/** Marks a failure after streaming has started (the client shows a retry). */
const ERROR_MARK = "\u0000";

type Turn = { role: "user" | "assistant"; content: string };

const provider = () => (process.env.SAGE_PROVIDER === "mock" ? "mock" : process.env.ANTHROPIC_API_KEY ? "anthropic" : null);

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });

export async function GET() {
  return json({ live: provider() !== null });
}

function parseTurns(raw: unknown): Turn[] | null {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { messages?: unknown }).messages)) return null;
  const list = (raw as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const turns: Turn[] = [];
  for (const m of list) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_QUESTION : MAX_ANSWER_ECHO);
    if (!text) continue;
    // Merge accidental repeats so roles alternate.
    if (turns.length && turns[turns.length - 1].role === role) turns[turns.length - 1].content += `\n${text}`;
    else turns.push({ role, content: text });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

export async function POST(req: Request) {
  const p = provider();
  if (!p) return json({ error: "not_configured" }, 503);

  // Same-site use only (a light check; it is not authentication).
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "forbidden" }, 403);

  const raw = await req.text();
  if (raw.length > 20_000) return json({ error: "too_large" }, 413);
  let turns: Turn[] | null = null;
  try {
    turns = parseTurns(JSON.parse(raw));
  } catch {
    turns = null;
  }
  if (!turns) return json({ error: "bad_request" }, 400);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const wait = checkRate(ip);
  if (wait !== null) return json({ error: "rate_limited", retryAfter: wait }, 429, { "retry-after": String(wait) });

  const encoder = new TextEncoder();
  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort());

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (t: string) => controller.enqueue(encoder.encode(t));
      try {
        if (p === "mock") await mockAnswer(turns!, send, abort.signal);
        else await anthropicAnswer(turns!, send, abort.signal);
      } catch (err) {
        if (!abort.signal.aborted) {
          // Report the kind of failure only; never the conversation.
          const status = err instanceof Anthropic.APIError ? err.status : "network";
          console.error("[sage] answer failed:", status);
          send(`${ERROR_MARK}${status === 429 ? "busy" : "failed"}`);
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed by a cancel
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

async function anthropicAnswer(turns: Turn[], send: (t: string) => void, signal: AbortSignal) {
  const client = new Anthropic();
  const stream = client.beta.messages.stream(
    {
      model: process.env.SAGE_MODEL || "claude-opus-5-5",
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" },
      // If a request is declined, let Anthropic retry it on its recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: buildSystemPrompt(),
      messages: turns,
    },
    { signal },
  );
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") send(event.delta.text);
  }
  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") send("\n\nThe Sage tilts his hood. That’s a door the house keeps closed. Ask me something else?");
  else if (final.stop_reason === "max_tokens") send("…");
}

/** Local testing only (SAGE_PROVIDER=mock): streams a canned answer; “#fail” fails midway. */
async function mockAnswer(turns: Turn[], send: (t: string) => void, signal: AbortSignal) {
  const q = turns[turns.length - 1].content;
  const text = `Ah, “${q.slice(0, 60)}”. A fine question to bring down here. Follow the sound, pilgrim: make one small thing tonight and let it be a little strange. Oliver agrees, mostly.`;
  await new Promise((r) => setTimeout(r, 700));
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (signal.aborted) return;
    if (q.includes("#fail") && i === 8) throw new Error("mock failure");
    send((i ? " " : "") + words[i]);
    await new Promise((r) => setTimeout(r, 70));
  }
}
