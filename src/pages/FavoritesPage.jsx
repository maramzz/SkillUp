import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { RESOURCE_CATEGORIES } from "../data/resources";
import { useStudy } from "../context/StudyContext";
import { CATEGORY_LABELS } from "../i18n/translations";
import { getBookProgressPct, getBookStudyEntry } from "../utils/bookStudy";
import { BookCover } from "../components/ui/BookCover";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { HeartButton } from "../components/ui/HeartButton";
import { PageHeader } from "../components/ui/PageHeader";
import { FilterPill, Tag } from "../components/ui/Tag";
import { BooksIcon, EmptyShelfIllustration } from "../components/icons/StudyIcons";

const AnimatedBookCount = ({ count, shouldReduceMotion }) => (
  <span className="relative inline-grid min-w-[1ch] place-items-center overflow-hidden align-middle tabular-nums">
    <span aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
          className="col-start-1 row-start-1"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
    <span className="sr-only">{count}</span>
  </span>
);

const AnimatedCountSubtitle = ({ count, text, shouldReduceMotion }) => (
  <span aria-live="polite" aria-atomic="true">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={count}
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  </span>
);

const FavoritesPage = () => {
  const {
    favoriteBooks,
    bookStudyData,
    toggleFavorite,
    navigate,
    language,
    t
  } = useStudy();
  const shouldReduceMotion = useReducedMotion();
  const [selectedDiscipline, setSelectedDiscipline] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 36 };
  const disciplines = RESOURCE_CATEGORIES
    .filter((category) => category !== "All")
    .map((category) => ({
      category,
      count: favoriteBooks.filter((book) => book.category === category).length
    }))
    .filter(({ count }) => count > 0);
  const showDisciplineFilter = disciplines.length > 1;
  const activeDiscipline = showDisciplineFilter
    && disciplines.some(({ category }) => category === selectedDiscipline)
    ? selectedDiscipline
    : "All";
  const disciplineBooks = activeDiscipline === "All"
    ? favoriteBooks
    : favoriteBooks.filter((book) => book.category === activeDiscipline);
  const visibleBooks = selectedStatus === "all"
    ? disciplineBooks
    : disciplineBooks.filter((book) => getBookStudyEntry(bookStudyData, book).status === selectedStatus);
  const shelves = [];
  for (let i = 0; i < visibleBooks.length; i += 3) {
    shelves.push(visibleBooks.slice(i, i + 3));
  }
  return <div className="space-y-8">
      <PageHeader
        eyebrow={t.favorites.kicker}
        title={t.favorites.title}
        description={favoriteBooks.length === 0
          ? t.favorites.emptySubtitle
          : <AnimatedCountSubtitle
              count={favoriteBooks.length}
              text={t.favorites.countSubtitle(favoriteBooks.length)}
              shouldReduceMotion={shouldReduceMotion}
            />}
        actions={favoriteBooks.length > 0 && <Button
    variant="secondary"
    onClick={() => navigate("/ressources")}
    leftIcon={<BooksIcon size={18} />}
  >
            {t.favorites.addMore}
          </Button>}
      />

      <AnimatePresence initial={false}>
        {favoriteBooks.length > 0 && <motion.div
          key="bookshelf-filters"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={layoutTransition}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {showDisciplineFilter && <div
            role="group"
            aria-label={t.favorites.filterAriaLabel}
            className="flex flex-wrap items-center gap-2"
          >
            <FilterPill
              layoutId="favorite-discipline-active-pill"
              active={activeDiscipline === "All"}
              onClick={() => setSelectedDiscipline("All")}
            >
              {CATEGORY_LABELS[language].All}{" "}
              <AnimatedBookCount count={favoriteBooks.length} shouldReduceMotion={shouldReduceMotion} />
            </FilterPill>
            {disciplines.map(({ category, count }) => <FilterPill
              key={category}
              layoutId="favorite-discipline-active-pill"
              active={activeDiscipline === category}
              onClick={() => setSelectedDiscipline(category)}
            >
              {CATEGORY_LABELS[language][category]}{" "}
              <AnimatedBookCount count={count} shouldReduceMotion={shouldReduceMotion} />
            </FilterPill>)}
          </div>}
          <label className="flex items-center gap-2 text-sm font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
            <span>{t.favorites.statusFilterLabel}</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.currentTarget.value)}
              className="min-h-10 rounded-xl border border-[#241B12]/14 bg-[#FFFCF5] px-3 text-sm text-[#241B12] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6B52]/70 dark:border-[#E9E0CD]/14 dark:bg-[#25251F] dark:text-[#E9E0CD] dark:focus:ring-[#C9A24A]/70"
            >
              <option value="all">{t.favorites.statusFilterAll}</option>
              <option value="reading">{t.detail.statusReading}</option>
              <option value="to_read">{t.detail.statusToRead}</option>
              <option value="finished">{t.detail.statusFinished}</option>
            </select>
          </label>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence mode="wait">
      {favoriteBooks.length === 0 ? <motion.div
    key="empty-state"
    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
    transition={layoutTransition}
  >
          <Card className="py-14 px-6 text-center max-w-lg mx-auto space-y-5">
          <div className="flex justify-center text-[#5C4B3A] dark:text-[#BDAE97]">
            <EmptyShelfIllustration className="w-56 h-34" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-display text-2xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {t.favorites.emptyTitle}
            </h2>
            <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97] max-w-sm mx-auto">
              {t.favorites.emptyBody}
            </p>
          </div>
          <div>
            <Button onClick={() => navigate("/ressources")} leftIcon={<BooksIcon size={18} />}>
              {t.favorites.browseLibrary}
            </Button>
          </div>
          </Card>
        </motion.div> : visibleBooks.length === 0 ? <motion.div
    key="filtered-empty-state"
    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
    transition={layoutTransition}
  >
          <Card className="py-10 px-6 text-center max-w-lg mx-auto space-y-3">
            <h2 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {t.favorites.filteredEmptyTitle}
            </h2>
            <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.favorites.filteredEmptyBody}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedDiscipline("All");
                setSelectedStatus("all");
              }}
            >
              {t.favorites.clearFilters}
            </Button>
          </Card>
        </motion.div> : <motion.div
    key="shelves"
    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
    transition={layoutTransition}
  >
          <LayoutGroup id="favorite-bookshelf">
          <motion.div layout className="space-y-12">
          {shelves.map((shelfBooks, shelfIndex) => <motion.section
            key={shelfIndex}
            layout
            transition={layoutTransition}
            aria-label={t.favorites.shelfRowLabel(shelfIndex + 1)}
            className="relative"
          >
            <motion.div layout className="grid grid-cols-2 items-end gap-5 px-3 sm:grid-cols-3 sm:gap-8 sm:px-8">
              <AnimatePresence mode="popLayout">
                {shelfBooks.map((book) => {
                  const study = getBookStudyEntry(bookStudyData, book);
                  return <motion.div
                    key={book.id}
                    layout
                    layoutId={`favorite-book-${book.id}`}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                    transition={layoutTransition}
                    className="group relative flex flex-col"
                  >
                    <div
                      onClick={() => navigate(`/ressources/${book.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/ressources/${book.id}`);
                        }
                      }}
                      className="relative cursor-pointer rounded-2xl transition-transform duration-200 ease-out group-hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
                    >
                      <BookCover
                        src={book.coverImage}
                        title={book.title}
                        category={CATEGORY_LABELS[language][book.category]}
                        tone={book.shelfTone}
                        noCoverLabel={t.resources.noCoverLabel}
                        progressPct={getBookProgressPct(study)}
                        progressStatus={study.status}
                        className="shadow-md"
                      />
                      <div className="absolute right-2.5 top-2.5">
                        <HeartButton
                          size="sm"
                          active
                          onToggle={() => toggleFavorite(book)}
                          label={`Remove ${book.title} from bookshelf`}
                        />
                      </div>
                    </div>

                    <div className="order-last px-1 pb-1 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/ressources/${book.id}`)}
                        className="cursor-pointer text-left transition-colors group-hover:text-[#245A43] dark:group-hover:text-[#D9B65F]"
                      >
                        <h2 className="line-clamp-1 font-serif-display text-base font-semibold leading-snug text-[#241B12] dark:text-[#E9E0CD] sm:text-lg">
                          {book.title}
                        </h2>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[#5C4B3A] dark:text-[#BDAE97] sm:text-sm">
                          {book.author}
                        </p>
                      </button>
                      <Tag tone="terracotta" className="mt-2 self-start">
                        {CATEGORY_LABELS[language][book.category]}
                      </Tag>
                    </div>
                  </motion.div>;
                })}
              </AnimatePresence>
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none relative -z-10 -mt-[54px] sm:-mt-[60px]"
            >
              <div className="h-5 w-full rounded-xl border border-[#241B12]/12 bg-gradient-to-b from-[#DFCCB4] via-[#D2BA9B] to-[#C2A684] shadow-[0_12px_20px_-8px_rgba(46,31,23,0.22)] dark:border-[#E9E0CD]/10 dark:from-[#4A382C] dark:via-[#3B2C22] dark:to-[#2D2119] dark:shadow-[0_14px_24px_-8px_rgba(0,0,0,0.6)]" />
              <div className="mx-6 flex h-2.5 justify-between">
                <div className="h-full w-6 rounded-b-md bg-[#B99A77]/70 dark:bg-[#261B14]" />
                <div className="h-full w-6 rounded-b-md bg-[#B99A77]/70 dark:bg-[#261B14]" />
              </div>
              <div className="h-12" />
            </div>

            <div className="mt-1 grid grid-cols-2 gap-5 px-3 sm:grid-cols-3 sm:gap-8 sm:px-8">
              {shelfBooks.map((book) => {
                const study = getBookStudyEntry(bookStudyData, book);
                const statusLabel = study.status === "finished"
                  ? t.detail.statusFinished
                  : study.status === "reading"
                    ? t.detail.statusReading
                    : t.detail.statusToRead;
                const summary = `${statusLabel} · ${getBookProgressPct(study)}% · ${t.detail.noteCount(study.notes.length)}`;
                return <p
                  key={book.id}
                  title={summary}
                  className="truncate px-1 text-xs text-[#5C4B3A] dark:text-[#BDAE97]"
                >
                  {summary}
                </p>;
              })}
            </div>
          </motion.section>)}
          </motion.div>
          </LayoutGroup>
        </motion.div>}
      </AnimatePresence>
    </div>;
};
export {
  FavoritesPage
};
