import { useStudy } from "../context/StudyContext";
import { CATEGORY_LABELS } from "../i18n/translations";
import { BookCover } from "../components/ui/BookCover";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { HeartButton } from "../components/ui/HeartButton";
import { BooksIcon, EmptyShelfIllustration } from "../components/icons/StudyIcons";
const FavoritesPage = () => {
  const { favoriteBooks, toggleFavorite, navigate, language, t } = useStudy();
  const shelves = [];
  for (let i = 0; i < favoriteBooks.length; i += 3) {
    shelves.push(favoriteBooks.slice(i, i + 3));
  }
  return <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="font-handwritten text-2xl text-[#245A43] dark:text-[#D9B65F]">
            {t.favorites.kicker}
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
            {t.favorites.title}
          </h1>
          <p className="text-sm sm:text-[15px] text-[#5C4B3A] dark:text-[#BDAE97]">
            {favoriteBooks.length === 0 ? t.favorites.emptySubtitle : t.favorites.countSubtitle(favoriteBooks.length)}
          </p>
        </div>

        {favoriteBooks.length > 0 && <Button
    variant="secondary"
    onClick={() => navigate("/ressources")}
    leftIcon={<BooksIcon size={18} />}
  >
            {t.favorites.addMore}
          </Button>}
      </div>

      {favoriteBooks.length === 0 ? <Card className="py-14 px-6 text-center max-w-lg mx-auto space-y-5">
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
        </Card> : <div className="space-y-12">
          {shelves.map((shelfBooks, shelfIndex) => <section
    key={shelfIndex}
    aria-label={`Bookshelf row ${shelfIndex + 1}`}
    className="relative"
  >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-8 px-3 sm:px-8 items-end">
                {shelfBooks.map((book) => <div key={book.id} className="group relative flex flex-col">
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
    className="relative cursor-pointer transition-transform duration-200 ease-out group-hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] rounded-2xl"
  >
                      <BookCover
    src={book.coverImage}
    title={book.title}
    category={CATEGORY_LABELS[language][book.category]}
    tone={book.shelfTone}
    noCoverLabel={t.resources.noCoverLabel}
    className="shadow-md"
  />
                      <div className="absolute top-2.5 right-2.5">
                        <HeartButton
    size="sm"
    active
    onToggle={() => toggleFavorite(book)}
    label={`Remove ${book.title} from bookshelf`}
  />
                      </div>
                    </div>

                    <div className="order-last pt-4 pb-1 px-1">
                      <button
    type="button"
    onClick={() => navigate(`/ressources/${book.id}`)}
    className="text-left cursor-pointer group-hover:text-[#245A43] dark:group-hover:text-[#D9B65F] transition-colors"
  >
                        <h2 className="font-serif-display text-base sm:text-lg font-semibold text-[#241B12] dark:text-[#E9E0CD] leading-snug line-clamp-1">
                          {book.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#5C4B3A] dark:text-[#BDAE97] mt-0.5 line-clamp-1">
                          {book.author}
                        </p>
                      </button>
                    </div>
                  </div>)}
              </div>

              <div
    aria-hidden="true"
    className="pointer-events-none relative -mt-[54px] sm:-mt-[60px] -z-10"
  >
                <div className="h-5 w-full rounded-xl bg-gradient-to-b from-[#DFCCB4] via-[#D2BA9B] to-[#C2A684] dark:from-[#4A382C] dark:via-[#3B2C22] dark:to-[#2D2119] border border-[#241B12]/12 dark:border-[#E9E0CD]/10 shadow-[0_12px_20px_-8px_rgba(46,31,23,0.22)] dark:shadow-[0_14px_24px_-8px_rgba(0,0,0,0.6)]" />
                <div className="mx-6 h-2.5 flex justify-between">
                  <div className="w-6 h-full rounded-b-md bg-[#B99A77]/70 dark:bg-[#261B14]" />
                  <div className="w-6 h-full rounded-b-md bg-[#B99A77]/70 dark:bg-[#261B14]" />
                </div>
                <div className="h-12" />
              </div>
            </section>)}
        </div>}
    </div>;
};
export {
  FavoritesPage
};
