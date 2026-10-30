
import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !configuredEmail ||
    session?.user?.email?.trim().toLowerCase() !== configuredEmail
  ) {
    redirect("/admin/login");
  }

  return session;
}
