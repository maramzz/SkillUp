import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { HERO_DESK_ILLUSTRATION } from "../data/resources";
import { useStudy } from "../context/StudyContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CharacterReveal } from "../components/ui/CharacterReveal";
import { StaggeredGrid } from "../components/ui/StaggeredGrid";
import {
  ArrowRightIcon,
  BooksIcon,
  ChecklistIcon,
  ClockIcon,
  HeartIcon,
  QuillIcon
} from "../components/icons/StudyIcons";
const HomePage = () => {
  const {
    navigate,
    favoriteBooks,
    tasks,
    studentName,
    resetStudentName,
    language,
    t
  } = useStudy();
  const [heroImgError, setHeroImgError] = useState(false);
  const displayName = studentName.trim() || "Alex";
  const getGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) return t.home.greetingMorning(displayName);
    if (hour < 18) return t.home.greetingAfternoon(displayName);
    return t.home.greetingEvening(displayName);
  };
  const formatDeadlineLabel = (dateStr) => {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const target = /* @__PURE__ */ new Date(`${dateStr}T00:00:00`);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
    if (diffDays === 0) return t.home.deadlineToday;
    if (diffDays === 1) return t.home.deadlineTomorrow;
    if (diffDays < 0) return t.home.deadlineOverdue(Math.abs(diffDays));
    if (diffDays <= 7) return t.home.deadlineInDays(diffDays);
    return target.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric"
    });
  };
  const completedTasks = tasks.filter((item) => item.done).length;
  const totalTasks = tasks.length;
  const nextDeadlineTask = useMemo(() => {
    const pending = tasks.filter((item) => !item.done && item.deadline).sort((a, b) => a.deadline.localeCompare(b.deadline));
    return pending[0] || null;
  }, [tasks]);
  const quickSections = [
    {
      title: t.home.corners.resourcesTitle,
      description: t.home.corners.resourcesDesc,
      path: "/ressources",
      Icon: BooksIcon,
      accent: "text-[#245A43] dark:text-[#D9B65F] bg-[#2F6B52]/12 dark:bg-[#C9A24A]/18"
    },
    {
      title: t.home.corners.favoritesTitle,
      description: t.home.corners.favoritesDesc,
      path: "/favoris",
      Icon: HeartIcon,
      accent: "text-[#9E6E14] dark:text-[#DFB056] bg-[#B8893B]/15 dark:bg-[#DFB056]/18"
    },
    {
      title: t.home.corners.revisionsTitle,
      description: t.home.corners.revisionsDesc,
      path: "/revisions",
      Icon: ChecklistIcon,
      accent: "text-[#4C5E3E] dark:text-[#97A888] bg-[#8A9A7B]/16 dark:bg-[#97A888]/18"
    },
    {
      title: t.home.corners.assistantTitle,
      description: t.home.corners.assistantDesc,
      path: "/assistant",
      Icon: QuillIcon,
      accent: "text-[#245A43] dark:text-[#D9B65F] bg-[#2F6B52]/12 dark:bg-[#C9A24A]/18"
    }
  ];
  return <div className="space-y-10">
      {
    /* Hero section */
  }
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 py-2">
          <div className="group flex flex-wrap items-baseline gap-2.5">
            <CharacterReveal
              text={getGreeting()}
              className="font-handwritten text-2xl sm:text-[28px] text-[#245A43] dark:text-[#D9B65F] leading-snug"
            />
            <button
    type="button"
    onClick={resetStudentName}
    className="change-name-button text-xs text-[#5C4B3A]/70 dark:text-[#BDAE97]/70 underline underline-offset-2 cursor-pointer transition-opacity duration-200 focus-visible:outline-none focus-visible:opacity-100"
  >
              {t.home.changeNameTitle}
            </button>
          </div>

          <h1
    className="font-serif-display text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-[#241B12] dark:text-[#E9E0CD] leading-[1.15]"
    style={{ textWrap: "balance" }}
  >
            {t.home.heroTitle}
          </h1>

          <p className="text-[15px] sm:text-base leading-relaxed text-[#5C4B3A] dark:text-[#BDAE97] max-w-xl">
            {t.home.heroBody}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
    size="lg"
    onClick={() => navigate("/ressources")}
    rightIcon={<ArrowRightIcon size={18} />}
  >
              {t.home.ctaExplore}
            </Button>
            <Button
    variant="secondary"
    size="lg"
    onClick={() => navigate("/assistant")}
    leftIcon={<QuillIcon size={18} />}
  >
              {t.home.ctaAssistant}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6 flex items-center justify-center">
          {!heroImgError ? <div className="home-hero-art w-full flex items-center justify-center">
              <img
    src={HERO_DESK_ILLUSTRATION}
    alt="Calm study desk illustration with stacked books, an open book with a bookmark, a steaming mug, and a warm desk lamp in front of an arched evening window"
    referrerPolicy="no-referrer"
    onError={() => setHeroImgError(true)}
    className="w-full max-w-lg lg:max-w-none h-auto object-contain select-none"
  />
            </div> : <div className="w-full py-12 flex flex-col items-center justify-center text-center">
              <BooksIcon size={40} className="text-[#2F6B52] mb-3" />
              <p className="font-serif-display text-lg text-[#241B12] dark:text-[#E9E0CD]">
                SkillUp Reading Desk
              </p>
            </div>}
        </div>
      </section>

      {
    /* Stat Cards */
  }
      <section>
        <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card
    hoverable
    onClick={() => navigate("/favoris")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate("/favoris");
      }
    }}
    className="cursor-pointer flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            <div>
              <p className="text-sm font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.home.statFavorites}
              </p>
              <p className="mt-2 font-serif-display text-3xl font-semibold text-[#241B12] dark:text-[#E9E0CD] tabular-nums">
                {favoriteBooks.length}
              </p>
              <p className="mt-1 text-xs text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.home.statFavoritesSub}
              </p>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-[#B8893B]/18 dark:bg-[#DFB056]/20 text-[#9E6E14] dark:text-[#DFB056] flex items-center justify-center shrink-0">
              <HeartIcon size={20} filled />
            </span>
          </Card>

          <Card
    hoverable
    onClick={() => navigate("/revisions")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate("/revisions");
      }
    }}
    className="cursor-pointer flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            <div>
              <p className="text-sm font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.home.statTasks}
              </p>
              <p className="mt-2 font-serif-display text-3xl font-semibold text-[#241B12] dark:text-[#E9E0CD] tabular-nums">
                {completedTasks}
                <span className="text-lg font-normal text-[#5C4B3A] dark:text-[#BDAE97]">
                  {" "}/ {totalTasks}
                </span>
              </p>
              <p className="mt-1 text-xs text-[#4C5E3E] dark:text-[#97A888] font-medium">
                {totalTasks > 0 ? t.home.statTasksProgress(Math.round(completedTasks / totalTasks * 100)) : t.home.statTasksEmpty}
              </p>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-[#8A9A7B]/20 dark:bg-[#97A888]/20 text-[#4C5E3E] dark:text-[#97A888] flex items-center justify-center shrink-0">
              <ChecklistIcon size={20} />
            </span>
          </Card>

          <Card
    hoverable
    onClick={() => navigate("/revisions")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate("/revisions");
      }
    }}
    className="cursor-pointer flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#5C4B3A] dark:text-[#BDAE97]">
                {t.home.statDeadline}
              </p>
              <p className="mt-2 font-serif-display text-2xl sm:text-[26px] font-semibold text-[#241B12] dark:text-[#E9E0CD] tabular-nums truncate">
                {nextDeadlineTask ? formatDeadlineLabel(nextDeadlineTask.deadline) : t.home.statDeadlineClear}
              </p>
              <p className="mt-1 text-xs text-[#5C4B3A] dark:text-[#BDAE97] truncate">
                {nextDeadlineTask ? nextDeadlineTask.title : t.home.statDeadlineNone}
              </p>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-[#2F6B52]/14 dark:bg-[#C9A24A]/20 text-[#245A43] dark:text-[#D9B65F] flex items-center justify-center shrink-0">
              <ClockIcon size={20} />
            </span>
          </Card>
        </StaggeredGrid>
      </section>

      {
    /* Quick-access section */
  }
      <section aria-labelledby="quick-access-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
    id="quick-access-heading"
    className="font-serif-display text-2xl font-semibold text-[#241B12] dark:text-[#E9E0CD]"
  >
              {t.home.cornersTitle}
            </h2>
            <p className="text-sm text-[#5C4B3A] dark:text-[#BDAE97]">
              {t.home.cornersSub}
            </p>
          </div>
          </div>

        <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickSections.map(({ title, description, path, Icon, accent }) => <Card
    as={Link}
    to={path}
    key={path}
    hoverable
    onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
    className="group flex h-full min-h-[220px] w-full flex-col justify-between gap-6 text-left no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52]"
  >
              <div className="flex items-start justify-between gap-4">
                <span aria-hidden="true" className={`w-11 h-11 rounded-2xl flex items-center justify-center ${accent}`}>
                  <Icon size={20} />
                </span>
                <span aria-hidden="true" className="w-9 h-9 rounded-full border border-[#241B12]/10 dark:border-[#E9E0CD]/12 text-[#5C4B3A] dark:text-[#BDAE97] flex items-center justify-center transition-all duration-200 group-hover:border-[#2F6B52]/35 group-hover:text-[#245A43] dark:group-hover:border-[#C9A24A]/40 dark:group-hover:text-[#D9B65F]">
                  <ArrowRightIcon size={16} />
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-display text-lg font-semibold text-[#241B12] dark:text-[#E9E0CD] leading-snug">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5C4B3A] dark:text-[#BDAE97] line-clamp-3">
                  {description}
                </p>
              </div>
              <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[#245A43] dark:text-[#D9B65F]">
                <span>{t.home.openLabel}</span>
              </span>
            </Card>)}
        </StaggeredGrid>
      </section>
    </div>;
};
export {
  HomePage
};
