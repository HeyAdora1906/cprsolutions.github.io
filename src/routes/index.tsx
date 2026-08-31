import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Shader,
  Swirl,
  ChromaFlow,
  FlutedGlass,
  FilmGrain,
  DotGrid,
  LinearGradient,
  CursorRipples,
} from "shaders/react";
import {
  finishLanguageSelection,
  getPreferredLanguage,
  getRenderLanguage,
  persistLanguage,
  type Language,
} from "~/lib/language";

export const Route = createFileRoute("/")({ component: Home });

type Lang = Language;
type ChatMessage = { role: "user" | "assistant"; content: string };
const copy = {
  es: {
    nav: ["Servicios", "Asistente", "Ecosistema", "Contacto"],
    eyebrow: "Tecnología con dirección",
    title: "Infraestructura sólida. Decisiones más inteligentes.",
    intro:
      "CPR Solutions acompaña a equipos de tecnología en seguridad, proyectos, infraestructura y transformación digital.",
    primary: "Solicitar diagnóstico",
    secondary: "Conocer servicios",
    trusted: "Capacidades para avanzar con claridad",
    servicesTitle: "Experiencia que conecta estrategia y operación",
    servicesIntro:
      "Un enfoque práctico para reducir fricción, proteger lo importante y convertir prioridades en resultados medibles.",
    processTitle: "Cómo trabajamos",
    processIntro:
      "Un recorrido claro para pasar de una necesidad prioritaria a un siguiente paso accionable.",
    process: [
      [
        "01",
        "Entender",
        "Alineamos el contexto, las prioridades y las preguntas que necesitan respuesta.",
      ],
      [
        "02",
        "Ordenar",
        "Traducimos hallazgos en opciones, prioridades y un plan de trabajo comprensible.",
      ],
      [
        "03",
        "Acompañar",
        "Apoyamos la ejecución y el seguimiento con comunicación práctica y foco operativo.",
      ],
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      [
        "¿La conversación diagnóstica tiene un alcance definido?",
        "El primer contacto sirve para entender su contexto y acordar el mejor punto de partida. El alcance se define de forma conjunta.",
      ],
      [
        "¿El asistente está conectado a sistemas externos?",
        "No. La experiencia actual es una demostración guiada y no consulta sistemas externos.",
      ],
      [
        "¿Pueden trabajar con equipos internos?",
        "Sí. Podemos conversar sobre necesidades de seguridad, proyectos, infraestructura, soporte o transformación junto con sus equipos.",
      ],
    ],
    services: [
      [
        "01",
        "Seguridad",
        "Fortalezca su postura de seguridad con una visión clara de riesgos, controles y prioridades.",
      ],
      [
        "02",
        "Gestión de proyectos",
        "Lleve iniciativas críticas de la idea a la ejecución con estructura, seguimiento y foco.",
      ],
      [
        "03",
        "Infraestructura y soporte",
        "Mantenga sus operaciones estables con soporte y una infraestructura preparada para crecer.",
      ],
      [
        "04",
        "Transformación digital",
        "Conecte personas, procesos y tecnología para evolucionar de forma sostenible.",
      ],
    ],
    assistantEyebrow: "Demostración del asistente",
    assistantTitle: "Una primera conversación, en cualquier momento.",
    assistantIntro:
      "Escriba a Sam su pregunta con naturalidad sobre los servicios de CPR Solutions. Si la API no está configurada, seguirá disponible como demo guiada.",
    chatTitle: "Sam · Secretaría CPR",
    online: "Demo / IA segura",
    ask: "¿En qué podemos orientarle?",
    assistantLimit:
      "Uso limitado para proteger la experiencia. Intente de nuevo en unos segundos.",
    assistantError:
      "Sam no está disponible en este momento. Solicite un diagnóstico para continuar.",
    assistantInput: "Escriba su pregunta con naturalidad…",
    assistantSend: "Enviar",
    assistantDemo: "Modo demo: API no configurada",
    assistantThinking: "Sam está pensando…",
    assistantScope:
      "Sam se enfoca en los servicios de CPR Solutions. Puede escribir su pregunta libremente.",
    voice: "Voz: planificada, aún no conectada",
    ecosystem: "Un ecosistema para crecer mejor",
    ecosystemText:
      "CPR Solutions hace parte del ecosistema Cast Corp. La descripción y el enlace oficial están pendientes de aprobación del stakeholder.",
    placeholder: "[Enlace oficial de Cast Corp — pendiente de aprobación]",
    contactEyebrow: "Hablemos de su próximo paso",
    contactTitle: "Cuéntenos qué necesita resolver.",
    contactText:
      "Comparta algunos detalles y prepararemos el mejor punto de partida para una conversación diagnóstica.",
    name: "Nombre",
    email: "Correo corporativo",
    company: "Empresa",
    message: "¿Qué le gustaría explorar?",
    send: "Solicitar diagnóstico",
    required: "Complete este campo para continuar.",
    emailError: "Ingrese un correo válido.",
    sent: "Gracias. Su solicitud quedó preparada para revisión.",
    footer:
      "CPR Solutions · Bogotá, Colombia · Información corporativa pendiente de aprobación",
    response:
      "Gracias por su pregunta. En esta demo podemos orientarle sobre el punto de partida y conectar su necesidad con el servicio adecuado. Para una recomendación específica, solicite un diagnóstico.",
    themeLabel: "Tema",
    light: "Modo claro",
    dark: "Modo oscuro",
  },
  en: {
    nav: ["Services", "Assistant", "Ecosystem", "Contact"],
    eyebrow: "Technology with direction",
    title: "Stronger infrastructure. Smarter decisions.",
    intro:
      "CPR Solutions supports technology teams across security, projects, infrastructure, and digital transformation.",
    primary: "Request a diagnostic",
    secondary: "Explore services",
    trusted: "Capabilities to move forward with clarity",
    servicesTitle: "Experience connecting strategy and operations",
    servicesIntro:
      "A practical approach to reduce friction, protect what matters, and turn priorities into measurable progress.",
    processTitle: "How we work",
    processIntro:
      "A clear path from a priority need to an actionable next step.",
    process: [
      [
        "01",
        "Understand",
        "We align on context, priorities, and the questions that need answers.",
      ],
      [
        "02",
        "Structure",
        "We translate findings into options, priorities, and an understandable work plan.",
      ],
      [
        "03",
        "Support",
        "We help with execution and follow-up through practical communication and operational focus.",
      ],
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      [
        "Does the diagnostic conversation have a defined scope?",
        "The first conversation helps us understand your context and agree on the right starting point. Scope is defined together.",
      ],
      [
        "Is the assistant connected to external systems?",
        "No. The current experience is a guided demonstration and does not query external systems.",
      ],
      [
        "Can you work with internal teams?",
        "Yes. We can discuss security, projects, infrastructure, support, or transformation needs alongside your teams.",
      ],
    ],
    services: [
      [
        "01",
        "Security",
        "Build a clearer security posture with a practical view of risks, controls, and priorities.",
      ],
      [
        "02",
        "Project management",
        "Move critical initiatives from idea to execution with structure, visibility, and focus.",
      ],
      [
        "03",
        "Infrastructure & support",
        "Keep operations stable with support and infrastructure ready to grow.",
      ],
      [
        "04",
        "Digital transformation",
        "Connect people, processes, and technology to evolve sustainably.",
      ],
    ],
    assistantEyebrow: "Assistant demonstration",
    assistantTitle: "A first conversation, whenever you need it.",
    assistantIntro:
      "Write your question naturally to Sam about CPR Solutions services. If the API is not configured, the guided demo remains available.",
    chatTitle: "Sam · CPR Secretary",
    online: "Demo / secure AI",
    ask: "How can we guide you?",
    assistantLimit:
      "Usage is limited to protect the experience. Try again in a few seconds.",
    assistantError:
      "Sam is unavailable right now. Request a diagnostic to continue.",
    assistantInput: "Write your question naturally…",
    assistantSend: "Send",
    assistantDemo: "Demo mode: API not configured",
    assistantThinking: "Sam is thinking…",
    assistantScope:
      "Sam focuses on CPR Solutions services. You can write your question freely.",
    voice: "Voice: planned, not connected",
    ecosystem: "An ecosystem built to help you grow",
    ecosystemText:
      "CPR Solutions is part of the Cast Corp ecosystem. The description and official link are pending stakeholder approval.",
    placeholder: "[Official Cast Corp link — pending approval]",
    contactEyebrow: "Let's discuss your next step",
    contactTitle: "Tell us what you need to solve.",
    contactText:
      "Share a few details and we'll prepare the right starting point for a diagnostic conversation.",
    name: "Name",
    email: "Business email",
    company: "Company",
    message: "What would you like to explore?",
    send: "Request a diagnostic",
    required: "Please complete this field.",
    emailError: "Enter a valid email.",
    sent: "Thank you. Your request is ready for review.",
    footer:
      "CPR Solutions · Bogotá, Colombia · Corporate information pending approval",
    response:
      "Thank you for your question. This demo can help identify a starting point and connect your need to the right service. For a tailored recommendation, request a diagnostic.",
    themeLabel: "Theme",
    light: "Light mode",
    dark: "Dark mode",
  },
} as const;

