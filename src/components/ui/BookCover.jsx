import { useState } from "react";
import { BooksIcon } from "../icons/StudyIcons";
const BookCover = ({
  src,
  title,
  category,
  tone = "#2F6B52",
  noCoverLabel,
  className = ""
}) => {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;
  return <div
    className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#E9E2D6] dark:bg-[#303129] border border-[#241B12]/10 dark:border-[#E9E0CD]/10 shadow-sm ${className}`}
  >
      {!showFallback ? <img
    src={src}
    alt={`${title} book cover`}
    referrerPolicy="no-referrer"
    onError={() => setHasError(true)}
    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
  /> : <div
    className="h-full w-full flex flex-col items-center justify-between p-5 text-center"
    style={{
      background: `linear-gradient(155deg, ${tone}22, ${tone}45)`
    }}
  >
          <span className="text-[11px] font-medium text-[#5C4B3A] dark:text-[#BDAE97] mt-1">
            {category}
          </span>
          <div className="space-y-2.5 my-auto px-1">
            <div className="w-10 h-10 rounded-xl bg-[#FFFCF5]/75 dark:bg-[#191A16]/55 mx-auto flex items-center justify-center">
              <BooksIcon size={20} className="text-[#241B12] dark:text-[#E9E0CD] opacity-80" />
            </div>
            <p className="font-serif-display text-sm sm:text-base font-semibold text-[#241B12] dark:text-[#E9E0CD] line-clamp-3 leading-snug">
              {title}
            </p>
          </div>
          <span className="text-[11px] text-[#5C4B3A] dark:text-[#BDAE97]">
            {noCoverLabel || ""}
          </span>
        </div>}

      {
    /* Subtle tactile book-spine crease & highlight */
  }
      <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/18 via-white/10 to-transparent"
  />
    </div>;
};
export {
  BookCover
};
