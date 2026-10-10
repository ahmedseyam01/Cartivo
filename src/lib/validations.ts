import { z } from "zod";

const email = z.email("Enter a valid email address");

const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/\d/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character");

export const egyptianPhone = z
  .string()
  .trim()
  .regex(/^(\+2|002)?01[0125]\d{8}$/, "Enter a valid Egyptian mobile number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email,
    password: strongPassword,
    rePassword: z.string(),
    phone: egyptianPhone,
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "Passwords don't match" });

export const forgotPasswordSchema = z.object({ email });

export const resetCodeSchema = z.object({
  resetCode: z.string().trim().regex(/^\d{4,6}$/, "Enter the code from your email"),
});

export const resetPasswordSchema = z
  .object({ newPassword: strongPassword, confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

export const profileSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email,
  phone: egyptianPhone.or(z.literal("")),
});

/** Only changed fields are sent: the API rejects re-submitting your current email. */
export const profileUpdateSchema = profileSchema
  .partial()
  .refine((v) => Object.values(v).some(Boolean), { message: "Nothing to update" });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: strongPassword,
    rePassword: z.string(),
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "Passwords don't match" });

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Give this address a label, e.g. Home"),
  city: z.string().trim().min(2, "City is required"),
  details: z.string().trim().min(5, "Add street, building and apartment"),
  phone: egyptianPhone,
});

export const shippingSchema = addressSchema.omit({ name: true });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email,
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters)"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type AddressValues = z.infer<typeof addressSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
