import { createBrowserRouter } from 'react-router';
import { ProtectedLayout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ChaptersPage } from './pages/ChaptersPage';
import { QuizPage } from './pages/QuizPage';
import { ChatPage } from './pages/ChatPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExamPage } from './pages/ExamPage';

export const router = createBrowserRouter([
  // Public routes
  { path: '/', Component: LandingPage },
  { path: '/auth', Component: AuthPage },

  // Protected routes (wrapped with auth guard + navbar)
  {
    Component: ProtectedLayout,
    children: [
      { path: '/dashboard', Component: DashboardPage },
      { path: '/subjects', Component: SubjectsPage },
      { path: '/subjects/:subjectId', Component: ChaptersPage },
      { path: '/quiz/:subjectId/:chapterId', Component: QuizPage },
      { path: '/chat', Component: ChatPage },
      { path: '/leaderboard', Component: LeaderboardPage },
      { path: '/profile', Component: ProfilePage },
      { path: '/exam', Component: ExamPage },
    ],
  },
]);
