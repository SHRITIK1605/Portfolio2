import bcrypt from "bcryptjs";
import { prisma } from "../src/index";
import { IMPACT_ITEMS } from "./impact-data";
import { PROJECTS } from "./projects-data";
import {
  DEFAULT_RESUME_URL,
  PROJECT_ASSISTANT_PROMPT,
  RECRUITER_SYSTEM_PROMPT,
} from "./prompts";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "shritik1234j@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin.123@@";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin" },
  });

  await prisma.user.deleteMany({
    where: { email: "admin@example.com" },
  });

  const resumeUrl = process.env.RESUME_URL ?? DEFAULT_RESUME_URL;

  await prisma.homepageSettings.upsert({
    where: { id: "homepage" },
    update: { resumeUrl },
    create: {
      id: "homepage",
      heroHeading: "Hi, I'm Shritik.",
      heroSubtitle:
        "I build products by questioning what everyone else accepts as given.",
      aboutMe:
        "Product builder focused on AI-powered experiences and thoughtful product design.",
      resumeUrl,
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
        email: "shritik1234j@gmail.com",
      },
    },
  });

  await prisma.promptSettings.upsert({
    where: { id: "default" },
    update: {
      systemPrompt: RECRUITER_SYSTEM_PROMPT,
      projectPrompt: PROJECT_ASSISTANT_PROMPT,
    },
    create: {
      id: "default",
      systemPrompt: RECRUITER_SYSTEM_PROMPT,
      projectPrompt: PROJECT_ASSISTANT_PROMPT,
    },
  });

  const suggestedQuestions = [
    { text: "What's your background?", category: "general", order: 0 },
    { text: "Tell me about your impact at BSE", category: "general", order: 1 },
    { text: "Walk me through your top projects", category: "projects", order: 2 },
    { text: "How can I contact you?", category: "contact", order: 3 },
  ];

  // Retire third-person / name-based starter chips (visitor talks TO Shritik with "your")
  await prisma.suggestedQuestion.updateMany({
    where: {
      text: {
        in: [
          "Tell me about Shritik",
          "Tell me about Shritik's background",
          "What are his strongest product skills?",
          "Walk me through his top projects",
          "How can I contact him?",
          "Help me find Shritik's resume",
        ],
      },
    },
    data: { active: false },
  });

  for (const q of suggestedQuestions) {
    const existing = await prisma.suggestedQuestion.findFirst({
      where: { text: q.text },
    });
    if (existing) {
      await prisma.suggestedQuestion.update({
        where: { id: existing.id },
        data: { active: true, category: q.category, order: q.order },
      });
    } else {
      await prisma.suggestedQuestion.create({ data: q });
    }
  }

  for (const project of PROJECTS) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        aiContext: project.aiContext,
        tags: project.tags,
        priority: project.priority,
        published: project.published,
        pdfUrl: `/api/uploads/projects/${project.slug}.pdf`,
        pdfFileName: `${project.slug}.pdf`,
      },
      create: {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        aiContext: project.aiContext,
        tags: project.tags,
        priority: project.priority,
        published: project.published,
        pdfUrl: `/api/uploads/projects/${project.slug}.pdf`,
        pdfFileName: `${project.slug}.pdf`,
      },
    });
  }

  const validSlugs = new Set(PROJECTS.map((p) => p.slug));
  await prisma.project.updateMany({
    where: { slug: { notIn: [...validSlugs] } },
    data: { published: false },
  });

  for (const item of IMPACT_ITEMS) {
    const existing = await prisma.impactItem.findFirst({
      where: { logoAlt: item.logoAlt },
    });
    const data = {
      ...item,
      tags: [...item.tags],
      pdfUrl: item.pdfUrl ?? null,
      published: true,
    };
    if (existing) {
      await prisma.impactItem.update({ where: { id: existing.id }, data });
    } else {
      await prisma.impactItem.create({ data });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email} / ${password}`);
  console.log("Run npm run setup:projects to copy PDFs and ingest RAG embeddings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
