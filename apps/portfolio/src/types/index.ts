export interface HomepageSettings {
  heroHeading: string;
  heroSubtitle: string;
  aboutMe: string | null;
  resumeUrl: string | null;
  socialLinks: Record<string, string> | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  aiContext: string | null;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  pdfFileName: string | null;
  tags: string[];
  githubUrl: string | null;
  figmaUrl: string | null;
  priority: number;
  published: boolean;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
