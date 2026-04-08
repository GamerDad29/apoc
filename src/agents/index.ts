import { AgentConfig } from '../types';
import { gemma } from './gemma';
import { mistral } from './mistral';
import { scribe } from './scribe';
import { cipher } from './cipher';
import { oracle } from './oracle';
import { jinx } from './jinx';
import { sage } from './sage';

export const agents: AgentConfig[] = [
  gemma,
  mistral,
  scribe,
  cipher,
  oracle,
  jinx,
  sage,
];

export function getAgent(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
