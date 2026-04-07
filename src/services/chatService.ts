import { AgentConfig, Message, ChatCompletionRequest } from '../types';
import { sendChatRequest } from './proxyService';
import { canSpend, recordUsage } from './tokenBudget';

function buildChatHistory(
  messages: Message[],
  agent: AgentConfig,
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const history: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: agent.systemPrompt },
  ];

  // Include last 30 messages for context
  const recent = messages
    .filter((m) => m.type !== 'system')
    .slice(-30);

  for (const msg of recent) {
    if (msg.senderId === agent.id) {
      history.push({ role: 'assistant', content: msg.content });
    } else {
      history.push({ role: 'user', content: `${msg.senderName}: ${msg.content}` });
    }
  }

  return history;
}

export async function sendMessageToAgent(
  agent: AgentConfig,
  messages: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  if (!canSpend(agent.id, agent.maxTokensPerResponse)) {
    onError(`Token budget exceeded for ${agent.name}. Try again later.`);
    return;
  }

  const chatHistory = buildChatHistory(messages, agent);

  const request: ChatCompletionRequest = {
    model: agent.modelId,
    messages: chatHistory,
    max_tokens: agent.maxTokensPerResponse,
    temperature: agent.temperature,
    stream: true,
  };

  let totalChars = 0;

  await sendChatRequest(
    request,
    (text) => {
      totalChars += text.length;
      onChunk(text);
    },
    () => {
      // Rough token estimate: 1 token per 4 chars
      const estimatedTokens = Math.ceil(totalChars / 4);
      recordUsage(agent.id, estimatedTokens);
      onDone();
    },
    onError,
  );
}

// Phase 1: Agent-to-agent exchange (scaffolded, not active)
export async function agentToAgentExchange(
  _agentA: AgentConfig,
  _agentB: AgentConfig,
  _topic: string,
  _maxTurns: number = 4,
  _maxTokensBudget: number = 4000,
): Promise<Message[]> {
  // Phase 1: implement this
  // For now, return empty array
  return [];
}
