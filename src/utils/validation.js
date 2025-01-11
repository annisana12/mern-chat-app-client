import * as Yup from "yup";

// Validate
export const validateForm = async (schema, payload, setErrors) => {
    try {
        await schema.validate(payload, { abortEarly: false });

        setErrors({});
        return true;
    } catch (error) {
        const newState = error.inner.reduce((acc, current) => {
            if (!acc[current.path]) acc[current.path] = current.message;
            return acc;
        }, {});

        setErrors(newState);
        return false;
    }
}

// Schema
export const registerSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .trim()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
});

export const loginSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .trim()
        .required("Password is required")
});

export const setupProfileSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Name is required")
});