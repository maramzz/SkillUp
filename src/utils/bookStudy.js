export const DEFAULT_BOOK_STUDY_STATUS = "to_read";
const BOOK_STUDY_STATUSES = new Set(["to_read", "reading", "finished"]);

export const normalizePageCount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
};

export const normalizeBookStudyEntry = (entry, initialTotalPages = 0) => {
  const totalPages = normalizePageCount(entry?.totalPages ?? initialTotalPages);
  const currentPage = normalizePageCount(entry?.currentPage);
  const notes = Array.isArray(entry?.notes)
    ? entry.notes.filter((note) => note && typeof note.text === "string")
      .map((note) => ({
        id: String(note.id ?? ""),
        text: note.text,
        pageRef: typeof note.pageRef === "string" ? note.pageRef : "",
        createdAt: typeof note.createdAt === "string" ? note.createdAt : ""
      }))
    : [];
  const status = BOOK_STUDY_STATUSES.has(entry?.status)
    ? entry.status
    : currentPage > 0
      ? "reading"
      : DEFAULT_BOOK_STUDY_STATUS;

  return {
    status,
    currentPage: totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage,
    totalPages,
    notes
  };
};

export const getBookStudyEntry = (bookStudyData, book) =>
  normalizeBookStudyEntry(
    bookStudyData?.[book.id],
    book.totalPages ?? book.pages ?? 0
  );

export const getBookProgressPct = (study) => {
  if (study.status === "finished") return 100;
  if (study.totalPages <= 0) return 0;
  return Math.min(100, Math.round((study.currentPage / study.totalPages) * 100));
};

export const migrateLegacyReadingProgress = (legacyProgress) =>
  Object.fromEntries(
    Object.entries(legacyProgress).map(([bookId, legacyEntry]) => {
      const currentPage = normalizePageCount(
        legacyEntry.currentPage
          ?? (legacyEntry.percentage && legacyEntry.totalPages
            ? Math.round((legacyEntry.percentage / 100) * legacyEntry.totalPages)
            : 0)
      );
      const totalPages = normalizePageCount(legacyEntry.totalPages);
      const legacyStatus = legacyEntry.status;
      const status = legacyStatus === "finished"
        || (totalPages > 0 && currentPage >= totalPages)
        ? "finished"
        : currentPage > 0
          ? "reading"
          : "to_read";

      return [
        bookId,
        normalizeBookStudyEntry({
          status,
          currentPage,
          totalPages,
          notes: []
        })
      ];
    })
  );
