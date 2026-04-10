import { Message } from '../types';
import { Expression } from '../services/expressionService';
import AnimatedAvatar from './AnimatedAvatar';

interface Props {
  message: Message;
  searchQuery?: string;
  onClickAgent?: (agentId: string) => void;
  expression?: Expression;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Safe markdown renderer: builds React elements directly instead of injecting
// HTML strings. Text passed through React children is auto-escaped, so no
// dangerouslySetInnerHTML is used anywhere.
//
// Supported syntax (in precedence order):
//   ```...```   fenced code block
//   `...`       inline code
//   **...**     strong
//   *...*       em
// After markdown tokenization, optional searchQuery highlighting wraps matches
// in <mark>.

type Node = string | JSX.Element;

const TOKEN_PATTERNS: { name: 'codeBlock' | 'code' | 'strong' | 'em'; re: RegExp }[] = [
  { name: 'codeBlock', re: /```([\s\S]*?)```/ },
  { name: 'code', re: /`([^`\n]+)`/ },
  { name: 'strong', re: /\*\*([^*]+)\*\*/ },
  { name: 'em', re: /(?<!\*)\*([^*\n]+)\*(?!\*)/ },
];

function tokenizeMarkdown(text: string, keyPrefix = 'md'): Node[] {
  // Find the earliest match among all patterns, recurse on the remainder.
  let earliest: { idx: number; len: number; inner: string; name: string } | null = null;
  for (const { name, re } of TOKEN_PATTERNS) {
    const m = re.exec(text);
    if (m && (earliest === null || m.index < earliest.idx)) {
      earliest = { idx: m.index, len: m[0].length, inner: m[1], name };
    }
  }
  if (!earliest) return [text];

  const before = text.slice(0, earliest.idx);
  const after = text.slice(earliest.idx + earliest.len);
  const key = `${keyPrefix}-${earliest.idx}`;
  let node: JSX.Element;
  switch (earliest.name) {
    case 'codeBlock':
      node = <pre key={key}>{earliest.inner}</pre>;
      break;
    case 'code':
      node = <code key={key}>{earliest.inner}</code>;
      break;
    case 'strong':
      node = <strong key={key}>{earliest.inner}</strong>;
      break;
    case 'em':
      node = <em key={key}>{earliest.inner}</em>;
      break;
    default:
      node = <span key={key}>{earliest.inner}</span>;
  }

  const result: Node[] = [];
  if (before) result.push(before);
  result.push(node);
  if (after) result.push(...tokenizeMarkdown(after, `${keyPrefix}>`));
  return result;
}

function highlightSearch(nodes: Node[], query: string): Node[] {
  if (!query) return nodes;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');

  const out: Node[] = [];
  let keyCounter = 0;
  for (const node of nodes) {
    if (typeof node !== 'string') {
      out.push(node);
      continue;
    }
    const parts = node.split(re);
    for (const part of parts) {
      if (!part) continue;
      if (re.test(part)) {
        // reset since /g is stateful
        re.lastIndex = 0;
        out.push(
          <mark
            key={`hl-${keyCounter++}`}
            style={{ background: '#c9a84c33', color: '#e0f0c0' }}
          >
            {part}
          </mark>,
        );
      } else {
        re.lastIndex = 0;
        out.push(part);
      }
    }
  }
  return out;
}

export function renderMessageContent(text: string, searchQuery?: string): Node[] {
  const tokens = tokenizeMarkdown(text);
  return highlightSearch(tokens, searchQuery || '');
}

export default function MessageBubble({ message, searchQuery, onClickAgent, expression }: Props) {
  const isAgent = message.type === 'agent';
  const isUser = message.type === 'user';
  const showAnimatedAvatar = isAgent || isUser;

  return (
    <div className={`message ${searchQuery ? 'highlighted' : ''}`}>
      {showAnimatedAvatar ? (
        <AnimatedAvatar
          agentId={message.senderId}
          size={38}
          expression={expression}
          className="message-avatar"
        />
      ) : (
        <img
          className="message-avatar"
          src={message.avatarUrl}
          alt={message.senderName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/avatars/user.svg';
          }}
        />
      )}
      <div className="message-body">
        <div className="message-header">
          <span
            className={`message-sender ${isAgent ? 'clickable' : ''}`}
            style={{ color: message.senderColor }}
            onClick={() => {
              if (isAgent && onClickAgent) onClickAgent(message.senderId);
            }}
          >
            {message.senderName}
          </span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-content">
          {renderMessageContent(message.content, searchQuery)}
          {message.isStreaming && <span className="streaming-cursor" />}
        </div>
      </div>
    </div>
  );
}
