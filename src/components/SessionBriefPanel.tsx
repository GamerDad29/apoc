import { SessionBrief } from '../types';

interface Props {
  brief: SessionBrief;
  onChange: (brief: SessionBrief) => void;
}

export default function SessionBriefPanel({ brief, onChange }: Props) {
  function updateField(field: keyof SessionBrief, value: string) {
    onChange({ ...brief, [field]: value });
  }

  return (
    <section className="session-brief-panel">
      <div className="panel-kicker">Pinned Brief</div>
      <div className="session-brief-grid">
        <label className="control-field">
          <span>Goal</span>
          <input
            type="text"
            value={brief.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            placeholder="What outcome matters here?"
          />
        </label>
        <label className="control-field">
          <span>Topic</span>
          <input
            type="text"
            value={brief.topic}
            onChange={(e) => updateField('topic', e.target.value)}
            placeholder="Current focus"
          />
        </label>
        <label className="control-field control-field-wide">
          <span>Constraints</span>
          <textarea
            value={brief.constraints}
            onChange={(e) => updateField('constraints', e.target.value)}
            placeholder="Budget, time, guardrails, hard requirements"
            rows={2}
          />
        </label>
        <label className="control-field control-field-wide">
          <span>Desired Output</span>
          <textarea
            value={brief.output}
            onChange={(e) => updateField('output', e.target.value)}
            placeholder="What should the hall produce?"
            rows={2}
          />
        </label>
      </div>
    </section>
  );
}
