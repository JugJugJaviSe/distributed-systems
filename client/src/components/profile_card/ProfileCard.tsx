import { useState } from "react";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { CloudinaryImageResponse } from "../../types/cloudinary/CloudinaryImageResponse";
import { useAuth } from "../../hooks/UseAuthHook";

interface ProfileCardProps {
  setShowProfile: (value: boolean) => void;
  cloudinaryApi: ICloudinariImageAPIService;
}

export function ProfileCard({ setShowProfile, cloudinaryApi }: ProfileCardProps) {
  const auth = {
    user: {
      first_name: "Aleksandar",
      last_name: "Jugovic",
      email: "jugovica205@gmail.com",
      date_of_birth: "01-01-2001",
      gender: "Male",
      profile_picture_url:
        "https://res.cloudinary.com/dqwnmmkwj/image/upload/v1768596065/drs_profile_pictures/user_1.jpg",
      country: "Serbia",
      street: "Dalmatinska",
      street_number: "58",
      role: "Player",
    },
  };

  const {
    first_name,
    last_name,
    email,
    date_of_birth,
    gender,
    country,
    street,
    street_number,
    role,
  } = auth.user;

  const [profilePicture, setProfilePicture] = useState(auth.user.profile_picture_url);
  const [loading, setLoading] = useState(false);
  const {token}  = useAuth();

  const handleChangePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    setLoading(true);
    try {
      const res: CloudinaryImageResponse = await cloudinaryApi.addOrChangeImage(file, token!);
      if (res.success) {
        setProfilePicture(res.data.url);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="profile-card"
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        width: "300px",
        textAlign: "center",
        position: "relative",
      }}
    >

      <img
        src={profilePicture}
        alt={`${first_name} ${last_name}`}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "1rem",
        }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#3498db",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {loading ? "Uploading..." : "Change Picture"}
          <input
            type="file"
            accept="image/*"
            onChange={handleChangePicture}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <h2>
        {first_name} {last_name}
      </h2>
      <p>First Name: {first_name}</p>
      <p>Last Name: {last_name}</p>
      <p>Email: {email}</p>
      <p>Date of Birth: {date_of_birth}</p>
      <p>Gender: {gender}</p>
      <p>Country: {country}</p>
      <p>Street: {street}</p>
      <p>Street Number: {street_number}</p>
      <p>Role: {role}</p>

      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => setShowProfile(false)}
      >
        Close
      </button>
    </div>
  );
}
