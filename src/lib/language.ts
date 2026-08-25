export type Language = "es" | "en";

/**
 * Manual language choices are intentionally local-only. Browser locale is a
 * privacy-preserving proxy for country, not true geolocation.
 */
export const LANGUAGE_STORAGE_KEY = "cpr-language";

// Spanish-first regions used only when a browser locale includes region data.
// US, Canada, and Europe (except Spain) are intentionally not included.
const SPANISH_FIRST_REGIONS = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GT", "HN",
  "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE",
]);

function parseLocale(locale: unknown): { language: string; region?: string } | null {
  if (typeof locale !== "string") return null;
  const parts = locale.trim().replace(/_/g, "-").split("-").filter(Boolean);
  const language = parts[0]?.toLowerCase();
  if (!language || !/^[a-z]{2,3}$/.test(language)) return null;

  // Read a BCP 47-style region after an optional four-letter script subtag.
  const possibleRegion = /^[a-z]{4}$/i.test(parts[1] || "") ? parts[2] : parts[1];
  const region = possibleRegion && (/^[a-z]{2}$/i.test(possibleRegion) || /^\d{3}$/.test(possibleRegion))
    ? possibleRegion.toUpperCase()
    : undefined;
  return region ? { language, region } : { language };
}

function browserLocales(): string[] {
  if (typeof navigator === "undefined") return [];
  try {
    const languages = Array.isArray(navigator.languages) ? navigator.languages : [];
    const candidates = languages.filter((locale): locale is string => typeof locale === "string");
    if (typeof navigator.language === "string" && navigator.language) candidates.push(navigator.language);
    return [...new Set(candidates)];
  } catch {
    try {
      return typeof navigator.language === "string" ? [navigator.language] : [];
    } catch {
      return [];
    }
  }
}

/** Select the first browser preference, defaulting to English when ambiguous. */
export function detectBrowserLanguage(): Language {
  const locale = browserLocales().map(parseLocale).find((parsed) => parsed !== null);
  if (!locale) return "en";
  if (locale.language === "es" || (locale.region && SPANISH_FIRST_REGIONS.has(locale.region))) return "es";
  return "en";
}

export function getStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "es" || saved === "en" ? saved : null;
  } catch {
    return null;
  }
}

/** Automatic detection is used only until the visitor makes a manual choice. */
export function getPreferredLanguage(): Language {
  return getStoredLanguage() ?? detectBrowserLanguage();
}

/** Keep the first SSR render stable; later client-side route transitions reuse the active language. */
export function getRenderLanguage(): Language {
  if (typeof document === "undefined" || document.documentElement.dataset.cprHydrated !== "true") return "es";
  return document.documentElement.dataset.cprLanguage === "en" ? "en" : "es";
}

export function applyLanguage(language: Language): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.cprLanguage = language;
  document.documentElement.lang = language;
}

export function persistLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage may be disabled; language selection still works for this visit.
  }
}

export function finishLanguageSelection(language: Language): void {
  if (typeof document === "undefined") return;
  applyLanguage(language);
  document.documentElement.dataset.cprHydrated = "true";
  document.documentElement.classList.remove("language-pending");
}
