import { Link, Navigate, Route, Routes } from "react-router-dom";
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
  const { t, hasEnteredName } = useStudy();
  if (!hasEnteredName) {
    return <div className="min-h-screen bg-[#E9E0CD] dark:bg-[#1B150F]">
        <WelcomeNameGate />
      </div>;
  }
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/ressources", label: t.nav.resources },
    { to: "/favoris", label: t.nav.favorites },
    { to: "/revisions", label: t.nav.revisions },
    { to: "/assistant", label: t.nav.assistant }
  ];
  return <div className="min-h-screen flex flex-col bg-[#E9E0CD] dark:bg-[#1B150F] text-[#241B12] dark:text-[#E9E0CD]">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 md:pb-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ressources" element={<ResourcesPage />} />
          <Route path="/ressources/:id" element={<DetailRoute />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/revisions" element={<RevisionsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="hidden md:block border-t border-[#241B12]/10 dark:border-[#E9E0CD]/10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
          <p className="font-serif-display text-base text-[#241B12] dark:text-[#E9E0CD]">SkillUp</p>
          <nav aria-label="Footer" className="flex items-center gap-5">
            {links.map((l) => <Link key={l.to} to={l.to} className="hover:text-[#241B12] dark:hover:text-[#E9E0CD]">
                {l.label}
              </Link>)}
          </nav>
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
