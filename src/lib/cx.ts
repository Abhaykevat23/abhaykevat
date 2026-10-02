/** Joins class names, skipping falsy values. Safe to use in server and client components. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
