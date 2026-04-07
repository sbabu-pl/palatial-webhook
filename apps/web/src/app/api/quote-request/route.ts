import { NextRequest, NextResponse } from "next/server";
import { quoteRequestSchema, toLeadApiPayload } from "../../../lib/quote-request.schema";
import { createLeadInCoreApi } from "../../../lib/server/palatial-api";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return req.headers.get("x-real-ip");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the form and try again.",
          errors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const timeSinceStart = Date.now() - input.formStartedAt;

    if (input.website) {
      return NextResponse.json(
        {
          success: true,
          message: "Thanks. Your request has been received."
        },
        { status: 200 }
      );
    }

    if (timeSinceStart < 2500) {
      return NextResponse.json(
        {
          success: false,
          message: "Please take a moment to complete the form and try again."
        },
        { status: 429 }
      );
    }

    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");
    const ip = getClientIp(req);

    const payload = toLeadApiPayload(input);

    await createLeadInCoreApi({
      ...payload,
      metadata: {
        ...(payload.metadata ?? {}),
        channel: "website",
        referer,
        userAgent,
        ip,
        submittedAt: new Date().toISOString()
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thanks. We’ve received your request. A Palatial advisor will contact you shortly."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote request submission failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "We could not submit your request right now. Please try again shortly."
      },
      { status: 500 }
    );
  }
}