export const LENGTH = 8;

export const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    .split("");

export function generateId(): string {
  return Array.from({ length: LENGTH }, (_, key) => key).reduce((str, _) => {
    const index = Math.floor(Math.random() * CHARS.length - 1) + 1;
    return str.concat(CHARS[index]);
  }, "");
}
