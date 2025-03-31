
import { z } from 'zod';

// Name validation - 20-60 characters
export const nameSchema = z.string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name cannot exceed 60 characters");

// Address validation - max 400 characters
export const addressSchema = z.string()
  .max(400, "Address cannot exceed 400 characters");

// Password validation - 8-16 characters, one uppercase, one special character
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password cannot exceed 16 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    "Password must contain at least one special character"
  );

// Email validation
export const emailSchema = z.string()
  .email("Please enter a valid email address");

// Rating validation (1-5)
export const ratingSchema = z.number()
  .min(1, "Rating must be at least 1")
  .max(5, "Rating cannot exceed 5");

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

// Registration schema
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"]
});

// User creation schema (for admin)
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"], {
    required_error: "Role is required"
  })
});

// Store creation schema (for admin)
export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().min(1, "Store owner is required")
});
