import { z } from "zod";

// Messages are keys of `t.validation` in the dictionaries; the forms translate them.

const email = z.email("email");

const strongPassword = z
  .string()
  .min(8, "min8")
  .regex(/[a-z]/, "lower")
  .regex(/[A-Z]/, "upper")
  .regex(/\d/, "number")
  .regex(/[^A-Za-z0-9]/, "special");

const egyptianPhone = z
  .string()
  .trim()
  .regex(/^(\+2|002)?01[0125]\d{8}$/, "phone");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "passwordRequired"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "name"),
    email,
    password: strongPassword,
    rePassword: z.string(),
    phone: egyptianPhone,
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "mismatch" });

export const forgotPasswordSchema = z.object({ email });

export const resetCodeSchema = z.object({
  resetCode: z.string().trim().regex(/^\d{4,6}$/, "code"),
});

export const resetPasswordSchema = z
  .object({ newPassword: strongPassword, confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "mismatch" });

export const profileSchema = z.object({
  name: z.string().trim().min(3, "name"),
  email,
  phone: egyptianPhone.or(z.literal("")),
});

/** Only changed fields are sent: the API rejects re-submitting your current email. */
export const profileUpdateSchema = profileSchema
  .partial()
  .refine((v) => Object.values(v).some(Boolean), { message: "nothing" });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPassword"),
    password: strongPassword,
    rePassword: z.string(),
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "mismatch" });

export const addressSchema = z.object({
  name: z.string().trim().min(2, "label"),
  city: z.string().trim().min(2, "city"),
  details: z.string().trim().min(5, "details"),
  phone: egyptianPhone,
});

export const shippingSchema = addressSchema.omit({ name: true });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired"),
  email,
  message: z.string().trim().min(10, "message"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type AddressValues = z.infer<typeof addressSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
