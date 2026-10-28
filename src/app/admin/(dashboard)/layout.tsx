import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
