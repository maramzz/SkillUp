import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useStudy } from "../context/StudyContext";
import { getBookStudyEntry } from "../utils/bookStudy";
import { TrashIcon } from "./icons/StudyIcons";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, Textarea } from "./ui/Input";

const formatNoteDate = (createdAt, language) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const createNoteId = () => (
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
);

const MarginNotesCard = ({ book }) => {
  const {
    bookStudyData,
    updateBookStudyData,
    language,
    t
  } = useStudy();
  const shouldReduceMotion = useReducedMotion();
  const study = getBookStudyEntry(bookStudyData, book);
  const [noteText, setNoteText] = useState("");
  const [pageRef, setPageRef] = useState("");

  const saveNote = (event) => {
    event?.preventDefault();
    const text = noteText.trim();
    if (!text) return;

    const note = {
      id: createNoteId(),
      text,
      pageRef: pageRef.trim(),
      createdAt: new Date().toISOString()
    };
    updateBookStudyData(
      book.id,
      (current) => ({ ...current, notes: [note, ...current.notes] }),
      book.pages
    );
    setNoteText("");
    setPageRef("");
  };

  const deleteNote = (noteId) => {
    updateBookStudyData(
      book.id,
      (current) => ({
        ...current,
        notes: current.notes.filter((note) => note.id !== noteId)
      }),
      book.pages
    );
  };

  return <Card variant="note" padding="md" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-handwritten text-2xl font-semibold text-[#245A43] dark:text-[#D9B65F]">
            {t.detail.marginNotes}
          </h2>
          <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
            {t.detail.marginNotesSubtitle}
          </p>
        </div>
        <span
          aria-live="polite"
          aria-atomic="true"
          className="shrink-0 rounded-full bg-[#2F6B52]/10 px-2.5 py-1 text-xs font-medium text-[#245A43] dark:bg-[#C9A24A]/15 dark:text-[#D9B65F]"
        >
          {t.detail.noteCount(study.notes.length)}
        </span>
      </div>

      <form onSubmit={saveNote} className="space-y-3">
        <Textarea
          label={t.detail.noteTextLabel}
          rows={3}
          value={noteText}
          onChange={(event) => setNoteText(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              saveNote(event);
            }
          }}
          placeholder={t.detail.noteTextPlaceholder}
          className="min-h-24 bg-[#FFFCF5]/80 dark:bg-[#25251F]/75"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            label={t.detail.pageRefLabel}
            value={pageRef}
            onChange={(event) => setPageRef(event.currentTarget.value)}
            placeholder={study.currentPage > 0
              ? t.detail.pageRefHint(study.currentPage)
              : t.detail.pageRefPlaceholder}
            className="bg-[#FFFCF5]/80 dark:bg-[#25251F]/75"
          />
          <Button type="submit" disabled={!noteText.trim()} className="sm:mb-0.5">
            {t.detail.saveNote}
          </Button>
        </div>
        <p className="text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
          {t.detail.noteShortcutHint}
        </p>
      </form>

      {study.notes.length === 0 ? <div className="rounded-2xl border border-dashed border-[#2F6B52]/20 px-4 py-5 text-center dark:border-[#C9A24A]/20">
          <p className="font-serif-display text-base font-semibold text-[#241B12] dark:text-[#E9E0CD]">
            {t.detail.noteEmptyTitle}
          </p>
          <p className="mt-1 text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
            {t.detail.noteEmptyBody}
          </p>
        </div> : <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {study.notes.map((note) => <motion.li
              key={note.id}
              layout={!shouldReduceMotion}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
              className="group rounded-xl px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-[#4C5E3E] dark:text-[#97A888]">
                  {[note.pageRef, formatNoteDate(note.createdAt, language)].filter(Boolean).join(" · ")}
                </p>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  aria-label={`${t.detail.deleteNote}: ${note.text.slice(0, 40)}`}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-[#9F352B] transition-opacity hover:bg-[#B8453A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8453A] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 dark:text-[#E6867A]"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
              <p className="whitespace-pre-wrap break-words py-1 text-[15px] leading-8 text-[#241B12] dark:text-[#E9E0CD]">
                {note.text}
              </p>
            </motion.li>)}
          </AnimatePresence>
        </ul>}
    </Card>;
};

export { MarginNotesCard };
