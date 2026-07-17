import { NextResponse } from "next/server";
import { generateChatResponse, saveAssistantMessage } from "@portfolio/ai";

function describeAiError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/DATABASE_URL|PrismaClientInitialization/i.test(message)) {
    return "The database is not configured on the server (missing DATABASE_URL).";
  }
  if (/429|rate.?limit|quota/i.test(message)) {
    return "The AI service is rate-limited right now. Please wait a minute and try again.";
  }
  if (/401|403|api.?key|unauthorized/i.test(message)) {
    return "The AI service rejected the request (invalid or missing API key).";
  }
  if (/ECONNREFUSED|fetch failed|network/i.test(message)) {
    return "Couldn't reach the AI service. Please check your connection and try again.";
  }
  return "The AI assistant hit an unexpected error. Please try again.";
}

export async function POST(req: Request) {
  try {
    const { message, sessionId, projectId, projectTitle } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const { stream, chatId, sessionId: sid } = await generateChatResponse({
      message: message.trim(),
      sessionId,
      projectId,
      projectTitle,
    });

    const encoder = new TextEncoder();
    let fullText = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of stream) {
            fullText += delta;
            controller.enqueue(encoder.encode(delta));
          }
          await saveAssistantMessage(chatId, fullText);
          controller.close();
        } catch (err) {
          console.error("Chat stream error:", err);
          const friendly = `${fullText ? "\n\n" : ""}⚠️ ${describeAiError(err)}`;
          controller.enqueue(encoder.encode(friendly));
          await saveAssistantMessage(chatId, fullText + friendly).catch(() => {});
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Session-Id": sid,
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: describeAiError(err) }, { status: 500 });
  }
}
