import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import PlayerDashboard from "./pages/dashboard/PlayerDashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import { authApi } from "./api_services/auth_api/AuthAPIService";
import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ModeratorDashboard from "./pages/dashboard/ModeratorDashboard";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import { adminApi } from "./api_services/admin_api/AdminAPIService";
import { cloudinaryApi } from "./api_services/cloudinary_image_api/CloudinaryImageAPIService";
import { usersApi } from "./api_services/users_api/UsersAPIService";
import CreateQuizPage from "./pages/quiz/CreateQuizPage";
import { quizApi } from "./api_services/quiz_api/QuizAPIService";
import { quizExecutionApi } from "./api_services/quiz_execution_api/QuizExecutionAPIService";
import { QuizPlayPage } from "./pages/quiz_execution/QuizPlayPage";
import EditQuizPage from "./pages/quiz/EditQuizPage";
import QuizReviewPage from "./pages/quiz/QuizReviewPage";
import QuizzesForReviewPage from "./pages/quiz/QuizzesForReviewPage";
import LeaderboardHomePage from "./pages/leaderboard/LeaderboardHomePage";
import QuizLeaderboardPage from "./pages/leaderboard/QuizLeaderboardPage";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage authApi={authApi} />} />
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route path="/Player-dashboard" element={
        <ProtectedRoute requiredRole="Player"><PlayerDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} /></ProtectedRoute>
      } />

      <Route path="/Admin-dashboard" element={
        <ProtectedRoute requiredRole="Admin"><AdminDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} adminApi={adminApi} /></ProtectedRoute>
      } />

      <Route path="/Moderator-dashboard" element={
        <ProtectedRoute requiredRole="Moderator"><ModeratorDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} /></ProtectedRoute>
      } />

      <Route path="/Admin/users" element={
        <ProtectedRoute requiredRole="Admin"><AdminUsersPage adminApi={adminApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} /></ProtectedRoute>
      } />

      <Route path="/quiz/play/:quizId" element={
        <ProtectedRoute requiredRole="Player"><QuizPlayPage quizApi={quizApi} executionApi={quizExecutionApi} /></ProtectedRoute>
      } />

      <Route
        path="/quiz/create"
        element={
          <ProtectedRoute requiredRole="Moderator">
            <CreateQuizPage quizApi={quizApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Admin/pendingQuizzes"
        element={
          <ProtectedRoute requiredRole="Admin">
            <QuizzesForReviewPage quizApi={quizApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/quizzes/:quizId"
        element={
          <ProtectedRoute requiredRole="Admin">
            <QuizReviewPage cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/edit/:quizId"
        element={
          <ProtectedRoute requiredRole="Moderator">
            <EditQuizPage quizApi={quizApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute requiredRole="">
            <LeaderboardHomePage cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:quizId/leaderboard"
        element={
          <ProtectedRoute requiredRole="">
            <QuizLeaderboardPage cloudinaryApi={cloudinaryApi} usersApi={usersApi} quizApi={quizApi} />
          </ProtectedRoute>
        }
      />


      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
}

export default App;
