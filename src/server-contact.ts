const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_COMPANY_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;
const RECIPIENT = "soporteweb@cprsas.com";
const requestLog = new Map<string, number[]>();

type ContactLanguage = "es" | "en";

type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  lang: ContactLanguage;
  consent: true;
  website?: string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isValidEmail(email: string): boolean {
  return (
    email.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function parsePayload(payload: unknown): ContactPayload | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const companyProvided = value.company !== undefined && value.company !== null;
  const company = typeof value.company === "string" ? value.company.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const lang = value.lang === "en" || value.lang === "es" ? value.lang : null;
  const consent = value.consent === true;
  const website =
    typeof value.website === "string" ? value.website.trim() : undefined;

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    !isValidEmail(email) ||
    (companyProvided && typeof value.company !== "string") ||
    company.length > MAX_COMPANY_LENGTH ||
    !message ||
    message.length > MAX_MESSAGE_LENGTH ||
    !lang ||
    !consent
  )
    return null;

  return { name, email, company, message, lang, consent: true, website };
}

function emailText(payload: ContactPayload): string {
  return [
    "CPR Solutions diagnostic request",
    "",
    `Name / Nombre: ${payload.name}`,
    `Email / Correo: ${payload.email}`,
    `Company / Empresa: ${payload.company || "(not provided / no indicada)"}`,
    `Language / Idioma: ${payload.lang}`,
    "Consent / Consentimiento: yes / sí",
    "",
    "Message / Mensaje:",
    payload.message,
  ].join("\n");
}

export async function contactResponse(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = clientIp(req);
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) return json({ error: "usage_limit" }, 429);
  recent.push(now);
  requestLog.set(ip, recent);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const value =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  const website =
    typeof value?.website === "string" ? value.website.trim() : "";

  // Treat the honeypot as a successful-looking, non-sending request so bots do
  // not learn whether delivery is configured or receive a retry signal.
  if (website) return json({ status: "success" });

  const contact = parsePayload(payload);
  if (!contact) return json({ error: "invalid_request" }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ status: "not_configured" }, 503);

  const subject =
    contact.lang === "en"
      ? "New diagnostic request — CPR Solutions"
      : "Nueva solicitud de diagnóstico — CPR Solutions";

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "CPR Solutions <onboarding@resend.dev>",
        to: RECIPIENT,
        reply_to: contact.email,
        subject,
        text: emailText(contact),
      }),
    });

    if (!resendResponse.ok) {
      console.error(
        `[team-site] contact delivery failed with status ${resendResponse.status}`,
      );
      return json({ error: "delivery_unavailable" }, 502);
    }

    return json({ status: "success" });
  } catch {
    console.error("[team-site] contact delivery request failed");
    return json({ error: "delivery_unavailable" }, 502);
  }
}
