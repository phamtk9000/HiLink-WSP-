import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Navbar } from "./components/index.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SplashProvider, useSplash } from "./context/SplashContext.jsx";

/* Homepage stays eager — it is the landing route for most visitors, so
   lazy-loading it would only add a round-trip before first paint. */
import Homepage from "./screens/Homepage.jsx";

/* ── Route-level code splitting ─────────────────────────────────────────────
   Every screen used to be imported eagerly, so a visitor landing on the
   homepage downloaded the forum, the portal, the recommendation tool and
   every legal page too (Lighthouse: 178 KiB of 302 KiB unused).
   Each route now ships as its own chunk, fetched on navigation.
   Named exports are unwrapped to a default for React.lazy.               */
const lz = (loader, name) =>
  lazy(() => loader().then((m) => ({ default: name ? m[name] : m.default })));

const SpacesExplorer   = lz(() => import("./screens/SpacesExplorer.jsx"));
const LocationsPage    = lz(() => import("./screens/LocationsPage.jsx"));
const LocationDetail   = lz(() => import("./screens/LocationDetail.jsx"));
const SolutionPage     = lz(() => import("./screens/SolutionPage.jsx"));
const SolutionsIndex   = lz(() => import("./screens/SolutionPage.jsx"), "SolutionsIndex");
const PartnershipsPage = lz(() => import("./screens/PartnershipsPage.jsx"));
const PartnerPage      = lz(() => import("./screens/PartnerPage.jsx"));
const CareersPage      = lz(() => import("./screens/CareersPage.jsx"));
const UnitDetail       = lz(() => import("./screens/UnitDetail.jsx"));
const AboutPage        = lz(() => import("./screens/AboutPage.jsx"));
const MembershipPage   = lz(() => import("./screens/MembershipPage.jsx"));
const HilinkOfficePage  = lz(() => import("./screens/MembershipDetail.jsx"), "HilinkOfficePage");
const HilinkDeskPage    = lz(() => import("./screens/MembershipDetail.jsx"), "HilinkDeskPage");
const HilinkRoamPage    = lz(() => import("./screens/MembershipDetail.jsx"), "HilinkRoamPage");
const HilinkVirtualPage = lz(() => import("./screens/MembershipDetail.jsx"), "HilinkVirtualPage");
const MeetingRoomsPage = lz(() => import("./screens/SpaceEnquiry.jsx"), "MeetingRoomsPage");
const EventSpacesPage  = lz(() => import("./screens/SpaceEnquiry.jsx"), "EventSpacesPage");
const MeetingRoomsLanding   = lz(() => import("./screens/VenuePages.jsx"), "MeetingRoomsLanding");
const MeetingRoomsLocation  = lz(() => import("./screens/VenuePages.jsx"), "MeetingRoomsLocation");
const MeetingRoomsWorkspace = lz(() => import("./screens/VenuePages.jsx"), "MeetingRoomsWorkspace");
const EventVenuesLanding    = lz(() => import("./screens/VenuePages.jsx"), "EventVenuesLanding");
const EventVenuesLocation   = lz(() => import("./screens/VenuePages.jsx"), "EventVenuesLocation");
const EventVenuesWorkspace  = lz(() => import("./screens/VenuePages.jsx"), "EventVenuesWorkspace");
const ForumPage    = lz(() => import("./screens/ForumPage.jsx"), "ForumPage");
const ArticlePage  = lz(() => import("./screens/ForumPage.jsx"), "ArticlePage");
const SpaceDetail  = lz(() => import("./screens/Screens.jsx"), "SpaceDetail");
const PublicRecommendationTool = lz(() => import("./screens/RecommendationTool.jsx"), "PublicRecommendationTool");
const TermsPage         = lz(() => import("./screens/LegalPages.jsx"), "TermsPage");
const PrivacyPage       = lz(() => import("./screens/LegalPages.jsx"), "PrivacyPage");
const CookiePage        = lz(() => import("./screens/LegalPages.jsx"), "CookiePage");
const AccessibilityPage = lz(() => import("./screens/LegalPages.jsx"), "AccessibilityPage");
const NotFoundPage      = lz(() => import("./screens/NotFoundPage.jsx"));

