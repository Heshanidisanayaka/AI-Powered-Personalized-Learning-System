import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Flame,
  Zap,
  Bell,
  CheckCircle2,
  ChevronDown,
  Shield,
  GraduationCap,
  LogOut,
  User as UserIcon,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    currentPage,
    setCurrentPage,
    switchRole,
    setIsAiDrawerOpen,
    searchQuery,
    setSearchQuery,
    addToast,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'Adaptive Quiz Available', desc: 'New targeted drill on Graph Cycle Detection is ready', time: '10m ago', unread: true },
    { id: 2, title: 'Study Streak Preserved!', desc: '14-day study milestone unlocked (+50 XP)', time: '2h ago', unread: true },
    { id: 3, title: 'AI Recommendation Updated', desc: 'Based on your recent lab score in PyTorch Transformer attention', time: '5h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-8 backdrop-blur-md">
      {/* Left: Mobile Brand & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2.5 lg:hidden cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Cogni<span className="text-brand-600">Learn</span></span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search concepts, courses, quiz topics, or AI prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Toggle Switcher */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => switchRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              user.role === 'student'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Student View
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              user.role === 'admin'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Admin SaaS
          </button>
        </div>

        {/* Daily Streak & XP Indicators */}
        {user.role === 'student' && (
          <div className="hidden lg:flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 border border-amber-200/80 text-amber-700 font-medium text-xs shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
              title="Daily Learning Streak: Keep studying daily to maintain multiplier"
              onClick={() => addToast('14-Day Study Streak! 🔥', 'You have hit your daily goal 14 consecutive days. Keep it up!', 'info')}
            >
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>{user.streakDays}d Streak</span>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 border border-indigo-200/80 text-brand-700 font-medium text-xs shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors"
              title="Total XP earned from quizzes, completed lessons, and study planner items"
              onClick={() => addToast('Level 8 Scholar ⚡', `Current XP: ${user.totalXp} XP (Next level at 4,000 XP)`, 'info')}
            >
              <Zap className="h-3.5 w-3.5 text-brand-600 fill-brand-600" />
              <span>{user.totalXp.toLocaleString()} XP</span>
            </div>
          </div>
        )}

        {/* Quick Launch AI Tutor Drawer Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-500/25 transition-all hover:shadow-lg hover:shadow-brand-500/35 hover:-translate-y-0.5"
          id="btn-quick-ai-tutor"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications (2 New)</span>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    addToast('Notifications Cleared', 'All alerts marked as read', 'info');
                  }}
                  className="text-[11px] font-medium text-brand-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl p-2.5 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-100">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-brand-500/30"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden xl:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  {user.role === 'admin' ? 'Institutional Administrator' : 'Senior CS & AI Student'}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                  My Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('courses');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  My Enrolled Courses
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={async () => {
                    setShowUserDropdown(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  Sign Out / Terminate Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
