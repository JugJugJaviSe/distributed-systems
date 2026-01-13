import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";

export default function AdminDashobard(){

    const { logout } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate(`/login`);
    }

    return(<div>
        <h1>Welcome to admin dashboard!</h1>
        <button onClick={logoutHandler}>Log out</button>
    </div>);
}