import { askAssistant } from "../services/ai";
import { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { StaggeredGrid } from "../components/ui/StaggeredGrid";
import { Tag } from "../components/ui/Tag";
import {
  CheckIcon,
  ChecklistIcon,
  CloseIcon,
  QuillIcon,
  RefreshIcon,
  SendIcon,
  TrashIcon
} from "../components/icons/StudyIcons";
const AssistantPage = () => {
  const {
    assistantDraft,
    setAssistantDraft,
    assistantContextBook,
    setAssistantContextBook,
    assistantNotes,
    addAssistantNote,
    clearAssistantNotes,
    addTask,
    language,
    t
  } = useStudy();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [savedNoteIds, setSavedNoteIds] = useState([]);
  const handleAsk = async (e) => {
    if (e) e.preventDefault();
    const trimmed = assistantDraft.trim();
    if (!trimmed || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const answer = await askAssistant({
        question: trimmed,
        contextTitle: assistantContextBook,
        language,
        history: assistantNotes.slice(-3).map((n) => ({ question: n.question, answer: n.answer }))
      });
      const noteId = `note-${Date.now()}`;
      addAssistantNote({
        id: noteId,
        question: trimmed,
        answer,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(language === "fr" ? "fr-FR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        contextBook: assistantContextBook
      });
      setAssistantDraft("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t.assistant.errorFriendly);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveAsTask = (noteId, question) => {
    const soon = /* @__PURE__ */ new Date();
    soon.setDate(soon.getDate() + 2);
    addTask({
      title: `Review: ${question.slice(0, 64)}${question.length > 64 ? "…" : ""}`,
      description: "Saved from AI Study Assistant study note.",
      deadline: soon.toISOString().slice(0, 10)
    });
    setSavedNoteIds((prev) => [...prev, noteId]);
  };
  return <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow={t.assistant.kicker}
        title={t.assistant.title}
        description={t.assistant.subtitle}
        actions={<>
          {import.meta.env.DEV && <Button
    variant="ghost"
    size="sm"
    onClick={() => setErrorMessage(t.assistant.errorFriendly)}
  >
            {t.assistant.simulateErrorBtn}
          </Button>}
          {assistantNotes.length > 0 && <Button
    variant="ghost"
    size="sm"
    onClick={clearAssistantNotes}
    leftIcon={<TrashIcon size={15} />}
  >
              {t.assistant.clearNotes}
            </Button>}
        </>}
      />

      {
    /* Question Composer Card */
  }
      <Card padding="lg" className="space-y-5">
        {assistantContextBook && <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#241B12]/8 dark:border-[#E9E0CD]/10">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
              <span>{t.assistant.activeVolume}</span>
              <Tag tone="terracotta">{assistantContextBook}</Tag>
            </div>
            <button
    type="button"
    onClick={() => setAssistantContextBook(void 0)}
    aria-label="Clear active volume context"
    className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C4B3A] hover:text-[#241B12] hover:bg-[#DDD2BA] dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#352A1D] cursor-pointer"
  >
              <CloseIcon size={14} />
            </button>
          </div>}

        <form onSubmit={handleAsk} className="space-y-4">
          <Textarea
    label={t.assistant.questionLabel}
    rows={4}
    value={assistantDraft}
    onChange={(e) => setAssistantDraft(e.target.value)}
    placeholder={t.assistant.questionPlaceholder}
    disabled={isLoading}
  />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.assistant.helperText}
            </p>

            <Button
    type="submit"
    size="lg"
    disabled={!assistantDraft.trim() || isLoading}
    isLoading={isLoading}
    leftIcon={!isLoading ? <SendIcon size={17} /> : <QuillIcon size={17} />}
    className="w-full sm:w-auto"
  >
              {isLoading ? <span className="inline-flex items-center gap-1">
                  <span>{t.assistant.thinkingBtn}</span>
                  <span className="inline-flex gap-0.5 ml-0.5" aria-hidden="true">
                    <span className="thinking-dot-1">.</span>
                    <span className="thinking-dot-2">.</span>
                    <span className="thinking-dot-3">.</span>
                  </span>
                </span> : t.assistant.askBtn}
            </Button>
          </div>
        </form>

        {
    /* Starter Suggestions */
  }
        <div className="pt-2 border-t border-[#241B12]/8 dark:border-[#E9E0CD]/10 space-y-2.5">
          <p className="text-xs font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
            {t.assistant.suggestionsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.assistant.prompts.map((prompt) => <button
    key={prompt}
    type="button"
    disabled={isLoading}
    onClick={() => setAssistantDraft(prompt)}
    className="min-h-10 text-left text-xs px-3.5 py-2 rounded-xl bg-[#DDD2BA]/75 hover:bg-[#D2C5A8] text-[#241B12] dark:bg-[#30261B] dark:hover:bg-[#3D2E25] dark:text-[#E9E0CD] transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
                {prompt}
              </button>)}
          </div>
        </div>
      </Card>

      {
    /* Friendly Error State */
  }
      {errorMessage && <Card
    variant="outlined"
    className="border-[#B8453A]/35 bg-[#B8453A]/8 dark:bg-[#E6867A]/10 text-[#8F2C23] dark:text-[#F5B0A7]"
    role="alert"
  >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{t.assistant.errorTitle}</p>
              <p className="text-sm opacity-90">{errorMessage}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {assistantDraft.trim() && <Button
    variant="secondary"
    size="sm"
    onClick={() => handleAsk()}
    leftIcon={<RefreshIcon size={14} />}
  >
                  {t.resources.tryAgain}
                </Button>}
              <button
    type="button"
    onClick={() => setErrorMessage(null)}
    aria-label="Dismiss error"
    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
  >
                <CloseIcon size={15} />
              </button>
            </div>
          </div>
        </Card>}

      {
    /* Thinking Note Card Placeholder */
  }
      {isLoading && <Card variant="note" padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-handwritten text-2xl text-[#245A43] dark:text-[#D9B65F]">
              {t.assistant.writingNote}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
              <span>{t.assistant.thinkingBtn}</span>
              <span aria-hidden="true" className="thinking-dot-1">.</span>
              <span aria-hidden="true" className="thinking-dot-2">.</span>
              <span aria-hidden="true" className="thinking-dot-3">.</span>
            </span>
          </div>
          <div className="space-y-2.5 animate-pulse pt-2">
            <div className="h-4 w-11/12 rounded bg-[#2F6B52]/14 dark:bg-[#C9A24A]/16" />
            <div className="h-4 w-4/5 rounded bg-[#2F6B52]/14 dark:bg-[#C9A24A]/16" />
            <div className="h-4 w-3/5 rounded bg-[#2F6B52]/14 dark:bg-[#C9A24A]/16" />
          </div>
        </Card>}

      {
    /* Answer History Styled as Handwritten Note Cards */
  }
      {assistantNotes.length === 0 && !isLoading ? <Card variant="note" padding="lg" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-handwritten text-2xl text-[#245A43] dark:text-[#D9B65F]">
              {t.assistant.indexReadyTitle}
            </span>
            <QuillIcon size={18} className="text-[#2F6B52] dark:text-[#C9A24A]" />
          </div>
          <p className="text-[15px] leading-relaxed text-[#241B12]/85 dark:text-[#E9E0CD]/85">
            {t.assistant.indexReadyBody}
          </p>
        </Card> : <StaggeredGrid className="space-y-6">
          {[...assistantNotes].reverse().map((note) => {
    const isSaved = savedNoteIds.includes(note.id);
    return <article key={note.id} className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-2xl rounded-2xl rounded-br-sm bg-[#DDD2BA] dark:bg-[#352A1D] px-5 py-3.5 text-sm sm:text-[15px] text-[#241B12] dark:text-[#E9E0CD] border border-[#241B12]/8 dark:border-[#E9E0CD]/8">
                    <p className="font-medium leading-relaxed">{note.question}</p>
                  </div>
                </div>

                <Card variant="note" padding="lg" className="relative space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2F6B52]/15 dark:border-[#C9A24A]/15 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-handwritten text-2xl text-[#245A43] dark:text-[#D9B65F] leading-none">
                        {t.assistant.studyNoteLabel}
                      </span>
                      {note.contextBook && <Tag tone="gold">{note.contextBook}</Tag>}
                    </div>
                    <span className="text-xs text-[#5C4B3A] dark:text-[#BDAE97] tabular-nums">
                      {note.timestamp}
                    </span>
                  </div>

                  <div className="text-[15px] leading-[32px] text-[#241B12] dark:text-[#E9E0CD] whitespace-pre-wrap">
                    {note.answer}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
      variant="ghost"
      size="sm"
      disabled={isSaved}
      onClick={() => handleSaveAsTask(note.id, note.question)}
      leftIcon={isSaved ? <CheckIcon size={15} /> : <ChecklistIcon size={15} />}
    >
                      {isSaved ? t.assistant.savedToRevisions : t.assistant.saveToRevisions}
                    </Button>
                  </div>
                </Card>
              </article>;
  })}
        </StaggeredGrid>}
    </div>;
};
export {
  AssistantPage
};
