import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Course,
  Recommendation,
  QuizQuestion,
  WeakArea,
  StudyTask,
  ChatMessage,
  QuizResult
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
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  switchRole: (role: 'student' | 'admin') => void;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
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
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  backendOnline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockCurrentUser);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(mockWeakAreas);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(mockStudyTasks);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(mockQuizQuestions);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);

  // Sync with live FastAPI backend on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [
          backendCourses,
          backendWeak,
          backendRecs,
          backendTasks,
          backendQuestions
        ] = await Promise.all([
          api.getCourses().catch(() => null),
          api.getWeakAreas().catch(() => null),
          api.getRecommendations().catch(() => null),
          api.getTasks().catch(() => null),
          api.getQuizQuestions().catch(() => null)
        ]);

        if (backendCourses && backendCourses.length > 0) {
          setCourses(backendCourses);
          setBackendOnline(true);
        }
        if (backendWeak && backendWeak.length > 0) {
          setWeakAreas(backendWeak);
        }
        if (backendRecs && backendRecs.length > 0) {
          setRecommendations(backendRecs);
        }
        if (backendTasks && backendTasks.length > 0) {
          setStudyTasks(backendTasks);
        }
        if (backendQuestions && backendQuestions.length > 0) {
          setQuizQuestions(backendQuestions);
        }
      } catch (err) {
        // Fallback to pre-loaded data seamlessly
      }
    }
    loadBackendData();
  }, []);

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setUser(mockAdminUser);
      setCurrentPage('admin');
      addToast('Switched to Admin Role', 'Logged in as Dr. Marcus Vance with full institutional access', 'info');
    } else {
      setUser(mockCurrentUser);
      setCurrentPage('dashboard');
      addToast('Switched to Student Role', 'Logged in as Sarah Chen (Senior CS & AI Student)', 'info');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    // Optimistic UI update
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
    } catch (e) {
      // safe fallback
    }
  };

  const addStudyTask = async (task: Omit<StudyTask, 'id'>) => {
    const tempId = 'task-' + Date.now();
    const newTask: StudyTask = {
      ...task,
      id: tempId,
    };
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
        setStudyTasks((prev) => prev.map((t) => t.id === tempId ? created : t));
      }
    } catch (e) {
      // safe fallback
    }
  };

  const deleteStudyTask = async (taskId: string) => {
    setStudyTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('Task Removed', 'The item was deleted from your planner', 'info');
    try {
      await api.deleteTask(taskId);
    } catch (e) {
      // safe fallback
    }
  };

  const generateAIStudyPlan = async (dailyMinutes: number = 60) => {
    try {
      const newPlan = await api.generatePlan(dailyMinutes);
      if (newPlan && newPlan.length > 0) {
        setStudyTasks(newPlan);
        addToast('AI Study Plan Generated! 📅', `Scheduled ${newPlan.length} sessions targeting your weakest topics`, 'success');
      }
    } catch (e) {
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
      // Query live RAG backend
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
    } catch (err) {
      // Fallback response generator if offline
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
      // Re-fetch updated topic mastery & weak areas from ML model
      const updatedWeak = await api.getWeakAreas();
      if (updatedWeak) setWeakAreas(updatedWeak);
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentPage,
        setCurrentPage,
        switchRole,
        courses,
        setCourses,
        selectedCourse,
        setSelectedCourse,
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
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        backendOnline
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
