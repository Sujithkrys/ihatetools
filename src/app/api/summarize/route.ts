import { NextRequest, NextResponse } from "next/server";
import { redis, getUtcDayKey, LIMITS } from "@/lib/ratelimit";
import crypto from "crypto";

const ANONYMOUS_COOKIE_NAME = "iht_uid";
const DAY_IN_SECONDS = 86400;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Please provide valid text to summarize." },
        { status: 400 }
      );
    }

    const text = body.text.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Text cannot be empty." },
        { status: 400 }
      );
    }

    if (text.length > LIMITS.MAX_INPUT_CHARS) {
      return NextResponse.json(
        {
          error: `Text is too long (${text.length} characters). The maximum allowed length is ${LIMITS.MAX_INPUT_CHARS} characters.`,
        },
        { status: 400 }
      );
    }

    // 1. Resolve User Identifier & IP
    let userId = req.cookies.get(ANONYMOUS_COOKIE_NAME)?.value;
    let isNewUserCookie = false;
    if (!userId || userId.length < 10) {
      userId = crypto.randomUUID();
      isNewUserCookie = true;
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const dayKey = getUtcDayKey();
    const globalKey = `summarize:global:${dayKey}`;
    const userKey = `summarize:user:${userId}:${dayKey}`;
    const ipKey = `summarize:ip:${ip}:${dayKey}`;

    // 2. Check Rate Limits (if Redis is configured)
    let userCount = 0;
    if (redis) {
      const [globalCountRaw, userCountRaw, ipCountRaw] = await Promise.all([
        redis.get<number>(globalKey),
        redis.get<number>(userKey),
        redis.get<number>(ipKey),
      ]);

      const globalCount = Number(globalCountRaw) || 0;
      userCount = Number(userCountRaw) || 0;
      const ipCount = Number(ipCountRaw) || 0;

      // 1) GLOBAL daily cap check (Primary safety mechanism)
      if (globalCount >= LIMITS.GLOBAL_DAILY_CAP) {
        return NextResponse.json(
          {
            error:
              "The daily community limit for AI summaries has been reached for today. Please try again tomorrow!",
            limitType: "global",
            remaining: 0,
          },
          { status: 429 }
        );
      }

      // 2) Per-user cap check (Secondary layer)
      if (userCount >= LIMITS.USER_DAILY_CAP) {
        return NextResponse.json(
          {
            error: `You have reached your daily limit of ${LIMITS.USER_DAILY_CAP} summaries. Please check back tomorrow!`,
            limitType: "user",
            remaining: 0,
          },
          { status: 429 }
        );
      }

      // 3) Per-IP cap check (Tertiary backstop)
      if (ipCount >= LIMITS.IP_DAILY_CAP) {
        return NextResponse.json(
          {
            error:
              "Too many requests from this network today. Please try again tomorrow!",
            limitType: "ip",
            remaining: 0,
          },
          { status: 429 }
        );
      }
    }

    // 3. Check Server-side Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[AI Summarize API] GEMINI_API_KEY is not configured.");
      return NextResponse.json(
        { error: "AI Summarizer service is temporarily unavailable. Please check back later." },
        { status: 503 }
      );
    }

    // 4. Call Google Gemini API (gemini-1.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are a concise, high-quality text summarizer. 
Summarize the following text clearly in 2 to 4 concise bullet points, followed by a one-sentence takeaway.
Do not hallucinate or add outside commentary.

Text to summarize:
"""
${text}
"""`;

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: LIMITS.MAX_OUTPUT_TOKENS,
        temperature: 0.2,
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("[Gemini API Error]", geminiRes.status, errorText.slice(0, 200));

      if (geminiRes.status === 429) {
        return NextResponse.json(
          { error: "Gemini AI is currently under high load. Please try again in a few moments." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to generate summary. Please try again later." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!summary) {
      return NextResponse.json(
        { error: "Could not generate a summary from the provided text." },
        { status: 500 }
      );
    }

    // 5. Increment Counters in Redis on Successful API Call
    let remaining = LIMITS.USER_DAILY_CAP - 1;
    if (redis) {
      const [, newUserCount] = await Promise.all([
        redis.incr(globalKey),
        redis.incr(userKey),
        redis.incr(ipKey),
      ]);

      // Set expiration to 2 days to keep store clean
      redis.expire(globalKey, DAY_IN_SECONDS * 2).catch(() => {});
      redis.expire(userKey, DAY_IN_SECONDS * 2).catch(() => {});
      redis.expire(ipKey, DAY_IN_SECONDS * 2).catch(() => {});

      remaining = Math.max(0, LIMITS.USER_DAILY_CAP - Number(newUserCount));
    }

    const response = NextResponse.json({
      summary,
      remaining,
      limit: LIMITS.USER_DAILY_CAP,
    });

    // Set cookie if new user
    if (isNewUserCookie) {
      response.cookies.set({
        name: ANONYMOUS_COOKIE_NAME,
        value: userId,
        maxAge: DAY_IN_SECONDS * 365,
        path: "/",
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (err: unknown) {
    console.error("[Summarizer API Error]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your summary." },
      { status: 500 }
    );
  }
}
