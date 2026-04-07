interface Props {
  agentName: string;
}

export default function TypingIndicator({ agentName }: Props) {
  return (
    <div className="typing-indicator">
      <span>{agentName} is typing</span>
      <div className="typing-dots">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}
