/** Only allow same-origin relative paths, so `callbackUrl` can't send users to another site. */
export function safeRedirect(target: string | null | undefined, fallback = "/") {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
