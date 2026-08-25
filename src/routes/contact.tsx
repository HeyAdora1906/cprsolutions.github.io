import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { finishLanguageSelection, getPreferredLanguage, getRenderLanguage, persistLanguage, type Language } from "~/lib/language";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CPR Solutions | Solicite un diagnóstico" },
      { name: "description", content: "Cuéntenos qué necesita resolver y preparemos el mejor punto de partida para una conversación diagnóstica con CPR Solutions." },
      { property: "og:title", content: "Contact CPR Solutions | Solicite un diagnóstico" },
      { property: "og:description", content: "Comparta los próximos retos de su equipo de tecnología con CPR Solutions." },
      { property: "og:url", content: "https://crpsas.ctonew.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://crpsas.ctonew.app/contact" }],
  }),
  component: ContactPage,
});

type Lang = Language;
const content = {
  es: { back: "Volver al inicio", eyebrow: "06 / Hablemos de su próximo paso", title: "Cuéntenos qué necesita resolver.", intro: "Comparta algunos detalles y prepararemos el mejor punto de partida para una conversación diagnóstica.", name: "Nombre", email: "Correo corporativo", company: "Empresa", message: "¿Qué le gustaría explorar?", send: "Solicitar diagnóstico", required: "Complete este campo para continuar.", emailError: "Ingrese un correo válido.", sent: "Gracias. Su solicitud quedó preparada para revisión.", note: "Demo MVP: el formulario no envía datos a servicios externos.", footer: "CPR Solutions · Bogotá, Colombia · Información corporativa pendiente de aprobación", theme: "Tema", light: "Modo claro", dark: "Modo oscuro" },
  en: { back: "Back to home", eyebrow: "06 / Let's discuss your next step", title: "Tell us what you need to solve.", intro: "Share a few details and we'll prepare the right starting point for a diagnostic conversation.", name: "Name", email: "Business email", company: "Company", message: "What would you like to explore?", send: "Request a diagnostic", required: "Please complete this field.", emailError: "Enter a valid email.", sent: "Thank you. Your request is ready for review.", note: "MVP demo: this form does not send data to external services.", footer: "CPR Solutions · Bogotá, Colombia · Corporate information pending approval", theme: "Theme", light: "Light mode", dark: "Dark mode" },
} as const;

function ContactPage() {
  const [lang, setLang] = useState<Lang>(getRenderLanguage);
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
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
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Record<string, boolean> = {};
    ["name", "email", "message"].forEach((key) => { if (!String(form.get(key) || "").trim()) next[key] = true; });
    if (String(form.get("email") || "") && !/^\S+@\S+\.\S+$/.test(String(form.get("email")))) next.email = true;
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };
  return <div className="contact-page">
    <header className="site-header contact-header"><a className="logo" href="/" aria-label="CPR Solutions">CPR<span>.</span></a><div className="header-controls"><div className="language" aria-label="Language"><button type="button" className={lang === "es" ? "active" : ""} onClick={() => changeLanguage("es")}>ES</button><span aria-hidden="true">/</span><button type="button" className={lang === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button></div><button className="theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)} aria-label={`${t.theme}: ${darkMode ? t.light : t.dark}`} aria-pressed={darkMode}><span aria-hidden="true">{darkMode ? "☀" : "◐"}</span><span className="theme-toggle-text">{darkMode ? t.light : t.dark}</span></button></div></header>
    <main className="contact-page-main"><a className="back-link" href="/">← {t.back}</a><section className="contact section contact-diagnostic reveal"><div className="contact-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div><form onSubmit={submit} noValidate>{([ ["name", t.name, "text"], ["email", t.email, "email"], ["company", t.company, "text"] ] as const).map(([name, label, type]) => <label key={name}>{label}<input name={name} type={type} autoComplete={name === "email" ? "email" : name === "name" ? "name" : "organization"} required={name !== "company"} aria-invalid={!!errors[name]} />{errors[name] && <small>{name === "email" ? t.emailError : t.required}</small>}</label>)}<label>{t.message}<textarea name="message" rows={5} required aria-invalid={!!errors.message} />{errors.message && <small>{t.required}</small>}</label>{submitted ? <p className="success">{t.sent}</p> : <button className="button button-primary" type="submit">{t.send}<span>↗</span></button>}<p className="form-note">{t.note}</p></form></section></main><footer className="contact-footer"><a className="logo" href="/">CPR<span>.</span></a><p>{t.footer}</p><a href="/" aria-label={t.back}>↑</a></footer>
  </div>;
}