function HeroShader({ darkMode }: { darkMode: boolean }) {
  const colors = darkMode
    ? {
        swirlA: "#061525",
        swirlB: "#123b5a",
        base: "#061525",
        down: "#0b2237",
        left: "#66ccff",
        right: "#4642ff",
        up: "#9b96ff",
      }
    : {
        swirlA: "#ffffff",
        swirlB: "#f0f0f0",
        base: "#ffffff",
        down: "#4642ff",
        left: "#56c2fc",
        right: "#5b4fff",
        up: "#7f66ff",
      };
  return (
    <div className="hero-shader" aria-hidden="true">
      <div className="shader-fallback" />
      <Shader
        key={darkMode ? "dark" : "light"}
        className="shader-canvas"
        onUnavailable={() => undefined}
      >
        <Swirl colorA={colors.swirlA} colorB={colors.swirlB} detail={1.7} />
        <ChromaFlow
          baseColor={colors.base}
          downColor={colors.down}
          leftColor={colors.left}
          rightColor={colors.right}
          upColor={colors.up}
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>
    </div>
  );
}

function CursorTrailContact({ lang }: { lang: Lang }) {
  const es = lang === "es";
  return (
    <section className="cursor-contact" aria-labelledby="cursor-contact-title">
      <div className="cursor-contact-shader" aria-hidden="true">
        <div className="cursor-contact-fallback" />
        <Shader
          className="cursor-contact-canvas"
          onUnavailable={() => undefined}
        >
          <DotGrid
            id="trailDots"
            density={40}
            dotSize={{
              type: "map",
              source: "trailFlow",
              channel: "alpha",
              inputMax: 1,
              inputMin: 0,
              outputMax: 1,
              outputMin: 0,
            }}
            twinkle={0.9}
            visible={false}
          />
          <ChromaFlow
            id="trailFlow"
            intensity={1.4}
            radius={2.9}
            visible={false}
          />
          <LinearGradient
            colorA="#123b5a"
            colorB="#071b30"
            colorSpace="hsl"
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 1 }}
          />
          <LinearGradient
            colorA="#000000"
            colorB="#ffffff"
            colorSpace="hsl"
            end={{ x: 1, y: 0 }}
            maskSource="trailDots"
            start={{ x: 0, y: 1 }}
          />
          <CursorRipples />
          <FilmGrain strength={0.1} />
        </Shader>
      </div>
      <div className="cursor-contact-content">
        <p className="cursor-contact-eyebrow">
          {es ? "Construyamos lo que sigue" : "Let's build what's next"}
        </p>
        <h2 id="cursor-contact-title">
          {es ? "¿Tiene algo que crear?" : "Got something to make?"}
        </h2>
        <a className="cursor-contact-cta" href="/contact">
          {es ? "Contáctenos" : "Contact us"}
          <span aria-hidden="true">↗</span>
        </a>
        <div className="cursor-contact-bottom">
          <div
            className="cursor-contact-socials"
            aria-label={es ? "Redes sociales" : "Social links"}
          >
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
            <a href="#">X</a>
          </div>
          <p className="cursor-contact-hint">
            {es
              ? "Mueva el cursor para explorar"
              : "Move your cursor to explore"}
          </p>
          <span className="cursor-contact-index">07 / 07</span>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [lang, setLang] = useState<Lang>(getRenderLanguage);
  const t = copy[lang];
  // Keep the initial render SSR-safe: locale/storage selection is applied after hydration.
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
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
    const nextDark = saved === "dark";
    setDarkMode(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    setThemeReady(true);
  }, []);
  useEffect(() => {
    if (!themeReady) return;
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("cpr-theme", theme);
  }, [darkMode, themeReady]);
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal"),
    );
    if (!items.length) return;
    const root = document.documentElement;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    root.classList.add("motion-ready");
    const revealPassedSections = () => {
      const viewportBottom = window.innerHeight;
      items.forEach((item) => {
        if (item.getBoundingClientRect().top < viewportBottom * 0.92)
          item.classList.add("is-visible");
      });
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    revealPassedSections();
    window.addEventListener("scroll", revealPassedSections, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealPassedSections);
      root.classList.remove("motion-ready");
    };
  }, []);
  const ask = async (q: string) => {
    const message = q.trim();
    if (
      !message ||
      pending ||
      Date.now() < cooldownUntil ||
      message.length > 600
    )
      return;
    setPending(true);
    setCooldownUntil(Date.now() + 1500);
    setChatError("");
    setDraft("");
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, lang, history: messages.slice(-8) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "error");
      setMessages(
        [...next, { role: "assistant" as const, content: data.reply }].slice(
          -8,
        ),
      );
      setDemoMode(data.mode === "demo");
    } catch (error) {
      setChatError(
        error instanceof Error && error.message === "usage_limit"
          ? t.assistantLimit
          : t.assistantError,
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <>
      <section className="hero" id="top">
        <HeroShader darkMode={darkMode} />
        <header className="site-header">
          <a className="logo" href="#top" aria-label="CPR Solutions">
            CPR<span>.</span>
          </a>
          <nav
            aria-label={
              lang === "es" ? "Navegación principal" : "Main navigation"
            }
          >
            <a href="#services">{t.nav[0]}</a>
            <a href="#assistant">{t.nav[1]}</a>
            <a href="#ecosystem">{t.nav[2]}</a>
            <a href="/contact">{t.nav[3]}</a>
          </nav>
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
              aria-label={`${t.themeLabel}: ${darkMode ? t.light : t.dark}`}
              aria-pressed={darkMode}
              title={`${t.themeLabel}: ${darkMode ? t.light : t.dark}`}
            >
              <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
              <span className="theme-toggle-text">
                {darkMode ? t.light : t.dark}
              </span>
            </button>
            <a className="header-cta" href="/contact">
              {t.primary}
              <span>↗</span>
            </a>
          </div>
        </header>
        <div className="hero-copy reveal">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {lang === "es" ? (
              <>
                Tecnología con <em>dirección.</em>
              </>
            ) : (
              <>
                Technology with <em>direction.</em>
              </>
            )}
          </h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="actions">
            <a className="button button-primary" href="/contact">
              {t.primary}
              <span>↗</span>
            </a>
            <a className="text-link" href="#services">
              {t.secondary}
              <span>↓</span>
            </a>
          </div>
        </div>
        <div className="hero-clients">
          <span>{lang === "es" ? "Grupo de empresas" : "Companies group"}</span>
          <strong>CPR SOLUTIONS</strong>
          <a
            href="https://castcorp.ctonew.app/"
            target="_blank"
            rel="noreferrer"
          >
            CAST AI
          </a>
          <a
            href="https://castcorp.framer.website/es/"
            target="_blank"
            rel="noreferrer"
          >
            CAST CORP
          </a>
        </div>
      </section>
      <main>
        <section className="signal">
          <p>{t.trusted}</p>
          <div className="signal-line" />
          <strong>CPR SOLUTIONS</strong>
          <strong>CAST CORP</strong>
          <strong>IT OPERATIONS</strong>
        </section>
        <section className="section services scroll-reveal" id="services">
          <div className="section-heading">
            <p className="eyebrow">
              04 / {lang === "es" ? "Capacidades" : "Capabilities"}
            </p>
            <h2>{t.servicesTitle}</h2>
            <p>{t.servicesIntro}</p>
          </div>
          <div className="service-grid">
            {t.services.map(([num, title, desc]) => (
              <article className="service-card" key={num}>
                <span className="service-num">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <a href="/contact" aria-label={`${title} — ${t.primary}`}>
                  ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="assistant-section scroll-reveal" id="assistant">
          <div className="assistant-intro">
            <p className="eyebrow">{t.assistantEyebrow}</p>
            <h2>{t.assistantTitle}</h2>
            <p>{t.assistantIntro}</p>
            <span className="voice-note">◌ &nbsp;{t.voice}</span>
          </div>
          <div className="chat">
            <div className="chat-head">
              <div>
                <strong>{t.chatTitle}</strong>
                <small>
                  <i /> {t.online}
                </small>
              </div>
              <span>•••</span>
            </div>
            <div className="chat-body" aria-live="polite">
              <div className="bot-message">{t.ask}</div>
              {messages.map((m, i) => (
                <div
                  className={
                    m.role === "assistant" ? "bot-message" : "user-message"
                  }
                  key={`${m.role}-${i}`}
                >
                  {m.content}
                </div>
              ))}
              {pending && (
                <div className="bot-message">{t.assistantThinking}</div>
              )}
              {chatError && (
                <p className="chat-error" role="alert">
                  {chatError}
                </p>
              )}
              {demoMode && (
                <small className="chat-mode">{t.assistantDemo}</small>
              )}
              <form
                className="chat-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void ask(draft);
                }}
              >
                <label className="sr-only" htmlFor="sam-message">
                  {t.assistantInput}
                </label>
                <input
                  id="sam-message"
                  value={draft}
                  maxLength={600}
                  disabled={pending}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t.assistantInput}
                />
                <button type="submit" disabled={pending || !draft.trim()}>
                  {t.assistantSend}
                </button>
              </form>
              <small className="chat-scope">{t.assistantScope}</small>
            </div>
          </div>
        </section>
        <section className="process section scroll-reveal" id="process">
          <div className="section-heading">
            <p className="eyebrow">
              05 / {lang === "es" ? "Proceso" : "Process"}
            </p>
            <h2>{t.processTitle}</h2>
            <p>{t.processIntro}</p>
          </div>
          <div className="process-grid">
            {t.process.map(([num, title, desc]) => (
              <article className="process-card" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="ecosystem section scroll-reveal" id="ecosystem">
          <div>
            <p className="eyebrow">06 / Ecosystem</p>
            <h2>{t.ecosystem}</h2>
          </div>
          <div>
            <p>{t.ecosystemText}</p>
            <span className="placeholder-link">{t.placeholder}</span>
          </div>
        </section>
        <section className="faq section scroll-reveal" id="faq">
          <div className="section-heading">
            <p className="eyebrow">07 / FAQ</p>
            <h2>{t.faqTitle}</h2>
          </div>
          <div className="faq-list">
            {t.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span>+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <CursorTrailContact lang={lang} />
      <footer>
        <span className="logo">
          CPR<span>.</span>
        </span>
        <p>{t.footer}</p>
        <a href="#top">↑</a>
      </footer>
    </>
  );
}
