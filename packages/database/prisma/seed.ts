import bcrypt from "bcryptjs";
import { prisma } from "../src/index";
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
    { text: "Tell me about Shritik's background", category: "general", order: 0 },
    { text: "What are his strongest product skills?", category: "general", order: 1 },
    { text: "Help me find Shritik's resume", category: "resume", order: 2 },
    { text: "Walk me through his top projects", category: "projects", order: 3 },
    { text: "How can I contact him?", category: "contact", order: 4 },
  ];

  for (const q of suggestedQuestions) {
    const existing = await prisma.suggestedQuestion.findFirst({
      where: { text: q.text },
    });
    if (!existing) {
      await prisma.suggestedQuestion.create({ data: q });
    }
  }

  const demoProjects = [
    {
      title: "Slikk AI Catalog",
      slug: "slikk-ai-catalog",
      shortDescription:
        "AI-powered catalog consistency for fashion quick commerce product listings.",
      longDescription:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
      aiContext:
        "Slikk AI Catalog: Built image processing pipeline for PLP consistency. Key metrics: 40% reduction in listing errors. Tech: computer vision, ML classification.",
      tags: [
        "AI Product",
        "Image Processing",
        "Fashion Quick Commerce",
        "Product Listing Page Consistency",
      ],
      priority: 4,
      published: true,
      pdfUrl: "/demo/paytm.pdf",
    },
    {
      title: "Flipkart APM",
      slug: "flipkart-apm",
      shortDescription: "Associate Product Manager work on e-commerce product strategy.",
      longDescription:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
      aiContext:
        "Flipkart APM: Focused on seller experience and conversion optimization. Led cross-functional initiatives.",
      tags: ["APM", "E-commerce", "Product Strategy"],
      priority: 3,
      published: true,
      pdfUrl: "/demo/paytm.pdf",
    },
    {
      title: "RISA APM",
      slug: "risa-apm",
      shortDescription: "Product management and user research for RISA platform.",
      longDescription:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
      aiContext:
        "RISA APM: Conducted user research, defined product roadmap, shipped MVP features.",
      tags: ["APM", "Product Management", "User Research"],
      priority: 2,
      published: true,
      pdfUrl: "/demo/paytm.pdf",
    },
    {
      title: "BCG Ideathon",
      slug: "bcg-ideathon",
      shortDescription: "Strategy and innovation ideation for BCG case competition.",
      longDescription:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
      aiContext:
        "BCG Ideathon: Won regional round. Focus on sustainable supply chain innovation.",
      tags: ["Ideation", "Strategy", "Innovation"],
      priority: 1,
      published: true,
      pdfUrl: "/demo/paytm.pdf",
    },
  ];

  for (const project of demoProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  const allProjects = await prisma.project.findMany();
  for (const project of allProjects) {
    const normalized = project.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (normalized && normalized !== project.slug) {
      await prisma.project.update({
        where: { id: project.id },
        data: { slug: normalized },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
