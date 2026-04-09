import { Room } from '../types';

export const rooms: Room[] = [
  {
    id: 'main',
    name: 'Main Room',
    description: 'General comms. Full crew. Say what you need.',
    icon: '\u25C8',
    agents: ['gemma', 'mistral', 'scribe', 'cipher', 'oracle', 'jinx', 'sage', 'flux', 'drift', 'patch', 'echo'],
  },
  {
    id: 'project',
    name: 'Project Room',
    description: 'Focused work. Strategy, architecture, code, research.',
    icon: '\u25A3',
    agents: ['gemma', 'cipher', 'oracle', 'patch', 'scribe'],
  },
  {
    id: 'makers',
    name: 'Makers Space',
    description: 'Creative builds. Brainstorm, break things, find meaning.',
    icon: '\u2692',
    agents: ['mistral', 'jinx', 'sage', 'echo', 'scribe'],
  },
  {
    id: 'vision',
    name: 'Vision Space',
    description: 'Forward-looking exploration. Ideas, trends, possibilities.',
    icon: '\u2605',
    agents: ['jinx', 'drift', 'flux', 'oracle', 'echo', 'scribe'],
  },
];

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
