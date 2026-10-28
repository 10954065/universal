import { describe, expect, it } from "vitest";
import { buildSermonWhere, parseSermonFilters, sermonListHref } from "@/lib/sermon-query";

describe("parseSermonFilters", () => {
  it("defaults to the first page with no filters", () => {
    expect(parseSermonFilters({})).toEqual({ page: 1 });
  });

  it("keeps valid filters", () => {
    expect(parseSermonFilters({ q: " grace ", speaker: "pastor-mensah", category: "faith", page: "3" })).toEqual({
      q: "grace",
      speaker: "pastor-mensah",
      category: "faith",
      page: 3,
    });
  });

  it("drops invalid values instead of throwing", () => {
    expect(parseSermonFilters({ speaker: "Robert'); DROP TABLE", category: "<script>", page: "abc" })).toEqual({ page: 1 });
    expect(parseSermonFilters({ page: "0" }).page).toBe(1);
    expect(parseSermonFilters({ page: "99999" }).page).toBe(1);
    expect(parseSermonFilters({ q: "x".repeat(101) }).q).toBeUndefined();
  });

  it("uses the first value when a parameter is repeated", () => {
    expect(parseSermonFilters({ page: ["2", "5"] }).page).toBe(2);
  });
});

describe("buildSermonWhere", () => {
  it("always restricts the public library to published sermons", () => {
    expect(buildSermonWhere({ page: 1 })).toEqual({ AND: [{ status: "PUBLISHED" }] });
    const where = buildSermonWhere({ page: 1, q: "hope", speaker: "a", category: "b" });
    expect(where.AND).toEqual(expect.arrayContaining([{ status: "PUBLISHED" }, { speaker: { slug: "a" } }, { category: { slug: "b" } }]));
  });

  it("searches title, summary, scripture and speaker case-insensitively", () => {
    const where = buildSermonWhere({ page: 1, q: "Hope" });
    const search = (where.AND as object[]).find((clause) => "OR" in clause) as { OR: object[] };
    expect(search.OR).toHaveLength(4);
    expect(search.OR[0]).toEqual({ title: { contains: "Hope", mode: "insensitive" } });
  });
});

describe("sermonListHref", () => {
  it("builds clean URLs and omits the first page", () => {
    expect(sermonListHref({})).toBe("/sermons");
    expect(sermonListHref({ page: 1 })).toBe("/sermons");
    expect(sermonListHref({ q: "grace", page: 2 })).toBe("/sermons?q=grace&page=2");
    expect(sermonListHref({ q: "holy spirit" })).toBe("/sermons?q=holy+spirit");
  });
});