/* ── Splash screen overlay ── */
const SplashScreen = () => (
  <motion.div
    key="splash"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
    style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
    }}
  >
    {/* Subtle warm radial glow behind logo */}
    <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", width:400, height:400, background:"radial-gradient(circle, rgba(168,143,92,0.10) 0%, transparent 70%)", pointerEvents:"none" }} />

    {/* Logo mark + wordmark */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ display: "flex", alignItems: "center", gap: 20, position:"relative" }}
    >
      {/* HiLink Premium Workspace logo — transparent trim, no border/box */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img src="/logo-hilink-lockup.svg" alt="HiLink" style={{ aspectRatio: "2413 / 1669", height:160, width:"auto", display:"block", border:"none", outline:"none" }}/>
      </div>
    </motion.div>

    {/* Tagline */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      style={{
        fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "rgba(15,15,15,0.4)", marginTop: 24,
      }}
    >
      Premium Workspaces · Hanoi
    </motion.p>

    {/* Gold progress bar */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(168,143,92,0.15)" }}>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: "linear" }}
        style={{ height: "100%", background: "var(--gold)" }}
      />
    </div>
  </motion.div>
);

/* Scroll to top instantly on route change — the push transition offsets the
   exiting page by the captured scroll so there is no visible jump. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};




/* ── Push page transition (as recorded) ────────────────────────────────────
   The chosen page slides UP from the bottom of the viewport while the
   current page keeps moving up and out above it — one continuous push.
   popLayout pops the exiting page out of flow; its exit target subtracts the
   scroll position captured at the moment of navigation, so the page appears
   to continue upward from exactly where the user was. */
const PUSH_EASE = [0.76, 0, 0.24, 1];
const pushVariants = {
  initial: { y: "100vh" },
  enter:   { y: 0, transition: { duration: 0.85, ease: PUSH_EASE } },
  exit: (scrollRef) => ({
    y: -((scrollRef?.current || 0) + window.innerHeight * 0.35),
    transition: { duration: 0.85, ease: PUSH_EASE },
  }),
};

/* Lightweight fade for phones / prefers-reduced-motion. The 0.85s full-page
   transform (compositing two viewport-sized layers) was the main source of
   the "clicks feel delayed" INP finding on mobile — a 0.2s opacity swap
   keeps the transition feel without blocking the main thread. */
const fadeVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

const LITE_MQ = "(max-width: 768px), (prefers-reduced-motion: reduce)";
const useLiteMotion = () => {
  const [lite, setLite] = useState(() => window.matchMedia(LITE_MQ).matches);
  useEffect(() => {
    const mq = window.matchMedia(LITE_MQ);
    const on = (e) => setLite(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return lite;
};

const RoutedApp = () => {
  const location = useLocation();
  const lite = useLiteMotion();
  const prevPath = useRef(location.pathname);
  const exitScroll = useRef(0);
  /* capture scroll during render, before ScrollToTop's effect resets it */
  if (prevPath.current !== location.pathname) {
    exitScroll.current = window.scrollY;
    prevPath.current = location.pathname;
  }
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
    <AnimatePresence mode="popLayout" initial={false} custom={exitScroll}>
      <motion.div
        key={location.pathname}
        custom={exitScroll}
        variants={lite ? fadeVariants : pushVariants}
        initial="initial" animate="enter" exit="exit"
        /* NOTE: no permanent willChange here — will-change:transform establishes a
           containing block for fixed descendants and would silently unpin the
           footer uncover. Framer applies will-change itself mid-animation. */
        style={{ position: "relative", boxShadow: "0 -30px 70px -20px rgba(0,0,0,0.35)" }}
      >
      <Routes location={location}>
              {/* Public */}
              <Route path="/"                    element={<Homepage />} />
              <Route path="/locations"           element={<LocationsPage />} />
              <Route path="/locations/:id"       element={<LocationDetail />} />
              <Route path="/locations/:id/units/:unitId" element={<UnitDetail />} />
              <Route path="/solutions"           element={<SolutionsIndex />} />
              <Route path="/solutions/:slug"     element={<SolutionPage />} />
              <Route path="/partnerships"        element={<PartnershipsPage />} />
              <Route path="/partnerships/:slug"  element={<PartnerPage />} />
              <Route path="/spaces"              element={<SpacesExplorer />} />
              <Route path="/spaces/:id"          element={<SpaceDetail />} />
              <Route path="/membership"               element={<MembershipPage />} />
              <Route path="/membership/office"         element={<HilinkOfficePage />} />
              <Route path="/membership/desk"           element={<HilinkDeskPage />} />
              <Route path="/membership/roam"           element={<HilinkRoamPage />} />
              <Route path="/membership/virtual"        element={<HilinkVirtualPage />} />
              <Route path="/spaces/meeting-rooms"      element={<MeetingRoomsPage />} />
              <Route path="/spaces/event-spaces"       element={<EventSpacesPage />} />
              <Route path="/meeting-rooms"                       element={<MeetingRoomsLanding />} />
              <Route path="/meeting-rooms/:district"              element={<MeetingRoomsLocation />} />
              <Route path="/meeting-rooms/:district/:workspace"   element={<MeetingRoomsWorkspace />} />
              <Route path="/event-venues"                         element={<EventVenuesLanding />} />
              <Route path="/event-venues/:district"               element={<EventVenuesLocation />} />
              <Route path="/event-venues/:district/:workspace"    element={<EventVenuesWorkspace />} />
              <Route path="/recommend"           element={<PublicRecommendationTool />} />
              <Route path="/about"               element={<AboutPage />} />
              <Route path="/careers"             element={<CareersPage />} />
              <Route path="/forum"               element={<ForumPage />} />
              <Route path="/forum/:slug"         element={<ArticlePage />} />
              <Route path="/terms"               element={<TermsPage />} />
              <Route path="/privacy"             element={<PrivacyPage />} />
              <Route path="/cookies"             element={<CookiePage />} />
              <Route path="/accessibility"       element={<AccessibilityPage />} />

              <Route path="*"                    element={<NotFoundPage />} />
      </Routes>
      </motion.div>
    </AnimatePresence>
    </Suspense>
  );
};

/* Inner app — has access to useSplash (inside SplashProvider) */
const AppInner = () => {
  const { show: splash } = useSplash();
  return (
    <BrowserRouter>
        <ScrollToTop />
      <LanguageProvider>
          {/* Splash renders above everything */}
          <AnimatePresence>{splash && <SplashScreen key="splash" />}</AnimatePresence>

          <Navbar />
          <RoutedApp />
      </LanguageProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <SplashProvider>
    <AppInner />
  </SplashProvider>
);

export default App;
