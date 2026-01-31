import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { AdminUsersList } from "../../components/admin/AdminUsersList";
import type { AdminUsersProps } from "../../types/admin/AdminUsersPageProps";
import { Navbar } from "../../components/navbar/Navbar";

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

    if (isLoading || !user || user.role !== "Admin") {
        return null;
    }

    return (
        <main className="min-h-screen w-full bg-gray-900 backdrop-blur-sm text-gray-100 p-6">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6 text-center">
                Administrator User Management
            </h1>
            <AdminUsersList adminApi={adminApi} />
        </main>
    );
}
