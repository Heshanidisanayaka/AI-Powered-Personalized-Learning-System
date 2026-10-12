import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  FileText,
  Clock,
  Star,
  Sparkles,
  Download,
  ExternalLink,
  CheckCircle,
  Code
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';

export const CoursesPage: React.FC = () => {
  const { courses, setSelectedCourse, addToast, setCurrentPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'enrolled' | 'materials'>('enrolled');
  const [localSearch, setLocalSearch] = useState('');

  const categories = ['All', 'Artificial Intelligence', 'Data Structures', 'Mathematics', 'Cloud & Systems'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(localSearch.toLowerCase())) ||
      c.instructor.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const materials = [
    {
      id: 'mat-1',
      title: 'Attention & Transformers Mathematical Derivation Cheat Sheet',
      course: 'Advanced Neural Networks & Deep Learning',
      type: 'PDF Guide',
      size: '2.4 MB',
      downloads: 4120,
      badge: 'Staff Pick'
    },
    {
      id: 'mat-2',
      title: 'Graph Cycle Detection: Kahn vs DFS Invariant Comparison Matrix',
      course: 'Data Structures & Algorithmic Optimization',
      type: 'Jupyter Notebook',
      size: '850 KB',
      downloads: 2890,
      badge: 'Interactive'
    },
    {
      id: 'mat-3',
      title: 'Bayesian Conjugate Priors & Normal-Normal Models Quick Reference',
      course: 'Probabilistic Machine Learning & Bayesian Inference',
      type: 'Formula Sheet',
      size: '1.1 MB',
      downloads: 1650,
      badge: 'Essential'
    },
    {
      id: 'mat-4',
      title: 'Raft State Machine Log Replication Protocol Flowchart',
      course: 'Distributed Systems & Cloud Architecture',
      type: 'High-Res Diagram',
      size: '3.2 MB',
      downloads: 3200,
      badge: 'Visual Guide'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand-600" />
            My Courses & Learning Materials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your active curricula, module syllabi, and supplemental reference guides.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'enrolled'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Enrolled Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'materials'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curriculum Resources & Handouts ({materials.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter courses by topic, tag, or instructor..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border-none bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'enrolled' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail banner */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-900 mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 backdrop-blur-sm shadow-sm">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    {course.level}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {course.rating} ({course.enrolledStudentsCount.toLocaleString()} enrolled)
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {course.estimatedHours}h Total
                    </span>
                  </div>
                </div>

                {/* Course Title and Description */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors">
                  {course.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="mt-4 flex items-center gap-2">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-700">Taught by {course.instructor}</span>
                </div>

                {/* Tag Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress and Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="text-brand-600">{course.progressPercent}% ({course.completedModules}/{course.totalModules} Units)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-600"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    View Syllabus
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      addToast('Launching Module', `Starting next module in ${course.title}`, 'info');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Materials & Handouts Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700 uppercase">
                    {mat.type}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    {mat.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{mat.title}</h4>
                <p className="mt-1 text-xs text-slate-500">Related to: {mat.course}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{mat.size} • {mat.downloads.toLocaleString()} student downloads</span>
                <button
                  onClick={() => addToast('Download Started 📄', `Downloading ${mat.title}`, 'success')}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 px-3 py-1.5 font-bold text-slate-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
