import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  HelpCircle,
  MessageSquareCode,
  Target,
  CalendarCheck,
  TrendingUp,
  User,
  ShieldAlert,
  GraduationCap,
  BrainCircuit,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useApp, PageId } from '../../context/AppContext';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, user, switchRole } = useApp();

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses & Materials', icon: BookOpen, badge: '4 Active' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, badge: '98% Match', badgeColor: 'bg-violet-100 text-violet-700' },
    { id: 'quiz', label: 'Adaptive Quiz', icon: HelpCircle, badge: 'Live Drill', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'ai-chat', label: 'AI Tutor Chat', icon: MessageSquareCode },
    { id: 'mastery', label: 'Topic Mastery & Gaps', icon: Target, badge: '4 Areas', badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'analytics', label: 'Progress & Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Management' },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold tracking-tight text-slate-900">Cogni<span className="text-brand-600">Learn</span></span>
              <span className="rounded bg-brand-100 px-1 py-0.5 text-[9px] font-bold text-brand-700 uppercase">AI SaaS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Personalized Learning OS</p>
          </div>
        </div>

        {/* Student Navigation Group */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Learner Workspace
          </div>
          <nav className="space-y-1">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration Group */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Administration</span>
            {user.role !== 'admin' && (
              <span className="text-[10px] text-violet-600 font-semibold cursor-pointer hover:underline" onClick={() => switchRole('admin')}>
                Enable
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (user.role !== 'admin') {
                      switchRole('admin');
                    }
                    setCurrentPage(item.id);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-800 shadow-sm border border-violet-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                    SaaS Portal
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom AI Status Card */}
      <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/60 via-violet-50/40 to-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-800">Adaptive AI Engine v4.8</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Personalized curriculum model calibrated for <span className="font-semibold text-slate-700">{user.name}</span>.
        </p>
        <button
          onClick={() => setCurrentPage('recommendations')}
          className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
        >
          <span>View Curriculum Logic</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};
