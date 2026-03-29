import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './constants';
import { PublicShell } from './components/layout/PublicShell';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { ProgramSelectionPage } from './pages/public/ProgramSelectionPage';
import { ApplicationFormPage } from './pages/public/ApplicationFormPage';
import { ChatbotInterviewPage } from './pages/public/ChatbotInterviewPage';
import { SuccessPage } from './pages/public/SuccessPage';
import { LoginPage } from './pages/admin/LoginPage';
import { LeaderboardPage } from './pages/admin/LeaderboardPage';
import { CandidateDetailPage } from './pages/admin/CandidateDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicShell />}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.SELECT_PROGRAM} element={<ProgramSelectionPage />} />
          <Route path={ROUTES.APPLY} element={<ApplicationFormPage />} />
          <Route path={ROUTES.INTERVIEW} element={<ChatbotInterviewPage />} />
          <Route path={ROUTES.SUCCESS} element={<SuccessPage />} />
        </Route>

        <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />

        <Route
          path={ROUTES.ADMIN}
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<LeaderboardPage />} />
          <Route path="candidates/:id" element={<CandidateDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
