import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const LanguageContext = createContext({ lang: "en", toggle: () => {} });

/* Language is synced with a `?lang=vi` URL parameter so each language has a
   distinct, shareable, indexable address — this is what makes the hreflang
   pairs emitted by src/lib/seo.js truthful. EN is the clean URL (canonical);
   VI is `?lang=vi`. history.replaceState is used directly (not the router)
   so the sync never triggers a route transition or re-render cascade. */

const readLangFromUrl = () => {
  try {
    return new URLSearchParams(window.location.search).get("lang") === "vi" ? "vi" : "en";
  } catch { return "en"; }
};

const writeLangToUrl = (lang) => {
  try {
    const url = new URL(window.location.href);
    if (lang === "vi") url.searchParams.set("lang", "vi");
    else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url);
  } catch { /* no-op — URL sync is progressive enhancement */ }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(readLangFromUrl);
  const { pathname } = useLocation();

  /* Keep <html lang> in sync with the toggle. Search engines and screen
     readers read this attribute to decide the document's language — leaving
     it hard-coded to "en" mislabels every Vietnamese page. */
  useEffect(() => {
    document.documentElement.lang = lang;
    /* Also re-applied on pathname change: <Link>s carry no query string, so
       every navigation would otherwise silently drop ?lang=vi. */
    writeLangToUrl(lang);
  }, [lang, pathname]);

  return (
    <LanguageContext.Provider value={{ lang, toggle: () => setLang(l => (l === "en" ? "vi" : "en")) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
