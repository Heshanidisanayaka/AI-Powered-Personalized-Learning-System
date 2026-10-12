import axios, { AxiosInstance, AxiosError } from 'axios';
import { DashboardSummary } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create Centralized Axios Client
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends and receives HttpOnly session cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request Interceptor: Attach in-memory auth token if present
let currentAuthToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  currentAuthToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (currentAuthToken && config.headers) {
    config.headers.Authorization = `Bearer ${currentAuthToken}`;
  }
  return config;
});

// Response Interceptor: Session expiration and error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    if (error.response?.status === 401) {
      // Dispatches session expiration event for app context
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('learnsmart:session-expired', {
            detail: error.response.data?.detail || 'Session expired. Please sign in again.',
          })
        );
      }
    }
    const message = error.response?.data?.detail || error.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // 1. Authentication & Session
  login: async (email: string, password: string) => {
    const res = await apiClient.post<{
      access_token: string;
      user_id: string;
      name: string;
      email: string;
      role: string;
    }>('/auth/login', { email, password });
    if (res.data?.access_token) {
      setApiAuthToken(res.data.access_token);
    }
    return res.data;
  },

  register: async (data: { name: string; email: string; password: string; role?: string; title?: string }) => {
    const res = await apiClient.post<{
      access_token: string;
      user_id: string;
      name: string;
      email: string;
      role: string;
    }>('/auth/register', data);
    if (res.data?.access_token) {
      setApiAuthToken(res.data.access_token);
    }
    return res.data;
  },

  logout: async () => {
    setApiAuthToken(null);
    const res = await apiClient.post<{ status: string; message: string }>('/auth/logout');
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get<any>('/auth/me');
    return res.data;
  },

  // 2. Student Dashboard
  getDashboard: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<DashboardSummary>('/dashboard');
    return res.data;
  },

  // 3. Profile & Learning Settings
  getProfile: async () => {
    const res = await apiClient.get<any>('/profile');
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await apiClient.put<any>('/profile', data);
    return res.data;
  },

  // 4. Courses & Learning Materials
  getCourses: async () => {
    const res = await apiClient.get<any[]>('/courses');
    return res.data;
  },

  getCourse: async (courseId: string) => {
    const res = await apiClient.get<any>(`/courses/${courseId}`);
    return res.data;
  },

  getCourseMaterials: async (courseId: string) => {
    const res = await apiClient.get<any[]>(`/courses/${courseId}/materials`);
    return res.data;
  },

  toggleModule: async (courseId: string, moduleId: string) => {
    const res = await apiClient.post<any>(`/courses/${courseId}/modules/${moduleId}/toggle`);
    return res.data;
  },

  // 5. Topic Mastery & Weak-Area Analysis
  getMastery: async () => {
    const res = await apiClient.get<any[]>('/mastery');
    return res.data;
  },

  getWeakAreas: async () => {
    const res = await apiClient.get<any[]>('/mastery/weak-areas');
    return res.data;
  },

  // 6. Personalized Recommendations
  getRecommendations: async () => {
    const res = await apiClient.get<any[]>('/recommendations');
    return res.data;
  },

  // 7. Adaptive Quiz Interface
  getQuizQuestions: async () => {
    const res = await apiClient.get<any[]>('/quiz/questions');
    return res.data;
  },

  getNextAdaptiveQuestion: async (params: {
    previous_question_id?: string;
    previous_was_correct?: boolean;
    answered_question_ids?: string[];
  }) => {
    const res = await apiClient.post<any>('/quiz/adaptive/next', params);
    return res.data;
  },

  submitAnswer: async (params: {
    question_id: string;
    selected_option_index: number;
    time_spent_seconds?: number;
  }) => {
    const res = await apiClient.post<any>('/quiz/submit-answer', params);
    return res.data;
  },

  finishQuiz: async (params: {
    total_questions: number;
    score: number;
    time_spent_seconds: number;
    difficulty_mode?: string;
  }) => {
    const res = await apiClient.post<any>('/quiz/finish', params);
    return res.data;
  },

  // 8. Personalized Study Planner
  getTasks: async () => {
    const res = await apiClient.get<any[]>('/planner/tasks');
    return res.data;
  },

  createTask: async (data: any) => {
    const res = await apiClient.post<any>('/planner/tasks', data);
    return res.data;
  },

  toggleTask: async (taskId: string) => {
    const res = await apiClient.patch<any>(`/planner/tasks/${taskId}/toggle`);
    return res.data;
  },

  deleteTask: async (taskId: string) => {
    const res = await apiClient.delete<any>(`/planner/tasks/${taskId}`);
    return res.data;
  },

  generatePlan: async (availableDailyMinutes: number = 60) => {
    const res = await apiClient.post<any[]>('/planner/generate', {
      available_daily_minutes: availableDailyMinutes,
      prioritize_weak_topics: true,
    });
    return res.data;
  },

  // 9. AI Learning Assistant (CogniTutor RAG)
  chatWithTutor: async (message: string, courseContext?: string) => {
    const res = await apiClient.post<any>('/chat', {
      message,
      course_context: courseContext,
    });
    return res.data;
  },

  // 10. Learning Analytics
  getAnalytics: async () => {
    const res = await apiClient.get<any>('/analytics');
    return res.data;
  },

  // 11. Institutional Administration & RBAC
  getAdminStats: async () => {
    const res = await apiClient.get<any>('/admin/stats');
    return res.data;
  },

  getAdminUsers: async () => {
    const res = await apiClient.get<any[]>('/admin/users');
    return res.data;
  },

  deleteAdminUser: async (userId: string) => {
    const res = await apiClient.delete<any>(`/admin/users/${userId}`);
    return res.data;
  },

  getAdminCourses: async () => {
    const res = await apiClient.get<any[]>('/admin/courses');
    return res.data;
  },

  createCourse: async (data: any) => {
    const res = await apiClient.post<any>('/admin/courses', data);
    return res.data;
  },

  deleteCourse: async (courseId: string) => {
    const res = await apiClient.delete<any>(`/admin/courses/${courseId}`);
    return res.data;
  },

  createQuestion: async (data: any) => {
    const res = await apiClient.post<any>('/admin/questions', data);
    return res.data;
  },

  deleteQuestion: async (questionId: string) => {
    const res = await apiClient.delete<any>(`/admin/questions/${questionId}`);
    return res.data;
  },

  dispatchIntervention: async (studentId: string, actionType: string) => {
    const res = await apiClient.post<any>('/admin/interventions', {
      student_id: studentId,
      action_type: actionType,
    });
    return res.data;
  },
};
