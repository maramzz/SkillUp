import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TRANSLATIONS } from "../i18n/translations";
import { migrateLegacyReadingProgress, normalizeBookStudyEntry, normalizePageCount } from "../utils/bookStudy";
const StudyContext = createContext(null);
const STORAGE_KEYS = {
  theme: "skillup_theme_v1",
  language: "skillup_language_v1",
  studentName: "skillup_student_name_v2",
  favoriteBooks: "skillup_favorite_books_v2",
  bookStudyData: "skillup_book_study_v1",
  legacyReadingProgress: "skillup_reading_progress_v1",
  tasks: "skillup_tasks_v2",
  notes: "skillup_assistant_notes_v1"
};
const StudyProvider = ({ children }) => {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const currentPath = location.pathname;
  const themeTransitionTimeout = useRef(null);
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.language);
    if (saved === "en" || saved === "fr") return saved;
    return "en";
  });
  const [studentName, setStudentNameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.studentName);
    return saved ? saved.trim() : "";
  });
  const [hasEnteredName, setHasEnteredName] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.studentName);
    return Boolean(saved && saved.trim().length > 0);
  });
  const [favoriteBooks, setFavoriteBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.favoriteBooks);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { 
        // ignore: storage unavailable or data is broken
    }
    return [];
  });
  const [bookStudyData, setBookStudyData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.bookStudyData);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return Object.fromEntries(
            Object.entries(parsed).map(([bookId, entry]) => [
              bookId,
              normalizeBookStudyEntry(entry)
            ])
          );
        }
      }
      const legacy = localStorage.getItem(STORAGE_KEYS.legacyReadingProgress);
      if (legacy !== null) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && typeof parsedLegacy === "object" && !Array.isArray(parsedLegacy)) {
          return migrateLegacyReadingProgress(parsedLegacy);
        }
      }
    } catch {
      // ignore: storage unavailable or data is broken
    }
    return {};
  });
  const bookStudyDataRef = useRef(bookStudyData);
  const bookCache = useRef({});
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.tasks);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
        // ignore: storage unavailable or data is broken
    }
    return [];
  });
  const [assistantNotes, setAssistantNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notes);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
        // ignore: storage unavailable or data is broken
    }
    return [];
  });
  const [assistantDraft, setAssistantDraft] = useState("");
  const [assistantContextBook, setAssistantContextBook] = useState(void 0);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);
  useEffect(() => () => {
    if (themeTransitionTimeout.current !== null) {
      window.clearTimeout(themeTransitionTimeout.current);
    }
    document.documentElement.classList.remove("theme-transitioning");
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);
  useEffect(() => {
    if (hasEnteredName && studentName.trim()) {
      localStorage.setItem(STORAGE_KEYS.studentName, studentName.trim());
    } else if (!hasEnteredName) {
      localStorage.removeItem(STORAGE_KEYS.studentName);
    }
  }, [studentName, hasEnteredName]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favoriteBooks, JSON.stringify(favoriteBooks));
  }, [favoriteBooks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookStudyData, JSON.stringify(bookStudyData));
  }, [bookStudyData]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(assistantNotes));
  }, [assistantNotes]);
  const navigate = (path) => {
    routerNavigate(path);
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const prepareThemeTransition = () => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");

    if (themeTransitionTimeout.current !== null) {
      window.clearTimeout(themeTransitionTimeout.current);
    }

    themeTransitionTimeout.current = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
      themeTransitionTimeout.current = null;
    }, 360);
  };
  const toggleTheme = () => {
    prepareThemeTransition();
    setThemeState((prev) => prev === "light" ? "dark" : "light");
  };
  const setTheme = (mode) => {
    if (mode === theme) return;
    prepareThemeTransition();
    setThemeState(mode);
  };
  const toggleLanguage = () => {
    setLanguageState((prev) => prev === "en" ? "fr" : "en");
  };
  const setLanguage = (lang) => {
    setLanguageState(lang);
  };
  const setStudentName = (name) => {
    setStudentNameState(name);
  };
  const saveStudentName = (name) => {
    const cleaned = name.trim();
    if (!cleaned) return;
    setStudentNameState(cleaned);
    setHasEnteredName(true);
    routerNavigate("/");
  };
  const resetStudentName = () => {
    setStudentNameState("");
    setHasEnteredName(false);
  };
  const toggleFavorite = (book) => {
    setFavoriteBooks((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) return prev.filter((item) => item.id !== book.id);
      return [book, ...prev];
    });
  };
  const updateBookStudyData = useCallback((bookId, updates, initialTotalPages = 0) => {
    const previous = normalizeBookStudyEntry(
      bookStudyDataRef.current[bookId],
      initialTotalPages
    );
    const changes = typeof updates === "function" ? updates(previous) : updates;
    const hasStatusChange = Object.hasOwn(changes, "status")
      && changes.status !== previous.status;
    const hasPageChange = (
      Object.hasOwn(changes, "currentPage")
      && normalizePageCount(changes.currentPage) !== previous.currentPage
    ) || (
      Object.hasOwn(changes, "totalPages")
      && normalizePageCount(changes.totalPages) !== previous.totalPages
    );
    const next = {
      ...previous,
      ...changes,
      totalPages: normalizePageCount(changes.totalPages ?? previous.totalPages),
      currentPage: normalizePageCount(changes.currentPage ?? previous.currentPage),
      notes: changes.notes ?? previous.notes
    };

    next.currentPage = next.totalPages > 0
      ? Math.min(next.currentPage, next.totalPages)
      : next.currentPage;

    if (hasStatusChange) {
      if (next.status === "finished") next.currentPage = next.totalPages;
      if (next.status === "to_read") next.currentPage = 0;
    } else if (hasPageChange) {
      if (next.totalPages > 0 && next.currentPage >= next.totalPages) {
        next.status = "finished";
      } else if (next.currentPage > 0) {
        next.status = "reading";
      } else {
        next.status = "to_read";
      }
    }

    const normalized = normalizeBookStudyEntry(next);
    const nextBookStudyData = {
      ...bookStudyDataRef.current,
      [bookId]: normalized
    };
    bookStudyDataRef.current = nextBookStudyData;
    setBookStudyData(nextBookStudyData);
    localStorage.setItem(STORAGE_KEYS.bookStudyData, JSON.stringify(nextBookStudyData));
  }, []);
  const ensureBookStudyData = useCallback((bookId, initialTotalPages = 0) => {
    const existing = bookStudyDataRef.current[bookId];
    if (!existing) {
      updateBookStudyData(bookId, {}, initialTotalPages);
      return;
    }

    const normalized = normalizeBookStudyEntry(existing);
    if (initialTotalPages > 0 && normalized.totalPages === 0) {
      updateBookStudyData(bookId, {
        totalPages: initialTotalPages,
        currentPage: normalized.status === "finished"
          ? initialTotalPages
          : normalized.currentPage
      }, initialTotalPages);
    }
  }, [updateBookStudyData]);
  const isFavorite = (id) => favoriteBooks.some((item) => item.id === id);
  const cacheBooks = useCallback((books) => {
    for (const b of books) bookCache.current[b.id] = b;
  }, []);
  const getCachedBook = useCallback((id) => bookCache.current[id], []);
  const addTask = ({
    title,
    description,
    deadline
  }) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      deadline,
      done: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    };
    setTasks((prev) => [newTask, ...prev]);
  };
  const updateTask = (id, { title, description, deadline }) => {
    setTasks((prev) => prev.map((task) => task.id === id
      ? { ...task, title: title.trim(), description: description.trim(), deadline }
      : task
    ));
  };
  const toggleTask = (id) => {
    const now = new Date();
    const completedAt = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
    setTasks((prev) => prev.map((task) => {
      if (task.id !== id) return task;
      return task.done
        ? { ...task, done: false, completedAt: undefined }
        : { ...task, done: true, completedAt };
    }));
  };
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  const addAssistantNote = (note) => {
    setAssistantNotes((prev) => [...prev, note]);
  };
  const clearAssistantNotes = () => {
    setAssistantNotes([]);
  };
  const favoriteIds = favoriteBooks.map((b) => b.id);
  const t = TRANSLATIONS[language];
  return <StudyContext.Provider
    value={{
      currentPath,
      navigate,
      theme,
      toggleTheme,
      setTheme,
      language,
      toggleLanguage,
      setLanguage,
      t,
      studentName,
      hasEnteredName,
      saveStudentName,
      resetStudentName,
      setStudentName,
      favoriteBooks,
      favoriteIds,
      toggleFavorite,
      bookStudyData,
      updateBookStudyData,
      ensureBookStudyData,
      isFavorite,
      cacheBooks,
      getCachedBook,
      tasks,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      assistantDraft,
      setAssistantDraft,
      assistantContextBook,
      setAssistantContextBook,
      assistantNotes,
      addAssistantNote,
      clearAssistantNotes
    }}
  >
      {children}
    </StudyContext.Provider>;
};
function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return ctx;
}
export {
  StudyProvider,
  // eslint-disable-next-line react-refresh/only-export-components
  useStudy
};
