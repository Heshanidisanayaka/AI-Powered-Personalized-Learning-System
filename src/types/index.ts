export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title?: string;
  grade?: string;
  streakDays: number;
  dailyGoalMinutes: number;
  dailyGoalProgressMinutes: number;
  totalXp: number;
  level: number;
  learningStyle: 'Visual' | 'Hands-on Coding' | 'Theoretical' | 'Socratic';
  preferredDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';
  targetExam?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Artificial Intelligence' | 'Computer Science' | 'Data Structures' | 'Mathematics' | 'Cloud & Systems';
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  totalModules: number;
  completedModules: number;
  progressPercent: number;
  estimatedHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledStudentsCount: number;
  tags: string[];
  nextLesson?: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'interactive' | 'quiz' | 'code';
  };
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'code' | 'quiz' | 'interactive';
  summary?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  type: 'Interactive Lab' | 'Concept Deep Dive' | 'Practice Drill' | 'Video Masterclass' | 'Flashcard Deck';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  matchScore: number; // e.g. 96%
  aiReasoning: string;
  targetSkillGap: string;
  thumbnail: string;
  impactPotential: string; // e.g. "+15% Mastery expected"
  courseRefId?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptTag: string;
  hint: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  difficulty: string;
  xpEarned: number;
  weakTopicsDetected: string[];
  strongTopics: string[];
}

export interface WeakArea {
  id: string;
  topic: string;
  subject: string;
  masteryPercentage: number;
  benchmarkPercentage: number;
  criticalGaps: string[];
  status: 'Critical Focus' | 'Needs Practice' | 'Developing' | 'Nearly Mastered';
  suggestedAction: string;
  lastPracticed: string;
  whyWeakExplanation?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  durationMinutes: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  type: 'quiz' | 'reading' | 'coding' | 'review';
  aiSuggested?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedFollowUps?: string[];
  relatedTopic?: string;
}

export interface AnalyticsMetric {
  day: string;
  hours: number;
  quizzesTaken: number;
  avgAccuracy: number;
  focusScore: number;
}

export interface AdminStats {
  totalStudents: number;
  activeToday: number;
  averageMastery: number;
  coursesActive: number;
  totalQuestions: number;
  aiQueriesAnswered: number;
}

export interface DashboardSummary {
  student_name: string;
  student_title?: string;
  streak_days: number;
  daily_goal_minutes: number;
  daily_goal_progress_minutes: number;
  total_xp: number;
  level: number;
  overall_progress_pct: number;
  completed_modules_count: number;
  total_modules_count: number;
  recommended_next_lesson?: {
    id: string;
    title: string;
    course_id: string;
    course_title: string;
    duration: string;
    module_type: string;
    topic: string;
  };
  weekly_activity: AnalyticsMetric[];
  weak_topics: WeakArea[];
  upcoming_tasks: StudyTask[];
  active_courses: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    progressPercent: number;
    completedModules: number;
    totalModules: number;
    estimatedHours: number;
    nextLesson?: string;
  }[];
}
