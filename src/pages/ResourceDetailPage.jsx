import { useEffect, useState } from "react";
import { getBook } from "../services/openLibrary";
import { useStudy } from "../context/StudyContext";
import { CATEGORY_LABELS } from "../i18n/translations";
import { ReadingProgressCard } from "../components/ReadingProgressCard";
import { MarginNotesCard } from "../components/MarginNotesCard";
import { BookCover } from "../components/ui/BookCover";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Tag } from "../components/ui/Tag";
import { HeartButton } from "../components/ui/HeartButton";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChecklistIcon,
  EmptyShelfIllustration,
  QuillIcon
} from "../components/icons/StudyIcons";
const ResourceDetailPage = ({ resourceId }) => {
  const {
    navigate,
    isFavorite,
    toggleFavorite,
    getCachedBook,
    cacheBooks,
    ensureBookStudyData,
    addTask,
    setAssistantDraft,
    setAssistantContextBook,
    language,
    t
  } = useStudy();
  const [book, setBook] = useState(() => getCachedBook(resourceId) ?? null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [previewState, setPreviewState] = useState("live");
  const [taskAdded, setTaskAdded] = useState(false);
  useEffect(() => {
    setTaskAdded(false);
    setPreviewState("live");
    let cancelled = false;
    const fetchWork = async () => {
      const cached = getCachedBook(resourceId);
      if (cached) setBook(cached);
      setLoading(true);
      setNotFound(false);
      try {
        const found = await getBook(resourceId);
        if (!found) {
          if (!cancelled) {
            setBook(null);
            setNotFound(true);
            setLoading(false);
          }
          return;
        }
        if (!cancelled) {
          const resolvedBook = {
            ...found,
            pages: found.pages ?? cached?.pages ?? null
          };
          ensureBookStudyData(resolvedBook.id, resolvedBook.pages ?? 0);
          setBook(resolvedBook);
          cacheBooks([resolvedBook]);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          if (!cached) {
            setNotFound(true);
          } else {
            ensureBookStudyData(cached.id, cached.pages ?? 0);
          }
          setLoading(false);
        }
      }
    };
    fetchWork();
    return () => {
      cancelled = true;
    };
  }, [resourceId, getCachedBook, cacheBooks, ensureBookStudyData]);
  const effectiveLoading = previewState === "loading" || previewState === "live" && loading;
  const effectiveNotFound = previewState === "not_found" || previewState === "live" && notFound && !book;
  const displayBook = book ? {
    ...book,
    coverImage: previewState === "no_cover" ? "" : book.coverImage,
    summary: previewState === "no_description" ? "" : book.summary
  } : null;
  const stateControls = <div className="flex flex-wrap items-center justify-between gap-3">
      <button
    type="button"
    onClick={() => navigate("/ressources")}
    className="inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 -ml-3 rounded-xl text-sm font-medium text-[#5C4B3A] hover:text-[#241B12] hover:bg-[#DDD2BA]/60 dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#30261B] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
        <ArrowLeftIcon size={16} />
        <span>{t.detail.back}</span>
      </button>
    </div>;
  if (effectiveLoading) {
    return <div className="space-y-8">
        {stateControls}
        <div
      aria-busy="true"
      aria-label="Loading book details"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-pulse"
    >
          <div className="lg:col-span-5 max-w-sm lg:max-w-none mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-[24px] bg-[#DDD2BA] dark:bg-[#342821]" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-36 rounded-lg bg-[#DDD2BA] dark:bg-[#342821]" />
            <div className="h-11 w-4/5 rounded-xl bg-[#DDD2BA] dark:bg-[#342821]" />
            <div className="h-5 w-1/2 rounded-lg bg-[#DDD2BA] dark:bg-[#342821]" />
            <div className="flex gap-3">
              <div className="h-11 w-44 rounded-2xl bg-[#DDD2BA] dark:bg-[#342821]" />
              <div className="h-11 w-44 rounded-2xl bg-[#DDD2BA] dark:bg-[#342821]" />
            </div>
            <div className="h-44 w-full rounded-[20px] bg-[#DDD2BA] dark:bg-[#342821]" />
          </div>
        </div>
      </div>;
  }
  if (effectiveNotFound || !displayBook) {
    return <div className="space-y-8">
        {stateControls}
        <Card className="py-12 px-6 text-center max-w-lg mx-auto space-y-4">
          <div className="flex justify-center text-[#5C4B3A] dark:text-[#BDAE97]">
            <EmptyShelfIllustration className="w-48 h-28" />
          </div>
          <h1 className="font-serif-display text-2xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
            {t.detail.notFoundTitle}
          </h1>
          <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
            {t.detail.notFoundBody}
          </p>
          <div>
            <Button onClick={() => navigate("/ressources")} leftIcon={<ArrowLeftIcon size={16} />}>
              {t.detail.back}
            </Button>
          </div>
        </Card>
      </div>;
  }
  const fav = isFavorite(displayBook.id);
  const handleAddRevisionTask = () => {
    const nextWeek = /* @__PURE__ */ new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    addTask({
      title: `Review "${displayBook.title}"`,
      description: `Summarize key concepts from ${displayBook.author}.`,
      deadline: nextWeek.toISOString().slice(0, 10)
    });
    setTaskAdded(true);
  };
  const handleAskAssistant = () => {
    setAssistantContextBook(displayBook.title);
    setAssistantDraft(
      language === "fr" ? `Résumez les concepts clés de « ${displayBook.title} » et proposez-moi une question d'entraînement.` : `Summarize the key exam concepts from "${displayBook.title}" and give me one practice question.`
    );
    navigate("/assistant");
  };
  return <div className="space-y-8">
      {stateControls}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {
    /* Left: Large cover (with clean no-cover state) */
  }
        <div className="lg:col-span-5 max-w-sm lg:max-w-none mx-auto w-full space-y-4">
          <div className="p-3 sm:p-4 rounded-[20px] bg-[#F6F0E1] dark:bg-[#261E15] border border-[#241B12]/8 dark:border-[#E9E0CD]/10 warm-shadow">
            <BookCover
    src={displayBook.coverImage}
    title={displayBook.title}
    category={CATEGORY_LABELS[language][displayBook.category]}
    tone={displayBook.shelfTone}
    noCoverLabel={t.resources.noCoverLabel}
  />
          </div>
          {!displayBook.coverImage && <p className="text-center text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.detail.noCoverBadge}
            </p>}
          <ReadingProgressCard key={displayBook.id} book={displayBook} />
        </div>

        {
    /* Right: Full info */
  }
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Tag tone="terracotta">{CATEGORY_LABELS[language][displayBook.category]}</Tag>
              <span className="text-xs font-medium text-[#5C4B3A] dark:text-[#BDAE97] tabular-nums">
                {[
    displayBook.courseCode,
    displayBook.year,
    displayBook.pages ? `${displayBook.pages} ${t.detail.pagesSuffix}` : null,
    displayBook.readingTime
  ].filter(Boolean).join(" · ")}
              </span>
            </div>

            <h1 className="page-title" style={{ textWrap: "balance" }}>
              {displayBook.title}
            </h1>

            <p className="text-base sm:text-lg text-[#5C4B3A] dark:text-[#BDAE97]">
              {displayBook.subtitle ? `${displayBook.subtitle} — ` : ""}
              <span className="text-[#241B12] dark:text-[#E9E0CD] font-medium">
                {displayBook.author}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HeartButton
    showText
    active={fav}
    onToggle={() => toggleFavorite(displayBook)}
    label={fav ? t.detail.savedOnShelf : t.detail.saveToShelf}
  />

            <Button
    variant="secondary"
    onClick={handleAskAssistant}
    leftIcon={<QuillIcon size={18} />}
  >
              {t.detail.askAssistant}
            </Button>

            <Button
    variant="outline"
    onClick={handleAddRevisionTask}
    disabled={taskAdded}
    leftIcon={taskAdded ? <CheckIcon size={17} /> : <ChecklistIcon size={17} />}
  >
              {taskAdded ? t.detail.addedRevision : t.detail.addRevision}
            </Button>
          </div>

          {
    /* Description / No description state */
  }
          <Card padding="lg" className="space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {t.detail.aboutTitle}
            </h2>
            {displayBook.summary ? <p className="text-[15px] leading-relaxed text-[#241B12]/90 dark:text-[#E9E0CD]/90 whitespace-pre-line">
                {displayBook.summary}
              </p> : <p className="text-sm italic leading-relaxed text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.detail.noDescription}
              </p>}
          </Card>

          {displayBook.takeaways.length > 0 && <Card padding="lg" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
                  {t.detail.takeawaysTitle}
                </h2>
                <span className="font-handwritten text-xl text-[#245A43] dark:text-[#D9B65F]">
                  {t.detail.takeawaysBadge}
                </span>
              </div>
              <ul className="space-y-3">
                {displayBook.takeaways.map((point, index) => <li
    key={index}
    className="flex items-start gap-3 text-[15px] leading-relaxed text-[#241B12]/90 dark:text-[#E9E0CD]/90"
  >
                    <span className="mt-1 w-6 h-6 rounded-full bg-[#8A9A7B]/20 dark:bg-[#97A888]/22 text-[#435237] dark:text-[#C7D6BA] text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>)}
              </ul>
            </Card>}
          <MarginNotesCard book={displayBook} />
        </div>
      </div>
    </div>;
};
export {
  ResourceDetailPage
};
