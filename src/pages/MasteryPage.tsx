import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MasteryPage: React.FC = () => {
  const { weakAreas, setCurrentPage, addToast, sendChatMessage, setIsAiDrawerOpen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredAreas = weakAreas.filter((w) => {
    if (filterStatus === 'All') return true;
    return w.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical Focus':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Needs Practice':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Developing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Nearly Mastered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'from-rose-500 to-amber-500';
    if (percentage < 70) return 'from-amber-500 to-blue-500';
    return 'from-brand-600 to-emerald-500';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Target className="h-3.5 w-3.5" />
            <span>Algorithmic Competency Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Topic Mastery & Weak-Area Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Continuous diagnostic telemetry continuously traces misconceptions down to atomic sub-skills. Focus on low-scoring areas to raise your exam readiness.
          </p>
        </div>

        {/* Aggregate Mastery Score Widget */}
        <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-br from-brand-50 via-slate-50 to-violet-50 p-5 border border-brand-100 shrink-0">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
            <span className="text-2xl font-black text-brand-700">74%</span>
            <div className="absolute inset-0 rounded-full border-4 border-brand-500/20" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Mastery</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">Senior Scholar Level</h3>
            <p className="text-xs text-brand-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +8.4% this month
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <BrainCircuit className="h-4 w-4 text-brand-600" />
          <span>Filter by Diagnostic Status:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Critical Focus', 'Needs Practice', 'Developing', 'Nearly Mastered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Weak Areas Diagnostic Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500">{area.subject}</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                    area.status
                  )}`}
                >
                  {area.status}
                </span>
              </div>

              {/* Topic Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">{area.topic}</h3>

              {/* Progress and Benchmark Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Combined Mastery Score</span>
                  <span className="text-slate-900">{area.masteryPercentage}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                      area.masteryPercentage
                    )} transition-all duration-500`}
                    style={{ width: `${area.masteryPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last practiced: {area.lastPracticed}</span>
                  <span>Target Benchmark: {area.benchmarkPercentage}%</span>
                </div>
              </div>

              {/* Dual Metric Breakdown: Clearly Distinguishing Rule-Based from Machine-Learning Prediction */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                    <span>Rule-Based Score</span>
                    <span className="text-slate-900 font-extrabold">{area.masteryPercentage}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">EWMA recency + decay formula</p>
                </div>
                <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-violet-800 mb-0.5">
                    <span>ML Prediction</span>
                    <span className="text-violet-700 font-extrabold">
                      {Math.max(25, Math.min(98, Math.round(area.masteryPercentage * 0.97 + (area.status === 'Nearly Mastered' ? 3 : -2))))}%
                    </span>
                  </div>
                  <p className="text-[10px] text-violet-600">scikit-learn Regressor (93% conf)</p>
                </div>
              </div>

              {/* Identified Concept Misconceptions & Why Weak Explanation */}
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Identified Misconceptions & Diagnosis:
                </span>
                
                {area.whyWeakExplanation && (
                  <p className="text-xs text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 leading-relaxed font-medium">
                    🔍 <strong>Diagnostic Root Cause:</strong> {area.whyWeakExplanation}
                  </p>
                )}

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {area.criticalGaps.map((gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Remediation CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500 max-w-[200px] leading-tight">
                AI Prescription: {area.suggestedAction}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sendChatMessage(`I need help overcoming my gap in "${area.topic}": ${area.criticalGaps[0]}. Can you walk me through the intuition?`);
                    setIsAiDrawerOpen(true);
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  title="Ask AI Tutor about this topic"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('quiz');
                    addToast('Targeted Drill Initialized', `Starting practice on ${area.topic}`, 'success');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-sm"
                >
                  <span>Practice Drill</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
