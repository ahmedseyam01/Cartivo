export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: Omit<User, "id">;
}

/** Discriminated result returned by every server action. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; unauthorized?: boolean };
