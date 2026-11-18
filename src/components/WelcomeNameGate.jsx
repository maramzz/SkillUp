import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useStudy } from "../context/StudyContext";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import {
  ArrowRightIcon,
  SkillUpMark
} from "./icons/StudyIcons";
import { ThemeToggleButton } from "./ui/ThemeToggleButton";
import { CharacterReveal } from "./ui/CharacterReveal";

const WelcomeNameGate = () => {
  const shouldReduceMotion = useReducedMotion();
  const {
    saveStudentName,
    t,
    language,
    toggleLanguage,
    theme,
    toggleTheme
  } = useStudy();
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError(t.home.welcomeError);
      return;
    }
    setError("");
    saveStudentName(nameInput);
  };
  return <motion.div
    key="welcome-name-gate"
    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
    transition={{
      duration: shouldReduceMotion ? 0 : 0.25,
      ease: [0.16, 1, 0.3, 1]
    }}
    className="app-shell min-h-screen flex flex-col justify-between px-4 py-6 sm:px-6"
  >
      {
    /* Top bar with logo + FR/EN & theme toggles */
  }
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[#241B12] dark:text-[#E9E0CD]">
          <span className="w-9 h-9 rounded-xl bg-[#2F6B52]/14 dark:bg-[#C9A24A]/18 text-[#245A43] dark:text-[#D9B65F] flex items-center justify-center">
            <SkillUpMark size={20} />
          </span>
          <span className="font-serif-display text-xl font-semibold tracking-tight">
            SkillUp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
    type="button"
    onClick={toggleLanguage}
    aria-label={t.nav.switchLanguage}
    className="h-10 px-3 rounded-full flex items-center justify-center bg-[#DDD2BA] hover:bg-[#D2C5A8] text-xs font-semibold text-[#241B12] dark:bg-[#352A1D] dark:hover:bg-[#443523] dark:text-[#E9E0CD] whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            {language === "en" ? "FR / EN" : "EN / FR"}
          </button>

          <ThemeToggleButton
            theme={theme}
            onToggle={toggleTheme}
            label={theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#DDD2BA] hover:bg-[#D2C5A8] text-[#241B12] dark:bg-[#352A1D] dark:hover:bg-[#443523] dark:text-[#E9E0CD] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
          />
        </div>
      </div>

      {
    /* Centered "What should I call you?" Card */
  }
      <main className="flex-1 flex items-center justify-center py-10">
        <motion.div
    initial={{ opacity: 0, y: 14, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="w-full max-w-md"
  >
          <Card padding="lg" className="space-y-6">
            <div className="space-y-2 text-center">
              <CharacterReveal
                key={language}
                text={t.home.welcomeKicker}
                className="font-handwritten welcome-kicker text-[#245A43] dark:text-[#D9B65F] leading-snug"
              />
              <h1 className="font-serif-display text-3xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
                {t.home.welcomeTitle}
              </h1>
              <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.home.welcomeSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
    autoFocus
    type="text"
    maxLength={28}
    value={nameInput}
    onChange={(e) => {
      setNameInput(e.target.value);
      if (error) setError("");
    }}
    placeholder={t.home.welcomePlaceholder}
    aria-label={t.home.welcomeTitle}
    error={error}
  />

              <Button
    type="submit"
    size="lg"
    className="w-full"
    rightIcon={<ArrowRightIcon size={18} />}
  >
                {t.home.welcomeSubmit}
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>

      <div className="h-6" aria-hidden="true" />
    </motion.div>;
};
export {
  WelcomeNameGate
};
