// Generates a unique ID for local/demo records.
// Uses the browser's native UUID generator when available,
// with a fallback for older environments.

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x"
        ? random
        : (random & 0x3) | 0x8;

      return value.toString(16);
    }
  );
}