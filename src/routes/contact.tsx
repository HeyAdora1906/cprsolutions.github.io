import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  finishLanguageSelection,
  getPreferredLanguage,
  getRenderLanguage,
  persistLanguage,
  type Language,
} from "~/lib/language";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CPR Solutions | Solicite un diagnóstico" },
      {
        name: "description",
        content:
          "Cuéntenos qué necesita resolver y preparemos el mejor punto de partida para una conversación diagnóstica con CPR Solutions.",
      },
      {
        property: "og:title",
        content: "Contact CPR Solutions | Solicite un diagnóstico",
      },
      {
        property: "og:description",
        content:
          "Comparta los próximos retos de su equipo de tecnología con CPR Solutions.",
      },
      { property: "og:url", content: "https://crpsas.ctonew.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://crpsas.ctonew.app/contact" }],
  }),
  component: ContactPage,
});

type Lang = Language;
type SubmissionState =
  "idle" | "submitting" | "success" | "error" | "not_configured";

const content = {
  es: {
    back: "Volver al inicio",
    eyebrow: "06 / Hablemos de su próximo paso",
    title: "Cuéntenos qué necesita resolver.",
    intro:
      "Comparta algunos detalles y prepararemos el mejor punto de partida para una conversación diagnóstica.",
    name: "Nombre",
    email: "Correo corporativo",
    company: "Empresa",
    message: "¿Qué le gustaría explorar?",
    consent:
      "Acepto que CPR Solutions use estos datos para revisar mi solicitud y contactarme sobre este diagnóstico.",
    send: "Solicitar diagnóstico",
    sending: "Enviando…",
    required: "Complete este campo para continuar.",
    emailError: "Ingrese un correo válido.",
    sent: "Gracias. Recibimos su solicitud y la enviaremos para revisión.",
    notConfigured:
      "Recibimos la información, pero el envío de correo aún no está configurado. Su solicitud no pudo ser enviada; inténtelo más tarde.",
    error:
      "No pudimos enviar su solicitud. Inténtelo nuevamente en unos minutos.",
    note: "La solicitud se procesa en el servidor y se envía por correo cuando la entrega está configurada.",
    footer:
      "CPR Solutions · Bogotá, Colombia · Información corporativa pendiente de aprobación",
    theme: "Tema",
    light: "Modo claro",
    dark: "Modo oscuro",
  },
  en: {
    back: "Back to home",
    eyebrow: "06 / Let's discuss your next step",
    title: "Tell us what you need to solve.",
    intro:
      "Share a few details and we'll prepare the right starting point for a diagnostic conversation.",
    name: "Name",
    email: "Business email",
    company: "Company",
    message: "What would you like to explore?",
    consent:
      "I agree that CPR Solutions may use these details to review my request and contact me about this diagnostic.",
    send: "Request a diagnostic",
    sending: "Sending…",
    required: "Please complete this field.",
    emailError: "Enter a valid email.",
    sent: "Thank you. We received your request and will send it for review.",
    notConfigured:
      "We received the information, but email delivery is not configured yet. Your request could not be sent; please try again later.",
    error: "We could not send your request. Please try again in a few minutes.",
    note: "Your request is processed server-side and sent by email when delivery is configured.",
    footer:
      "CPR Solutions · Bogotá, Colombia · Corporate information pending approval",
    theme: "Theme",
    light: "Light mode",
    dark: "Dark mode",
  },
} as const;

