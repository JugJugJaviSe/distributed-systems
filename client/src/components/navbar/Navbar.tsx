import { useNavigate } from "react-router-dom";
import { NAVBAR_ITEMS } from "./navbarConfig";
import { useAuth } from "../../hooks/UseAuthHook";

interface NavbarProps {
    onProfileClick?: () => void;
}

export function Navbar({ onProfileClick }: NavbarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    const items = NAVBAR_ITEMS[user.role];

    return (
        <nav className="w-full px-6 py-4 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 shadow-md mb-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left */}
                <div className="flex gap-6">
                    {items.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="text-gray-300 hover:text-white transition-colors duration-150 font-medium"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Right */}
                <div className="flex gap-4">
                    {onProfileClick && (
                        <button
                            onClick={onProfileClick}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100 transition-all duration-150"
                        >
                            Profile
                        </button>
                    )}

                    <button
                        onClick={logoutHandler}
                        className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded-lg text-white transition-all duration-150"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </nav>
    );
}