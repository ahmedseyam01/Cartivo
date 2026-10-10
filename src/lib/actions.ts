import "server-only";
import { ZodError } from "zod";
import type { ActionResult } from "@/types/user";
import { getAccessToken } from "./auth/session";

/** Errors are either API messages or keys of `t.validation` / `t.errors`, translated by the client. */
function toMessage(error: unknown) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? "invalid";
  if (error instanceof Error && error.message) return error.message;
  return "generic";
}

export async function safeAction<T>(run: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Runs `run` with the signed-in user's access token, or fails with `unauthorized`. */
export async function authedAction<T>(run: (token: string) => Promise<T>): Promise<ActionResult<T>> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "unauthorized", unauthorized: true };

  const result = await safeAction(() => run(token));
  if (!result.ok && /token|not logged|expired/i.test(result.error)) {
    return { ok: false, error: "unauthorized", unauthorized: true };
  }
  return result;
}
