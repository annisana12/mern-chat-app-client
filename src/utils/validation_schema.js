import * as Yup from "yup";

export const authSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .trim()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
});