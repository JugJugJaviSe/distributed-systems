import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";

interface ModeratorDashboardProps {
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
}

export default function ModeratorDashboard({
  cloudinaryApi,
  usersApi,
}: ModeratorDashboardProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 backdrop-blur-sm text-gray-100 p-6 flex flex-col items-center justify-start space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome to moderator dashboard!</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={toggleProfile}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          {showProfile ? "Hide Profile" : "Show Profile"}
        </button>

        <button
          onClick={logoutHandler}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Log out
        </button>
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <ProfileCard
            setShowProfile={setShowProfile}
            cloudinaryApi={cloudinaryApi}
            usersApi={usersApi}
          />
        </div>
      )}
    </div>
  );
}
