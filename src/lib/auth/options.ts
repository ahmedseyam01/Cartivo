import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@/lib/config";
import type { AuthResponse } from "@/types/user";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${API_URL}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.token) {
          throw new Error(payload?.message ?? "Incorrect email or password");
        }

        const { token, user } = payload as AuthResponse;
        const { id } = jwtDecode<{ id: string }>(token);

        return { ...user, id, accessToken: token };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = { id: user.id, name: user.name ?? "", email: user.email ?? "", role: user.role };
      }
      // Lets the client refresh the visible profile after "update my info".
      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...pickProfile(session.user) };
      }
      return token;
    },
    // The access token never leaves the server: the session only exposes the profile.
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

function pickProfile(input: Record<string, unknown>) {
  const profile: { name?: string; email?: string } = {};
  if (typeof input.name === "string") profile.name = input.name;
  if (typeof input.email === "string") profile.email = input.email;
  return profile;
}
