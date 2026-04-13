import { useMemo, useState } from 'react';
import { SessionBrief } from '../types';

interface Props {
  brief: SessionBrief;
  onChange: (brief: SessionBrief) => void;
}

export default function SessionBriefPanel({ brief, onChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  function updateField(field: keyof SessionBrief, value: string) {
    onChange({ ...brief, [field]: value });
  }

  const summary = useMemo(() => {
    const parts = [
      brief.goal && `Goal: ${brief.goal}`,
      brief.topic && `Topic: ${brief.topic}`,
      brief.constraints && `Constraints: ${brief.constraints}`,
      brief.output && `Output: ${brief.output}`,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' • ') : 'No pinned brief yet';
  }, [brief]);

  return (
    <section className="session-brief-panel">
      <div className="panel-header">
        <div className="panel-kicker">Pinned Brief</div>
        <button
          type="button"
          className="panel-toggle-btn"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Hide' : 'Edit'}
        </button>
      </div>
      <div className="panel-summary">{summary}</div>
      {isExpanded && (
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
      )}
    </section>
  );
}
