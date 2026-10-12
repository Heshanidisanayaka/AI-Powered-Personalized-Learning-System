import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Calendar,
  HelpCircle,
  MessageSquareCode,
  Award,
  BarChart3,
  Bot,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockWeeklyAnalytics } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const {
    user,
    courses,
    weakAreas,
    studyTasks,
    toggleTaskCompletion,
    setSelectedCourse,
    setCurrentPage,
    setIsAiDrawerOpen,
    sendChatMessage,
    addToast,
    dashboardData,
    isDashboardLoading,
    dashboardError,
    refreshDashboard,
    backendOnline
  } = useApp();

  const [selectedDay, setSelectedDay] = useState('Thu');

  // Overall calculations (prefer real aggregated backend data if available)
  const totalCompletedModules = dashboardData?.completed_modules_count ?? courses.reduce((acc, c) => acc + c.completedModules, 0);
  const totalModules = dashboardData?.total_modules_count ?? courses.reduce((acc, c) => acc + c.totalModules, 0);
  const overallProgress = dashboardData?.overall_progress_pct ?? Math.round((totalCompletedModules / (totalModules || 1)) * 100);

  // Recommended next lesson: find from backend dashboard or first unfinished course
  const primaryCourse = courses[0];
  const nextLesson = dashboardData?.recommended_next_lesson
    ? {
        id: dashboardData.recommended_next_lesson.id,
        title: dashboardData.recommended_next_lesson.title,
        duration: dashboardData.recommended_next_lesson.duration,
        type: (dashboardData.recommended_next_lesson.module_type || 'reading') as any
      }
    : primaryCourse?.nextLesson;

  const weeklyActivityData = dashboardData?.weekly_activity || mockWeeklyAnalytics;
  const maxHours = Math.max(...weeklyActivityData.map((m) => m.hours));

  return (
    <div className="space-y-6 pb-12">
      {/* Backend Synchronization & Error Status Banner */}
      {dashboardError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Offline Fallback Mode:</strong> {dashboardError}. Displaying cached curriculum telemetry.
            </span>
          </div>
          <button
            onClick={() => refreshDashboard()}
            disabled={isDashboardLoading}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 font-bold text-white hover:bg-amber-700 transition-colors shadow-sm shrink-0"
          >
            <RefreshCw className={`h-3 w-3 ${isDashboardLoading ? 'animate-spin' : ''}`} />
            Retry Connection
          </button>
        </div>
      )}

      {/* 1. Welcome Header & SaaS Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-600 via-brand-700 to-violet-700 p-6 sm:p-8 text-white shadow-lg shadow-brand-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>
                {backendOnline ? 'AI Learning Optimizer Active • Connected to FastAPI & MySQL' : 'AI Learning Optimizer (Local Standby)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {dashboardData?.student_name || user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-brand-100/90 leading-relaxed">
              You've conquered {user.dailyGoalProgressMinutes} minutes today. Reviewing <span className="font-semibold text-white underline decoration-brand-300">Graph Cycle Detection</span> will raise your overall algorithmic mastery to 82%.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (primaryCourse) setSelectedCourse(primaryCourse);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-brand-700 shadow-md hover:bg-slate-50 hover:shadow-lg transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-brand-700" />
              Continue Learning
            </button>
            <button
              onClick={() => setCurrentPage('quiz')}
              className="flex items-center gap-2 rounded-2xl bg-brand-500/30 px-4 py-2.5 text-xs font-bold text-white border border-white/20 backdrop-blur-md hover:bg-brand-500/40 transition-all"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Adaptive Quiz
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards: Daily Goal, Streak, Overall Progress, XP Rank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Learning Goal */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Study Goal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{user.dailyGoalProgressMinutes}</span>
            <span className="text-xs text-slate-500 font-medium">/ {user.dailyGoalMinutes} mins</span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((user.dailyGoalProgressMinutes / user.dailyGoalMinutes) * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-brand-600 flex items-center justify-between">
              <span>{Math.round((user.dailyGoalProgressMinutes / user.dailyGoalMinutes) * 100)}% completed</span>
              <span className="text-slate-400 font-normal">18 mins to target</span>
            </p>
          </div>
        </div>

        {/* Study Streak */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Study Streak</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{user.streakDays}</span>
            <span className="text-xs font-semibold text-amber-600">Days Consecutive 🔥</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Top 5% consistency at Stanford. Study today to claim the 15-day streak badge.
          </p>
        </div>

        {/* Overall Curriculum Progress */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Progress</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{overallProgress}%</span>
            <span className="text-xs text-slate-500 font-medium">({totalCompletedModules}/{totalModules} units)</span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-brand-600"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Across 4 enrolled specialized tracks</p>
          </div>
        </div>

        {/* XP & Scholar Level */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mastery Level</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-brand-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">Level {user.level}</span>
            <span className="text-xs font-bold text-brand-600">Scholar Tier</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {user.totalXp.toLocaleString()} XP earned • 160 XP to Level 9
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Weekly Chart & Recommended Next Lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Learning Activity Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-600" />
                Weekly Learning Activity
              </h3>
              <p className="text-xs text-slate-500">Study hours & quiz volume for the current week</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Hours Studied
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-200" /> Quizzes Taken
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="mt-6 flex h-48 items-end justify-between gap-3 px-2">
            {weeklyActivityData.map((item) => {
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              const isSelected = selectedDay === item.day;
              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className="group flex flex-1 flex-col items-center gap-2 cursor-pointer"
                >
                  {/* Tooltip on hover/active */}
                  <div
                    className={`rounded-lg px-1.5 py-0.5 text-[10px] font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700'
                    }`}
                  >
                    {item.hours}h
                  </div>

                  {/* Dual Bar (Hours + Quizzes) */}
                  <div className="flex h-36 w-full max-w-[36px] items-end justify-center gap-1 rounded-xl bg-slate-50 p-1">
                    {/* Hours Bar */}
                    <div
                      className={`w-1/2 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-brand-600 shadow-md shadow-brand-500/30'
                          : 'bg-brand-500/80 group-hover:bg-brand-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Quizzes Bar */}
                    <div
                      className="w-1/2 rounded-lg bg-violet-200 group-hover:bg-violet-300 transition-all duration-300"
                      style={{ height: `${Math.round((item.quizzesTaken / 6) * 100)}%` }}
                    />
                  </div>

                  <span className={`text-xs font-semibold ${isSelected ? 'text-brand-600' : 'text-slate-500'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected day summary callout */}
          <div className="mt-4 rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Activity for <strong className="text-slate-900">{selectedDay}</strong>: 4.2h study time, 5 adaptive quizzes completed with 82% average accuracy.
            </span>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0"
            >
              Full Analytics <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Recommended Next Lesson Card (1 col) */}
        <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-b from-brand-50/40 via-white to-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                <Sparkles className="h-3 w-3" /> Recommended Next Lesson
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Course #1</span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base leading-snug">
              {nextLesson?.title || 'Multi-Head Self-Attention Implementation in PyTorch'}
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Targeted based on your learning style: Hands-on code playground with PyTorch tensor reshaping exercises.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                <Clock className="h-3.5 w-3.5" /> {nextLesson?.duration || '24 mins'}
              </span>
              <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium capitalize">
                {nextLesson?.type || 'code'} lab
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (primaryCourse) setSelectedCourse(primaryCourse);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 hover:shadow-lg transition-all"
            >
              <span>Start This Lesson</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Enrolled Courses Progress Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-600" />
              Active Enrolled Courses
            </h3>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={() => setCurrentPage('courses')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All Courses ({courses.length}) <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {course.category}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                  {course.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-400">By {course.instructor}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold">
                  <span className="text-slate-500">{course.completedModules}/{course.totalModules} Units</span>
                  <span className="text-brand-600">{course.progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Lower Section: Weak Topics, Upcoming Study Tasks & Quick AI Tutor Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Topics Needing Improvement */}
        <div className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Target Knowledge Gaps
              </h3>
              <p className="text-xs text-slate-500">Topics identified by AI diagnostics</p>
            </div>
            <button
              onClick={() => setCurrentPage('mastery')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Diagnostics
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {weakAreas.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-white hover:border-amber-200 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 leading-snug">{item.topic}</span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 shrink-0">
                    {item.masteryPercentage}% Mastery
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{item.criticalGaps[0]}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Benchmark: {item.benchmarkPercentage}%</span>
                  <button
                    onClick={() => {
                      setCurrentPage('quiz');
                      addToast('Targeted Drill Initialized', `Starting practice on ${item.topic}`, 'info');
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Practice Now <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Study Tasks */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-600" />
                Upcoming Study Tasks
              </h3>
              <p className="text-xs text-slate-500">Spaced repetition schedule</p>
            </div>
            <button
              onClick={() => setCurrentPage('planner')}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Planner
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {studyTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion(task.id)}
                className={`flex items-start gap-3 rounded-2xl border p-3 text-xs cursor-pointer transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-400 line-through'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/20 text-slate-800'
                }`}
              >
                <button className="mt-0.5 shrink-0 text-slate-400">
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-md border-2 border-slate-300" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate">{task.title}</span>
                    {task.aiSuggested && (
                      <span className="rounded bg-violet-100 px-1 py-0.5 text-[9px] font-bold text-violet-700 shrink-0">
                        AI Pick
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{task.dueDate}</span>
                    <span>•</span>
                    <span>{task.durationMinutes}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access to AI Tutor Card */}
        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50/60 via-brand-50/30 to-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">CogniTutor 24/7 AI</h3>
                <p className="text-[11px] text-emerald-600 font-semibold">Ready to help you debug or review</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Have a question about Kahn's Algorithm, Transformer Self-Attention, or Bayes Theorem? Ask CogniTutor right now.
            </p>

            <div className="mt-4 space-y-1.5">
              {[
                'Explain Topological Sort with an analogy',
                'Why scale dot-product attention by sqrt(d_k)?',
                'Generate 3 practice questions on Bayes theorem'
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sendChatMessage(starter);
                    setIsAiDrawerOpen(true);
                  }}
                  className="w-full text-left rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-300 p-2 text-[11px] font-medium text-slate-700 transition-colors truncate"
                >
                  💬 {starter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200/60">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:shadow-lg transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open AI Tutor Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
