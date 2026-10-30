
import "server-only";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireAdminApi() {
  const session = await auth();
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  if (!configuredEmail || sessionEmail !== configuredEmail) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  return null;
}
