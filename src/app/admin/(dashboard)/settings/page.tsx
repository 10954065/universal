import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getMediaOptions } from "@/lib/admin-data";
import { isEmailConfigured } from "@/lib/email";
import { isPaystackConfigured } from "@/lib/paystack";
import { requirePagePermission } from "@/lib/session";
import { saveSettings } from "@/server/admin/content-actions";
import { AdminForm, Checkbox, Field, ImagePicker, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requirePagePermission("settings:manage");
  const [settings, media] = await Promise.all([db.siteSettings.findUnique({ where: { id: 1 } }), getMediaOptions()]);
  const s = settings;

  return (
    <AdminPage title="Site settings" description="Ministry identity, official contact channels, SEO defaults, giving details and feature switches.">
      <AdminForm action={saveSettings} submitLabel="Save settings">
        <Notice tone="warning">Only enter official, verified details. Anything left blank is simply not shown on the website.</Notice>
        <Panel title="Identity">
          <div className="space-y-5">
            <FormGrid>
              <Field name="ministryName" label="Ministry name" required defaultValue={s?.ministryName ?? "Universal Trinity Ministry"} />
              <Field name="shortName" label="Short name" required defaultValue={s?.shortName ?? "UTM"} maxLength={20} />
            </FormGrid>
            <Field name="tagline" label="Tagline" defaultValue={s?.tagline} />
            <ImagePicker name="logoId" label="Official logo" hint="Upload the logo in the Media library first. Until then, a typographic wordmark is used." media={media} defaultValue={s?.logoId} />
            <TextArea name="footerText" label="Footer description" defaultValue={s?.footerText} rows={2} maxLength={300} />
          </div>
        </Panel>
        <Panel title="Contact & location">
          <div className="space-y-5">
            <FormGrid>
              <Field name="email" type="email" label="Official email" defaultValue={s?.email} />
              <Field name="phone" type="tel" label="Official phone" defaultValue={s?.phone} />
              <Field name="whatsapp" type="tel" label="WhatsApp number" defaultValue={s?.whatsapp} hint="e.g. 024 000 0000 or +233 24 000 0000" />
              <Field name="addressLine" label="Street address" defaultValue={s?.addressLine} />
              <Field name="city" label="Town / city" defaultValue={s?.city} />
              <Field name="region" label="Region" defaultValue={s?.region} />
              <Field name="country" label="Country" required defaultValue={s?.country ?? "Ghana"} />
              <Field name="directionsUrl" label="Directions link" defaultValue={s?.directionsUrl} hint="A Google Maps share link." />
            </FormGrid>
            <Field name="mapEmbedUrl" label="Map embed link" defaultValue={s?.mapEmbedUrl} hint="Google Maps → Share → Embed a map → copy only the https://www.google.com/maps/embed?… address." />
          </div>
        </Panel>
        <Panel title="Official social media">
          <FormGrid>
            <Field name="facebookUrl" label="Facebook" defaultValue={s?.facebookUrl} placeholder="https://facebook.com/…" />
            <Field name="instagramUrl" label="Instagram" defaultValue={s?.instagramUrl} placeholder="https://instagram.com/…" />
            <Field name="youtubeUrl" label="YouTube" defaultValue={s?.youtubeUrl} placeholder="https://youtube.com/@…" />
            <Field name="tiktokUrl" label="TikTok" defaultValue={s?.tiktokUrl} />
            <Field name="xUrl" label="X (Twitter)" defaultValue={s?.xUrl} />
          </FormGrid>
        </Panel>
        <Panel title="Search engines & sharing">
          <div className="space-y-5">
            <Field name="seoTitle" label="Homepage title" defaultValue={s?.seoTitle} maxLength={70} hint="Up to 70 characters." />
            <TextArea name="seoDescription" label="Default description" defaultValue={s?.seoDescription} rows={2} maxLength={170} hint="Up to 170 characters. Shown in search results." />
            <ImagePicker name="ogImageId" label="Default sharing image" media={media} defaultValue={s?.ogImageId} />
          </div>
        </Panel>
        <Panel title="Giving">
          <div className="space-y-5">
            <TextArea name="givingIntro" label="Introduction" defaultValue={s?.givingIntro} rows={3} maxLength={600} />
            <TextArea name="bankInstructions" label="Bank transfer details" defaultValue={s?.bankInstructions} rows={5} hint="Bank, account name, account number and branch, exactly as confirmed by the ministry. Markdown allowed." />
            <TextArea name="momoInstructions" label="Mobile Money details" defaultValue={s?.momoInstructions} rows={4} hint="Network, number and registered name." />
            <Field name="givingContact" label="Giving enquiries contact" defaultValue={s?.givingContact} hint="e.g. the finance office email or phone." />
            <Checkbox
              name="onlineGivingEnabled"
              label="Enable online giving (Paystack)"
              defaultChecked={s?.onlineGivingEnabled}
              hint={isPaystackConfigured() ? "Paystack keys are configured." : "Paystack keys are NOT configured yet, so online giving stays hidden even if ticked."}
            />
          </div>
        </Panel>
        <Panel title="Features & privacy">
          <div className="space-y-5">
            <Checkbox
              name="newsletterEnabled"
              label="Enable ministry updates sign-up"
              defaultChecked={s?.newsletterEnabled}
              hint={isEmailConfigured() ? "Email delivery is configured." : "Email delivery is NOT configured yet, so the sign-up stays hidden even if ticked."}
            />
            <Field name="prayerRetentionDays" type="number" label="Delete prayer requests after (days)" required defaultValue={s?.prayerRetentionDays ?? 180} min={7} max={730} />
          </div>
        </Panel>
      </AdminForm>
    </AdminPage>
  );
}
