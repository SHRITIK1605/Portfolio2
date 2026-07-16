"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ChatCta = { type: "project"; slug: string; title: string };

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ctas?: ChatCta[];
}

export const CHAT_MIN_WIDTH_PCT = 20;
export const CHAT_MAX_WIDTH_PCT = 50;
export const CHAT_DEFAULT_WIDTH_PCT = 33;

interface ChatContextValue {
  isOpen: boolean;
  messages: ChatMessage[];
  isStreaming: boolean;
  sessionId: string | null;
  panelWidth: number;
  isResizing: boolean;
  openChat: () => void;
  closeChat: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsStreaming: (v: boolean) => void;
  setSessionId: (v: string | null) => void;
  setPanelWidth: (v: number) => void;
  setIsResizing: (v: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [panelWidth, setPanelWidthState] = useState(CHAT_DEFAULT_WIDTH_PCT);
  const [isResizing, setIsResizing] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const setPanelWidth = useCallback((v: number) => {
    setPanelWidthState(
      Math.min(CHAT_MAX_WIDTH_PCT, Math.max(CHAT_MIN_WIDTH_PCT, v))
    );
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      isStreaming,
      sessionId,
      panelWidth,
      isResizing,
      openChat,
      closeChat,
      setMessages,
      setIsStreaming,
      setSessionId,
      setPanelWidth,
      setIsResizing,
    }),
    [
      isOpen,
      messages,
      isStreaming,
      sessionId,
      panelWidth,
      isResizing,
      openChat,
      closeChat,
      setPanelWidth,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
