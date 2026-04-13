import { useMemo, useState } from 'react';
import { Message } from '../types';

interface Props {
  messages: Message[];
  onUnpin: (messageId: string) => void;
  onQuote: (message: Message) => void;
}

export default function PinnedMessagesPanel({ messages, onUnpin, onQuote }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (messages.length === 0) return null;

  const summary = useMemo(() => {
    const senders = Array.from(new Set(messages.map((message) => message.senderName)));
    return `${messages.length} pinned ${messages.length === 1 ? 'message' : 'messages'}${senders.length ? ` • ${senders.join(', ')}` : ''}`;
  }, [messages]);

  return (
    <section className="pinned-messages-panel">
      <div className="panel-header">
        <div className="panel-kicker">Pinned Messages</div>
        <button
          type="button"
          className="panel-toggle-btn"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="panel-summary">{summary}</div>
      {isExpanded && (
        <div className="pinned-messages-list">
          {messages.map((message) => (
            <article key={message.id} className="pinned-message-card">
              <div className="pinned-message-meta">
                <span style={{ color: message.senderColor }}>{message.senderName}</span>
              </div>
              <div className="pinned-message-content">{message.content}</div>
              <div className="pinned-message-actions">
                <button onClick={() => onQuote(message)}>Quote</button>
                <button onClick={() => onUnpin(message.id)}>Unpin</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
