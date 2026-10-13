import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/seo";

describe("pageMeta", () => {
  const m = pageMeta({ title: "FAQs", description: "Answers.", path: "/faq" });

  it("sets a canonical path", () => {
    expect(m.alternates?.canonical).toBe("/faq");
  });

  it("gives the page its own Open Graph card, not the home page's", () => {
    expect(m.openGraph).toMatchObject({ title: "FAQs · Forebytes", url: "/faq", description: "Answers." });
  });

  it("mirrors the card for Twitter", () => {
    expect(m.twitter).toMatchObject({ title: "FAQs · Forebytes", description: "Answers." });
  });
});
