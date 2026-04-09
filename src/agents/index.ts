import { AgentConfig } from '../types';
import { gemma } from './gemma';
import { mistral } from './mistral';
import { scribe } from './scribe';
import { cipher } from './cipher';
import { oracle } from './oracle';
import { jinx } from './jinx';
import { sage } from './sage';
import { flux } from './flux';
import { drift } from './drift';
import { patch } from './patch';
import { echo } from './echo';

export const agents: AgentConfig[] = [
  gemma,
  mistral,
  scribe,
  cipher,
  oracle,
  jinx,
  sage,
  flux,
  drift,
  patch,
  echo,
];

export function getAgent(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
