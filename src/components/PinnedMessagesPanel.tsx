import { Message } from '../types';

interface Props {
  messages: Message[];
  onUnpin: (messageId: string) => void;
  onQuote: (message: Message) => void;
}

export default function PinnedMessagesPanel({ messages, onUnpin, onQuote }: Props) {
  if (messages.length === 0) return null;

  return (
    <section className="pinned-messages-panel">
      <div className="panel-kicker">Pinned Messages</div>
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
    </section>
  );
}
