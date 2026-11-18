import { motion, useReducedMotion } from "motion/react";

const toneClasses = {
  neutral: "bg-[#E9E2D6] text-[#5C4A3E] dark:bg-[#303129] dark:text-[#D5C7BA]",
  terracotta: "bg-[#2F6B52]/14 text-[#8F3F1A] dark:bg-[#C9A24A]/20 dark:text-[#EBD08F]",
  sage: "bg-[#8A9A7B]/18 text-[#435237] dark:bg-[#97A888]/20 dark:text-[#C7D6BA]",
  gold: "bg-[#B8893B]/18 text-[#724F0E] dark:bg-[#DFB056]/20 dark:text-[#F0CF89]",
  danger: "bg-[#B8453A]/14 text-[#8F2C23] dark:bg-[#E6867A]/20 dark:text-[#F5B0A7]"
};
const Tag = ({
  children,
  tone = "neutral",
  icon,
  className = ""
}) => {
  return <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${toneClasses[tone]} ${className}`}
  >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>;
};
const FilterPill = ({
  active = false,
  count,
  children,
  className = "",
  layoutId,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();
  const layoutTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 520, damping: 38 };
  const animated = Boolean(layoutId);

  return <button
    type="button"
    aria-pressed={active}
    className={`relative inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A] ${active ? animated ? "border-transparent text-[#FFFDF9] dark:text-[#1B150F]" : "border-transparent bg-[#245A43] text-[#FFFDF9] dark:bg-[#C9A24A] dark:text-[#1B150F] shadow-sm" : "border-[#241B12]/10 bg-[#FFFCF5] text-[#5C4B3A] hover:text-[#241B12] hover:bg-[#E9E2D6] dark:border-[#E9E0CD]/10 dark:bg-[#25251F] dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#303129]"} ${className}`}
    {...rest}
  >
      {active && animated && <motion.span
        layoutId={layoutId}
        transition={layoutTransition}
        aria-hidden="true"
        className="absolute inset-0 z-0 rounded-full bg-[#245A43] shadow-sm dark:bg-[#C9A24A]"
      />}
      <span className="relative z-10">{children}</span>
      {typeof count === "number" && <span
    className={`relative z-10 text-xs tabular-nums ${active ? "text-[#FFFDF9]/85 dark:text-[#1B150F]/80" : "text-[#5C4B3A]/75 dark:text-[#BDAE97]/75"}`}
  >
          {count}
        </span>}
    </button>;
};
export {
  FilterPill,
  Tag
};
