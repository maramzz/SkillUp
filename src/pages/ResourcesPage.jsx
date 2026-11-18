import { useCallback, useEffect, useMemo, useState } from "react";
import { RESOURCE_CATEGORIES } from "../data/resources";
import { searchBooks } from "../services/openLibrary";
import { useStudy } from "../context/StudyContext";
import { CATEGORY_LABELS } from "../i18n/translations";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { FilterPill, Tag } from "../components/ui/Tag";
import { HeartButton } from "../components/ui/HeartButton";
import { BookCover } from "../components/ui/BookCover";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { StaggeredGrid } from "../components/ui/StaggeredGrid";
import {
  CloseIcon,
  EmptyShelfIllustration,
  ErrorShelfIllustration,
  RefreshIcon,
  SearchIcon
} from "../components/icons/StudyIcons";
const PAGE_SIZE = 20;
const ResourcesPage = () => {
  const { navigate, isFavorite, toggleFavorite, cacheBooks, language, t } = useStudy();
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewState, setViewState] = useState("loading");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOrder, setSortOrder] = useState("curated");
  const loadCatalog = useCallback(
    async (query, category, pageNum, append) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setViewState("loading");
      }
      try {
        const data = await searchBooks(query, category, pageNum, PAGE_SIZE);
        const merged = data.books;
        cacheBooks(merged);
        if (append) {
          setBooks((prev) => {
            const seen = new Set(prev.map((b) => b.id));
            const uniqueNext = merged.filter((b) => !seen.has(b.id));
            return [...prev, ...uniqueNext];
          });
        } else {
          setBooks(merged);
        }
        setNumFound(data.numFound);
        setPage(data.page);
        setHasMore(data.hasMore);
        setViewState("ready");
      } catch {
        if (!append) {
          setViewState("error");
        }
      } finally {
        setLoadingMore(false);
      }
    },
    [cacheBooks]
  );
  useEffect(() => {
    loadCatalog(activeQuery, selectedCategory, 1, false);
  }, [activeQuery, selectedCategory, loadCatalog]);
  const sortedBooks = useMemo(() => {
    if (sortOrder === "curated") return books;

    const sorted = [...books];
    if (sortOrder === "title") {
      const collator = new Intl.Collator(language, {
        numeric: true,
        sensitivity: "base"
      });
      return sorted.sort((a, b) => collator.compare(a.title, b.title));
    }

    return sorted.sort((a, b) => {
      const yearA = Number.isFinite(a.year) ? a.year : null;
      const yearB = Number.isFinite(b.year) ? b.year : null;
      if (yearA === null) return yearB === null ? 0 : 1;
      if (yearB === null) return -1;
      return yearB - yearA;
    });
  }, [books, sortOrder, language]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
  };
  const resetFilters = () => {
    setSearchInput("");
    setActiveQuery("");
    setSelectedCategory("All");
  };
  return <div className="space-y-8">
      {
    /* Header & State Inspector */
  }
      <PageHeader
        eyebrow={t.resources.kicker}
        title={t.resources.title}
        description={t.resources.subtitle}
        actions={<>
          <button
    type="button"
    onClick={() => loadCatalog(activeQuery, selectedCategory, 1, false)}
    aria-label={t.resources.refreshAriaLabel}
    title={t.resources.refreshAriaLabel}
    className="w-10 h-10 rounded-2xl bg-[#F6F0E1] dark:bg-[#261E15] border border-[#241B12]/10 dark:border-[#E9E0CD]/10 flex items-center justify-center text-[#5C4B3A] dark:text-[#BDAE97] hover:text-[#241B12] dark:hover:text-[#E9E0CD] transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            <RefreshIcon size={16} />
          </button>
        </>}
      />

      {
    /* Search & Pill Filter Row */
  }
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1">
            <Input
    type="search"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder={t.resources.searchPlaceholder}
    aria-label={t.resources.searchPlaceholder}
    leftIcon={<SearchIcon size={18} />}
    rightSlot={searchInput ? <button
      type="button"
      onClick={() => {
        setSearchInput("");
        setActiveQuery("");
      }}
      aria-label={t.resources.clearSearch}
      className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C4B3A] hover:text-[#241B12] hover:bg-[#DDD2BA] dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#352A1D] cursor-pointer"
    >
                    <CloseIcon size={14} />
                  </button> : void 0}
  />
          </div>
          <Button type="submit" variant="secondary">
            {t.resources.searchButton}
          </Button>
        </form>

        <div
    role="group"
    aria-label={t.resources.filterAriaLabel}
    className="flex flex-wrap items-center gap-2"
  >
          {RESOURCE_CATEGORIES.map((category) => <FilterPill
    key={category}
    layoutId="resource-category-active-pill"
    active={selectedCategory === category}
    onClick={() => setSelectedCategory(category)}
  >
              {CATEGORY_LABELS[language][category]}
            </FilterPill>)}
        </div>
      </div>

      {
    /* State 1: Loading Skeleton Cards */
  }
      {viewState === "loading" && <div
    aria-busy="true"
    aria-label={t.resources.loadingAriaLabel}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >
          {Array.from({ length: 8 }).map((_, idx) => <Card key={idx} padding="sm" className="space-y-4 animate-pulse">
              <div className="aspect-[3/4] w-full rounded-2xl bg-[#DDD2BA] dark:bg-[#342821]" />
              <div className="space-y-2.5 px-1 pb-1">
                <div className="h-5 w-24 rounded-lg bg-[#DDD2BA] dark:bg-[#342821]" />
                <div className="h-6 w-4/5 rounded-lg bg-[#DDD2BA] dark:bg-[#342821]" />
                <div className="h-4 w-1/2 rounded-lg bg-[#DDD2BA] dark:bg-[#342821]" />
              </div>
            </Card>)}
        </div>}

      {
    /* State 2: Network Error State */
  }
      {viewState === "error" && <Card className="py-12 px-6 text-center max-w-lg mx-auto space-y-4" role="alert">
          <div className="flex justify-center text-[#2F6B52] dark:text-[#C9A24A]">
            <ErrorShelfIllustration className="w-44 h-28" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif-display text-2xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {t.resources.errorTitle}
            </h2>
            <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.resources.errorBody}
            </p>
          </div>
          <div className="pt-2">
            <Button
    onClick={() => loadCatalog(activeQuery, selectedCategory, 1, false)}
    leftIcon={<RefreshIcon size={16} />}
  >
              {t.resources.tryAgain}
            </Button>
          </div>
        </Card>}

      {
    /* State 3: Empty State */
  }
      {viewState === "ready" && books.length === 0 && <Card className="py-12 px-6 text-center max-w-lg mx-auto space-y-4">
          <div className="flex justify-center text-[#5C4B3A] dark:text-[#BDAE97]">
            <EmptyShelfIllustration className="w-52 h-32" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif-display text-2xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {t.resources.emptyTitle}
            </h2>
            <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.resources.emptyBody}
            </p>
          </div>
          <div className="pt-2">
            <Button variant="secondary" onClick={resetFilters}>
              {t.resources.clearFilters}
            </Button>
          </div>
        </Card>}

      {
    /* State 4: Book Grid + Pagination ("Load 20 more") */
  }
      {viewState === "ready" && books.length > 0 && <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C4B3A] dark:text-[#BDAE97] tabular-nums">
            <span>{t.resources.showingCount(books.length, Math.max(books.length, numFound))}</span>
            <label className="inline-flex items-center gap-2">
              <span>{t.resources.sortBy}</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="min-h-10 rounded-xl border border-[#241B12]/10 bg-[#FFFCF5] px-3 py-2 text-sm text-[#241B12] shadow-sm dark:border-[#E9E0CD]/10 dark:bg-[#25251F] dark:text-[#E9E0CD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
              >
                <option value="curated">{t.resources.sortCurated}</option>
                <option value="title">{t.resources.sortTitle}</option>
                <option value="newest">{t.resources.sortNewest}</option>
              </select>
            </label>
          </div>

          <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {sortedBooks.map((book) => {
    const fav = isFavorite(book.id);
    return <Card
      key={book.id}
      padding="sm"
      hoverable
      onClick={() => navigate(`/ressources/${book.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/ressources/${book.id}`);
        }
      }}
      className="group cursor-pointer flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
    >
                  <div className="relative">
                    <BookCover
      src={book.coverImage}
      title={book.title}
      category={CATEGORY_LABELS[language][book.category]}
      tone={book.shelfTone}
      noCoverLabel={t.resources.noCoverLabel}
    />
                    <div className="absolute top-3 right-3">
                      <HeartButton
      size="sm"
      active={fav}
      onToggle={() => toggleFavorite(book)}
      label={fav ? `Remove ${book.title} from favorites` : `Save ${book.title} to favorites`}
    />
                    </div>
                  </div>

                  <div className="px-1.5 pb-1.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Tag tone="terracotta">
                        {CATEGORY_LABELS[language][book.category]}
                      </Tag>
                      {book.year && <span className="text-xs text-[#5C4B3A] dark:text-[#BDAE97] tabular-nums">
                          {book.year}
                        </span>}
                    </div>
                    <h2 className="font-serif-display text-lg font-semibold text-[#241B12] dark:text-[#E9E0CD] leading-snug line-clamp-2 group-hover:text-[#245A43] dark:group-hover:text-[#D9B65F] transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C4B3A] dark:text-[#BDAE97] line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </Card>;
  })}
          </StaggeredGrid>

          {hasMore && <div className="flex justify-center pt-2">
              <Button
    variant="secondary"
    size="lg"
    isLoading={loadingMore}
    onClick={() => loadCatalog(activeQuery, selectedCategory, page + 1, true)}
  >
                {loadingMore ? t.resources.loadingMore : t.resources.loadMore}
              </Button>
            </div>}
        </div>}
    </div>;
};
export {
  ResourcesPage
};
