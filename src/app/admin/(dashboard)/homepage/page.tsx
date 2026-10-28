import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getMediaOptions } from "@/lib/admin-data";
import { requirePagePermission } from "@/lib/session";
import { saveHomepage } from "@/server/admin/content-actions";
import { AdminForm, Checkbox, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Homepage" };

export default async function AdminHomepagePage() {
  await requirePagePermission("content:manage");
  const [home, media, sermons] = await Promise.all([
    db.homepageContent.findUnique({ where: { id: 1 } }),
    getMediaOptions(),
    db.sermon.findMany({ where: { status: "PUBLISHED" }, orderBy: { preachedAt: "desc" }, select: { id: true, title: true }, take: 100 }),
  ]);

  return (
    <AdminPage title="Homepage" description="Edit the first impression visitors get. Wrap words in *asterisks* in a heading to give them the gold italic accent.">
      <AdminForm action={saveHomepage} submitLabel="Save homepage">
        <Panel title="Hero">
          <div className="space-y-5">
            <Notice tone="warning">The hero headline and welcome text are proposed copy. Please confirm or replace them with the ministry&apos;s own words.</Notice>
            <FormGrid>
              <Field name="heroEyebrow" label="Small label" required defaultValue={home?.heroEyebrow ?? "UNIVERSAL TRINITY MINISTRY"} maxLength={80} />
              <ImagePicker name="heroImageId" label="Hero image" media={media} defaultValue={home?.heroImageId} />
            </FormGrid>
            <Field name="heroHeading" label="Headline" required defaultValue={home?.heroHeading} maxLength={160} />
            <TextArea name="heroText" label="Supporting text" required defaultValue={home?.heroText} rows={3} maxLength={400} />
            <FormGrid>
              <Field name="primaryCtaLabel" label="Primary button label" required defaultValue={home?.primaryCtaLabel ?? "Plan Your Visit"} />
              <Field name="primaryCtaHref" label="Primary button link" required defaultValue={home?.primaryCtaHref ?? "/plan-your-visit"} hint="A site path such as /plan-your-visit" />
              <Field name="secondaryCtaLabel" label="Secondary button label" required defaultValue={home?.secondaryCtaLabel ?? "Explore Our Ministry"} />
              <Field name="secondaryCtaHref" label="Secondary button link" required defaultValue={home?.secondaryCtaHref ?? "/about"} />
            </FormGrid>
          </div>
        </Panel>

        <Panel title="Welcome">
          <div className="space-y-5">
            <Field name="welcomeHeading" label="Heading" required defaultValue={home?.welcomeHeading} maxLength={160} />
            <TextArea name="welcomeText" label="Introduction" required defaultValue={home?.welcomeText} rows={5} maxLength={1500} />
            <ImagePicker name="welcomeImageId" label="Welcome image" media={media} defaultValue={home?.welcomeImageId} />
          </div>
        </Panel>

        <Panel title="Featured scripture">
          <div className="space-y-5">
            <Notice>Use a public-domain translation (such as KJV or WEB) or one the ministry has permission to reproduce, and check the wording carefully.</Notice>
            <TextArea name="scriptureText" label="Scripture text" defaultValue={home?.scriptureText} rows={3} maxLength={800} />
            <FormGrid>
              <Field name="scriptureReference" label="Reference" defaultValue={home?.scriptureReference} placeholder="Psalm 23:1–3" />
              <Field name="scriptureTranslation" label="Translation" defaultValue={home?.scriptureTranslation} placeholder="KJV" />
            </FormGrid>
          </div>
        </Panel>

        <Panel title="Community & outreach">
          <div className="space-y-5">
            <Field name="outreachHeading" label="Heading" defaultValue={home?.outreachHeading} maxLength={160} />
            <TextArea name="outreachText" label="Text" defaultValue={home?.outreachText} rows={4} maxLength={1500} hint="Describe only real, current programmes. Do not include impact numbers unless they are verified." />
            <ImagePicker name="outreachImageId" label="Outreach image" media={media} defaultValue={home?.outreachImageId} />
          </div>
        </Panel>

        <Panel title="Featured sermon & sections">
          <div className="space-y-5">
            <Select
              name="featuredSermonId"
              label="Featured sermon"
              hint="Leave on automatic to always feature the most recent published sermon."
              defaultValue={home?.featuredSermonId}
              options={[{ value: "", label: "Automatic — latest sermon" }, ...sermons.map((sermon) => ({ value: sermon.id, label: sermon.title }))]}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Checkbox name="showServices" label="Show service times" defaultChecked={home?.showServices ?? true} />
              <Checkbox name="showMinistries" label="Show ministries" defaultChecked={home?.showMinistries ?? true} hint="Appears once at least one ministry is published." />
              <Checkbox name="showSermon" label="Show featured sermon" defaultChecked={home?.showSermon ?? true} />
              <Checkbox name="showEvents" label="Show upcoming events" defaultChecked={home?.showEvents ?? true} />
              <Checkbox name="showScripture" label="Show scripture" defaultChecked={home?.showScripture ?? true} />
              <Checkbox name="showOutreach" label="Show outreach" defaultChecked={home?.showOutreach ?? true} />
              <Checkbox name="showNewsletter" label="Show newsletter sign-up" defaultChecked={home?.showNewsletter ?? true} hint="Also requires email to be configured and updates enabled in Site settings." />
            </div>
          </div>
        </Panel>
      </AdminForm>
    </AdminPage>
  );
}
