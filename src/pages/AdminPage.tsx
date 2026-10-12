import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Search,
  Plus,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Send,
  Zap,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  mockAdminStats,
  mockAdminUsers,
  mockAdminQuestions,
  mockAdminResources
} from '../data/mockData';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const { user, switchRole, courses, setCourses, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'questions' | 'resources'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<any | null>(null);

  const [adminStats, setAdminStats] = useState(mockAdminStats);
  const [adminUsers, setAdminUsers] = useState(mockAdminUsers);

  // New course form state
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<any>('Artificial Intelligence');
  const [newCourseLevel, setNewCourseLevel] = useState<any>('Intermediate');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // New question form state
  const [newQTopic, setNewQTopic] = useState('');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQText, setNewQText] = useState('');

  // Load real admin stats & user records if authenticated as admin
  React.useEffect(() => {
    if (user.role === 'admin') {
      api.getAdminStats().then((data) => {
        if (data) setAdminStats(data);
      }).catch(() => {});

      api.getAdminUsers().then((users) => {
        if (users && users.length > 0) setAdminUsers(users);
      }).catch(() => {});
    }
  }, [user.role]);

  // Role Protection Guard
  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 mb-4 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Institutional Access Restricted</h2>
        <p className="mt-2 max-w-md text-xs text-slate-600 leading-relaxed">
          The Institutional Oversight and Admin Management Dashboard is restricted to accredited faculty directors and administrators.
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="mt-6 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-700 transition-all"
        >
          Authenticate as Dr. Marcus Vance (Admin)
        </button>
      </div>
    );
  }

  const filteredUsers = adminUsers.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    try {
      const created = await api.createCourse({
        title: newCourseTitle.trim(),
        description: newCourseDesc.trim() || 'Comprehensive institutional learning module powered by CogniLearn curriculum models.',
        category: newCourseCategory,
        level: newCourseLevel,
        estimated_hours: 24
      });
      if (created) {
        setCourses((prev) => [created, ...prev]);
      }
    } catch {
      const fallbackCourse = {
        id: 'course-' + Date.now(),
        title: newCourseTitle.trim(),
        description: newCourseDesc.trim() || 'Comprehensive institutional learning module powered by CogniLearn curriculum models.',
        category: newCourseCategory,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        instructor: 'Faculty Instruction Board',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        totalModules: 10,
        completedModules: 0,
        progressPercent: 0,
        estimatedHours: 24,
        level: newCourseLevel,
        rating: 5.0,
        enrolledStudentsCount: 1,
        tags: ['Curriculum', 'Accredited'],
        modules: []
      };
      setCourses((prev) => [fallbackCourse, ...prev]);
    }

    setShowAddCourseModal(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
    addToast('New Course Published! 📚', `"${newCourseTitle}" is now available in the curriculum catalog.`, 'success');
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTopic.trim() || !newQText.trim()) return;

    try {
      await api.createQuestion({
        subject: 'Computer Science',
        topic: newQTopic.trim(),
        difficulty: newQDifficulty,
        question: newQText.trim(),
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_option_index: 0,
        explanation: 'Detailed pedagogical breakdown generated.',
        concept_tag: newQTopic.trim(),
        hint: 'Review core definitions.'
      });
    } catch {
      // offline safe
    }

    addToast('Question Added to Adaptive Bank! 🎯', `Topic: "${newQTopic}" with difficulty ${newQDifficulty}`, 'success');
    setShowAddQuestionModal(false);
    setNewQTopic('');
    setNewQText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-violet-400/30">
              <ShieldAlert className="h-3.5 w-3.5 text-violet-300" />
              <span>Institutional Oversight & SaaS Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Curriculum & Student Analytics Administration
            </h1>
            <p className="text-xs sm:text-sm text-violet-200/90 leading-relaxed">
              Supervise student cohorts, publish curriculum modules, monitor diagnostic difficulty models, and intervene with at-risk learners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-violet-900 shadow-md hover:bg-violet-50 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New Course
            </button>
            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Adaptive Question
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Institutional Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Enrolled</span>
          <p className="text-xl font-black text-slate-900 mt-1">{adminStats.totalStudents.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">Active Today</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{adminStats.activeToday.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">Average Mastery</span>
          <p className="text-xl font-black text-brand-600 mt-1">{adminStats.averageMastery}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">Active Courses</span>
          <p className="text-xl font-black text-slate-900 mt-1">{courses.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">Question Bank</span>
          <p className="text-xl font-black text-slate-900 mt-1">{adminStats.totalQuestions}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase text-slate-400">AI Queries Answered</span>
          <p className="text-xl font-black text-violet-700 mt-1">{(adminStats.aiQueriesAnswered / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'users', label: 'Student Cohort & Interventions', icon: Users, count: filteredUsers.length },
          { id: 'courses', label: 'Course Catalog & Modules', icon: BookOpen, count: courses.length },
          { id: 'questions', label: 'Adaptive Question Bank', icon: HelpCircle, count: mockAdminQuestions.length },
          { id: 'resources', label: 'Learning Resources & Handouts', icon: FileText, count: mockAdminResources.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. USERS TAB */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name or university email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>
            <span className="text-xs text-slate-500">Showing {filteredUsers.length} enrolled students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Enrolled Tracks</th>
                  <th className="py-3 px-4">Overall Completion</th>
                  <th className="py-3 px-4">AI Risk Indicator</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{u.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{u.role}</td>
                    <td className="py-3.5 px-4">{u.enrolled} Courses</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{u.completion}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          u.riskScore.includes('High')
                            ? 'bg-rose-100 text-rose-800'
                            : u.riskScore.includes('Medium')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.riskScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudentForIntervention(u);
                        }}
                        className="rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-1.5 text-xs font-bold transition-colors"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-900 mb-3">
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                    {course.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{course.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>{course.totalModules} Syllabus Modules</span>
                  <span className="font-bold text-violet-700">{course.enrolledStudentsCount.toLocaleString()} Students</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Published & Active
                </span>
                <button
                  onClick={() => addToast('Course Editor Loaded', `Opened curriculum editor for ${course.title}`, 'info')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit Syllabus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. QUESTION BANK TAB */}
      {activeTab === 'questions' && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Adaptive Quiz Diagnostic Repository</h3>
            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-violet-700"
            >
              <Plus className="h-3.5 w-3.5" /> New Question
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Topic Tag</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Global Accuracy</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAdminQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{q.topic}</td>
                    <td className="py-3.5 px-4 font-semibold">{q.difficulty}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{q.accuracyRate}</td>
                    <td className="py-3.5 px-4">{q.timesAttempted.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          q.status.includes('Review')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => addToast('Question Calibrated', `Adjusted telemetry for ${q.topic}`, 'info')}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        Recalibrate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAdminResources.map((res) => (
            <div key={res.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-violet-700 uppercase">{res.type}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{res.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Course: {res.course}</p>
                <span className="mt-2 inline-block text-[11px] text-slate-400 font-medium">
                  {res.views.toLocaleString()} student views • {res.rating}★ rating
                </span>
              </div>
              <button
                onClick={() => addToast('Resource Synced', `Handout verified: ${res.title}`, 'info')}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Inspect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Publish New Course</h3>
            <p className="text-xs text-slate-500 mt-0.5">Author a new curriculum track for students</p>

            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LLM Reasoning & Autonomous Agents"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-violet-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option>Artificial Intelligence</option>
                    <option>Data Structures</option>
                    <option>Mathematics</option>
                    <option>Cloud & Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline the pedagogical objectives, prerequisites, and learning outcomes..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-violet-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Adaptive Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Add Question to Adaptive Bank</h3>
            <p className="text-xs text-slate-500 mt-0.5">Author an assessment item with diagnostic tags</p>

            <form onSubmit={handleCreateQuestion} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Concept Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Variational Autoencoders & Reparameterization Trick"
                  value={newQTopic}
                  onChange={(e) => setNewQTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Calibration</label>
                <select
                  value={newQDifficulty}
                  onChange={(e) => setNewQDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify the problem formulation and answer constraints..."
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Diagnostic Intervention */}
      {selectedStudentForIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Student AI Diagnostic Intervention</h3>
            <p className="text-xs text-slate-500 mt-0.5">Send a targeted remediation package to {selectedStudentForIntervention.name}</p>

            <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900">
              ⚠️ <strong>Risk Alert:</strong> Student progress is lagging at {selectedStudentForIntervention.completion} with high error rates on Graph Cycles and Bayes formula calculations.
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Recommended Intervention Action</label>
              <div className="space-y-1.5 text-xs">
                <div className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer">
                  <span className="font-bold text-slate-800">Auto-Schedule 1-on-1 Faculty Office Hours</span>
                  <p className="text-[11px] text-slate-500">Sends calendar invite with auto-generated diagnostic error report</p>
                </div>
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-2.5 hover:bg-brand-50 cursor-pointer">
                  <span className="font-bold text-brand-900">Queue Targeted Remediation Lab into Student Planner</span>
                  <p className="text-[11px] text-brand-700">Auto-injects step-by-step Kahn Algorithm and Bayes cheat sheets</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudentForIntervention(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast(
                    'Intervention Dispatched! 🚀',
                    `Targeted remediation package sent to ${selectedStudentForIntervention.name}.`,
                    'success'
                  );
                  setSelectedStudentForIntervention(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Intervention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
