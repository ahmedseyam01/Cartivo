import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

// next-auth uses the __Secure- prefix when served over HTTPS.
const SESSION_COOKIES = ["__Secure-next-auth.session-token", "next-auth.session-token"];

const getSessionToken = cache(async () => {
  const store = await cookies();
  const raw = SESSION_COOKIES.map((name) => store.get(name)?.value).find(Boolean);
  if (!raw || !process.env.NEXTAUTH_SECRET) return null;

  try {
    return await decode({ token: raw, secret: process.env.NEXTAUTH_SECRET });
  } catch {
    return null;
  }
});

/** The backend access token of the signed-in user, or null. Server only. */
export async function getAccessToken() {
  return (await getSessionToken())?.accessToken ?? null;
}

export async function getCurrentUser() {
  return (await getSessionToken())?.user ?? null;
}
