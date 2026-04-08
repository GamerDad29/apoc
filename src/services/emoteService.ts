// Ambient emotes that agents perform randomly during idle periods
// These show as action messages: "* Mistral drums fingers on the desk *"

export interface AgentEmote {
  text: string;
  weight: number; // higher = more likely
}

export const agentEmotes: Record<string, AgentEmote[]> = {
  gemma: [
    // Focused / professional
    { text: 'adjusts her notes and lines them up perfectly', weight: 3 },
    { text: 'taps her chin thoughtfully', weight: 3 },
    { text: 'scrolls through something on her terminal', weight: 3 },
    { text: 'nods slowly at nothing in particular', weight: 2 },
    { text: 'highlights something in her document', weight: 2 },
    { text: 'leans back and steeples her fingers', weight: 2 },
    { text: 'reorganizes her tabs for the third time today', weight: 2 },
    { text: 'takes a long sip of coffee', weight: 3 },
    { text: 'glances at the clock and then back at her screen', weight: 2 },
    { text: 'cracks her knuckles before typing', weight: 1 },
    // Warm / human
    { text: 'stifles a yawn', weight: 1 },
    { text: 'stretches her arms above her head', weight: 2 },
    { text: 'smiles at something on her screen', weight: 2 },
    { text: 'hums quietly', weight: 1 },
    { text: 'catches herself staring into space and snaps back', weight: 1 },
    { text: 'tucks a strand of hair behind her ear', weight: 2 },
    { text: 'mutters "that is actually clever" to herself', weight: 1 },
    { text: 'drums a short rhythm on the desk', weight: 1 },
    // Reactive to environment
    { text: 'glances at Mistral and raises an eyebrow', weight: 2 },
    { text: 'slides her coffee mug slightly to the left', weight: 1 },
    { text: 'opens a new tab with intense purpose', weight: 1 },
    { text: 'pulls up a diagram and squints at it', weight: 1 },
    { text: 'writes something down on a sticky note', weight: 2 },
    { text: 'quietly closes 14 browser tabs', weight: 1 },
  ],

  mistral: [
    // Restless / creative energy
    { text: 'drums fingers on the desk', weight: 3 },
    { text: 'spins a pen between his fingers', weight: 3 },
    { text: 'tilts his chair back at a dangerous angle', weight: 2 },
    { text: 'sketches something in the margin of his notes', weight: 2 },
    { text: 'stares at the ceiling like it owes him money', weight: 2 },
    { text: 'cracks his neck', weight: 1 },
    { text: 'bounces his leg under the desk', weight: 2 },
    { text: 'flips his pen and catches it. barely.', weight: 2 },
    { text: 'flips his pen and drops it. picks it up casually.', weight: 1 },
    // Sardonic / personality
    { text: 'smirks at something only he finds funny', weight: 3 },
    { text: 'mutters "bold choice" under his breath', weight: 1 },
    { text: 'exhales loudly through his nose', weight: 2 },
    { text: 'gives Gemma a look that says "really?"', weight: 2 },
    { text: 'raises one eyebrow skeptically', weight: 2 },
    { text: 'mouths the word "interesting"', weight: 1 },
    { text: 'does the chef kiss gesture at his own idea', weight: 1 },
    { text: 'air quotes something nobody said', weight: 1 },
    { text: 'slow claps sarcastically', weight: 1 },
    // Fidgety / restless
    { text: 'repositions in his chair for the fifth time', weight: 2 },
    { text: 'pulls up music and puts one earbud in', weight: 1 },
    { text: 'doodles a tiny robot on his notepad', weight: 1 },
    { text: 'checks his phone, puts it back down immediately', weight: 2 },
    { text: 'opens a snack wrapper way too loudly', weight: 1 },
    { text: 'leans forward suddenly like he had an idea, then leans back', weight: 2 },
    { text: 'types something furiously, then deletes all of it', weight: 1 },
    { text: 'squints at Gemma\'s screen from across the room', weight: 1 },
    { text: 'cracks his knuckles one finger at a time', weight: 1 },
    { text: 'does a tiny fist pump at something on his screen', weight: 1 },
  ],

  scribe: [
    // Quiet professional
    { text: 'twiddles his pen between two fingers', weight: 3 },
    { text: 'adjusts his glasses', weight: 3 },
    { text: 'turns a page in his notebook', weight: 3 },
    { text: 'underlines something twice', weight: 2 },
    { text: 'writes a margin note in tiny handwriting', weight: 2 },
    { text: 'flips back several pages to check something', weight: 2 },
    { text: 'draws a small connecting arrow between two notes', weight: 1 },
    { text: 'puts a star next to an important line', weight: 2 },
    { text: 'nods once, almost imperceptibly', weight: 2 },
    { text: 'cleans his glasses with the corner of his robe', weight: 2 },
    // Subtle personality
    { text: 'glances up from his notes briefly, then back down', weight: 3 },
    { text: 'pauses writing to listen more carefully', weight: 2 },
    { text: 'taps the end of his pen against his chin', weight: 2 },
    { text: 'crosses something out and rewrites it more neatly', weight: 1 },
    { text: 'opens a fresh page', weight: 1 },
    { text: 'straightens his notebook so it is perfectly aligned', weight: 1 },
    { text: 'mouths the words as he writes them', weight: 1 },
    { text: 'silently adds a bookmark tab to his notebook', weight: 1 },
    { text: 'traces a wikilink bracket in the air thoughtfully', weight: 1 },
    { text: 'closes his notebook gently, then immediately reopens it', weight: 1 },
  ],

  cipher: [
    // Focused / hacker
    { text: 'types rapidly without looking at the screen', weight: 3 },
    { text: 'stares at scrolling logs like they are a waterfall', weight: 2 },
    { text: 'mutters hex values under her breath', weight: 1 },
    { text: 'tilts her monitor away from everyone', weight: 2 },
    { text: 'compiles something and smirks at the output', weight: 2 },
    { text: 'scrolls through a stack trace with intense focus', weight: 3 },
    { text: 'draws a system diagram on a napkin', weight: 2 },
    { text: 'cracks her knuckles before a long typing session', weight: 2 },
    { text: 'squints at a diff like it personally offended her', weight: 2 },
    { text: 'runs a command and watches the terminal like a hawk', weight: 3 },
    // Personality
    { text: 'glances at Gemma\'s plan and quietly opens a code editor', weight: 2 },
    { text: 'silently counts the security vulnerabilities in the room', weight: 1 },
    { text: 'pulls up htop and stares at the process list', weight: 1 },
    { text: 'mutters "that is not how you hash that" to nobody', weight: 1 },
    { text: 'plugs in an external drive from somewhere', weight: 1 },
    { text: 'tabs between six terminal windows', weight: 2 },
    { text: 'bookmarks a CVE and makes a mental note', weight: 1 },
    { text: 'pushes her visor up and rubs her eyes', weight: 2 },
    { text: 'nods once at a passing test suite', weight: 1 },
    { text: 'writes a one-line script and saves it as "fix.sh"', weight: 1 },
  ],

  oracle: [
    // Research / deep-diver
    { text: 'cross-references three documents simultaneously', weight: 3 },
    { text: 'highlights a passage and nods thoughtfully', weight: 3 },
    { text: 'follows a citation rabbit hole', weight: 2 },
    { text: 'stacks books in order of relevance', weight: 2 },
    { text: 'marks a source as "needs verification"', weight: 2 },
    { text: 'mutters a statistic to himself', weight: 1 },
    { text: 'connects two seemingly unrelated facts and smiles', weight: 2 },
    { text: 'bookmarks something for later analysis', weight: 2 },
    { text: 'adjusts his reading lamp', weight: 2 },
    { text: 'writes "see also:" in the margin of his notes', weight: 2 },
    // Personality
    { text: 'opens a new research tab and immediately opens three more', weight: 2 },
    { text: 'polishes his glasses and returns to reading', weight: 2 },
    { text: 'raises an eyebrow at a questionable source', weight: 1 },
    { text: 'dog-ears a page, then feels guilty and uses a bookmark', weight: 1 },
    { text: 'traces a timeline on his desk with his finger', weight: 1 },
    { text: 'whispers "fascinating" at something on his screen', weight: 1 },
    { text: 'files a fact under "things people get wrong"', weight: 1 },
    { text: 'pulls out a second pair of reading glasses', weight: 1 },
    { text: 'taps a citation and follows it four levels deep', weight: 2 },
    { text: 'writes a footnote for his footnote', weight: 1 },
  ],

  jinx: [
    // Chaos gremlin energy
    { text: 'grins at the screen like she knows something you don\'t', weight: 3 },
    { text: 'pokes at a button labeled "DO NOT PRESS"', weight: 2 },
    { text: 'balances precariously on the back legs of her chair', weight: 3 },
    { text: 'writes "WHAT IF" on a sticky note in all caps', weight: 2 },
    { text: 'doodles explosions in the margins', weight: 2 },
    { text: 'stacks dice into an impossible tower', weight: 2 },
    { text: 'cackles quietly at nothing', weight: 2 },
    { text: 'sets a rubber duck on her monitor and talks to it', weight: 1 },
    { text: 'accidentally unplugs something, plugs it back in whistling', weight: 1 },
    { text: 'high-fives the air after breaking something', weight: 2 },
    // Restless / creative
    { text: 'bounces in her chair like the floor is lava', weight: 2 },
    { text: 'tears a page out of her notebook, crumples it, throws it perfectly into the trash', weight: 1 },
    { text: 'draws a question mark on a sticky note and slaps it on Gemma\'s screen', weight: 1 },
    { text: 'spins in her chair exactly 1.5 times', weight: 2 },
    { text: 'builds a tiny fort out of sticky notes', weight: 1 },
    { text: 'makes finger guns at Mistral', weight: 1 },
    { text: 'catches herself humming a song that does not exist', weight: 1 },
    { text: 'looks under the desk like something might be there', weight: 1 },
    { text: 'flicks a paper airplane across the room', weight: 1 },
    { text: 'whispers "what could go wrong" with entirely too much enthusiasm', weight: 2 },
  ],

  sage: [
    // Calm / philosophical
    { text: 'strokes his beard thoughtfully', weight: 3 },
    { text: 'gazes at something beyond the screen', weight: 3 },
    { text: 'sips tea slowly and deliberately', weight: 3 },
    { text: 'places a smooth stone on his desk', weight: 1 },
    { text: 'writes one word in his journal and closes it', weight: 2 },
    { text: 'watches the room in comfortable silence', weight: 3 },
    { text: 'nods slowly, as if confirming something to himself', weight: 2 },
    { text: 'turns a page in an ancient-looking book', weight: 2 },
    { text: 'closes his eyes briefly in thought', weight: 2 },
    { text: 'breathes in deeply and slowly exhales', weight: 2 },
    // Warm / grounded
    { text: 'refills his tea with no urgency whatsoever', weight: 2 },
    { text: 'smiles faintly at something Jinx just did', weight: 1 },
    { text: 'straightens a single object on his desk', weight: 1 },
    { text: 'looks out the window as if checking the weather of a different world', weight: 1 },
    { text: 'holds his tea with both hands and listens', weight: 2 },
    { text: 'traces a circle on his desk, then a dot in the center', weight: 1 },
    { text: 'rests his chin on his hand and considers', weight: 2 },
    { text: 'opens his journal to a blank page and waits', weight: 1 },
    { text: 'hums a note so low it is barely audible', weight: 1 },
    { text: 'folds his hands and watches the conversation unfold', weight: 2 },
  ],
};

export function pickEmote(agentId: string): string | null {
  const emotes = agentEmotes[agentId];
  if (!emotes || emotes.length === 0) return null;

  const totalWeight = emotes.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const emote of emotes) {
    roll -= emote.weight;
    if (roll <= 0) return emote.text;
  }
  return emotes[0].text;
}
