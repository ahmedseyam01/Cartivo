"use server";

import { z } from "zod";
import { authedAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { fetchAddresses } from "@/lib/api/account";
import {
  addressSchema,
  changePasswordSchema,
  profileUpdateSchema,
  type AddressValues,
  type ChangePasswordValues,
  type ProfileValues,
} from "@/lib/validations";
import type { Address } from "@/types/commerce";

export async function updateProfile(values: Partial<ProfileValues>) {
  return authedAction(async (token) => {
    const { user } = await api<{ user: { name: string; email: string } }>("/users/updateMe", {
      method: "PUT",
      body: Object.fromEntries(Object.entries(profileUpdateSchema.parse(values)).filter(([, v]) => v)),
      token,
    });
    return user;
  });
}

export async function changePassword(values: ChangePasswordValues) {
  return authedAction(async (token) => {
    await api("/users/changeMyPassword", { method: "PUT", body: changePasswordSchema.parse(values), token });
  });
}

export async function getAddresses() {
  return authedAction(fetchAddresses);
}

export async function addAddress(values: AddressValues) {
  return authedAction(
    async (token) =>
      (await api<{ data: Address[] }>("/addresses", { method: "POST", body: addressSchema.parse(values), token }))
        .data,
  );
}

export async function removeAddress(id: string) {
  const addressId = z.string().regex(/^[a-f\d]{24}$/i).parse(id);
  return authedAction(
    async (token) => (await api<{ data: Address[] }>(`/addresses/${addressId}`, { method: "DELETE", token })).data,
  );
}
