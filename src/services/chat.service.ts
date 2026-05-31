import type { Conversation, ChatMessage } from "../types";
import { apiRequest, IS_CHAT_MOCK, mockDelay } from "./api";
import { conversations as mockConversations } from "../data/mockData";

/** Fetch all conversations for the current user. */
export async function getConversations(): Promise<Conversation[]> {
  if (IS_CHAT_MOCK) return mockDelay([...mockConversations]);
  return apiRequest<Conversation[]>("/chat/conversations");
}

/** Fetch a single conversation with full message history. */
export async function getConversationById(
  id: string
): Promise<Conversation | undefined> {
  if (IS_CHAT_MOCK)
    return mockDelay(mockConversations.find((c) => c.id === id));
  return apiRequest<Conversation>(`/chat/conversations/${id}`);
}

/** Send a message within an existing conversation. */
export async function sendMessage(
  conversationId: string,
  text: string
): Promise<ChatMessage> {
  if (IS_CHAT_MOCK) {
    const msg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: "current",
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "numeric",
        minute: "2-digit",
      }),
      read: false,
    };
    return mockDelay(msg);
  }
  return apiRequest<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: { text },
  });
}

/** Start a new conversation with another user. */
export async function startConversation(
  participantId: string
): Promise<Conversation> {
  if (IS_CHAT_MOCK) {
    const existing = mockConversations.find(
      (c) => c.participantId === participantId
    );
    if (existing) return mockDelay(existing);
    throw new Error("No mock conversation found for participantId: " + participantId);
  }
  return apiRequest<Conversation>("/chat/conversations", {
    method: "POST",
    body: { participantId },
  });
}
