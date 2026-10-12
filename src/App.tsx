import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AIDrawer } from './components/layout/AIDrawer';
import { ToastContainer } from './components/layout/ToastContainer';
import { CourseModal } from './components/common/CourseModal';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { QuizPage } from './pages/QuizPage';
import { AIChatPage } from './pages/AIChatPage';
import { MasteryPage } from './pages/MasteryPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const MainAppContent: React.FC = () => {
  const { currentPage } = useApp();

  // If on Auth page, render without standard sidebar for focused login experience
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">
          <AuthPage />
        </main>
        <ToastContainer />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'courses':
        return <CoursesPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'ai-chat':
        return <AIChatPage />;
      case 'mastery':
        return <MasteryPage />;
      case 'planner':
        return <StudyPlannerPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Slide-Over AI Tutor Drawer */}
      <AIDrawer />

      {/* Global Course Syllabus Modal */}
      <CourseModal />

      {/* Toast Alerts System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