function ContactPage() {
  const [lang, setLang] = useState<Lang>(getRenderLanguage);
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const t = content[lang];

  useEffect(() => {
    const preferred = getPreferredLanguage();
    setLang(preferred);
    finishLanguageSelection(preferred);
  }, []);

  const changeLanguage = (next: Lang) => {
    setLang(next);
    persistLanguage(next);
    finishLanguageSelection(next);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("cpr-theme");
    const dark = saved === "dark";
    setDarkMode(dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("cpr-theme", theme);
  }, [darkMode, themeReady]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === "submitting") return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const consent = form.get("consent") === "on";
    const next: Record<string, boolean> = {};
    if (!name) next.name = true;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) next.email = true;
    if (!message) next.message = true;
    if (!consent) next.consent = true;
    setErrors(next);
    if (Object.keys(next).length) {
      setSubmissionState("idle");
      return;
    }

    setSubmissionState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: String(form.get("company") || "").trim(),
          message,
          lang,
          consent,
          website: String(form.get("website") || ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        status?: string;
      } | null;
      if (response.status === 503 && result?.status === "not_configured") {
        setSubmissionState("not_configured");
      } else if (response.ok && result?.status === "success") {
        setSubmissionState("success");
      } else {
        setSubmissionState("error");
      }
    } catch {
      setSubmissionState("error");
    }
  };

  const statusMessage =
    submissionState === "success"
      ? t.sent
      : submissionState === "not_configured"
        ? t.notConfigured
        : submissionState === "error"
          ? t.error
          : null;

  return (
    <div className="contact-page">
      <header className="site-header contact-header">
        <a className="logo" href="/" aria-label="CPR Solutions">
          CPR<span>.</span>
        </a>
        <div className="header-controls">
          <div className="language" aria-label="Language">
            <button
              type="button"
              className={lang === "es" ? "active" : ""}
              onClick={() => changeLanguage("es")}
            >
              ES
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`${t.theme}: ${darkMode ? t.light : t.dark}`}
            aria-pressed={darkMode}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
            <span className="theme-toggle-text">
              {darkMode ? t.light : t.dark}
            </span>
          </button>
        </div>
      </header>
      <main className="contact-page-main">
        <a className="back-link" href="/">
          ← {t.back}
        </a>
        <section className="contact section contact-diagnostic reveal">
          <div className="contact-copy">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </div>
          <form onSubmit={submit} noValidate>
            {(
              [
                ["name", t.name, "text"],
                ["email", t.email, "email"],
                ["company", t.company, "text"],
              ] as const
            ).map(([name, label, type]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  type={type}
                  autoComplete={
                    name === "email"
                      ? "email"
                      : name === "name"
                        ? "name"
                        : "organization"
                  }
                  maxLength={name === "email" ? 320 : 200}
                  required={name !== "company"}
                  aria-invalid={!!errors[name]}
                />
                {errors[name] && (
                  <small>{name === "email" ? t.emailError : t.required}</small>
                )}
              </label>
            ))}
            <label>
              {t.message}
              <textarea
                name="message"
                rows={5}
                maxLength={4000}
                required
                aria-invalid={!!errors.message}
              />
              {errors.message && <small>{t.required}</small>}
            </label>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">
                Website
                <input
                  id="website"
                  name="website"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </label>
            </div>
            <label className="consent-label">
              <span className="consent-control">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  aria-invalid={!!errors.consent}
                  aria-describedby={
                    errors.consent ? "consent-error" : undefined
                  }
                />
                <span>{t.consent}</span>
              </span>
              {errors.consent && <small id="consent-error">{t.required}</small>}
            </label>
            {submissionState !== "success" && (
              <button
                className="button button-primary"
                type="submit"
                disabled={submissionState === "submitting"}
              >
                {submissionState === "submitting" ? t.sending : t.send}
                <span aria-hidden="true">↗</span>
              </button>
            )}
            {statusMessage && (
              <p
                className={`form-status ${submissionState}`}
                role="status"
                aria-live="polite"
              >
                {statusMessage}
              </p>
            )}
            <p className="form-note">{t.note}</p>
          </form>
        </section>
      </main>
      <footer className="contact-footer">
        <a className="logo" href="/">
          CPR<span>.</span>
        </a>
        <p>{t.footer}</p>
        <a href="/" aria-label={t.back}>
          ↑
        </a>
      </footer>
    </div>
  );
}
