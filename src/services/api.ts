const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cognilearn_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export const api = {
  // Auth & Profile
  login: (email: string, password: string) =>
    fetchFromApi<{ access_token: string; user_id: string; name: string; email: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => fetchFromApi<any>('/profile'),
  updateProfile: (data: any) =>
    fetchFromApi<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Courses
  getCourses: () => fetchFromApi<any[]>('/courses'),
  getCourse: (courseId: string) => fetchFromApi<any>(`/courses/${courseId}`),
  toggleModule: (courseId: string, moduleId: string) =>
    fetchFromApi<any>(`/courses/${courseId}/modules/${moduleId}/toggle`, {
      method: 'POST',
    }),

  // Topic Mastery & Weak Areas
  getMastery: () => fetchFromApi<any[]>('/mastery'),
  getWeakAreas: () => fetchFromApi<any[]>('/mastery/weak-areas'),

  // Personalized Recommendations
  getRecommendations: () => fetchFromApi<any[]>('/recommendations'),

  // Adaptive Quiz
  getQuizQuestions: () => fetchFromApi<any[]>('/quiz/questions'),
  getNextAdaptiveQuestion: (params: {
    previous_question_id?: string;
    previous_was_correct?: boolean;
    answered_question_ids?: string[];
  }) =>
    fetchFromApi<any>('/quiz/adaptive/next', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  submitAnswer: (params: { question_id: string; selected_option_index: number; time_spent_seconds?: number }) =>
    fetchFromApi<any>('/quiz/submit-answer', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  finishQuiz: (params: { total_questions: number; score: number; time_spent_seconds: number; difficulty_mode?: string }) =>
    fetchFromApi<any>('/quiz/finish', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Study Planner
  getTasks: () => fetchFromApi<any[]>('/planner/tasks'),
  createTask: (data: any) =>
    fetchFromApi<any>('/planner/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleTask: (taskId: string) =>
    fetchFromApi<any>(`/planner/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    }),
  deleteTask: (taskId: string) =>
    fetchFromApi<any>(`/planner/tasks/${taskId}`, {
      method: 'DELETE',
    }),
  generatePlan: (availableDailyMinutes: number = 60) =>
    fetchFromApi<any[]>('/planner/generate', {
      method: 'POST',
      body: JSON.stringify({ available_daily_minutes: availableDailyMinutes, prioritize_weak_topics: true }),
    }),

  // AI Chat (RAG Assistant)
  chatWithTutor: (message: string, courseContext?: string) =>
    fetchFromApi<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, course_context: courseContext }),
    }),

  // Analytics
  getAnalytics: () => fetchFromApi<any>('/analytics'),

  // Admin
  getAdminStats: () => fetchFromApi<any>('/admin/stats'),
  getAdminUsers: () => fetchFromApi<any[]>('/admin/users'),
  createCourse: (data: any) =>
    fetchFromApi<any>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createQuestion: (data: any) =>
    fetchFromApi<any>('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  dispatchIntervention: (studentId: string, actionType: string) =>
    fetchFromApi<any>('/admin/interventions', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, action_type: actionType }),
    }),
};
