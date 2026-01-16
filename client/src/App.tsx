import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import PlayerDashboard from "./pages/dashboard/PlayerDashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import { authApi } from "./api_services/auth_api/AuthAPIService";
import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import { adminApi } from "./api_services/admin_api/AdminAPIService";
import { cloudinaryApi } from "./api_services/cloudinary_image_api/CloudinaryImageAPIService";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage authApi={authApi} />} />
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route path="/Player-dashboard" element={
        <ProtectedRoute requiredRole="Player"><PlayerDashboard cloudinaryApi={cloudinaryApi} /></ProtectedRoute>
      } />

      <Route path="/Admin-dashboard" element={
        <ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>
      } />

      <Route path="/Admin/users" element={
        <ProtectedRoute requiredRole="Admin"><AdminUsersPage adminApi={adminApi} /></ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
