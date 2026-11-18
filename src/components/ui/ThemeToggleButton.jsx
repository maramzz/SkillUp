import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MoonIcon, SunIcon } from "../icons/StudyIcons";

const ThemeToggleButton = ({ theme, onToggle, label, title, className }) => {
  const shouldReduceMotion = useReducedMotion();
  const rotation = theme === "dark" ? -90 : 90;
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 460, damping: 28 };

  return <button
    type="button"
    onClick={onToggle}
    aria-label={label}
    title={title}
    className={className}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{
          opacity: 0,
          rotate: shouldReduceMotion ? 0 : rotation,
          scale: shouldReduceMotion ? 1 : 0.75
        }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{
          opacity: 0,
          rotate: shouldReduceMotion ? 0 : -rotation,
          scale: shouldReduceMotion ? 1 : 0.75
        }}
        transition={transition}
        aria-hidden="true"
        className="inline-flex items-center justify-center"
      >
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </motion.span>
    </AnimatePresence>
  </button>;
};

export { ThemeToggleButton };
