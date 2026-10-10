"use server";

import { z } from "zod";
import { safeAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { forgotPasswordSchema, registerSchema, resetCodeSchema, type RegisterValues } from "@/lib/validations";

export async function registerUser(values: RegisterValues) {
  return safeAction(async () => {
    await api("/auth/signup", { method: "POST", body: registerSchema.parse(values) });
  });
}

export async function requestPasswordReset(email: string) {
  return safeAction(async () => {
    await api("/auth/forgotPasswords", { method: "POST", body: forgotPasswordSchema.parse({ email }) });
  });
}

export async function verifyResetCode(resetCode: string) {
  return safeAction(async () => {
    await api("/auth/verifyResetCode", { method: "POST", body: resetCodeSchema.parse({ resetCode }) });
  });
}

export async function resetPassword(email: string, newPassword: string) {
  return safeAction(async () => {
    const body = z.object({ email: z.email(), newPassword: z.string().min(8) }).parse({ email, newPassword });
    await api("/auth/resetPassword", { method: "PUT", body });
  });
}
