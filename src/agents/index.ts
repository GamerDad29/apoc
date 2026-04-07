import { AgentConfig } from '../types';
import { gemma } from './gemma';
// import { mistral } from './mistral';  // uncomment when ready

export const agents: AgentConfig[] = [
  gemma,
  // mistral,
];

export function getAgent(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
