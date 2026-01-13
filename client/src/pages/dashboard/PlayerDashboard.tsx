import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";

export default function PlayerDashobard(){

    const { logout } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate(`/register`);  //we still do not have login
    }

    return(<div>
        <h1>Welcome to player dashboard!</h1>
        <button onClick={logoutHandler}>Log out</button>
    </div>);
}