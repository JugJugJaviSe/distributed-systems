import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/UseAuthHook";
import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import { RegisterForm } from "../../components/auth/RegisterForm";

interface RegisterPageProps {
  authApi: IAuthAPIService;
}

export default function RegisterPage({ authApi }: RegisterPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user){
        console.log(`User role: ${user?.role} ${user.email} ${user.id}`);
      navigate(`/${user.role}-dashboard`);
    }
  
  }, [isAuthenticated, navigate, user]);

  return (
    <main>
      <RegisterForm authApi={authApi} />
    </main>
  );
}