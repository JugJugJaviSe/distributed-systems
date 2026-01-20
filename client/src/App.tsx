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

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage authApi={authApi} />} />
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route path="/Player-dashboard" element={
        <ProtectedRoute requiredRole="Player"><PlayerDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} /></ProtectedRoute>
      } />

      <Route path="/Admin-dashboard" element={
        <ProtectedRoute requiredRole="Admin"><AdminDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} /></ProtectedRoute>
      } />

      <Route path="/Moderator-dashboard" element={
        <ProtectedRoute requiredRole="Moderator"><ModeratorDashboard cloudinaryApi={cloudinaryApi} usersApi={usersApi} /></ProtectedRoute>
      } />

      <Route path="/Admin/users" element={
        <ProtectedRoute requiredRole="Admin"><AdminUsersPage adminApi={adminApi} /></ProtectedRoute>
      } />

          <Route
              path="/quizzes/create"
              element={
                  <ProtectedRoute requiredRole="Moderator">
                      <CreateQuizPage quizApi={quizApi} />
                  </ProtectedRoute>
              }
          />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
