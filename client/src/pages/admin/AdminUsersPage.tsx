import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
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

    if (isLoading || !user || user.role !== "Admin") {
        return null;
    }

    return (
        <main>
            <h1>Administrator User Management</h1>
            <AdminUsersList adminApi={adminApi} />
        </main>
    );
}
