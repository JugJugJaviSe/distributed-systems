import type { ProfileFormState } from "../types/user/ProfileFormState";

export const validateChangeProfileDataForm = (form: ProfileFormState) => {
  const errors: Partial<Record<keyof ProfileFormState, string>> = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (form.firstName.length < 3) errors.firstName = "First name is too short";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";
  if (form.lastName.length < 3) errors.lastName = "Last name is too short";

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email address";
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    if (age < 13) errors.dateOfBirth = "You must be at least 13 years old";
  }

  if (!form.gender) {
    errors.gender = "Gender is required";
  } else if (form.gender !== "Male" && form.gender !== "Female") {
    errors.gender = "Gender must be Male or Female";
  }

  if (!form.country) errors.country = "Country is required.";
  if (form.country && form.country.length > 50) errors.country = "Country is too long";
  if (form.country && form.country.length < 2) errors.country = "Country is too short";

  if (!form.street) errors.street = "Street is required.";
  if (form.street && form.street.length > 100) errors.street = "Street is too long";
  if (form.street && form.street.length < 5) errors.street = "Street is too short";

  if (!form.streetNumber) errors.streetNumber = "Street number is required.";
  if (!form.streetNumber.trim()) errors.streetNumber = "Street number is required";
  if (form.streetNumber.length > 10)
    errors.streetNumber = "Street number is too long";

  return errors;
};
