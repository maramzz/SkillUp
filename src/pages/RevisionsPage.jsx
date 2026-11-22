import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useStudy } from "../context/StudyContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { FilterPill, Tag } from "../components/ui/Tag";
import {
  CheckIcon,
  ChecklistIcon,
  ClockIcon,
  FlameIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from "../components/icons/StudyIcons";
function isValidIsoDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [yStr, mStr, dStr] = dateStr.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  if (y < 2020 || y > 2100) return false;
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d;
}
function getLocalDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}
const RevisionsPage = () => {
  const { tasks, addTask, updateTask, toggleTask, deleteTask, language, t } = useStudy();
  const shouldReduceMotion = useReducedMotion();
  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 36 };
  const progressTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 180, damping: 28 };
  const checkTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 520, damping: 24 };
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const getDefaultDeadline = () => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  };
  const [deadline, setDeadline] = useState(getDefaultDeadline);
  const [titleError, setTitleError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const editingTask = tasks.find((task) => task.id === editingTaskId);
  const getDeadlineInfo = (dateStr, done) => {
    if (!dateStr || !isValidIsoDate(dateStr)) {
      return { label: t.revisions.badgeNoDeadline, tone: "neutral" };
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const target = /* @__PURE__ */ new Date(`${dateStr}T00:00:00`);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
    const formatted = target.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric"
    });
    if (done) {
      return { label: t.revisions.badgeCompleted(formatted), tone: "sage" };
    }
    if (diffDays < 0) {
      return { label: t.revisions.badgeOverdue(formatted), tone: "danger" };
    }
    if (diffDays === 0) {
      return { label: t.revisions.badgeToday(formatted), tone: "terracotta" };
    }
    if (diffDays <= 2) {
      return { label: t.revisions.badgeSoon(formatted), tone: "gold" };
    }
    return { label: t.revisions.badgeDue(formatted), tone: "neutral" };
  };
  const completedCount = tasks.filter((item) => item.done).length;
  const inProgressCount = tasks.length - completedCount;
  const completionPct = tasks.length === 0 ? 0 : Math.round(completedCount / tasks.length * 100);
  const streakDays = useMemo(() => {
    const completedDates = new Set(
      tasks.filter((item) => item.done && item.completedAt).map((item) => item.completedAt)
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let currentDay = completedDates.has(getLocalDateKey(today)) ? today : yesterday;
    let streak = 0;
    while (completedDates.has(getLocalDateKey(currentDay))) {
      streak += 1;
      currentDay.setDate(currentDay.getDate() - 1);
    }
    return streak;
  }, [tasks]);
  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      if (filter === "in_progress") return !item.done;
      if (filter === "done") return item.done;
      return true;
    });
  }, [tasks, filter]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErr = false;
    if (!title.trim()) {
      setTitleError(t.revisions.errEmptyTitle);
      hasErr = true;
    } else {
      setTitleError("");
    }
    if (!isValidIsoDate(deadline) && !(editingTask && !deadline)) {
      setDeadlineError(t.revisions.errInvalidDate);
      hasErr = true;
    } else {
      setDeadlineError("");
    }
    if (hasErr) return;
    if (editingTask) {
      updateTask(editingTask.id, { title, description, deadline });
      setEditingTaskId(null);
      setDeadline(getDefaultDeadline());
    } else {
      addTask({ title, description, deadline });
    }
    setTitle("");
    setDescription("");
  };
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setDeadline(task.deadline || "");
    setTitleError("");
    setDeadlineError("");
  };
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setDeadline(getDefaultDeadline());
    setTitleError("");
    setDeadlineError("");
  };
  const handleDeleteTask = (taskId) => {
    if (editingTaskId === taskId) handleCancelEdit();
    deleteTask(taskId);
  };
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - completionPct / 100 * circumference;
  const emptyStateCopy = tasks.length === 0 ? { title: t.revisions.emptyAllTitle, body: t.revisions.emptyAllBody } : filter === "in_progress" ? { title: t.revisions.emptyInProgressTitle, body: t.revisions.emptyInProgressBody } : filter === "done" ? { title: t.revisions.emptyDoneTitle, body: t.revisions.emptyDoneBody } : { title: t.revisions.emptyAllTitle, body: t.revisions.emptyAllBody };
  return <div className="space-y-8">
      <PageHeader
        eyebrow={t.revisions.kicker}
        title={t.revisions.title}
        description={t.revisions.subtitle}
      />

      {
    /* Study Streak Progress Card */
  }
      <Card padding="lg" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                <motion.circle
    cx="32"
    cy="32"
    r={radius}
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    className="text-[#DDD2BA] dark:text-[#342821]"
  />
                <circle
    cx="32"
    cy="32"
    r={radius}
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeDasharray={circumference}
    initial={{ strokeDashoffset: dashOffset }}
    animate={{ strokeDashoffset: dashOffset }}
    transition={progressTransition}
    className="text-[#B8893B] dark:text-[#DFB056]"
  />
              </svg>
              <span className="absolute text-xs font-semibold text-[#241B12] dark:text-[#E9E0CD] tabular-nums">
                {completionPct}%
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${streakDays > 0 ? "text-[#9E6E14] dark:text-[#DFB056]" : "text-[#5C4B3A] dark:text-[#BDAE97]"}`}>
                  <FlameIcon size={17} aria-hidden="true" />
                  <span className="tabular-nums">{streakDays > 0 ? t.revisions.streakLabel(streakDays) : t.revisions.streakEmpty}</span>
                </span>
              </div>
              <h2 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD] mt-0.5 tabular-nums">
                {t.revisions.progressTitle(completedCount, tasks.length)}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
                {inProgressCount === 0 && tasks.length > 0 ? t.revisions.allCaughtUpSub : t.revisions.remainingSub(inProgressCount)}
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <Tag tone={completionPct === 100 && tasks.length > 0 ? "sage" : streakDays > 0 ? "gold" : "neutral"}>
              {completionPct === 100 && tasks.length > 0 ? t.revisions.goalReached : streakDays > 0 ? t.revisions.activeStreak : t.revisions.streakEmpty}
            </Tag>
          </div>
        </div>

        <div
    role="progressbar"
    aria-valuenow={completionPct}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Revision task completion progress"
    className="h-3 w-full rounded-full bg-[#DDD2BA] dark:bg-[#342821] overflow-hidden"
  >
          <motion.div
    className="h-full rounded-full bg-gradient-to-r from-[#B8893B] via-[#2F6B52] to-[#8A9A7B]"
    animate={{ width: `${completionPct}%` }}
    transition={progressTransition}
  />
        </div>
      </Card>

      {
    /* Main Split: Add Form + Task List */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card padding="lg" className="lg:col-span-4 space-y-5">
          <div className="space-y-1">
            <h2 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
              {editingTask ? t.revisions.editFormTitle : t.revisions.formTitle}
            </h2>
            <p className="text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
              {editingTask ? t.revisions.editFormSubtitle : t.revisions.formSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
    label={t.revisions.fieldTitle}
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      if (titleError) setTitleError("");
    }}
    placeholder={t.revisions.fieldTitlePlaceholder}
    error={titleError}
  />

            <Textarea
    label={t.revisions.fieldDesc}
    rows={3}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder={t.revisions.fieldDescPlaceholder}
  />

            <Input
    label={t.revisions.fieldDeadline}
    type="date"
    value={deadline}
    onChange={(e) => {
      setDeadline(e.target.value);
      if (deadlineError) setDeadlineError("");
    }}
    error={deadlineError}
  />

            <div className="space-y-2">
              <Button
      type="submit"
      className="w-full"
      leftIcon={editingTask ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
    >
                {editingTask ? t.revisions.saveTaskBtn : t.revisions.addTaskBtn}
              </Button>
              {editingTask && <Button
      type="button"
      variant="secondary"
      className="w-full"
      onClick={handleCancelEdit}
    >
                {t.revisions.cancelEditBtn}
              </Button>}
            </div>
          </form>
        </Card>

        <div className="lg:col-span-8 space-y-5">
          <div
    role="group"
    aria-label="Filter revision tasks"
    className="flex flex-wrap items-center gap-2"
  >
            <FilterPill
    layoutId="revision-filter-active-pill"
    active={filter === "all"}
    count={tasks.length}
    onClick={() => setFilter("all")}
  >
              {t.revisions.filterAll}
            </FilterPill>
            <FilterPill
    layoutId="revision-filter-active-pill"
    active={filter === "in_progress"}
    count={inProgressCount}
    onClick={() => setFilter("in_progress")}
  >
              {t.revisions.filterInProgress}
            </FilterPill>
            <FilterPill
    layoutId="revision-filter-active-pill"
    active={filter === "done"}
    count={completedCount}
    onClick={() => setFilter("done")}
  >
              {t.revisions.filterDone}
            </FilterPill>
          </div>

          <motion.div layout transition={layoutTransition} className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? <motion.div
    key="empty-state"
    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
    transition={layoutTransition}
  >
                  <Card className="py-12 px-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#DDD2BA] dark:bg-[#342821] text-[#5C4B3A] dark:text-[#BDAE97] flex items-center justify-center mx-auto">
                      <ChecklistIcon size={22} />
                    </div>
                    <h3 className="font-serif-display text-xl font-semibold text-[#241B12] dark:text-[#E9E0CD]">
                      {emptyStateCopy.title}
                    </h3>
                    <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97] max-w-sm mx-auto">
                      {emptyStateCopy.body}
                    </p>
                  </Card>
                </motion.div> : filteredTasks.map((task) => {
    const deadlineMeta = getDeadlineInfo(task.deadline, task.done);
    return <motion.div
      key={task.id}
      layout
      initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
      transition={layoutTransition}
    >
                    <Card
      padding="sm"
      hoverable
      className={`flex items-start gap-3 sm:gap-4 transition-opacity ${task.done ? "opacity-80" : ""}`}
    >
                    <button
      type="button"
      role="checkbox"
      aria-checked={task.done}
      aria-label={task.done ? `Mark "${task.title}" as in progress` : `Mark "${task.title}" as done`}
      onClick={() => toggleTask(task.id)}
      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] hover:bg-[#DDD2BA]/60 dark:hover:bg-[#342821]/70 transition-colors"
    >
                      <span
      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-150 ${task.done ? "bg-[#6F8260] border-[#6F8260] text-[#FFFDF9] dark:bg-[#97A888] dark:border-[#97A888] dark:text-[#1B150F]" : "bg-transparent border-[#5C4B3A]/45 dark:border-[#BDAE97]/45"}`}
    >
                        <AnimatePresence>
                          {task.done && <motion.span
                            key="checked"
                            initial={shouldReduceMotion ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.45, rotate: -35 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.45, rotate: 35 }}
                            transition={checkTransition}
                            className="inline-flex"
                          >
                            <CheckIcon size={15} />
                          </motion.span>}
                        </AnimatePresence>
                      </span>
                    </button>

                    <div className="flex-1 min-w-0 py-1.5 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3
      className={`font-serif-display text-lg font-semibold leading-snug transition-colors ${task.done ? "line-through text-[#5C4B3A] dark:text-[#BDAE97]" : "text-[#241B12] dark:text-[#E9E0CD]"}`}
    >
                          {task.title}
                        </h3>
                        <Tag tone={deadlineMeta.tone} icon={<ClockIcon size={13} />}>
                          {deadlineMeta.label}
                        </Tag>
                      </div>

                      {task.description && <p
      className={`text-sm leading-relaxed text-[#5C4B3A] dark:text-[#BDAE97] ${task.done ? "line-through opacity-75" : ""}`}
    >
                          {task.description}
                        </p>}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                    <button
      type="button"
      onClick={() => handleEditTask(task)}
      aria-label={`${t.revisions.editTask} "${task.title}"`}
      className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#5C4B3A] hover:text-[#2F6B52] hover:bg-[#2F6B52]/8 dark:text-[#BDAE97] dark:hover:text-[#97A888] dark:hover:bg-[#97A888]/12 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
    >
                      <PencilIcon size={18} />
                    </button>
                    <button
      type="button"
      onClick={() => handleDeleteTask(task.id)}
      aria-label={`Delete task "${task.title}"`}
      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-[#5C4B3A] hover:text-[#9F352B] hover:bg-[#B8453A]/10 dark:text-[#BDAE97] dark:hover:text-[#E6867A] dark:hover:bg-[#E6867A]/12 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
    >
                      <TrashIcon size={18} />
                    </button>
    </div>
                    </Card>
                  </motion.div>;
  })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>;
};
export {
  RevisionsPage
};
