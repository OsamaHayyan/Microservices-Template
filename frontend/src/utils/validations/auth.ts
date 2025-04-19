import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least 1 letter" })
    .regex(/[0-9]/, { message: "Password must contain at least 1 number" })
    .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least 1 special character"
    }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Please enter your password" }),
});