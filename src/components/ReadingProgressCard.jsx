import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform
} from "motion/react";
import { useStudy } from "../context/StudyContext";
import { getBookProgressPct, getBookStudyEntry, normalizePageCount } from "../utils/bookStudy";
import { CheckIcon } from "./icons/StudyIcons";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

const AnimatedPercent = ({ value, instant, shouldReduceMotion }) => {
  const percentValue = useMotionValue(value);
  const displayValue = useTransform(percentValue, (latest) => `${Math.round(latest)}%`);

  useLayoutEffect(() => {
    if (instant || shouldReduceMotion) {
      percentValue.set(value);
    }
  }, [instant, percentValue, shouldReduceMotion, value]);

  useEffect(() => {
    if (instant || shouldReduceMotion) return undefined;
    const animation = animate(percentValue, value, {
      duration: 0.32,
      ease: "easeOut"
    });
    return () => animation.stop();
  }, [instant, percentValue, shouldReduceMotion, value]);

  return <motion.span aria-label={`${value}%`} className="tabular-nums">{displayValue}</motion.span>;
};

const ReadingProgressCard = ({ book }) => {
  const { bookStudyData, updateBookStudyData, t } = useStudy();
  const shouldReduceMotion = useReducedMotion();
  const study = getBookStudyEntry(bookStudyData, book);
  const progressPct = getBookProgressPct(study);
  const sliderMax = study.totalPages || 300;
  const sliderValue = Math.min(study.currentPage, sliderMax);
  const [isSliding, setIsSliding] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentPageDraft, setCurrentPageDraft] = useState(String(study.currentPage));
  const [totalPagesDraft, setTotalPagesDraft] = useState(String(study.totalPages));
  const [editingCurrentPage, setEditingCurrentPage] = useState(false);
  const [editingTotalPages, setEditingTotalPages] = useState(false);
  const savedTimer = useRef(null);

  useEffect(() => () => {
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
  }, []);

  const showSaved = () => {
    setIsSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => {
      setIsSaved(false);
      savedTimer.current = null;
    }, 1500);
  };

  const handleSliderChange = (event) => {
    const currentPage = normalizePageCount(event.currentTarget.value);
    const totalPages = study.totalPages || 300;
    updateBookStudyData(book.id, { currentPage, totalPages }, book.pages);
    setCurrentPageDraft(String(currentPage));
    setTotalPagesDraft(String(totalPages));
    setEditingCurrentPage(false);
    setEditingTotalPages(false);
    showSaved();
  };

  const handleStatusChange = (status) => {
    const currentPage = status === "to_read"
      ? 0
      : status === "finished"
        ? study.totalPages
        : study.currentPage;
    updateBookStudyData(book.id, { status }, book.pages);
    setCurrentPageDraft(String(currentPage));
    setEditingCurrentPage(false);
    showSaved();
  };

  const handleCurrentPageBlur = (event) => {
    const requestedPage = normalizePageCount(event.currentTarget.value);
    const totalPages = study.totalPages || (requestedPage > 0 ? 300 : 0);
    const currentPage = totalPages > 0
      ? Math.min(requestedPage, totalPages)
      : requestedPage;
    updateBookStudyData(book.id, { currentPage, totalPages }, book.pages);
    setCurrentPageDraft(String(currentPage));
    setTotalPagesDraft(String(totalPages));
    setEditingCurrentPage(false);
    showSaved();
  };

  const handleTotalPagesBlur = (event) => {
    const totalPages = normalizePageCount(event.currentTarget.value);
    const currentPage = totalPages > 0
      ? Math.min(study.currentPage, totalPages)
      : study.currentPage;
    updateBookStudyData(book.id, { currentPage, totalPages }, book.pages);
    setCurrentPageDraft(String(currentPage));
    setTotalPagesDraft(String(totalPages));
    setEditingTotalPages(false);
    showSaved();
  };

  const statusOptions = [
    { value: "to_read", label: t.detail.statusToRead },
    { value: "reading", label: t.detail.statusReading },
    { value: "finished", label: t.detail.statusFinished }
  ];
  const transition = shouldReduceMotion || isSliding
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34 };
  const progressColor = study.status === "finished"
    ? "from-[#6F8260] to-[#97A888]"
    : "from-[#D9A441] to-[#C4693D]";

  return <Card padding="md" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-serif-display text-lg font-semibold text-[#241B12] dark:text-[#E9E0CD]">
          {t.detail.readingProgress}
        </h2>
        <span className="font-serif-display text-xl font-semibold text-[#9E6E14] dark:text-[#DFB056]">
          <AnimatedPercent
            value={progressPct}
            instant={isSliding}
            shouldReduceMotion={shouldReduceMotion}
          />
        </span>
      </div>

      <div
        role="group"
        aria-label={t.detail.readingProgress}
        className="grid grid-cols-3 gap-1 rounded-2xl bg-[#E9E2D6] p-1 dark:bg-[#303129]"
      >
        {statusOptions.map(({ value, label }) => <button
          key={value}
          type="button"
          aria-pressed={study.status === value}
          onClick={() => handleStatusChange(value)}
          className="relative min-h-10 rounded-xl px-2 text-xs font-medium text-[#5C4B3A] transition-colors hover:text-[#241B12] dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] dark:focus-visible:ring-[#C9A24A] sm:text-sm"
        >
          {study.status === value && <motion.span
            layoutId={`book-study-status-${book.id}`}
            transition={transition}
            className="absolute inset-0 rounded-xl bg-[#FFFCF5] shadow-sm dark:bg-[#25251F]"
          />}
          <span className={`relative z-[1] ${study.status === value ? "text-[#245A43] dark:text-[#D9B65F]" : ""}`}>
            {label}
          </span>
        </button>)}
      </div>

      <div className="space-y-2">
        <div className="group relative h-10 touch-none">
          <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full bg-[#EFE5D6] dark:bg-[#342821]">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={transition}
              className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
            />
          </div>
          <motion.span
            initial={false}
            animate={{ left: `clamp(10px, ${progressPct}%, calc(100% - 10px))` }}
            transition={transition}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-[1] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2F6B52] bg-[#FFFCF5] shadow-md transition-[box-shadow,scale] group-hover:scale-110 group-focus-within:scale-110 group-focus-within:ring-4 group-focus-within:ring-[#2F6B52]/20 dark:border-[#A66B42] dark:bg-[#38291F] dark:group-focus-within:ring-[#A66B42]/25"
          />
          <input
            type="range"
            min="0"
            max={sliderMax}
            step="1"
            value={sliderValue}
            aria-label={t.detail.progressSliderLabel}
            aria-valuetext={t.detail.progressSliderValue(sliderValue, sliderMax)}
            onChange={handleSliderChange}
            onPointerDown={() => setIsSliding(true)}
            onPointerUp={() => setIsSliding(false)}
            onPointerCancel={() => setIsSliding(false)}
            onBlur={() => setIsSliding(false)}
            className="absolute inset-0 z-[2] m-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing focus:outline-none"
          />
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          min="0"
          max={study.totalPages > 0 ? study.totalPages : undefined}
          step="1"
          inputMode="numeric"
          label={t.detail.currentPage}
          value={editingCurrentPage ? currentPageDraft : String(study.currentPage)}
          onFocus={() => {
            setCurrentPageDraft(String(study.currentPage));
            setEditingCurrentPage(true);
          }}
          onChange={(event) => setCurrentPageDraft(event.currentTarget.value)}
          onBlur={handleCurrentPageBlur}
        />
        <Input
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          label={t.detail.totalPages}
          value={editingTotalPages ? totalPagesDraft : String(study.totalPages)}
          onFocus={() => {
            setTotalPagesDraft(String(study.totalPages));
            setEditingTotalPages(true);
          }}
          onChange={(event) => setTotalPagesDraft(event.currentTarget.value)}
          onBlur={handleTotalPagesBlur}
        />
      </div>

      <div className="flex min-h-5 items-center justify-between gap-2 text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
        <span className="shrink-0 tabular-nums">
          {t.detail.progressSliderValue(study.currentPage, study.totalPages || 300)}
        </span>
        <span aria-live="polite" aria-atomic="true" className="text-right">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isSaved ? "saved" : "hint"}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
              className={isSaved
                ? "inline-flex items-center gap-1 font-medium text-[#4C5E3E] dark:text-[#97A888]"
                : ""}
            >
              {isSaved
                ? <><CheckIcon size={14} />{t.detail.saved}</>
                : t.detail.progressHint}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </Card>;
};

export { ReadingProgressCard };
