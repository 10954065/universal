import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it.each([
    ["Women's Fellowship!", "womens-fellowship"],
    ["Café Évangélique", "cafe-evangelique"],
    ["  --Hello   World--  ", "hello-world"],
    ["Psalm 23: The Lord Is My Shepherd", "psalm-23-the-lord-is-my-shepherd"],
    ["!!!", ""],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("caps length at 80 characters without a trailing hyphen", () => {
    const slug = slugify(`${"word ".repeat(40)}end`);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("uniqueSlug", () => {
  const taken = (slugs: string[]) => async (slug: string) => slugs.includes(slug);

  it("returns the base slug when it is free", async () => {
    expect(await uniqueSlug("Youth Camp", taken([]))).toBe("youth-camp");
  });

  it("appends the first free number", async () => {
    expect(await uniqueSlug("Youth Camp", taken(["youth-camp", "youth-camp-2"]))).toBe("youth-camp-3");
  });

  it("falls back to 'item' when the title has no usable characters", async () => {
    expect(await uniqueSlug("???", taken([]))).toBe("item");
  });
});
