import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  HelpCircle,
  MessageSquareCode,
  CalendarCheck,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, user } = useApp();

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'recommendations', label: 'AI Pick', icon: Sparkles },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'ai-chat', label: 'AI Tutor', icon: MessageSquareCode },
    { id: 'planner', label: 'Plan', icon: CalendarCheck },
    ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert }] : [{ id: 'analytics', label: 'Stats', icon: TrendingUp }])
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 py-2 px-2 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as any)}
            className={`flex flex-col items-center gap-0.5 rounded-lg p-1.5 transition-colors ${
              isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
