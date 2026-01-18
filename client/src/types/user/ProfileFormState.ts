export type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: "" | "Male" | "Female";
  country: string;
  street: string;
  streetNumber: string;
};