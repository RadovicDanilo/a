import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(32, "Username cannot exceed 32 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password cannot exceed 128 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(32, "Username cannot exceed 32 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password cannot exceed 128 characters"),
});
