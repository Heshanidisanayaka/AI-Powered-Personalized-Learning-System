import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar as CalendarIcon,
  BookOpen,
  HelpCircle,
  Code2,
  AlarmClock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StudyPlannerPage: React.FC = () => {
  const {
    studyTasks,
    toggleTaskCompletion,
    addStudyTask,
    deleteStudyTask,
    generateAIStudyPlan,
    addToast
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('Advanced Neural Networks');
  const [newTaskDuration, setNewTaskDuration] = useState('30');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [showAddModal, setShowAddModal] = useState(false);

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      addToast(
        timerMode === 'focus' ? 'Focus Session Completed! 🔔' : 'Break Finished! 🔔',
        timerMode === 'focus' ? 'Take a well-deserved 5-minute break.' : 'Time to dive back into learning!',
        'success'
      );
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, timerMode]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (mode: 'focus' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setPomodoroSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addStudyTask({
      title: newTaskTitle.trim(),
      course: newTaskCourse,
      dueDate: 'Today, 8:00 PM',
      durationMinutes: parseInt(newTaskDuration) || 25,
      completed: false,
      priority: newTaskPriority,
      type: 'reading',
      aiSuggested: false,
    });

    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-brand-600" />
            Personalized Study Planner & Focus Timer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AI spaced-repetition timetable optimized for long-term concept retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateAIStudyPlan(60)}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:shadow-lg transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Auto-Generate AI Plan
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Custom Task
          </button>
        </div>
      </div>

      {/* Top Banner: Pomodoro Focus Timer & Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer Card (1 col) */}
        <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-b from-brand-50/50 via-white to-white p-6 shadow-card flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 text-brand-700">
              <AlarmClock className="h-4 w-4 text-brand-600" /> Pomodoro Focus
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => resetTimer('focus')}
                className={`rounded-lg px-2 py-0.5 text-[11px] ${
                  timerMode === 'focus' ? 'bg-brand-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                25m Focus
              </button>
              <button
                onClick={() => resetTimer('break')}
                className={`rounded-lg px-2 py-0.5 text-[11px] ${
                  timerMode === 'break' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                5m Break
              </button>
            </div>
          </div>

          <div className="my-6">
            <div className="text-5xl font-black text-slate-900 tracking-tight font-mono">
              {formatTimer(pomodoroSeconds)}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {timerMode === 'focus' ? 'Deep Work Session • Zero Distractions' : 'Rest your eyes & hydrate'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-md transition-all ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
              }`}
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isTimerRunning ? 'Pause Timer' : 'Start Focus Block'}</span>
            </button>
            <button
              onClick={() => resetTimer(timerMode)}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Spaced Repetition Schedule Calendar Overview (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-600" />
                  Spaced Repetition Schedule (Oct 11 - Oct 17)
                </h3>
                <p className="text-xs text-slate-500">Auto-calculated review intervals based on Ebbinghaus forgetting curve</p>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                AI Synced
              </span>
            </div>

            {/* Calendar Days Strip */}
            <div className="grid grid-cols-7 gap-2 mt-4 text-center">
              {[
                { day: 'Sun', date: '11', active: true, count: 2 },
                { day: 'Mon', date: '12', active: false, count: 3 },
                { day: 'Tue', date: '13', active: false, count: 1 },
                { day: 'Wed', date: '14', active: false, count: 4 },
                { day: 'Thu', date: '15', active: false, count: 2 },
                { day: 'Fri', date: '16', active: false, count: 3 },
                { day: 'Sat', date: '17', active: false, count: 1 },
              ].map((slot, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-3 border transition-all ${
                    slot.active
                      ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-1 ring-brand-600'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-400 block">{slot.day}</span>
                  <span className={`text-base font-extrabold mt-1 block ${slot.active ? 'text-brand-700' : 'text-slate-800'}`}>
                    {slot.date}
                  </span>
                  <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-200/60">
                    {slot.count} tasks
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 shrink-0" />
              <span>Optimal retention window detected for <strong>Graph Traversal & Bayes Formulas</strong> tonight.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Study Task Queue</h3>
            <p className="text-xs text-slate-500">Click circle to check off finished study sessions</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {studyTasks.filter((t) => t.completed).length} of {studyTasks.length} Completed
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {studyTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-xs transition-all ${
                task.completed
                  ? 'border-emerald-200 bg-emerald-50/30 text-slate-400'
                  : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50/40 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-lg border-2 border-slate-300 hover:border-brand-500" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold truncate text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    {task.aiSuggested && (
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 shrink-0">
                        AI Recommended
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-600">{task.course}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> {task.durationMinutes} mins
                    </span>
                    <span>•</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                    task.priority === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : task.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteStudyTask(task.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Add New Study Task</h3>
            <p className="text-xs text-slate-500 mt-0.5">Schedule a personalized learning or revision session</p>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Kahn's Algorithm in C++"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Related Course</label>
                <select
                  value={newTaskCourse}
                  onChange={(e) => setNewTaskCourse(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option>Advanced Neural Networks</option>
                  <option>Data Structures & Optimization</option>
                  <option>Probabilistic Machine Learning</option>
                  <option>Distributed Systems & Cloud</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
