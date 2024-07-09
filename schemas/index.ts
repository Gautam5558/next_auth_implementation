import * as z from "zod";

export const loginFormschema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  // adding an optional field if 2FA is enabled for the 2FA code
  code: z.optional(z.string()),
});

export const registerFormschema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const ResetFormschema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum of 6 characters" }),
});
