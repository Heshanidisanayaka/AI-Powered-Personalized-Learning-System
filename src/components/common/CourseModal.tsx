import React from 'react';
import {
  X,
  PlayCircle,
  FileText,
  Code,
  HelpCircle,
  CheckCircle,
  Clock,
  Star,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourseModal: React.FC = () => {
  const { selectedCourse, setSelectedCourse, setCourses, addToast, setCurrentPage } = useApp();

  if (!selectedCourse) return null;

  const toggleModule = (moduleId: string) => {
    if (!selectedCourse.modules) return;

    const updatedModules = selectedCourse.modules.map((m) =>
      m.id === moduleId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedModules.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedModules.length) * 100);

    const updatedCourse = {
      ...selectedCourse,
      modules: updatedModules,
      completedModules: completedCount,
      progressPercent
    };

    setSelectedCourse(updatedCourse);
    setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? updatedCourse : c)));

    addToast('Module Status Updated', `Progress is now ${progressPercent}%`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Banner with course thumbnail */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={selectedCourse.thumbnail}
            alt={selectedCourse.title}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <button
            onClick={() => setSelectedCourse(null)}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-md bg-brand-500/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                {selectedCourse.category}
              </span>
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {selectedCourse.level}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{selectedCourse.title}</h2>
          </div>
        </div>

        {/* Course Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-6 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <img
              src={selectedCourse.instructorAvatar}
              alt={selectedCourse.instructor}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="font-semibold text-slate-800">{selectedCourse.instructor}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {selectedCourse.rating} Rating
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {selectedCourse.estimatedHours} Hours
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {(selectedCourse.enrolledStudentsCount ?? 0).toLocaleString()} Students
            </span>
          </div>
        </div>

        {/* Modal Body: Description & Modules */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Course Overview</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedCourse.description}</p>
          </div>

          {/* Progress Tracker */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800">Your Learning Completion</span>
              <span className="font-bold text-brand-600">{selectedCourse.progressPercent}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-600 transition-all duration-300"
                style={{ width: `${selectedCourse.progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {selectedCourse.completedModules} of {selectedCourse.totalModules} modules completed. Keep going to earn the Certificate of Mastery.
            </p>
          </div>

          {/* Interactive Syllabus Modules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum & Syllabus Modules</h4>
              <span className="text-[11px] text-slate-400">Click circle to toggle completed status</span>
            </div>
            <div className="space-y-2">
              {selectedCourse.modules ? (
                selectedCourse.modules.map((mod, idx) => {
                  let Icon = FileText;
                  if (mod.type === 'video') Icon = PlayCircle;
                  if (mod.type === 'code') Icon = Code;
                  if (mod.type === 'quiz') Icon = HelpCircle;

                  return (
                    <div
                      key={mod.id}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                        mod.completed
                          ? 'border-emerald-200 bg-emerald-50/40 text-slate-700'
                          : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {mod.completed ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-slate-300 hover:border-brand-500" />
                          )}
                        </button>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                          <span className={`font-semibold ${mod.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {idx + 1}. {mod.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400">{mod.duration}</span>
                        {mod.type === 'quiz' && (
                          <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                            Quiz
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  Full module tree synced with institutional LMS.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={() => {
              setSelectedCourse(null);
              setCurrentPage('recommendations');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            See AI Recommended Next Steps
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCourse(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSelectedCourse(null);
                setCurrentPage('quiz');
                addToast('Starting Adaptive Quiz', `Loaded diagnostic quiz for ${selectedCourse.title}`, 'success');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Take Practice Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
