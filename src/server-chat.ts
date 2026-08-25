const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY = 8;
const MAX_OUTPUT_TOKENS = 220;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;
const requestLog = new Map<string, number[]>();

const fallback = (lang: string) => lang === "en"
  ? "I’m Sam, CPR Solutions’ professional secretary. I can help you explore security, project management, infrastructure and support, or digital transformation. For a tailored conversation, please request a diagnostic at /contact."
  : "Soy Sam, la secretaria profesional de CPR Solutions. Puedo orientarle sobre seguridad, gestión de proyectos, infraestructura y soporte, o transformación digital. Para una conversación a medida, solicite un diagnóstico en /contact.";

const systemPrompt = `You are Sam, a courteous and professional secretary for CPR Solutions. Maintain a formal, helpful tone. Stay within CPR Solutions' services: security, project management, infrastructure and support, and digital transformation. Acknowledge and use relevant context from prior user and assistant messages. Give useful, structured detail appropriate to the question rather than generic replies, and ask a concise clarifying question when key information is missing. Reply in Spanish or English to match the user's language. Never invent company facts, certifications, partners, case studies, prices, results, or capabilities. Never claim to have taken an action, accessed a system, or contacted someone. For unrelated requests, briefly explain that you can help only with CPR Solutions services. When the user needs a tailored assessment, human follow-up, or next step, recommend the diagnostic contact page (/contact).`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export async function chatResponse(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return json({ error: "usage_limit" }, 429);
  recent.push(now); requestLog.set(ip, recent);
  let payload: any;
  try { payload = await req.json(); } catch { return json({ error: "invalid_request" }, 400); }
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  const history = Array.isArray(payload?.history) ? payload.history : [];
  const lang = payload?.lang === "en" ? "en" : "es";
  if (!message || message.length > MAX_MESSAGE_LENGTH || history.length > MAX_HISTORY || history.some((item: any) => (item?.role !== "user" && item?.role !== "assistant") || typeof item?.content !== "string" || !item.content.trim() || item.content.length > MAX_MESSAGE_LENGTH)) {
    return json({ error: "invalid_request" }, 400);
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) return json({ reply: fallback(lang), mode: "demo" });
  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: MAX_OUTPUT_TOKENS, temperature: 0.2, messages: [{ role: "system", content: `${systemPrompt}\nRespond in ${lang === "en" ? "English" : "Spanish"} to match the visitor's selected site language.` }, ...history.slice(-MAX_HISTORY), { role: "user", content: message }] }),
    });
    if (!completion.ok) return json({ error: "assistant_unavailable" }, 502);
    const data: any = await completion.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) return json({ error: "assistant_unavailable" }, 502);
    return json({ reply: reply.trim(), mode: "ai" });
  } catch { return json({ error: "assistant_unavailable" }, 502); }
}
