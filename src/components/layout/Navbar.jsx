import { useStudy } from "../../context/StudyContext";
import {
  BooksIcon,
  ChecklistIcon,
  HeartIcon,
  HomeIcon,
  QuillIcon,
  SkillUpMark
} from "../icons/StudyIcons";
import { NavItem } from "../ui/NavItem";
import { ThemeToggleButton } from "../ui/ThemeToggleButton";
const Navbar = () => {
  const {
    
    navigate,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t
  } = useStudy();
  const navLinks = [
    { label: t.nav.home, path: "/", Icon: HomeIcon },
    { label: t.nav.resources, path: "/ressources", Icon: BooksIcon },
    { label: t.nav.favorites, path: "/favoris", Icon: HeartIcon },
    { label: t.nav.revisions, path: "/revisions", Icon: ChecklistIcon },
    { label: t.nav.assistant, path: "/assistant", Icon: QuillIcon }
  ];
 
  return <>
      {
    /* Desktop floating rounded top navbar */
  }
      <div className="hidden md:block sticky top-4 z-30 px-4 lg:px-6 pointer-events-none">
        <header className="pointer-events-auto max-w-6xl mx-auto rounded-[24px] bg-[#FFFCF5]/90 dark:bg-[#25251F]/90 backdrop-blur-xl border border-[#241B12]/9 dark:border-[#E9E0CD]/10 warm-shadow px-4 lg:px-5 py-3 flex items-center justify-between gap-3 lg:gap-6">
          <button
    type="button"
    onClick={() => navigate("/")}
    className="flex items-center gap-2.5 text-[#241B12] dark:text-[#E9E0CD] whitespace-nowrap shrink-0 cursor-pointer rounded-xl px-1.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A]"
  >
            <span className="w-9 h-9 rounded-xl bg-[#2F6B52]/14 dark:bg-[#C9A24A]/18 text-[#245A43] dark:text-[#D9B65F] flex items-center justify-center">
              <SkillUpMark size={20} />
            </span>
            <span className="navbar-brand font-serif-display text-xl font-semibold tracking-tight">
              SkillUp
            </span>
          </button>

          <nav aria-label="Primary navigation" className="flex items-center gap-1 lg:gap-1.5">
            {navLinks.map(({ label, path, Icon }) => <NavItem
    key={path}
    label={label}
    to={path}
    icon={<Icon size={17} />}
  />)}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
    type="button"
    onClick={toggleLanguage}
    aria-label={t.nav.switchLanguage}
    title={t.nav.switchLanguage}
    className="h-10 px-3 rounded-full flex items-center justify-center bg-[#DDD2BA]/80 hover:bg-[#D2C5A8] text-xs font-semibold text-[#241B12] dark:bg-[#352A1D] dark:hover:bg-[#443523] dark:text-[#E9E0CD] whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A]"
  >
              {language === "en" ? "FR / EN" : "EN / FR"}
            </button>

            <ThemeToggleButton
              theme={theme}
              onToggle={toggleTheme}
              label={theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark}
              title={theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#DDD2BA]/80 hover:bg-[#D2C5A8] text-[#241B12] dark:bg-[#352A1D] dark:hover:bg-[#443523] dark:text-[#E9E0CD] shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A]"
            />
          </div>
        </header>
      </div>

      {
    /* Mobile compact top bar */
  }
      <header className="md:hidden sticky top-0 z-30 h-[56px] bg-[#F3F0E7]/92 dark:bg-[#191A16]/92 backdrop-blur-xl border-b border-[#241B12]/8 dark:border-[#E9E0CD]/8 px-3.5 flex items-center justify-between gap-2">
        <button
    type="button"
    onClick={() => navigate("/")}
    className="flex items-center gap-2 text-[#241B12] dark:text-[#E9E0CD] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
          <span className="w-8 h-8 rounded-xl bg-[#2F6B52]/14 dark:bg-[#C9A24A]/20 text-[#245A43] dark:text-[#D9B65F] flex items-center justify-center">
            <SkillUpMark size={18} />
          </span>
          <span className="navbar-brand font-serif-display text-lg font-semibold tracking-tight">
            SkillUp
          </span>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
    type="button"
    onClick={toggleLanguage}
    aria-label={t.nav.switchLanguage}
    className="h-9 px-2.5 rounded-full flex items-center justify-center bg-[#DDD2BA] text-[11px] font-semibold text-[#241B12] dark:bg-[#30261B] dark:text-[#E9E0CD] whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            {language.toUpperCase()}
          </button>

          <ThemeToggleButton
            theme={theme}
            onToggle={toggleTheme}
            label={theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#DDD2BA] text-[#241B12] dark:bg-[#30261B] dark:text-[#E9E0CD] shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
          />
        </div>
      </header>

      {
    /* Mobile fixed bottom tab bar */
  }
      <nav
    aria-label="Mobile navigation"
    className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-[68px] bg-[#FFFCF5]/95 dark:bg-[#25251F]/95 backdrop-blur-xl border-t border-[#241B12]/10 dark:border-[#E9E0CD]/10 px-1.5 grid grid-cols-5 items-center"
  >
        {navLinks.map(({ label, path, Icon }) => <NavItem
    key={path}
    variant="mobile"
    label={label}
    to={path}
    icon={<Icon size={20} />}
  />)}
      </nav>
    </>;
};
export {
  Navbar
};
