import { Room } from '../types';

// Room ids are internal and stay the same across rebrands so that
// persisted message history (keyed on roomId) keeps working.
// User-facing names use the Norse hall naming.
//
// Roster updated in Shipment 2.6 (Agent Overhaul v2): Echo, Flux, Drift,
// and Patch retired; Scout added.
export const rooms: Room[] = [
  {
    id: 'main',
    name: 'Main Hall',
    description: 'The great hall. Full crew. Speak your mind.',
    icon: '\u25C8',
    agents: ['gemma', 'mistral', 'scribe', 'cipher', 'oracle', 'jinx', 'sage', 'scout'],
  },
  {
    id: 'project',
    name: 'War Room',
    description: 'Focused work. Strategy, architecture, code.',
    icon: '\u25A3',
    agents: ['gemma', 'cipher', 'oracle', 'scout', 'scribe'],
  },
  {
    id: 'makers',
    name: 'The Forge',
    description: 'Creative builds. Brainstorm, break things, make things.',
    icon: '\u2692',
    agents: ['mistral', 'jinx', 'sage', 'scribe'],
  },
  {
    id: 'vision',
    name: 'The Loom',
    description: 'Forward-looking. Ideas, trends, what comes next.',
    icon: '\u2605',
    agents: ['jinx', 'scout', 'oracle', 'sage', 'scribe'],
  },
];

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
