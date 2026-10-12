import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Download,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockWeeklyAnalytics } from '../data/mockData';

export const AnalyticsPage: React.FC = () => {
  const { user, addToast } = useApp();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  const milestones = [
    { id: 1, title: 'Algorithm Architect', desc: 'Completed 10 advanced graph & tree challenges', date: 'Earned Oct 8', icon: '🏆', unlocked: true },
    { id: 2, title: 'Neural Pioneer', desc: 'Constructed custom transformer attention layer', date: 'Earned Oct 10', icon: '🧠', unlocked: true },
    { id: 3, title: 'Consistency Champion', desc: 'Hit daily goal 14 consecutive days', date: 'Earned Yesterday', icon: '🔥', unlocked: true },
    { id: 4, title: 'Bayesian Master', desc: 'Achieved 90%+ on conjugate prior assessment', date: 'In Progress (62%)', icon: '📊', unlocked: false }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-brand-600" />
            Learning Progress & Analytics Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cognitive performance telemetry, retention curves, and learning milestone tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200">
            {(['7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  timeframe === t
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => addToast('Learning Transcript Exported 📊', 'Full analytics report generated as PDF.', 'success')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Study Hours</span>
            <Clock className="h-4 w-4 text-brand-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">23.7h</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +14% vs last week
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Average: 3.4h / day</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Quiz Accuracy</span>
            <Award className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">83.4%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +5.2%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Across 27 adaptive questions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Concepts Mastered</span>
            <BrainCircuit className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">28 / 36</span>
            <span className="text-xs font-bold text-slate-500">78%</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">4 in remediation focus</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Longest Streak</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">14 Days</span>
            <span className="text-xs font-bold text-amber-600">Active</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Milestone badge unlocked</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention & Spaced Repetition Curve (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-brand-600" />
                Spaced Repetition Concept Retention Curve
              </h3>
              <p className="text-xs text-slate-500">Ebbinghaus cognitive decay model vs CogniLearn AI reinforcement</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              88% Average Retention
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { interval: 'Day 1 (Immediate)', natural: '100%', withAI: '100%', retention: 100 },
              { interval: 'Day 3 (First Review)', natural: '60%', withAI: '94%', retention: 94 },
              { interval: 'Day 7 (Spaced Drill)', natural: '35%', withAI: '88%', retention: 88 },
              { interval: 'Day 14 (Long-Term Mastery)', natural: '21%', withAI: '82%', retention: 82 },
            ].map((row, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{row.interval}</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-slate-400">Without AI: {row.natural}</span>
                    <span className="text-brand-600 font-bold">With CogniLearn: {row.withAI}</span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-600 transition-all duration-500"
                    style={{ width: `${row.retention}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-brand-50/50 p-4 border border-brand-100 text-xs text-brand-900">
            💡 <strong>Cognitive Takeaway:</strong> Reviewing Graph Cycle Detection today will protect it from dropping below the 80% long-term recall threshold.
          </div>
        </div>

        {/* Subject Distribution Breakdown (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Study Time Distribution</h3>
            <p className="text-xs text-slate-500">Distribution across 4 specialized areas</p>

            <div className="mt-6 space-y-3.5">
              {[
                { subject: 'Artificial Intelligence & Deep Learning', percent: 42, color: 'bg-brand-600' },
                { subject: 'Data Structures & Algorithms', percent: 33, color: 'bg-violet-600' },
                { subject: 'Probabilistic Mathematics', percent: 15, color: 'bg-amber-500' },
                { subject: 'Cloud & Distributed Systems', percent: 10, color: 'bg-emerald-500' },
              ].map((s, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 truncate">{s.subject}</span>
                    <span className="text-slate-900">{s.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Peak Focus Period:</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">10:00 AM – 1:00 PM (94% Accuracy)</p>
          </div>
        </div>
      </div>

      {/* Achievement Milestones Showcase */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-600" />
              Achievements & Learning Milestones
            </h3>
            <p className="text-xs text-slate-500">Unlocked badges based on academic persistence and mastery</p>
          </div>
          <span className="text-xs font-bold text-brand-600">3 of 4 Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 text-center transition-all ${
                m.unlocked
                  ? 'border-brand-200 bg-brand-50/30'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{m.icon}</div>
              <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{m.desc}</p>
              <span className="mt-3 inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200">
                {m.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
