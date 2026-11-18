import { useState } from "react";
import { HeartIcon } from "../icons/StudyIcons";
const HeartButton = ({
  active,
  onToggle,
  label,
  size = "md",
  showText = false
}) => {
  const [popping, setPopping] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setPopping(true);
    onToggle(e);
    window.setTimeout(() => setPopping(false), 340);
  };
  if (showText) {
    return <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A] ${active ? "bg-[#B8893B]/20 text-[#724F0E] border border-[#B8893B]/45 dark:bg-[#DFB056]/20 dark:text-[#F0CF89] dark:border-[#DFB056]/40" : "bg-[#FFFCF5] text-[#241B12] border border-[#241B12]/14 hover:border-[#2F6B52] dark:bg-[#25251F] dark:text-[#E9E0CD] dark:border-[#E9E0CD]/15 dark:hover:border-[#C9A24A]"}`}
    >
        <span className={popping ? "animate-heart-pop inline-flex" : "inline-flex"}>
          <HeartIcon
      size={18}
      filled={active}
      className={active ? "text-[#B57E1A] dark:text-[#DFB056]" : "text-[#5C4B3A] dark:text-[#BDAE97]"}
    />
        </span>
        <span>{active ? "Saved on bookshelf" : "Save to bookshelf"}</span>
      </button>;
  }
  const dims = size === "sm" ? "w-10 h-10" : "w-11 h-11";
  return <button
    type="button"
    onClick={handleClick}
    aria-pressed={active}
    aria-label={label || (active ? "Remove from favorites" : "Save to favorites")}
    className={`${dims} rounded-full flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A] ${active ? "bg-[#B8893B]/22 text-[#A77416] dark:bg-[#DFB056]/22 dark:text-[#DFB056]" : "bg-[#FFFCF5]/95 text-[#5C4B3A] hover:text-[#2F6B52] hover:bg-[#E9E2D6] dark:bg-[#25251F]/90 dark:text-[#BDAE97] dark:hover:text-[#C9A24A]"}`}
  >
      <span className={popping ? "animate-heart-pop inline-flex" : "inline-flex"}>
        <HeartIcon size={size === "sm" ? 18 : 20} filled={active} />
      </span>
    </button>;
};
export {
  HeartButton
};
