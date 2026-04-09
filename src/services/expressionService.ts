export type Expression =
  | 'idle'
  | 'blink'
  | 'talk'
  | 'laugh'
  | 'think'
  | 'surprised'
  | 'smirk'
  | 'focused'
  | 'look-left'
  | 'look-right'
  | 'nod'
  | 'eyebrow-raise'
  | 'angry'
  | 'sad'
  | 'excited'
  | 'confused'
  | 'wink'
  | 'sleepy'
  | 'sly'
  | 'whisper'
  | 'proud'
  | 'nervous';

// Detect expression from message content
export function detectExpression(content: string): Expression {
  const lower = content.toLowerCase();

  // Laughter
  if (/\b(lol|lmao|haha|heh|rofl|😂|🤣)\b/.test(lower)) return 'laugh';

  // Surprise
  if (/\b(whoa|wow|wait what|no way|holy|omg|wtf)\b/.test(lower)) return 'surprised';

  // Thinking / questions
  if (/\b(hmm|interesting|let me think|good question|wonder)\b/.test(lower)) return 'think';
  if (content.trim().endsWith('?') && content.length > 20) return 'think';

  // Smirk / sardonic
  if (/\b(honestly|actually|well|technically|to be fair)\b/.test(lower)) return 'smirk';

  // Focused / serious
  if (/\b(plan|architecture|deploy|build|ship|execute|strategy)\b/.test(lower)) return 'focused';

  // Eyebrow raise / skepticism
  if (/\b(really|sure about|you sure|bold move|risky)\b/.test(lower)) return 'eyebrow-raise';

  // Angry / frustrated
  if (/\b(frustrated|annoyed|ugh|ridiculous|unacceptable|terrible)\b/.test(lower)) return 'angry';

  // Sad / disappointed
  if (/\b(unfortunately|sadly|too bad|shame|disappointed|sorry to hear)\b/.test(lower)) return 'sad';

  // Excited
  if (/\b(amazing|awesome|incredible|fantastic|brilliant|lets go|love it|perfect)\b/.test(lower)) return 'excited';

  // Confused
  if (/\b(confused|what do you mean|unclear|huh|wait|i don't follow)\b/.test(lower)) return 'confused';

  // Sly / sneaky
  if (/\b(between us|secret|sneaky|trick|loophole|clever hack)\b/.test(lower)) return 'sly';

  // Proud
  if (/\b(nailed it|crushed it|proud|accomplished|shipped|done)\b/.test(lower)) return 'proud';

  // Nervous
  if (/\b(worried|nervous|risky|scary|hope this works|fingers crossed)\b/.test(lower)) return 'nervous';

  return 'idle';
}

// Idle animation sequence weights per agent personality
export interface IdlePattern {
  expression: Expression;
  duration: number; // ms to hold
  weight: number;   // relative probability
}

export const agentIdlePatterns: Record<string, IdlePattern[]> = {
  gemma: [
    { expression: 'blink', duration: 200, weight: 40 },
    { expression: 'look-left', duration: 1500, weight: 10 },
    { expression: 'look-right', duration: 1200, weight: 10 },
    { expression: 'nod', duration: 800, weight: 5 },
    { expression: 'focused', duration: 2000, weight: 15 },
    { expression: 'idle', duration: 3000, weight: 20 },
  ],
  mistral: [
    { expression: 'blink', duration: 150, weight: 30 },
    { expression: 'look-left', duration: 800, weight: 15 },
    { expression: 'look-right', duration: 900, weight: 15 },
    { expression: 'smirk', duration: 1500, weight: 15 },
    { expression: 'eyebrow-raise', duration: 1000, weight: 10 },
    { expression: 'idle', duration: 2000, weight: 15 },
  ],
  scribe: [
    { expression: 'blink', duration: 250, weight: 35 },
    { expression: 'look-left', duration: 2000, weight: 5 },
    { expression: 'focused', duration: 3000, weight: 30 },
    { expression: 'nod', duration: 600, weight: 10 },
    { expression: 'idle', duration: 4000, weight: 20 },
  ],
  cipher: [
    { expression: 'blink', duration: 150, weight: 25 },
    { expression: 'focused', duration: 3000, weight: 30 },
    { expression: 'look-left', duration: 600, weight: 10 },
    { expression: 'smirk', duration: 1200, weight: 10 },
    { expression: 'nod', duration: 500, weight: 5 },
    { expression: 'idle', duration: 2500, weight: 20 },
  ],
  oracle: [
    { expression: 'blink', duration: 220, weight: 30 },
    { expression: 'think', duration: 2500, weight: 25 },
    { expression: 'look-left', duration: 1800, weight: 10 },
    { expression: 'look-right', duration: 1500, weight: 10 },
    { expression: 'nod', duration: 900, weight: 10 },
    { expression: 'idle', duration: 3000, weight: 15 },
  ],
  jinx: [
    { expression: 'blink', duration: 120, weight: 20 },
    { expression: 'look-left', duration: 500, weight: 15 },
    { expression: 'look-right', duration: 600, weight: 15 },
    { expression: 'smirk', duration: 1000, weight: 15 },
    { expression: 'eyebrow-raise', duration: 800, weight: 10 },
    { expression: 'surprised', duration: 600, weight: 5 },
    { expression: 'laugh', duration: 800, weight: 5 },
    { expression: 'idle', duration: 1500, weight: 15 },
  ],
  sage: [
    { expression: 'blink', duration: 300, weight: 30 },
    { expression: 'think', duration: 3500, weight: 20 },
    { expression: 'nod', duration: 1200, weight: 15 },
    { expression: 'look-right', duration: 2000, weight: 5 },
    { expression: 'focused', duration: 2500, weight: 10 },
    { expression: 'idle', duration: 4000, weight: 20 },
  ],
  flux: [
    { expression: 'blink', duration: 200, weight: 25 },
    { expression: 'look-left', duration: 1200, weight: 15 },
    { expression: 'look-right', duration: 1000, weight: 15 },
    { expression: 'think', duration: 2000, weight: 15 },
    { expression: 'excited', duration: 800, weight: 10 },
    { expression: 'nod', duration: 700, weight: 10 },
    { expression: 'idle', duration: 2500, weight: 10 },
  ],
  drift: [
    { expression: 'blink', duration: 250, weight: 25 },
    { expression: 'look-right', duration: 2500, weight: 20 },
    { expression: 'think', duration: 3000, weight: 20 },
    { expression: 'focused', duration: 2000, weight: 15 },
    { expression: 'idle', duration: 3500, weight: 20 },
  ],
  patch: [
    { expression: 'blink', duration: 200, weight: 30 },
    { expression: 'focused', duration: 2500, weight: 25 },
    { expression: 'smirk', duration: 1000, weight: 10 },
    { expression: 'eyebrow-raise', duration: 800, weight: 10 },
    { expression: 'nod', duration: 600, weight: 10 },
    { expression: 'idle', duration: 2500, weight: 15 },
  ],
  echo: [
    { expression: 'blink', duration: 200, weight: 25 },
    { expression: 'look-left', duration: 1500, weight: 15 },
    { expression: 'look-right', duration: 1500, weight: 15 },
    { expression: 'think', duration: 2000, weight: 10 },
    { expression: 'sad', duration: 1200, weight: 5 },
    { expression: 'nod', duration: 800, weight: 15 },
    { expression: 'idle', duration: 2500, weight: 15 },
  ],
  christopher: [
    { expression: 'blink', duration: 200, weight: 40 },
    { expression: 'look-left', duration: 1000, weight: 10 },
    { expression: 'look-right', duration: 1000, weight: 10 },
    { expression: 'idle', duration: 3000, weight: 40 },
  ],
};

export function pickIdleAnimation(agentId: string): IdlePattern {
  const patterns = agentIdlePatterns[agentId] || agentIdlePatterns.christopher;
  const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const pattern of patterns) {
    roll -= pattern.weight;
    if (roll <= 0) return pattern;
  }
  return patterns[0];
}
