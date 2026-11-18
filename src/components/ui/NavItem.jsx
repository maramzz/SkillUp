import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A]";
const NavItem = ({ label, to, icon, variant = "desktop" }) => {
  const shouldReduceMotion = useReducedMotion();
  const activeLayoutId = variant === "mobile" ? "mobile-navigation-active-pill" : "desktop-navigation-active-pill";
  const layoutTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 520, damping: 38 };

  if (variant === "mobile") {
    return <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => `relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-2xl transition-colors ${focus} ${isActive ? "text-[#1E4D39] dark:text-[#DDBB68]" : "text-[#5C4B3A] dark:text-[#BDAE97] hover:text-[#241B12] dark:hover:text-[#E9E0CD]"}`}
    >
        {({ isActive }) => <>
            <span className="relative flex items-center justify-center w-10 h-7 rounded-full">
              {isActive && <motion.span
                layoutId={activeLayoutId}
                transition={layoutTransition}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[#2F6B52]/15 dark:bg-[#C9A24A]/20"
              />}
              <span className="relative z-10">{icon}</span>
            </span>
            <span className="relative z-10 text-[11px] font-medium mt-0.5 whitespace-nowrap truncate max-w-full">
              {label}
            </span>
          </>}
      </NavLink>;
  }
  return <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) => `relative inline-flex items-center gap-1.5 lg:gap-2 min-h-[40px] px-3 lg:px-4 py-2 rounded-full text-[13px] lg:text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${focus} ${isActive ? "text-[#1A4332] dark:text-[#EBD08F]" : "text-[#5C4B3A] hover:text-[#241B12] hover:bg-[#241B12]/5 dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#E9E0CD]/7"}`}
  >
      {({ isActive }) => <>
        {isActive && <motion.span
          layoutId={activeLayoutId}
          transition={layoutTransition}
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#2F6B52]/16 dark:bg-[#C9A24A]/22"
        />}
        {icon && <span className="relative z-10 shrink-0">{icon}</span>}
        <span className="relative z-10">{label}</span>
      </>}
    </NavLink>;
};
export {
  NavItem
};
