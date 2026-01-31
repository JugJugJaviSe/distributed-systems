import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import { Navbar } from "../../components/navbar/Navbar";

interface PlayerDashboardProps {
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
}

export default function PlayerDashboard({ cloudinaryApi, usersApi }: PlayerDashboardProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-900 backdrop-blur-sm text-gray-100 flex flex-col items-center justify-start">
      <Navbar onProfileClick={() => setShowProfile(true)} />
      <div className="w-full flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold">Quizzes</h1>
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
