import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { StudyProvider, useStudy } from "./context/StudyContext";
import { Navbar } from "./components/layout/Navbar";
import { WelcomeNameGate } from "./components/WelcomeNameGate";
import { HomePage } from "./pages/HomePage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ResourceDetailPage } from "./pages/ResourceDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { RevisionsPage } from "./pages/RevisionsPage";
import { AssistantPage } from "./pages/AssistantPage";
const DetailRoute = () => {
  const id = window.location.pathname.split("/")[2] ?? "";
  return <ResourceDetailPage resourceId={decodeURIComponent(id)} key={id} />;
};
const AppContent = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { hasEnteredName } = useStudy();
  if (!hasEnteredName) {
    return <div className="app-shell min-h-screen">
        <WelcomeNameGate />
      </div>;
  }
  return <div className="app-shell min-h-screen flex flex-col text-[#241B12] dark:text-[#E9E0CD]">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8 md:pb-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.32,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/ressources" element={<ResourcesPage />} />
              <Route path="/ressources/:id" element={<DetailRoute />} />
              <Route path="/favoris" element={<FavoritesPage />} />
              <Route path="/revisions" element={<RevisionsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="mt-8 border-t border-[#241B12]/10 dark:border-[#E9E0CD]/10 bg-[#FFFCF5]/45 dark:bg-[#25251F]/35">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 pb-28 md:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3 min-w-0">
            <p className="font-serif-display text-base font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              SkillUp
            </p>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#B8893B] dark:bg-[#DFB056]" />
            <p className="text-xs font-medium tracking-wide text-[#76614A] dark:text-[#C7B697]">
              made with care
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5C4B3A] dark:text-[#BDAE97] sm:shrink-0">
            <span aria-hidden="true" className="w-7 h-px bg-[#B8893B]/70 dark:bg-[#DFB056]/70" />
            <span>© {new Date().getFullYear()} SkillUp</span>
          </div>
        </div>
      </footer>
    </div>;
};
function App() {
  return <StudyProvider>
      <AppContent />
    </StudyProvider>;
}
export {
  App as default
};
