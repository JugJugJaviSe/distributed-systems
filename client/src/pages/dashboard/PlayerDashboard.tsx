import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";

interface PlayerDashboardProps{
  cloudinaryApi: ICloudinariImageAPIService;
}

export default function PlayerDashboard({cloudinaryApi}: PlayerDashboardProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate(`/login`);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <div className="dashboard">
      <h1>Welcome to player dashboard!</h1>

      <button className="button button-blue" onClick={toggleProfile}>
        {showProfile ? "Hide Profile" : "Show Profile"}
      </button>

      <button className="button button-red" onClick={logoutHandler}>
        Log out
      </button>

      {showProfile && (
        <div className="modal-backdrop">
          <ProfileCard setShowProfile={setShowProfile} cloudinaryApi={cloudinaryApi}/>
        </div>
      )}
    </div>
  );
}
