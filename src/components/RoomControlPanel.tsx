import { ActiveDiscussion, DiscussionMode } from '../types';

interface AgentOption {
  id: string;
  name: string;
  color: string;
}

interface Props {
  mode: DiscussionMode;
  topic: string;
  durationMinutes: number;
  includeScribe: boolean;
  selectedAgents: string[];
  agentOptions: AgentOption[];
  activeDiscussion: ActiveDiscussion | null;
  onModeChange: (mode: DiscussionMode) => void;
  onTopicChange: (topic: string) => void;
  onDurationChange: (minutes: number) => void;
  onIncludeScribeChange: (include: boolean) => void;
  onToggleAgent: (agentId: string) => void;
  onStart: () => void;
  onStop: () => void;
}

const MODE_LABELS: Record<DiscussionMode, string> = {
  'round-robin': 'Round Robin',
  brainstorm: 'Brainstorm',
  critique: 'Critique',
  synthesis: 'Synthesis',
  freeform: 'Freeform',
};

export default function RoomControlPanel(props: Props) {
  const {
    mode,
    topic,
    durationMinutes,
    includeScribe,
    selectedAgents,
    agentOptions,
    activeDiscussion,
    onModeChange,
    onTopicChange,
    onDurationChange,
    onIncludeScribeChange,
    onToggleAgent,
    onStart,
    onStop,
  } = props;

  return (
    <section className="room-control-panel">
      <div className="panel-kicker">Hall Control</div>
      <div className="room-control-topline">
        <div className="room-control-status">
          {activeDiscussion ? `Running ${MODE_LABELS[activeDiscussion.mode]} on "${activeDiscussion.topic}"` : 'No active discussion'}
        </div>
        <div className="room-control-buttons">
          <button className="room-control-btn primary" onClick={onStart}>
            Start
          </button>
          <button className="room-control-btn" onClick={onStop} disabled={!activeDiscussion}>
            Stop
          </button>
        </div>
      </div>

      <div className="room-control-grid">
        <label className="control-field">
          <span>Mode</span>
          <select value={mode} onChange={(e) => onModeChange(e.target.value as DiscussionMode)}>
            {Object.entries(MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="control-field control-field-wide">
          <span>Topic</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="What is the hall working on?"
          />
        </label>

        <label className="control-field">
          <span>Duration</span>
          <select value={String(durationMinutes)} onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}>
            <option value="3">3 min</option>
            <option value="5">5 min</option>
            <option value="8">8 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </label>

        <label className="control-toggle">
          <input
            type="checkbox"
            checked={includeScribe}
            onChange={(e) => onIncludeScribeChange(e.target.checked)}
          />
          <span>Ask Scribe to summarize at the end</span>
        </label>
      </div>

      <div className="participant-strip">
        {agentOptions.map((agent) => {
          const selected = selectedAgents.includes(agent.id);
          return (
            <button
              key={agent.id}
              className={`participant-chip ${selected ? 'selected' : ''}`}
              style={{ color: agent.color }}
              onClick={() => onToggleAgent(agent.id)}
            >
              {agent.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
