import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms for using the Universal Trinity Ministry website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage page="terms" href="/terms" eyebrow="Website terms" />;
}
