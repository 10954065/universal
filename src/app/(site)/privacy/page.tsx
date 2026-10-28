import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Universal Trinity Ministry collects, uses and protects personal information shared through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage page="privacy" href="/privacy" eyebrow="Your privacy" />;
}
