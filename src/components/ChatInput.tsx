import { useState, useRef } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  draft?: string;
  onDraftChange?: (text: string) => void;
}

export default function ChatInput({ onSend, disabled, draft, onDraftChange }: Props) {
  const [internalText, setInternalText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const text = draft ?? internalText;

  const isCommand = text.startsWith('/');

  function updateText(next: string) {
    if (onDraftChange) onDraftChange(next);
    else setInternalText(next);
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    updateText('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-bar">
      <input
        ref={inputRef}
        className={`chat-input ${isCommand ? 'command-mode' : ''}`}
        type="text"
        placeholder="Type a message... (/help for commands)"
        value={text}
        onChange={(e) => updateText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus
      />
      <button
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
      >
        Send
      </button>
    </div>
  );
}
