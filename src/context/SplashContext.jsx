import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SplashCtx = createContext(null);

export const SplashProvider = ({ children }) => {
  /* Splash plays once per browser session. Repeat page loads (and every
     mobile back/forward visit) go straight to interactive content — the
     1.8s overlay on every load was a large share of the "sluggish" INP/TBT
     feel in the mobile audit. */
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem("hl-splash-seen"); } catch { return true; }
  });

  // Auto-dismiss on first load
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem("hl-splash-seen", "1"); } catch { /* private mode */ }
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Logo click replays the splash
  const trigger = useCallback(() => {
    setShow(true);
    setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <SplashCtx.Provider value={{ show, trigger }}>
      {children}
    </SplashCtx.Provider>
  );
};

export const useSplash = () => useContext(SplashCtx);
