
import "server-only";
import { NextResponse } from "next/server";

export function requireSameOrigin(request: Request) {
  const requestOrigin = request.headers.get("origin");
  const configuredOrigin = process.env.APP_URL;

  if (!requestOrigin || !configuredOrigin) {
    return NextResponse.json(
      { error: "Request origin could not be verified." },
      { status: 403 }
    );
  }

  try {
    const expectedOrigin = new URL(configuredOrigin).origin;
    const actualOrigin = new URL(requestOrigin).origin;

    if (actualOrigin !== expectedOrigin) {
      return NextResponse.json(
        { error: "Cross-origin request rejected." },
        { status: 403 }
      );
    }

    return null;
  } catch {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }
}
