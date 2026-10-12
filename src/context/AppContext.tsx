import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Course,
  Recommendation,
  QuizQuestion,
  WeakArea,
  StudyTask,
  ChatMessage,
  QuizResult,
  DashboardSummary
} from '../types';
import {
  mockCurrentUser,
  mockAdminUser,
  mockCourses,
  mockRecommendations,
  mockWeakAreas,
  mockStudyTasks,
  mockChatMessages,
  mockQuizQuestions
} from '../data/mockData';
import { api } from '../services/api';

export type PageId =
  | 'dashboard'
  | 'courses'
  | 'recommendations'
  | 'quiz'
  | 'ai-chat'
  | 'mastery'
  | 'planner'
  | 'analytics'
  | 'profile'
  | 'admin'
  | 'auth';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string; title?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  switchRole: (role: 'student' | 'admin') => Promise<void>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  toggleCourseModule: (courseId: string, moduleId: string) => Promise<void>;
  recommendations: Recommendation[];
  weakAreas: WeakArea[];
  studyTasks: StudyTask[];
  toggleTaskCompletion: (taskId: string) => void;
  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  deleteStudyTask: (taskId: string) => void;
  generateAIStudyPlan: (dailyMinutes?: number) => Promise<void>;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  quizQuestions: QuizQuestion[];
  recordQuizCompletion: (result: QuizResult) => void;
  dashboardData: DashboardSummary | null;
  isDashboardLoading: boolean;
  dashboardError: string | null;
  refreshDashboard: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  backendOnline: boolean;
  retryBackendConnection: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(mockWeakAreas);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(mockStudyTasks);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(mockQuizQuestions);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);

  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Dashboard data from FastAPI
  const refreshDashboard = useCallback(async () => {
    setIsDashboardLoading(true);
    setDashboardError(null);
    try {
      const summary = await api.getDashboard();
      if (summary) {
        setDashboardData(summary);
        setBackendOnline(true);
        if (summary.weak_topics && summary.weak_topics.length > 0) {
          setWeakAreas(summary.weak_topics);
        }
        if (summary.upcoming_tasks && summary.upcoming_tasks.length > 0) {
          setStudyTasks(summary.upcoming_tasks);
        }
      }
    } catch (err: any) {
      setDashboardError(err.message || 'Could not load dashboard telemetry');
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  // Initial Sync with FastAPI backend
  const loadBackendData = useCallback(async () => {
    try {
      // 1. Check current authenticated user
      const currentUser = await api.getCurrentUser().catch(() => null);
      if (currentUser && currentUser.id) {
        setUser({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar || mockCurrentUser.avatar,
          role: currentUser.role as 'student' | 'admin',
          title: currentUser.title,
          grade: currentUser.grade,
          streakDays: currentUser.streak_days ?? 14,
          dailyGoalMinutes: currentUser.daily_goal_minutes ?? 60,
          dailyGoalProgressMinutes: currentUser.daily_goal_progress_minutes ?? 42,
          totalXp: currentUser.total_xp ?? 3840,
          level: currentUser.level ?? 8,
          learningStyle: currentUser.learning_style || 'Hands-on Coding',
          preferredDifficulty: currentUser.preferred_difficulty || 'Adaptive',
          targetExam: currentUser.target_exam
        });
        setIsAuthenticated(true);
        setBackendOnline(true);
      }

      // 2. Load feature collections
      const [backendCourses, backendWeak, backendRecs, backendTasks, backendQuestions] = await Promise.all([
        api.getCourses().catch(() => null),
        api.getWeakAreas().catch(() => null),
        api.getRecommendations().catch(() => null),
        api.getTasks().catch(() => null),
        api.getQuizQuestions().catch(() => null)
      ]);

      if (backendCourses && backendCourses.length > 0) {
        // Map backend courses
        const mapped: Course[] = backendCourses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          category: c.category,
          thumbnail: c.thumbnail,
          instructor: c.instructor,
          instructorAvatar: c.instructor_avatar,
          totalModules: c.total_modules,
          completedModules: c.completed_modules,
          progressPercent: c.progress_percent,
          estimatedHours: c.estimated_hours,
          level: c.level,
          rating: c.rating,
          enrolledStudentsCount: c.enrolled_count || 1200,
          tags: typeof c.tags === 'string' ? c.tags.split(',') : c.tags || [],
          modules: c.modules?.map((m: any) => ({
            id: m.id,
            title: m.title,
            duration: m.duration,
            completed: m.completed,
            type: m.module_type,
            summary: m.summary
          })),
        }));
        setCourses(mapped);
        setBackendOnline(true);
      }

      if (backendWeak && backendWeak.length > 0) setWeakAreas(backendWeak);
      if (backendRecs && backendRecs.length > 0) setRecommendations(backendRecs);
      if (backendTasks && backendTasks.length > 0) setStudyTasks(backendTasks);
      if (backendQuestions && backendQuestions.length > 0) setQuizQuestions(backendQuestions);

      // Load dashboard summary
      await refreshDashboard();
    } catch {
      // Seamlessly fall back to pre-loaded rich demo data
      setBackendOnline(false);
    }
  }, [refreshDashboard]);

  useEffect(() => {
    loadBackendData();

    // Listen to session expiration events from Axios interceptor
    const handleSessionExpired = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsAuthenticated(false);
      setCurrentPage('auth');
      addToast('Session Expired', customEvent.detail || 'Please sign in to renew your session.', 'warning');
    };

    window.addEventListener('learnsmart:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('learnsmart:session-expired', handleSessionExpired);
    };
  }, [loadBackendData, addToast]);

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const res = await api.login(email, password);
      setIsAuthenticated(true);
      setBackendOnline(true);
      
      // Fetch full profile
      const fullProfile = await api.getCurrentUser().catch(() => null);
      if (fullProfile) {
        setUser({
          id: fullProfile.id,
          name: fullProfile.name,
          email: fullProfile.email,
          avatar: fullProfile.avatar || mockCurrentUser.avatar,
          role: fullProfile.role as 'student' | 'admin',
          title: fullProfile.title,
          grade: fullProfile.grade,
          streakDays: fullProfile.streak_days ?? 14,
          dailyGoalMinutes: fullProfile.daily_goal_minutes ?? 60,
          dailyGoalProgressMinutes: fullProfile.daily_goal_progress_minutes ?? 42,
          totalXp: fullProfile.total_xp ?? 3840,
          level: fullProfile.level ?? 8,
          learningStyle: fullProfile.learning_style || 'Hands-on Coding',
          preferredDifficulty: fullProfile.preferred_difficulty || 'Adaptive',
          targetExam: fullProfile.target_exam
        });
      } else {
        setUser((prev) => ({
          ...prev,
          id: res.user_id,
          name: res.name,
          email: res.email,
          role: res.role as 'student' | 'admin'
        }));
      }

      addToast('Welcome Back!', `Signed in as ${res.name}`, 'success');
      setCurrentPage(res.role === 'admin' ? 'admin' : 'dashboard');
      refreshDashboard();
      return true;
    } catch (err: any) {
      addToast('Sign In Failed', err.message || 'Invalid email or password', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role?: string; title?: string }): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const res = await api.register(data);
      setIsAuthenticated(true);
      setBackendOnline(true);
      setUser((prev) => ({
        ...prev,
        id: res.user_id,
        name: res.name,
        email: res.email,
        role: res.role as 'student' | 'admin'
      }));
      addToast('Account Created! 🎓', `Welcome to LearnSmart, ${res.name}!`, 'success');
      setCurrentPage('dashboard');
      refreshDashboard();
      return true;
    } catch (err: any) {
      addToast('Registration Failed', err.message || 'Could not create account', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // offline logout
    }
    setIsAuthenticated(false);
    setUser(mockCurrentUser);
    setCurrentPage('auth');
    addToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const switchRole = async (role: 'student' | 'admin') => {
    if (role === 'admin') {
      try {
        await api.login('m.vance@cognilearn.ai', 'password');
        setUser(mockAdminUser);
        setIsAuthenticated(true);
        setCurrentPage('admin');
        addToast('Switched to Admin Role', 'Logged in as Dr. Marcus Vance with institutional admin privileges', 'info');
      } catch {
        setUser(mockAdminUser);
        setCurrentPage('admin');
        addToast('Switched to Admin (Demo)', 'Operating with administrator dashboard permissions', 'info');
      }
    } else {
      try {
        await api.login('sarah.chen@stanford.edu', 'password');
        setUser(mockCurrentUser);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        addToast('Switched to Student Role', 'Logged in as Sarah Chen (Senior CS & AI Student)', 'info');
      } catch {
        setUser(mockCurrentUser);
        setCurrentPage('dashboard');
        addToast('Switched to Student (Demo)', 'Operating with student dashboard permissions', 'info');
      }
    }
  };

  const toggleCourseModule = async (courseId: string, moduleId: string) => {
    // Optimistic UI update
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId && c.modules) {
          const updatedModules = c.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedModules.filter((m) => m.completed).length;
          const pct = Math.round((completedCount / updatedModules.length) * 100);
          return {
            ...c,
            modules: updatedModules,
            completedModules: completedCount,
            progressPercent: pct
          };
        }
        return c;
      })
    );

    try {
      await api.toggleModule(courseId, moduleId);
      addToast('Lesson Progress Saved', 'Updated module completion status and earned +25 XP', 'success');
      setUser((u) => ({ ...u, totalXp: u.totalXp + 25 }));
      refreshDashboard();
    } catch {
      // safe fallback
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = !t.completed;
          if (updated) {
            addToast('Task Completed! 🎉', `"${t.title}" marked as finished (+25 XP)`, 'success');
            setUser((u) => ({ ...u, totalXp: u.totalXp + 25 }));
          }
          return { ...t, completed: updated };
        }
        return t;
      })
    );

    try {
      await api.toggleTask(taskId);
      refreshDashboard();
    } catch {
      // safe fallback
    }
  };

  const addStudyTask = async (task: Omit<StudyTask, 'id'>) => {
    const tempId = 'task-' + Date.now();
    const newTask: StudyTask = { ...task, id: tempId };
    setStudyTasks((prev) => [newTask, ...prev]);
    addToast('New Task Scheduled', `Added "${task.title}" to your study planner`, 'success');

    try {
      const created = await api.createTask({
        title: task.title,
        course: task.course,
        due_date: task.dueDate,
        duration_minutes: task.durationMinutes,
        priority: task.priority,
        task_type: task.type,
        ai_suggested: task.aiSuggested
      });
      if (created && created.id) {
        setStudyTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
      }
      refreshDashboard();
    } catch {
      // safe fallback
    }
  };

  const deleteStudyTask = async (taskId: string) => {
    setStudyTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('Task Removed', 'The item was deleted from your planner', 'info');
    try {
      await api.deleteTask(taskId);
      refreshDashboard();
    } catch {
      // safe fallback
    }
  };

  const generateAIStudyPlan = async (dailyMinutes: number = 60) => {
    try {
      const newPlan = await api.generatePlan(dailyMinutes);
      if (newPlan && newPlan.length > 0) {
        setStudyTasks(newPlan);
        addToast('AI Study Plan Generated! 📅', `Scheduled ${newPlan.length} sessions targeting your weakest topics`, 'success');
        refreshDashboard();
      }
    } catch {
      addToast('Plan Generated', 'Scheduled spaced-repetition slots for today', 'info');
    }
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const response = await api.chatWithTutor(text);
      if (response && response.text) {
        const aiMsg: ChatMessage = {
          id: response.id || 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: response.text,
          codeSnippet: response.code_snippet,
          timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: response.suggested_follow_ups,
          relatedTopic: response.rag_sources_used ? response.rag_sources_used[0] : undefined
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        return;
      }
    } catch {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: `In modern computing architectures, mastering the trade-offs between space, time, and conceptual clarity is essential. Let's analyze "${text}" from first principles: trace how state invariants change across operations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: ['Could you give a concrete example?', 'How does this affect complexity?']
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }, 700);
    }
  };

  const recordQuizCompletion = async (result: QuizResult) => {
    setUser((u) => ({
      ...u,
      totalXp: u.totalXp + result.xpEarned,
      dailyGoalProgressMinutes: Math.min(u.dailyGoalMinutes, u.dailyGoalProgressMinutes + Math.round(result.timeSpentSeconds / 60))
    }));

    if (result.accuracy >= 80) {
      setWeakAreas((prev) =>
        prev.map((w) =>
          result.strongTopics.includes(w.topic) || w.topic.includes('Graph')
            ? { ...w, masteryPercentage: Math.min(95, w.masteryPercentage + 18), status: 'Nearly Mastered' }
            : w
        )
      );
    }

    addToast(
      'Quiz Completed! 🏆',
      `Score: ${result.score}/${result.totalQuestions} (${result.accuracy}%) • +${result.xpEarned} XP awarded`,
      'success'
    );

    try {
      await api.finishQuiz({
        score: result.score,
        total_questions: result.totalQuestions,
        time_spent_seconds: result.timeSpentSeconds,
        difficulty_mode: result.difficulty
      });
      const updatedWeak = await api.getWeakAreas();
      if (updatedWeak) setWeakAreas(updatedWeak);
      refreshDashboard();
    } catch {
      // safe fallback
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isAuthLoading,
        login,
        register,
        logout,
        currentPage,
        setCurrentPage,
        switchRole,
        courses,
        setCourses,
        selectedCourse,
        setSelectedCourse,
        toggleCourseModule,
        recommendations,
        weakAreas,
        studyTasks,
        toggleTaskCompletion,
        addStudyTask,
        deleteStudyTask,
        generateAIStudyPlan,
        chatMessages,
        sendChatMessage,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        quizQuestions,
        recordQuizCompletion,
        dashboardData,
        isDashboardLoading,
        dashboardError,
        refreshDashboard,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        backendOnline,
        retryBackendConnection: loadBackendData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
