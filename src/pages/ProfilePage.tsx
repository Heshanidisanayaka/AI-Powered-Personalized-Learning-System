import React, { useState } from 'react';
import {
  User,
  Settings,
  Sparkles,
  Award,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { user, setUser, addToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title || 'B.S. Computer Science & AI Candidate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user.dailyGoalMinutes);
  const [learningStyle, setLearningStyle] = useState(user.learningStyle);
  const [preferredDifficulty, setPreferredDifficulty] = useState(user.preferredDifficulty);
  const [targetExam, setTargetExam] = useState(user.targetExam || 'ACM-ICPC & Machine Learning Engineer Certification');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      title,
      dailyGoalMinutes,
      learningStyle,
      preferredDifficulty,
      targetExam
    }));
    addToast('Profile & AI Settings Saved!', 'Your adaptive tutor preferences have been updated.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="h-6 w-6 text-brand-600" />
          Student Profile & AI Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your adaptive tutor persona, study targets, and notification schedules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand-600" /> Personal Academic Profile
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                  Level {user.level} Scholar
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  {user.streakDays}-Day Streak
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Academic Degree / Major</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Tutor Calibration Preferences */}
        <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50/40 via-white to-violet-50/30 p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" /> AI Tutor Personalization Matrix
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Preferred Learning Modality (AI Tutor Response Style)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Hands-on Coding', 'Visual', 'Theoretical', 'Socratic'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setLearningStyle(style)}
                    className={`rounded-xl border p-3 font-bold text-center transition-all ${
                      learningStyle === style
                        ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Daily Study Target (Minutes)</label>
                <select
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
                >
                  <option value={30}>30 mins / day (Light)</option>
                  <option value={45}>45 mins / day (Steady)</option>
                  <option value={60}>60 mins / day (Recommended)</option>
                  <option value={90}>90 mins / day (Intensive)</option>
                  <option value={120}>120 mins / day (Exam Bootcamp)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quiz Difficulty Engine</label>
                <select
                  value={preferredDifficulty}
                  onChange={(e) => setPreferredDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
                >
                  <option value="Adaptive">Dynamic Adaptive (Auto-Calibrate)</option>
                  <option value="Beginner">Foundational Concepts</option>
                  <option value="Intermediate">University Intermediate</option>
                  <option value="Advanced">Advanced Graduate Level</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Exam / Capstone Goal</label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                placeholder="e.g. ACM-ICPC World Finals, GRE CS, FAANG Technical Interviews"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications and Sync */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" /> Notifications & Spaced Repetition Reminders
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">Spaced Repetition Memory Prompts</p>
                <p className="text-slate-500 text-[11px]">Receive optimal review alerts before memory decay hits 50%</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">Daily Study Streak Alerts</p>
                <p className="text-slate-500 text-[11px]">Reminder sent at 7:00 PM if daily 60-minute goal is unreached</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
