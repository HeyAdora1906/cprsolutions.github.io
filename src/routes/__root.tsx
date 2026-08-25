import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CPR Solutions | Tecnología con dirección" },
      { name: "description", content: "CPR Solutions acompaña a equipos de tecnología en seguridad, proyectos, infraestructura y transformación digital." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://crpsas.ctonew.app/" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "CPR Solutions | Tecnología con dirección" },
      { property: "og:description", content: "Seguridad, proyectos, infraestructura y transformación digital para equipos que necesitan avanzar con claridad." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "canonical", href: "https://crpsas.ctonew.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "stylesheet", href: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=geist-mono@400&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        {/*
          Resolve the first-visit language before the page paints. This uses only
          the browser's locale as a privacy-preserving country proxy; it is not
          true country detection and never calls an external geo-IP service.
        */}
        <script dangerouslySetInnerHTML={{ __html: `(() => {
          const key = "cpr-language";
          const spanishRegions = new Set(["AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE"]);
          const parse = (value) => {
            if (typeof value !== "string") return null;
            const parts = value.trim().replace(/_/g, "-").split("-").filter(Boolean);
            const language = parts[0]?.toLowerCase();
            if (!language || !/^[a-z]{2,3}$/.test(language)) return null;
            const possibleRegion = /^[a-z]{4}$/i.test(parts[1] || "") ? parts[2] : parts[1];
            const region = possibleRegion && (/^[a-z]{2}$/i.test(possibleRegion) || /^\\d{3}$/.test(possibleRegion)) ? possibleRegion.toUpperCase() : undefined;
            return { language, region };
          };
          const detect = () => {
            try {
              const languages = typeof navigator !== "undefined" && Array.isArray(navigator.languages) ? navigator.languages : [];
              const candidates = languages.filter((locale) => typeof locale === "string");
              if (typeof navigator !== "undefined" && typeof navigator.language === "string") candidates.push(navigator.language);
              const locale = candidates.map(parse).find(Boolean);
              return locale && (locale.language === "es" || (locale.region && spanishRegions.has(locale.region))) ? "es" : "en";
            } catch { return "en"; }
          };
          let stored = null;
          try { stored = window.localStorage.getItem(key); } catch {}
          const language = stored === "es" || stored === "en" ? stored : detect();
          document.documentElement.dataset.cprLanguage = language;
          document.documentElement.classList.add("language-pending");
        })();` }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
