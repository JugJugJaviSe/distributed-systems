import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/UseAuthHook";
import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { AdminUsersList } from "../../components/admin/AdminUsersList";

import type { AdminUsersProps } from "../../types/admin/AdminUsersPageProps";

export default function AdminUsersPage({ adminApi }: AdminUsersProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "Admin") {
      navigate(`/${user.role}-dashboard`);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading || !user || user.role !== "Admin") return null;

  return (
    <DashboardLayout navbar={<Navbar />}>
     
      <div className="w-full max-w-5xl px-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
      </div>

      <div className="w-full max-w-5xl px-6">
        <AdminUsersList adminApi={adminApi} />
      </div>
    </DashboardLayout>
  );
}
