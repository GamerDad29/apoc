import { Message } from '../types';

interface Props {
  message: Message;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function MessageBubble({ message }: Props) {
  return (
    <div className="message">
      <img
        className="message-avatar"
        src={message.avatarUrl}
        alt={message.senderName}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/avatars/user.svg';
        }}
      />
      <div className="message-body">
        <div className="message-header">
          <span
            className="message-sender"
            style={{ color: message.senderColor }}
          >
            {message.senderName}
          </span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-content">
          {message.content}
          {message.isStreaming && <span className="streaming-cursor" />}
        </div>
      </div>
    </div>
  );
}
