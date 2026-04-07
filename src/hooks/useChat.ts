import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, UserInfo } from '../types';
import { agents } from '../agents';
import { sendMessageToAgent } from '../services/chatService';
import { checkHealth } from '../services/proxyService';

const STORAGE_KEY = 'apoc_messages';
const USER_ID = 'christopher';
const USER_NAME = 'Christopher';
const USER_COLOR = '#00ff88';
const USER_AVATAR = '/avatars/user.svg';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupt storage
  }
  return [];
}

function saveMessages(messages: Message[]): void {
  // Only persist non-streaming messages
  const toSave = messages.filter((m) => !m.isStreaming);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages();
    if (saved.length > 0) return saved;

    // First visit: show agent join messages
    return agents.map((agent) => ({
      id: generateId(),
      senderId: 'system',
      senderName: 'System',
      senderColor: '#8888aa',
      avatarUrl: '',
      content: `${agent.name} has entered the room`,
      timestamp: Date.now(),
      type: 'system' as const,
    }));
  });

  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const streamingRef = useRef(false);

  // Persist messages on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Health check on mount
  useEffect(() => {
    checkHealth().then(setIsConnected).catch(() => setIsConnected(false));
  }, []);

  const buildUsers = useCallback((): UserInfo[] => {
    const agentUsers: UserInfo[] = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      nameColor: agent.nameColor,
      avatarUrl: agent.avatarUrl,
      status: typingAgent === agent.name ? 'typing' : 'online',
    }));

    const christopherUser: UserInfo = {
      id: USER_ID,
      name: USER_NAME,
      nameColor: USER_COLOR,
      avatarUrl: USER_AVATAR,
      status: 'online',
    };

    return [...agentUsers, christopherUser];
  }, [typingAgent]);

  const sendMessage = useCallback(
    (text: string) => {
      if (streamingRef.current) return;

      // Add user message
      const userMsg: Message = {
        id: generateId(),
        senderId: USER_ID,
        senderName: USER_NAME,
        senderColor: USER_COLOR,
        avatarUrl: USER_AVATAR,
        content: text,
        timestamp: Date.now(),
        type: 'user',
      };

      setMessages((prev) => [...prev, userMsg]);

      // Send to first agent (Phase 0: just Gemma)
      const agent = agents[0];
      if (!agent) return;

      streamingRef.current = true;
      setTypingAgent(agent.name);

      const agentMsgId = generateId();
      let accumulated = '';
      let streamStarted = false;

      const allMessagesWithUser = [...messages, userMsg];

      sendMessageToAgent(
        agent,
        allMessagesWithUser,
        // onChunk
        (chunk) => {
          accumulated += chunk;

          if (!streamStarted) {
            streamStarted = true;
            setTypingAgent(null);
          }

          setMessages((prev) => {
            const existing = prev.find((m) => m.id === agentMsgId);
            if (existing) {
              return prev.map((m) =>
                m.id === agentMsgId
                  ? { ...m, content: accumulated }
                  : m,
              );
            }
            return [
              ...prev,
              {
                id: agentMsgId,
                senderId: agent.id,
                senderName: agent.name,
                senderColor: agent.nameColor,
                avatarUrl: agent.avatarUrl,
                content: accumulated,
                timestamp: Date.now(),
                type: 'agent',
                isStreaming: true,
              },
            ];
          });
        },
        // onDone
        () => {
          streamingRef.current = false;
          setTypingAgent(null);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentMsgId ? { ...m, isStreaming: false } : m,
            ),
          );
        },
        // onError
        (error) => {
          streamingRef.current = false;
          setTypingAgent(null);
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              senderId: 'system',
              senderName: 'System',
              senderColor: '#8888aa',
              avatarUrl: '',
              content: `Error: ${error}`,
              timestamp: Date.now(),
              type: 'system',
            },
          ]);
        },
      );
    },
    [messages],
  );

  return {
    messages,
    users: buildUsers(),
    typingAgent,
    isConnected,
    sendMessage,
  };
}
