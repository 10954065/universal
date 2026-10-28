import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { STATUS_OPTIONS } from "@/lib/admin-data";
import { requirePagePermission } from "@/lib/session";
import { savePageSection } from "@/server/admin/content-actions";
import { AdminForm, Field, Select, TextArea } from "@/components/admin/form";
import { AdminPage, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Page content" };

const PAGE_LABELS: Record<string, { label: string; href: string }> = {
  about: { label: "About Us", href: "/about" },
  visit: { label: "Plan Your Visit", href: "/plan-your-visit" },
  give: { label: "Give", href: "/give" },
  privacy: { label: "Privacy Policy", href: "/privacy" },
  terms: { label: "Terms & Conditions", href: "/terms" },
};

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function PageContentPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await searchParams;
  const sections = await db.pageSection.findMany({ orderBy: [{ page: "asc" }, { sortOrder: "asc" }] });
  const editing = sections.find((section) => section.id === id);
  const pages = Object.keys(PAGE_LABELS);

  return (
    <AdminPage
      title="Page content"
      description="Long-form text for the About, Plan Your Visit, Give and legal pages. Draft or empty sections are not shown to visitors."
    >
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <nav aria-label="Sections" className="space-y-6">
          {pages.map((page) => (
            <div key={page}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{PAGE_LABELS[page]!.label}</p>
              <ul className="mt-2 space-y-1">
                {sections
                  .filter((section) => section.page === page)
                  .map((section) => (
                    <li key={section.id}>
                      <Link
                        href={`/admin/pages?id=${section.id}`}
                        aria-current={section.id === id ? "page" : undefined}
                        className={`flex items-center justify-between gap-2 border px-3 py-2 text-sm ${section.id === id ? "border-navy-900 bg-white" : "border-transparent hover:border-line hover:bg-white"}`}
                      >
                        <span className="text-navy-900">{section.title}</span>
                        <StatusBadge status={section.status === "PUBLISHED" && section.body.trim() ? "PUBLISHED" : "DRAFT"} />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        <div>
          {editing ? (
            <Panel title={editing.title}>
              {editing.editorNote && (
                <div className="mb-6">
                  <Notice tone="warning">{editing.editorNote}</Notice>
                </div>
              )}
              <AdminForm action={savePageSection} key={editing.id}>
                <input type="hidden" name="id" value={editing.id} />
                <Field name="title" label="Section heading" required defaultValue={editing.title} maxLength={120} />
                <TextArea
                  name="body"
                  label="Content"
                  defaultValue={editing.body}
                  rows={16}
                  hint={
                    <>
                      Markdown formatting: blank line between paragraphs, <code>## Heading</code>, <code>- list item</code>, <code>**bold**</code>, <code>[link text](https://example.org)</code>.
                    </>
                  }
                />
                <Select name="status" label="Visibility" defaultValue={editing.status} options={STATUS_OPTIONS} />
              </AdminForm>
              <p className="mt-4 text-sm text-muted">
                Appears on{" "}
                <Link href={PAGE_LABELS[editing.page]?.href ?? "/"} target="_blank" className="underline underline-offset-4">
                  {PAGE_LABELS[editing.page]?.label ?? editing.page}
                </Link>
                .
              </p>
            </Panel>
          ) : (
            <Panel>
              <p className="text-muted">Choose a section on the left to edit it.</p>
            </Panel>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
