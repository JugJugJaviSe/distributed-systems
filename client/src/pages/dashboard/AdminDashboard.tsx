import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";

export default function AdminDashobard(){

    const { logout } = useAuth();
    const navigate = useNavigate();

    const goToAdminUsersPage = () => {
        navigate(`/Admin/users`);
    }

    const logoutHandler = () => {
        logout();
        navigate(`/login`);
    }

    return(<div>
        <h1>Welcome to admin dashboard!</h1>
        <button
        onClick={goToAdminUsersPage}
        style={{ padding: "10px 16px", margin:"10px" }}
        >
        Users page
        </button>

        <button
        onClick={logoutHandler}
        style={{ padding: "10px 16px", margin:"10px" }}
        >
        Log out
        </button>

    </div>);
}