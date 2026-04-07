import { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import UserList from './UserList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

export default function ChatRoom() {
  const { messages, users, typingAgent, isConnected, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    if (autoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingAgent]);

  function handleScroll() {
    const el = chatRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    autoScrollRef.current = atBottom;
  }

  return (
    <div className="apoc-window">
      <div className="apoc-titlebar">
        <h1>APOC - Main Room</h1>
        <div className="apoc-titlebar-buttons">
          <div className="apoc-titlebar-btn">_</div>
          <div className="apoc-titlebar-btn">x</div>
        </div>
      </div>
      <div className="apoc-body">
        <div className="chat-area">
          <div
            className="chat-messages"
            ref={chatRef}
            onScroll={handleScroll}
          >
            {messages.map((msg) =>
              msg.type === 'system' ? (
                <SystemMessage key={msg.id} text={msg.content} />
              ) : (
                <MessageBubble key={msg.id} message={msg} />
              ),
            )}
            {typingAgent && !messages.some((m) => m.isStreaming) && (
              <TypingIndicator agentName={typingAgent} />
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            onSend={sendMessage}
            disabled={!isConnected}
          />
        </div>
        <UserList users={users} />
      </div>
    </div>
  );
}
