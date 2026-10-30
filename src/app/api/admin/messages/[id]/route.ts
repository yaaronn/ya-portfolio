
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import {
  adminApiLimiter,
  enforceRateLimit,
  getClientIp,
} from "@/lib/rate-limit";
import { requireSameOrigin } from "@/lib/origin-check";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidMessageId(id: string) {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

async function checkAdminApiRateLimit(request: Request) {
  if (!adminApiLimiter) {
    return NextResponse.json(
      { error: "Admin service is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    return await enforceRateLimit(
      adminApiLimiter,
      `admin-api:${getClientIp(request)}`
    );
  } catch (error) {
    console.error("Admin API rate limiter unavailable:", error);

    return NextResponse.json(
      { error: "Admin service is temporarily unavailable." },
      { status: 503 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const rateLimitResponse = await checkAdminApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await context.params;

    if (!isValidMessageId(id)) {
      return NextResponse.json(
        { error: "Invalid message ID." },
        { status: 400 }
      );
    }

    if (
      !request.headers
        .get("content-type")
        ?.includes("application/json")
    ) {
      return NextResponse.json(
        { error: "Content-Type must be application/json." },
        { status: 415 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      typeof (body as { isRead?: unknown }).isRead !== "boolean"
    ) {
      return NextResponse.json(
        { error: "isRead must be a boolean." },
        { status: 400 }
      );
    }

    const isRead = (body as { isRead: boolean }).isRead;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
      select: {
        id: true,
        isRead: true,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }

    console.error("Failed to update message status:", error);

    return NextResponse.json(
      { error: "Unable to update message status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const rateLimitResponse = await checkAdminApiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await context.params;

    if (!isValidMessageId(id)) {
      return NextResponse.json(
        { error: "Invalid message ID." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }

    console.error("Failed to delete message:", error);

    return NextResponse.json(
      { error: "Unable to delete message." },
      { status: 500 }
    );
  }
}
