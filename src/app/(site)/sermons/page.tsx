import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSermonFacets, getSermonPage } from "@/lib/content";
import { parseSermonFilters, sermonListHref } from "@/lib/sermon-query";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { Pagination } from "@/components/site/pagination";
import { SermonCard } from "@/components/sermons/sermon-card";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseSermonFilters(await searchParams);
  const filtered = Boolean(filters.q || filters.speaker || filters.category || filters.page > 1);
  return {
    title: "Sermons",
    description: "Watch and listen to messages from Universal Trinity Ministry. Search by topic, speaker or scripture.",
    alternates: { canonical: "/sermons" },
    // Filtered and paginated variants are useful for visitors but not as separate search results.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

const selectClass =
  "h-12 w-full appearance-none border border-navy-900/20 bg-ivory-100 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><path d=%22M5 7l5 5 5-5%22 fill=%22none%22 stroke=%22%23101b2d%22 stroke-width=%221.5%22/></svg>')] bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pl-4 pr-10 text-[0.9375rem] text-navy-900 focus:border-navy-900";

export default async function SermonsPage({ searchParams }: Props) {
  const filters = parseSermonFilters(await searchParams);
  const [{ sermons, total, pageCount }, facets] = await Promise.all([getSermonPage(filters), getSermonFacets()]);
  const isFiltered = Boolean(filters.q || filters.speaker || filters.category);
  const libraryEmpty = total === 0 && !isFiltered;

  return (
    <>
      <PageHeader
        title="Sermons"
        intro="Watch or listen to recent messages, and search by topic, speaker or scripture."
        crumbs={[{ label: "Sermons", href: "/sermons" }]}
      />

      <section className="py-16 sm:py-20" aria-labelledby="sermon-list-heading">
        <Container>
          <h2 id="sermon-list-heading" className="sr-only">
            All messages
          </h2>
          {!libraryEmpty && (
            <form role="search" action="/sermons" method="get" className="grid gap-3 border-b border-line pb-10 md:grid-cols-[1fr_14rem_14rem_auto]">
              <div className="relative">
                <label htmlFor="sermon-q" className="sr-only">
                  Search sermons
                </label>
                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="sermon-q"
                  name="q"
                  type="search"
                  defaultValue={filters.q}
                  maxLength={100}
                  placeholder="Search by title, scripture or speaker"
                  className="h-12 w-full border border-navy-900/20 bg-ivory-100 pl-11 pr-4 text-[0.9375rem] text-navy-900 placeholder:text-muted focus:border-navy-900"
                />
              </div>
              <div>
                <label htmlFor="sermon-speaker" className="sr-only">
                  Speaker
                </label>
                <select id="sermon-speaker" name="speaker" defaultValue={filters.speaker ?? ""} className={selectClass}>
                  <option value="">All speakers</option>
                  {facets.speakers.map((speaker) => (
                    <option key={speaker.id} value={speaker.slug}>
                      {speaker.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sermon-category" className="sr-only">
                  Series or category
                </label>
                <select id="sermon-category" name="category" defaultValue={filters.category ?? ""} className={selectClass}>
                  <option value="">All categories</option>
                  {facets.categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={buttonClasses("navy", "!min-h-12")}>
                Search
              </button>
            </form>
          )}

          {isFiltered && (
            <p role="status" className="mt-8 flex flex-wrap items-center gap-4 text-muted">
              <span>
                {total} {total === 1 ? "message" : "messages"} found
              </span>
              <Link href="/sermons" className="font-semibold text-navy-900 underline decoration-gold-ink underline-offset-4">
                Clear filters
              </Link>
            </p>
          )}

          {libraryEmpty ? (
            <EmptyState
              title="No sermons yet"
              action={
                <ButtonLink href="/plan-your-visit" variant="outline">
                  Join us in person
                </ButtonLink>
              }
            >
              Recorded messages will appear here as they are published. Until then, we would love to see you at a service.
            </EmptyState>
          ) : sermons.length === 0 ? (
            <div className="mt-12">
              <EmptyState title="No messages match your search">Try a different word, or clear the filters to see every message.</EmptyState>
            </div>
          ) : (
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <li key={sermon.id} className="reveal">
                  <SermonCard sermon={sermon} />
                </li>
              ))}
            </ul>
          )}

          <Pagination page={filters.page} pageCount={pageCount} hrefForPage={(page) => sermonListHref({ ...filters, page })} />
        </Container>
      </section>
    </>
  );
}
