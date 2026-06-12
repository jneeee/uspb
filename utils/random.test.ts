import { assertEquals, assertNotEquals } from "$std/assert/mod.ts";
import { generateId, LENGTH, CHARS } from "./random.ts";

Deno.test("generateId should return string with correct length", () => {
  const id = generateId();
  assertEquals(typeof id, "string");
  assertEquals(id.length, LENGTH);
});

Deno.test("generateId should return different ids on each call", () => {
  const id1 = generateId();
  const id2 = generateId();
  assertNotEquals(id1, id2);
});

Deno.test("generateId should only contain valid characters", () => {
  const id = generateId();
  for (const char of id) {
    const charIndex = CHARS.indexOf(char);
    assertEquals(charIndex >= 0, true, `Invalid character '${char}' found in id`);
  }
});

Deno.test("LENGTH constant should be 8", () => {
  assertEquals(LENGTH, 8);
});

Deno.test("CHARS should contain all alphanumeric characters", () => {
  const hasLowercase = CHARS.some(c => c >= 'a' && c <= 'z');
  const hasUppercase = CHARS.some(c => c >= 'A' && c <= 'Z');
  const hasDigits = CHARS.some(c => c >= '0' && c <= '9');
  
  assertEquals(hasLowercase, true, "CHARS should contain lowercase letters");
  assertEquals(hasUppercase, true, "CHARS should contain uppercase letters");
  assertEquals(hasDigits, true, "CHARS should contain digits");
});
