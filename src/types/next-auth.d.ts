import type { User as AppUser } from "./user";

declare module "next-auth" {
  interface User extends AppUser {
    accessToken: string;
  }

  interface Session {
    user: AppUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: AppUser;
  }
}
