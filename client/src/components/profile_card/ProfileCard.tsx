import { useEffect, useMemo, useState } from "react";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { CloudinaryImageResponse } from "../../types/cloudinary/CloudinaryImageResponse";
import { useAuth } from "../../hooks/UseAuthHook";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { UserDto } from "../../models/UserDto";

interface ProfileCardProps {
  setShowProfile: (value: boolean) => void;
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
}

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: "" | "Male" | "Female";
  country: string;
  street: string;
  streetNumber: string;
};

export function ProfileCard({
  setShowProfile,
  cloudinaryApi,
  usersApi,
}: ProfileCardProps) {
  const { token } = useAuth();

  const [profile, setProfile] = useState<UserDto | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    street: "",
    streetNumber: "",
  });

  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    display: "block",
    boxSizing: "border-box",
    padding: "0.6rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#3b3b3b",
    color: "white",
    outline: "none",
  };

  const hasChanges = useMemo(() => {
    if (!profile) return false;
    return (
      profile.firstName !== form.firstName ||
      profile.lastName !== form.lastName ||
      profile.email !== form.email ||
      profile.dateOfBirth !== form.dateOfBirth ||
      (profile.gender ?? "") !== form.gender ||
      profile.country !== form.country ||
      profile.street !== form.street ||
      profile.streetNumber !== form.streetNumber
    );
  }, [profile, form]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setError("Missing auth token");
        return;
      }

      setLoadingProfile(true);
      setError("");

      const res = await usersApi.getMe(token);
      if (!res.success || !res.data) {
        setError(res.message || "Failed to fetch profile");
        setProfile(null);
        setProfilePicture("");
        setLoadingProfile(false);
        return;
      }

      const dto = res.data;

      setProfile(dto);
      setProfilePicture(dto.profilePictureUrl ?? "");

      setForm({
        firstName: dto.firstName ?? "",
        lastName: dto.lastName ?? "",
        email: dto.email ?? "",
        dateOfBirth: dto.dateOfBirth ?? "",
        gender: (dto.gender === "Male" || dto.gender === "Female"
          ? dto.gender
          : "") as ProfileFormState["gender"],
        country: dto.country ?? "",
        street: dto.street ?? "",
        streetNumber: dto.streetNumber ?? "",
      });

      setLoadingProfile(false);
    };

    fetchMe();
  }, [token, usersApi]);

  const onChange =
    (field: keyof Omit<ProfileFormState, "gender" | "dateOfBirth">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }));
  };

  const onGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      gender: e.target.value as ProfileFormState["gender"],
    }));
  };

  const handleChangePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!token) {
      alert("Missing auth token");
      return;
    }

    const file = e.target.files[0];

    setLoadingPicture(true);
    try {
      const res: CloudinaryImageResponse = await cloudinaryApi.addOrChangeImage(
        file,
        token
      );

      if (res.success) {
        setProfilePicture(res.data.url);
        setProfile((prev) =>
          prev ? { ...prev, profilePictureUrl: res.data.url } : prev
        );
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setLoadingPicture(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      alert("Missing auth token");
      return;
    }
    if (!profile) return;

    // Gender constraint
    if (form.gender && form.gender !== "Male" && form.gender !== "Female") {
      setError("Gender must be Male or Female");
      return;
    }

    setSaving(true);
    setError("");

    const updates: Partial<UserDto> = {};
    if (profile.firstName !== form.firstName) updates.firstName = form.firstName;
    if (profile.lastName !== form.lastName) updates.lastName = form.lastName;
    if (profile.email !== form.email) updates.email = form.email;
    if (profile.dateOfBirth !== form.dateOfBirth)
      updates.dateOfBirth = form.dateOfBirth;
    if ((profile.gender ?? "") !== form.gender) updates.gender = form.gender;
    if (profile.country !== form.country) updates.country = form.country;
    if (profile.street !== form.street) updates.street = form.street;
    if (profile.streetNumber !== form.streetNumber)
      updates.streetNumber = form.streetNumber;

    const res = await usersApi.updateMe(token, updates);

    if (!res.success || !res.data) {
      setError(res.message || "Failed to save profile");
      setSaving(false);
      return;
    }

    const dto = res.data;
    setProfile(dto);

    setForm({
      firstName: dto.firstName ?? "",
      lastName: dto.lastName ?? "",
      email: dto.email ?? "",
      dateOfBirth: dto.dateOfBirth ?? "",
      gender: (dto.gender === "Male" || dto.gender === "Female"
        ? dto.gender
        : "") as ProfileFormState["gender"],
      country: dto.country ?? "",
      street: dto.street ?? "",
      streetNumber: dto.streetNumber ?? "",
    });

    setSaving(false);
  };

  if (loadingProfile) {
    return (
      <div
        className="profile-card"
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          width: "340px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="profile-card"
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          width: "340px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
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

  if (!profile) return null;

  return (
    <div
      className="profile-card"
      style={{
        border: "1px solid #ccc",
        padding: "1.25rem",
        borderRadius: "8px",
        width: "340px",
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <img
        src={profilePicture}
        alt={`${form.firstName} ${form.lastName}`}
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
          {loadingPicture ? "Uploading..." : "Change Picture"}
          <input
            type="file"
            accept="image/*"
            onChange={handleChangePicture}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <h2 style={{ marginBottom: "0.75rem" }}>
        {form.firstName} {form.lastName}
      </h2>

      <div style={{ display: "grid", gap: "0.6rem", textAlign: "left" }}>
        <label>
          First Name
          <input
            value={form.firstName}
            onChange={onChange("firstName")}
            style={inputStyle}
          />
        </label>

        <label>
          Last Name
          <input
            value={form.lastName}
            onChange={onChange("lastName")}
            style={inputStyle}
          />
        </label>

        <label>
          Email
          <input value={form.email} onChange={onChange("email")} style={inputStyle} />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={form.dateOfBirth}
            required
            onChange={onDateChange}
            style={inputStyle}
          />
        </label>

        <label>
          Gender
          <select value={form.gender} onChange={onGenderChange} style={inputStyle}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>

        <label>
          Country
          <input
            value={form.country}
            onChange={onChange("country")}
            style={inputStyle}
          />
        </label>

        <label>
          Street
          <input value={form.street} onChange={onChange("street")} style={inputStyle} />
        </label>

        <label>
          Street Number
          <input
            value={form.streetNumber}
            onChange={onChange("streetNumber")}
            style={inputStyle}
          />
        </label>

        <div style={{ textAlign: "left", marginTop: "0.25rem" }}>
          <strong>Role:</strong> {profile.role}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <button
          disabled={!hasChanges || saving}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: !hasChanges || saving ? "#95a5a6" : "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !hasChanges || saving ? "not-allowed" : "pointer",
            minWidth: "120px",
          }}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            minWidth: "120px",
          }}
          onClick={() => setShowProfile(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
