
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  contactLimiter,
  enforceRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  // 1. Rate limiting
  if (!contactLimiter) {
    return NextResponse.json(
      { message: "Contact service is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const rateLimitResponse = await enforceRateLimit(
      contactLimiter,
      `contact:${getClientIp(request)}`
    );

    if (rateLimitResponse) return rateLimitResponse;
  } catch (error) {
    console.error("Contact rate limiter unavailable:", error);

    return NextResponse.json(
      { message: "Contact service is temporarily unavailable." },
      { status: 503 }
    );
  }

  // 2. Parse request body
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON request." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  // 3. Validate fields
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { message: "Please complete all fields." },
      { status: 400 }
    );
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    subject.length > 150 ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { message: "One or more fields exceed the allowed length." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  // 4. Save to database
  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: "Your message has been saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact message database operation failed:", error);

    return NextResponse.json(
      {
        message:
          "Unable to save your message right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
