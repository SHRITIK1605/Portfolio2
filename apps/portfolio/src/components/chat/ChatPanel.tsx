"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, ExternalLink } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useChatContext, type ChatCta } from "@/context/ChatContext";
import { SUGGESTED_PROMPTS } from "@/lib/demo-data";
import { projectPath } from "@/lib/slug";
import SparkleIcon from "@/components/ui/SparkleIcon";

interface ChatPanelProps {
  projectId?: string;
  projectTitle?: string;
}

const MAX_CTAS = 2;

interface CtaCandidate {
  index: number;
  cta: ChatCta;
}

function detectCtas(
  text: string,
  projects: { title: string; slug: string }[]
): ChatCta[] {
  const lower = text.toLowerCase();
  const candidates: CtaCandidate[] = [];

  for (const project of projects) {
    const title = project.title.trim();
    if (!title) continue;
    const index = lower.indexOf(title.toLowerCase());
    if (index !== -1) {
      candidates.push({
        index,
        cta: { type: "project", slug: project.slug, title },
      });
    }
  }

  candidates.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  const result: ChatCta[] = [];
  for (const { cta } of candidates) {
    const key = `project:${cta.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cta);
    if (result.length === MAX_CTAS) break;
  }

  return result;
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="m-0 mb-[8px] leading-[1.5] last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-all font-medium text-forest underline underline-offset-2 hover:text-forest/70"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="m-0 mb-[8px] list-disc space-y-[4px] pl-[18px] last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="m-0 mb-[8px] list-decimal space-y-[4px] pl-[18px] last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-[1.5]">{children}</li>,
  code: ({ children }) => (
    <code className="break-all rounded bg-forest/[0.08] px-[4px] py-[1px] text-[13px]">
      {children}
    </code>
  ),
  h1: ({ children }) => (
    <h1 className="m-0 mb-[6px] text-[16px] font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="m-0 mb-[6px] text-[15px] font-bold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="m-0 mb-[6px] text-[14px] font-bold">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="m-0 mb-[8px] border-l-2 border-forest/20 pl-[10px] italic text-forest/80 last:mb-0">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-[8px] max-w-full overflow-x-auto rounded-[10px] border border-forest/10 last:mb-0">
      <table className="w-full min-w-[260px] border-collapse text-[13px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-forest/[0.06]">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-forest/10 px-[10px] py-[6px] text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-forest/[0.06] px-[10px] py-[6px] align-top">
      {children}
    </td>
  ),
};

export default function ChatPanel({ projectId, projectTitle }: ChatPanelProps) {
  const {
    isOpen,
    closeChat,
    messages,
    setMessages,
    isStreaming,
    setIsStreaming,
    sessionId,
    setSessionId,
    panelWidth,
    setPanelWidth,
    setIsResizing,
  } = useChatContext();
  const router = useRouter();

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsResizing(true);

      const onMove = (ev: PointerEvent) => {
        const pct = ((window.innerWidth - ev.clientX) / window.innerWidth) * 100;
        setPanelWidth(pct);
      };
      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [setPanelWidth, setIsResizing]
  );

  const [input, setInput] = useState("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(SUGGESTED_PROMPTS);
  const [projects, setProjects] = useState<{ title: string; slug: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/suggested-questions")
      .then((r) => r.json())
      .then((d) => {
        const texts = (d.questions ?? []).map((q: { text: string }) => q.text);
        if (texts.length > 0) setSuggestedPrompts(texts);
      })
      .catch(() => {});

    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.projects ?? []).map(
          (p: { title: string; slug: string }) => ({ title: p.title, slug: p.slug })
        );
        setProjects(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleCtaClick = useCallback(
    (cta: ChatCta) => {
      router.push(projectPath(cta.slug));
    },
    [router]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId,
            projectId,
            projectTitle,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error("Chat request failed");
        }

        const sid = res.headers.get("X-Session-Id");
        if (sid) setSessionId(sid);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          const snapshot = assistantText;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", content: snapshot };
            return next;
          });
        }

        const ctas = detectCtas(assistantText, projects);
        if (ctas.length > 0) {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: assistantText,
              ctas,
            };
            return next;
          });
        }
      } catch {
        setMessages((prev) => [
          ...prev.filter((msg, i) => !(i === prev.length - 1 && msg.role === "assistant" && !msg.content)),
          {
            role: "assistant",
            content:
              "⚠️ Sorry, I couldn't reach the AI assistant right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, projectId, projectTitle, sessionId, setMessages, setIsStreaming, setSessionId, projects]
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-forest/20 backdrop-blur-[2px] md:hidden"
            onClick={closeChat}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            style={{ "--chat-w": `${panelWidth}%` } as React.CSSProperties}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-cream shadow-[-8px_0_32px_rgba(0,75,64,0.12)] md:w-[max(var(--chat-w),300px)] md:border-l md:border-forest/10"
            role="dialog"
            aria-label="AI chat"
          >
            <div
              onPointerDown={startResize}
              className="absolute left-0 top-0 z-10 hidden h-full w-[6px] cursor-col-resize hover:bg-forest/10 active:bg-forest/20 md:block"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize chat panel"
            />
            <header className="flex items-center justify-between border-b border-forest/10 px-[20px] py-[16px]">
              <div className="flex items-center gap-[8px] text-forest">
                <SparkleIcon size={24} />
                <span className="text-[15px] font-semibold">Virtual Me</span>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-forest/20 bg-white"
                aria-label="Close chat"
              >
                <X className="h-[16px] w-[16px]" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-[20px] py-[24px]">
              {messages.length === 0 ? (
                <div className="animate-fade-in">
                  <h2 className="m-0 text-[20px] font-semibold text-forest">
                    Hi! How can I help you?
                  </h2>
                  <p className="mt-2 text-[14px] text-forest/60">
                    Ask about Shritik&apos;s projects, experience, or resume.
                  </p>
                  <div className="mt-[24px] flex flex-col gap-[8px]">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-[16px] border border-forest/15 bg-white px-[16px] py-[12px] text-left text-[14px] text-forest transition hover:border-forest/30"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-[16px]">
                  {messages.map((msg, i) => (
                    <div
                      key={`${msg.role}-${i}`}
                      className={
                        msg.role === "user"
                          ? "flex justify-end"
                          : "flex items-start gap-[8px]"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <Image
                          src="/logo.png"
                          alt=""
                          width={24}
                          height={24}
                          className="mt-[2px] h-[24px] w-[24px] shrink-0 rounded-full object-cover"
                        />
                      ) : null}

                      <div
                        className={
                          msg.role === "user"
                            ? "max-w-[85%] overflow-hidden rounded-[16px] bg-forest px-[16px] py-[12px] text-[14px] text-white break-words"
                            : "max-w-[85%] overflow-hidden rounded-[16px] bg-white px-[16px] py-[12px] text-[14px] text-forest shadow-[0_1px_4px_rgba(0,75,64,0.06)] break-words"
                        }
                      >
                        {msg.role === "assistant" ? (
                          msg.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                              components={markdownComponents}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : null
                        ) : (
                          <p className="m-0 whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        )}

                        {msg.ctas && msg.ctas.length > 0 ? (
                          <div className="mt-[10px] flex flex-wrap gap-[8px]">
                            {msg.ctas.map((cta, ci) => (
                              <button
                                key={ci}
                                type="button"
                                onClick={() => handleCtaClick(cta)}
                                className="inline-flex items-center gap-[6px] rounded-full border-[1.5px] border-forest bg-btn-cream px-[14px] py-[7px] text-[13px] font-medium text-forest transition hover:bg-forest/10"
                              >
                                <ExternalLink className="h-[12px] w-[12px]" strokeWidth={2} />
                                {`View ${cta.title}`}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {isStreaming ? (
                    <div className="flex gap-[4px] py-[8px]">
                      <span className="typing-dot h-[8px] w-[8px] rounded-full bg-forest/40" />
                      <span className="typing-dot h-[8px] w-[8px] rounded-full bg-forest/40" />
                      <span className="typing-dot h-[8px] w-[8px] rounded-full bg-forest/40" />
                    </div>
                  ) : null}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              className="border-t border-forest/10 p-[16px]"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <div className="flex items-end gap-[8px]">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask anything…"
                  rows={1}
                  disabled={isStreaming}
                  className="max-h-[112px] min-h-[44px] flex-1 resize-none rounded-[16px] border border-forest/15 bg-white px-[16px] py-[12px] text-[14px] outline-none focus:border-forest/35"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-forest bg-btn-cream disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-[16px] w-[16px] text-forest" />
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
