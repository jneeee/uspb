import { assertEquals } from "$std/assert/mod.ts";
import Alert from "./Alert.tsx";

Deno.test("Alert component should handle undefined message", () => {
  const result = Alert({ message: undefined });
  assertEquals(result, null);
});

Deno.test("Alert component should return article element with message", () => {
  const testMessage = "Test alert message";
  const result = Alert({ message: testMessage });
  
  assertEquals(result?.type, "article");
  assertEquals(result?.props.children, testMessage);
});

Deno.test("Alert component should handle empty string", () => {
  const result = Alert({ message: "" });
  
  assertEquals(result?.type, "article");
  assertEquals(result?.props.children, "");
});
