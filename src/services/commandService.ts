import { getUsage, resetSession } from './tokenBudget';
import { agents } from '../agents';

export interface CommandResult {
  type: 'system' | 'action' | 'clear' | 'notes' | 'export' | 'none';
  content: string;
  targetAgent?: string;
}

export function parseCommand(input: string, _userId: string, userName: string): CommandResult | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return null;

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1).join(' ');

  switch (cmd) {
    case '/me':
      if (!rest) return { type: 'system', content: 'Usage: /me <action>' };
      return { type: 'action', content: `* ${userName} ${rest} *` };

    case '/clear':
      return { type: 'clear', content: 'Chat cleared.' };

    case '/reset':
      return { type: 'clear', content: 'Conversation reset. All agents have forgotten everything.' };

    case '/notes':
      return { type: 'notes', content: rest || 'Compile notes from this conversation.', targetAgent: 'scribe' };

    case '/export':
      return { type: 'export', content: 'Exporting notes...' };

    case '/budget': {
      const lines = agents.map((agent) => {
        const usage = getUsage(agent.id);
        const sessionPct = Math.round((usage.sessionTokensUsed / usage.sessionTokenLimit) * 100);
        const dailyPct = Math.round((usage.dailyTokensUsed / usage.dailyTokenLimit) * 100);
        const cost = agent.modelId.includes(':free') ? 'FREE' : `${sessionPct}%`;
        return `${agent.name}: session ${usage.sessionTokensUsed.toLocaleString()}/${usage.sessionTokenLimit.toLocaleString()} (${cost}) | daily ${usage.dailyTokensUsed.toLocaleString()}/${usage.dailyTokenLimit.toLocaleString()} (${dailyPct}%)`;
      });
      return { type: 'system', content: `TOKEN BUDGET\n${lines.join('\n')}` };
    }

    case '/resetbudget': {
      agents.forEach((agent) => resetSession(agent.id));
      return { type: 'system', content: 'Session token budgets reset for all agents.' };
    }

    case '/help':
      return {
        type: 'system',
        content: [
          'AVAILABLE COMMANDS',
          '/me <action> ..... Perform an action',
          '/clear ........... Clear chat history',
          '/reset ........... Reset conversation (agents forget)',
          '/notes [topic] ... Ask Scribe to compile session notes',
          '/export .......... Download last notes as .md for Obsidian',
          '/budget .......... Show token usage',
          '/resetbudget ..... Reset session token budgets',
          '/help ............ Show this message',
          '',
          'TALKING TO AGENTS',
          '@gemma <msg> ..... Direct message to Gemma',
          '@mistral <msg> ... Direct message to Mistral',
          '@scribe <msg> .... Direct message to Scribe',
          'hey all .......... All agents respond',
          '',
          'Unaddressed messages go to chat but',
          'do NOT auto-trigger any agent.',
        ].join('\n'),
      };

    default:
      return { type: 'system', content: `Unknown command: ${cmd}. Type /help for a list.` };
  }
}

export function parseTargetAgent(text: string): { agentId: string | null; cleanText: string; heyAll: boolean } {
  // Check for "hey all", "hey everyone", "hey everybody"
  const heyAllPattern = /^hey\s+(all|everyone|everybody|team|crew|gang|y'all)\b/i;
  if (heyAllPattern.test(text.trim())) {
    return { agentId: null, cleanText: text, heyAll: true };
  }

  // Check for @agent targeting
  const match = text.match(/^@(\w+)\s+([\s\S]+)/);
  if (!match) return { agentId: null, cleanText: text, heyAll: false };

  const name = match[1].toLowerCase();
  const agent = agents.find((a) => a.id === name || a.name.toLowerCase() === name);
  if (!agent) return { agentId: null, cleanText: text, heyAll: false };

  return { agentId: agent.id, cleanText: match[2], heyAll: false };
}
