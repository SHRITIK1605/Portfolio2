import { prisma } from "@portfolio/database";
import { getMistralClient, MISTRAL_CHAT_MODEL } from "./mistral";
import { buildContext, searchEmbeddings } from "./rag";

export interface ChatOptions {
  message: string;
  sessionId?: string;
  projectId?: string | null;
  projectTitle?: string;
}

const RESUME_NOTE =
  '\nResume: never share resume links or URLs. If someone asks for the resume, tell them to click the "Resume" button at the top of the page to view and download it.';

async function buildProjectsSummary(): Promise<string> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      tags: true,
    },
  });

  if (projects.length === 0) {
    return `No published projects listed yet.${RESUME_NOTE}`;
  }

  const list = projects
    .map(
      (project, index) =>
        `${index + 1}. ${project.title} (slug: ${project.slug})\n   Summary: ${project.shortDescription}\n   Tags: ${project.tags.join(", ")}`
    )
    .join("\n");

  return `Published projects on this portfolio:\n${list}${RESUME_NOTE}`;
}

export async function generateChatResponse(options: ChatOptions) {
  const { message, sessionId, projectId, projectTitle } = options;

  const [promptSettings, projectsSummary] = await Promise.all([
    prisma.promptSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    buildProjectsSummary(),
  ]);

  const basePrompt =
    projectId && promptSettings?.projectPrompt
      ? promptSettings.projectPrompt
      : promptSettings?.systemPrompt ??
        'You are Shritik Jaiswal speaking in first person ("I", "me", "my") to recruiters and visitors. Never refer to yourself in third person.';

  const chunks = await searchEmbeddings(message, {
    projectId,
    limit: projectId ? 8 : 6,
    globalFallback: true,
  });

  const context = buildContext(chunks);

  let projectKnowledge = "";
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { aiContext: true, longDescription: true, title: true, tags: true },
    });
    if (project) {
      projectKnowledge += `\n\nActive project: ${project.title}`;
      projectKnowledge += `\nTags: ${project.tags.join(", ")}`;
      if (project.longDescription?.trim()) {
        projectKnowledge += `\nOverview: ${project.longDescription.trim()}`;
      }
      if (project.aiContext?.trim()) {
        projectKnowledge += `\nDetailed notes: ${project.aiContext.trim()}`;
      }
    }
  } else if (projectTitle) {
    projectKnowledge += `\n\nVisitor context: viewing ${projectTitle}`;
  }

  const systemInstruction = `${basePrompt}

${projectsSummary}
${projectKnowledge}

Retrieved knowledge (use this first, do not invent facts):
${context}`;

  let chat = sessionId
    ? await prisma.chat.findUnique({
        where: { sessionId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      })
    : null;

  if (!chat) {
    chat = await prisma.chat.create({
      data: { projectId: projectId ?? undefined },
      include: { messages: true },
    });

    await prisma.analyticsEvent.create({
      data: { type: "CHAT_SESSION", projectId: projectId ?? undefined },
    });
  }

  const history = chat.messages.slice(-10).map((msg) => ({
    role: (msg.role === "assistant" ? "assistant" : "user") as
      | "assistant"
      | "user",
    content: msg.content,
  }));

  await prisma.message.create({
    data: { chatId: chat.id, role: "user", content: message },
  });

  await prisma.analyticsEvent.create({
    data: {
      type: "CHAT_QUESTION",
      projectId: projectId ?? undefined,
      metadata: { question: message.slice(0, 200) },
    },
  });

  async function* streamResponse() {
    const client = getMistralClient();
    const stream = await client.chat.stream({
      model: MISTRAL_CHAT_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        ...history,
        { role: "user", content: message },
      ],
    });

    for await (const event of stream) {
      const text = event.data.choices[0]?.delta?.content;
      if (typeof text === "string" && text) yield text;
    }
  }

  return {
    stream: streamResponse(),
    chatId: chat.id,
    sessionId: chat.sessionId,
  };
}

export async function saveAssistantMessage(chatId: string, content: string) {
  await prisma.message.create({
    data: { chatId, role: "assistant", content },
  });
}
