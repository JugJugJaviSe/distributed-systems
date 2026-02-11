import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/UseAuthHook";
import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { AdminUsersList } from "../../components/admin/AdminUsersList";

import type { AdminUsersProps } from "../../types/admin/AdminUsersPageProps";
import { ProfileCard } from "../../components/profile_card/ProfileCard";

export default function AdminUsersPage({ adminApi, cloudinaryApi, usersApi }: AdminUsersProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

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
    <DashboardLayout navbar={<Navbar onProfileClick={() => setShowProfile(true)} />}>
      <div className="w-full max-w-5xl px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">
          User Management
        </h1>
      </div>

      <div className="w-full max-w-5xl px-6">
        <AdminUsersList adminApi={adminApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} />
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ProfileCard
            setShowProfile={setShowProfile}
            cloudinaryApi={cloudinaryApi}
            usersApi={usersApi}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
