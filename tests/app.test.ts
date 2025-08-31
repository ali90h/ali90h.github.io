import { describe, it, expect } from "vitest";
describe("persistence keys", () => {
  it("stores mode and calm", () => {
    localStorage.setItem("mode","object");
    localStorage.setItem("calm","true");
    expect(localStorage.getItem("mode")).toBe("object");
    expect(localStorage.getItem("calm")).toBe("true");
  });
});
