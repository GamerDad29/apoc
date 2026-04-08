import { useState, useEffect, useRef, useCallback } from 'react';
import { Expression, pickIdleAnimation } from '../services/expressionService';

interface Props {
  agentId: string;
  size: number;
  expression?: Expression;
  className?: string;
  mouseTarget?: { x: number; y: number };
}

interface AvatarParts {
  headColor: string;
  headDark: string;
  bgColor: string;
  borderColor: string;
}

const COLORS: Record<string, AvatarParts> = {
  gemma: { headColor: '#ff6b9d', headDark: '#cc4477', bgColor: '#1a1525', borderColor: '#2e2240' },
  mistral: { headColor: '#7b8cde', headDark: '#5a6abe', bgColor: '#141420', borderColor: '#252540' },
  scribe: { headColor: '#F0C75E', headDark: '#a88c3a', bgColor: '#1a1810', borderColor: '#35301a' },
  cipher: { headColor: '#00ff41', headDark: '#00aa2a', bgColor: '#0d1418', borderColor: '#1a2a30' },
  oracle: { headColor: '#b388ff', headDark: '#7c4dff', bgColor: '#161020', borderColor: '#2a1f40' },
  jinx: { headColor: '#ff6347', headDark: '#cc3322', bgColor: '#1a1014', borderColor: '#351a20' },
  sage: { headColor: '#4dd0e1', headDark: '#2a9aaa', bgColor: '#0d1520', borderColor: '#1a2a38' },
  christopher: { headColor: '#55ddaa', headDark: '#33aa77', bgColor: '#0d1418', borderColor: '#1a3030' },
};

export default function AnimatedAvatar({ agentId, size, expression: externalExpr, className, mouseTarget }: Props) {
  const [expr, setExpr] = useState<Expression>('idle');
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExternalRef = useRef(false);

  // External expression overrides idle
  useEffect(() => {
    if (externalExpr && externalExpr !== 'idle') {
      isExternalRef.current = true;
      setExpr(externalExpr);
      // Hold external expression for a bit, then return to idle
      const timer = setTimeout(() => {
        isExternalRef.current = false;
        setExpr('idle');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [externalExpr]);

  // Idle animation loop
  const scheduleIdle = useCallback(() => {
    const delay = 2000 + Math.random() * 5000;
    idleTimerRef.current = setTimeout(() => {
      if (!isExternalRef.current) {
        const anim = pickIdleAnimation(agentId);
        setExpr(anim.expression);
        setTimeout(() => {
          if (!isExternalRef.current) setExpr('idle');
          scheduleIdle();
        }, anim.duration);
      } else {
        scheduleIdle();
      }
    }, delay);
  }, [agentId]);

  useEffect(() => {
    scheduleIdle();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [scheduleIdle]);

  const c = COLORS[agentId] || COLORS.christopher;
  const s = size;
  const cx = s / 2;
  const headR = s * 0.17;
  const headY = s * 0.37;

  // Eye positions
  const eyeSpacing = s * 0.07;
  const eyeY = headY - s * 0.01;
  const leftEyeX = cx - eyeSpacing;
  const rightEyeX = cx + eyeSpacing;
  const eyeR = s * 0.025;

  // Mouse-tracking eye offset (for profile modal)
  let mouseEyeX = 0;
  let mouseEyeY = 0;
  if (mouseTarget) {
    const maxOffset = s * 0.025;
    const dx = mouseTarget.x - cx;
    const dy = mouseTarget.y - (headY);
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    mouseEyeX = Math.max(-maxOffset, Math.min(maxOffset, (dx / dist) * maxOffset));
    mouseEyeY = Math.max(-maxOffset * 0.5, Math.min(maxOffset * 0.5, (dy / dist) * maxOffset * 0.5));
  }

  // Expression-based transforms
  const isNervous = expr === 'nervous';
  const nervousJitter = isNervous ? (Math.random() > 0.5 ? s * 0.015 : -s * 0.015) : 0;
  const eyeOffsetX = mouseTarget ? mouseEyeX : (expr === 'look-left' ? -s * 0.02 : expr === 'look-right' ? s * 0.02 : nervousJitter);
  const eyeOffsetY = mouseTarget ? mouseEyeY : 0;
  const isBlink = expr === 'blink';
  const isLaugh = expr === 'laugh';
  const isThink = expr === 'think';
  const isSurprised = expr === 'surprised';
  const isSmirk = expr === 'smirk';
  const isFocused = expr === 'focused';
  const isEyebrowRaise = expr === 'eyebrow-raise';
  const isTalk = expr === 'talk';
  const isNod = expr === 'nod';
  const isAngry = expr === 'angry';
  const isSad = expr === 'sad';
  const isExcited = expr === 'excited';
  const isConfused = expr === 'confused';
  const isWink = expr === 'wink';
  const isSleepy = expr === 'sleepy';
  const isSly = expr === 'sly';
  const isWhisper = expr === 'whisper';
  const isProud = expr === 'proud';

  // Mouth shape
  let mouth;
  const mouthY = headY + s * 0.06;
  if (isLaugh || isExcited) {
    mouth = <ellipse cx={cx} cy={mouthY} rx={s * 0.04} ry={s * 0.03} fill="#0a0e0a" />;
  } else if (isSurprised) {
    mouth = <circle cx={cx} cy={mouthY + s * 0.01} r={s * 0.025} fill="#0a0e0a" />;
  } else if (isSmirk || isSly) {
    mouth = <path d={`M${cx - s * 0.03} ${mouthY} Q${cx} ${mouthY + s * 0.02} ${cx + s * 0.05} ${mouthY - s * 0.01}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.018} strokeLinecap="round" />;
  } else if (isTalk) {
    mouth = <ellipse cx={cx} cy={mouthY} rx={s * 0.03} ry={s * 0.02} fill="#0a0e0a" className="avatar-talk" />;
  } else if (isWhisper) {
    mouth = <ellipse cx={cx} cy={mouthY} rx={s * 0.015} ry={s * 0.012} fill="#0a0e0a" />;
  } else if (isAngry) {
    mouth = <path d={`M${cx - s * 0.04} ${mouthY + s * 0.01} Q${cx} ${mouthY - s * 0.015} ${cx + s * 0.04} ${mouthY + s * 0.01}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.018} strokeLinecap="round" />;
  } else if (isSad) {
    mouth = <path d={`M${cx - s * 0.035} ${mouthY + s * 0.01} Q${cx} ${mouthY - s * 0.02} ${cx + s * 0.035} ${mouthY + s * 0.01}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.015} strokeLinecap="round" />;
  } else if (isProud) {
    mouth = <path d={`M${cx - s * 0.045} ${mouthY - s * 0.005} Q${cx} ${mouthY + s * 0.035} ${cx + s * 0.045} ${mouthY - s * 0.005}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.018} strokeLinecap="round" />;
  } else if (isFocused || isNervous) {
    mouth = <line x1={cx - s * 0.04} y1={mouthY} x2={cx + s * 0.04} y2={mouthY} stroke="#0a0e0a" strokeWidth={s * 0.015} strokeLinecap="round" />;
  } else if (isSleepy) {
    mouth = <path d={`M${cx - s * 0.02} ${mouthY} Q${cx} ${mouthY + s * 0.01} ${cx + s * 0.02} ${mouthY}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.012} strokeLinecap="round" />;
  } else if (isConfused) {
    mouth = <path d={`M${cx - s * 0.03} ${mouthY} Q${cx - s * 0.01} ${mouthY + s * 0.015} ${cx + s * 0.01} ${mouthY - s * 0.005} Q${cx + s * 0.02} ${mouthY + s * 0.01} ${cx + s * 0.03} ${mouthY}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.015} strokeLinecap="round" />;
  } else if (agentId === 'scribe' || agentId === 'sage') {
    mouth = <line x1={cx - s * 0.035} y1={mouthY} x2={cx + s * 0.035} y2={mouthY} stroke="#0a0e0a" strokeWidth={s * 0.015} strokeLinecap="round" />;
  } else if (agentId === 'cipher') {
    mouth = <path d={`M${cx - s * 0.035} ${mouthY - s * 0.005} Q${cx} ${mouthY + s * 0.01} ${cx + s * 0.035} ${mouthY - s * 0.005}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.015} strokeLinecap="round" />;
  } else {
    mouth = <path d={`M${cx - s * 0.04} ${mouthY - s * 0.005} Q${cx} ${mouthY + s * 0.03} ${cx + s * 0.04} ${mouthY - s * 0.005}`} fill="none" stroke="#0a0e0a" strokeWidth={s * 0.018} strokeLinecap="round" />;
  }

  // Eyes
  const eyeHeight = isBlink ? s * 0.003
    : isLaugh ? s * 0.008
    : isSleepy ? s * 0.01
    : isWink ? eyeR  // left eye normal, right handled separately
    : isSly ? s * 0.018
    : isExcited ? eyeR * 1.3
    : isAngry ? s * 0.018
    : eyeR;
  const eyeWidth = isExcited ? eyeR * 1.2 : eyeR;

  // Eyebrows
  const browY = eyeY - s * 0.045;
  const browLen = s * 0.035;
  const browOffset = isEyebrowRaise || isSurprised ? -s * 0.015
    : isThink ? -s * 0.008
    : isExcited ? -s * 0.018
    : isAngry ? s * 0.005
    : isSad ? -s * 0.005
    : isConfused ? -s * 0.01
    : isProud ? -s * 0.01
    : 0;
  const browAngleL = isThink || isConfused ? -0.15
    : isEyebrowRaise ? -0.2
    : isAngry ? 0.25
    : isSad ? -0.15
    : 0;
  const browAngleR = isThink ? 0.15
    : isConfused ? 0.25  // one brow up, one down
    : isEyebrowRaise ? 0.2
    : isAngry ? -0.25
    : isSad ? 0.15
    : 0;

  // Head transforms
  const headTransform = isNod ? `translate(0, ${s * 0.01})`
    : isWhisper ? `translate(0, ${s * 0.005})`
    : isProud ? `translate(0, ${-s * 0.008})`
    : isExcited ? `translate(0, ${-s * 0.005})`
    : '';

  // Agent-specific details
  let agentDetails = null;
  if (agentId === 'gemma') {
    // Hair
    agentDetails = <path d={`M${cx - headR} ${headY - s * 0.03} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.05} ${cx} ${headY - headR - s * 0.02} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.05} ${cx + headR} ${headY - s * 0.03}`} fill={c.headDark} />;
  } else if (agentId === 'mistral') {
    // Spiky hair
    agentDetails = (
      <g>
        <polygon points={`${cx - s * 0.1},${headY - s * 0.08} ${cx - s * 0.06},${headY - s * 0.2} ${cx - s * 0.03},${headY - s * 0.1}`} fill={c.headDark} />
        <polygon points={`${cx - s * 0.03},${headY - s * 0.12} ${cx},${headY - s * 0.24} ${cx + s * 0.03},${headY - s * 0.12}`} fill={c.headDark} />
        <polygon points={`${cx + s * 0.03},${headY - s * 0.1} ${cx + s * 0.06},${headY - s * 0.2} ${cx + s * 0.1},${headY - s * 0.08}`} fill={c.headDark} />
      </g>
    );
  } else if (agentId === 'scribe') {
    // Hood
    agentDetails = (
      <g>
        <path d={`M${cx - headR - s * 0.04} ${headY + s * 0.01} Q${cx - headR} ${headY - headR - s * 0.08} ${cx} ${headY - headR - s * 0.05} Q${cx + headR} ${headY - headR - s * 0.08} ${cx + headR + s * 0.04} ${headY + s * 0.01}`} fill={c.headDark} fillOpacity="0.9" />
        {/* Glasses */}
        <circle cx={leftEyeX} cy={eyeY} r={s * 0.04} fill="none" stroke="#5a5a3a" strokeWidth={s * 0.012} />
        <circle cx={rightEyeX} cy={eyeY} r={s * 0.04} fill="none" stroke="#5a5a3a" strokeWidth={s * 0.012} />
        <line x1={leftEyeX + s * 0.04} y1={eyeY} x2={rightEyeX - s * 0.04} y2={eyeY} stroke="#5a5a3a" strokeWidth={s * 0.01} />
      </g>
    );
  } else if (agentId === 'cipher') {
    // Visor / goggles + short cropped hair
    agentDetails = (
      <g>
        {/* Short cropped hair */}
        <path d={`M${cx - headR} ${headY - s * 0.02} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.02} ${cx} ${headY - headR - s * 0.01} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.02} ${cx + headR} ${headY - s * 0.02}`} fill={c.headDark} />
        {/* Visor */}
        <rect x={leftEyeX - s * 0.05} y={eyeY - s * 0.025} width={rightEyeX - leftEyeX + s * 0.1} height={s * 0.04} rx={s * 0.01} fill="#0a0e0a" opacity="0.6" />
        <rect x={leftEyeX - s * 0.05} y={eyeY - s * 0.025} width={rightEyeX - leftEyeX + s * 0.1} height={s * 0.04} rx={s * 0.01} fill="none" stroke={c.headColor} strokeWidth={s * 0.008} opacity="0.7" />
      </g>
    );
  } else if (agentId === 'oracle') {
    // Circlet / headpiece + longer face framing
    agentDetails = (
      <g>
        {/* Side hair */}
        <path d={`M${cx - headR - s * 0.02} ${headY + s * 0.02} Q${cx - headR - s * 0.01} ${headY - headR - s * 0.04} ${cx} ${headY - headR - s * 0.03} Q${cx + headR + s * 0.01} ${headY - headR - s * 0.04} ${cx + headR + s * 0.02} ${headY + s * 0.02}`} fill={c.headDark} />
        {/* Circlet */}
        <path d={`M${cx - headR + s * 0.02} ${headY - headR + s * 0.03} Q${cx} ${headY - headR - s * 0.01} ${cx + headR - s * 0.02} ${headY - headR + s * 0.03}`} fill="none" stroke="#e0c0ff" strokeWidth={s * 0.012} strokeLinecap="round" />
        {/* Center gem */}
        <circle cx={cx} cy={headY - headR + s * 0.01} r={s * 0.015} fill="#e0c0ff" opacity="0.8" />
      </g>
    );
  } else if (agentId === 'jinx') {
    // Wild asymmetric spiky hair
    agentDetails = (
      <g>
        <polygon points={`${cx - s * 0.12},${headY - s * 0.06} ${cx - s * 0.08},${headY - s * 0.22} ${cx - s * 0.04},${headY - s * 0.08}`} fill={c.headDark} />
        <polygon points={`${cx - s * 0.04},${headY - s * 0.1} ${cx - s * 0.01},${headY - s * 0.26} ${cx + s * 0.04},${headY - s * 0.1}`} fill={c.headDark} />
        <polygon points={`${cx + s * 0.02},${headY - s * 0.08} ${cx + s * 0.07},${headY - s * 0.2} ${cx + s * 0.11},${headY - s * 0.04}`} fill={c.headDark} />
        {/* Extra wild spike to one side */}
        <polygon points={`${cx + s * 0.08},${headY - s * 0.1} ${cx + s * 0.14},${headY - s * 0.18} ${cx + s * 0.12},${headY - s * 0.06}`} fill={c.headDark} opacity="0.8" />
      </g>
    );
  } else if (agentId === 'sage') {
    // Hood + beard
    agentDetails = (
      <g>
        {/* Hood */}
        <path d={`M${cx - headR - s * 0.05} ${headY + s * 0.02} Q${cx - headR - s * 0.01} ${headY - headR - s * 0.1} ${cx} ${headY - headR - s * 0.06} Q${cx + headR + s * 0.01} ${headY - headR - s * 0.1} ${cx + headR + s * 0.05} ${headY + s * 0.02}`} fill={c.headDark} fillOpacity="0.85" />
        {/* Beard */}
        <path d={`M${cx - s * 0.06} ${mouthY + s * 0.01} Q${cx - s * 0.04} ${mouthY + s * 0.08} ${cx} ${mouthY + s * 0.1} Q${cx + s * 0.04} ${mouthY + s * 0.08} ${cx + s * 0.06} ${mouthY + s * 0.01}`} fill={c.headDark} opacity="0.6" />
      </g>
    );
  } else if (agentId === 'christopher') {
    // Short hair + headphones + cape
    agentDetails = (
      <g>
        <path d={`M${cx - headR} ${headY - s * 0.03} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.03} ${cx} ${headY - headR - s * 0.01} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.03} ${cx + headR} ${headY - s * 0.03}`} fill={c.headDark} />
        <path d={`M${cx - s * 0.12} ${headY + s * 0.08} Q${cx - s * 0.12} ${headY + s * 0.03} ${cx - s * 0.08} ${headY + s * 0.03}`} fill="none" stroke="#1a3030" strokeWidth={s * 0.02} strokeLinecap="round" />
        <path d={`M${cx + s * 0.12} ${headY + s * 0.08} Q${cx + s * 0.12} ${headY + s * 0.03} ${cx + s * 0.08} ${headY + s * 0.03}`} fill="none" stroke="#1a3030" strokeWidth={s * 0.02} strokeLinecap="round" />
      </g>
    );
  }

  // Body
  const bodyY = s * 0.56;
  const bodyH = s * 0.38;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      style={{ borderRadius: 2 }}
    >
      {/* Background */}
      <rect width={s} height={s} fill="#0d0f14" />
      <rect x={s * 0.03} y={s * 0.03} width={s * 0.94} height={s * 0.94} fill={c.bgColor} rx={s * 0.03} stroke={c.borderColor} strokeWidth={s * 0.015} />

      {/* Cape (Christopher only) */}
      {agentId === 'christopher' && (
        <g className="avatar-cape">
          <path
            d={`M${cx - s * 0.14} ${bodyY + s * 0.02} Q${cx - s * 0.22} ${bodyY + s * 0.2} ${cx - s * 0.18} ${bodyY + bodyH + s * 0.04} L${cx + s * 0.18} ${bodyY + bodyH + s * 0.04} Q${cx + s * 0.22} ${bodyY + s * 0.2} ${cx + s * 0.14} ${bodyY + s * 0.02}`}
            fill="#3B6BA5"
            opacity="0.85"
          />
          <path
            d={`M${cx - s * 0.14} ${bodyY + s * 0.02} Q${cx - s * 0.20} ${bodyY + s * 0.2} ${cx - s * 0.16} ${bodyY + bodyH + s * 0.02} L${cx + s * 0.16} ${bodyY + bodyH + s * 0.02} Q${cx + s * 0.20} ${bodyY + s * 0.2} ${cx + s * 0.14} ${bodyY + s * 0.02}`}
            fill="#2a4a75"
            opacity="0.5"
          />
        </g>
      )}

      {/* Body */}
      <rect x={cx - s * 0.16} y={bodyY} width={s * 0.32} height={bodyH} rx={s * 0.04} fill={c.headColor} opacity="0.9" />

      {/* Head group (nodding) */}
      <g transform={headTransform} className={isNod ? 'avatar-nod' : ''}>
        {/* Head */}
        <circle cx={cx} cy={headY} r={headR} fill={c.headColor} opacity="0.9" />

        {/* Agent-specific details (hair, hood, etc.) */}
        {agentDetails}

        {/* Eyes */}
        <ellipse
          cx={leftEyeX + eyeOffsetX}
          cy={eyeY + eyeOffsetY}
          rx={eyeWidth}
          ry={eyeHeight}
          fill="#0a0e0a"
          className={isBlink ? 'avatar-blink' : isExcited ? 'avatar-excited' : ''}
        />
        <ellipse
          cx={rightEyeX + eyeOffsetX}
          cy={eyeY + eyeOffsetY}
          rx={eyeWidth}
          ry={isWink ? s * 0.003 : eyeHeight}
          fill="#0a0e0a"
          className={isBlink ? 'avatar-blink' : ''}
        />

        {/* Eyebrows */}
        <line
          x1={leftEyeX - browLen}
          y1={browY + browOffset}
          x2={leftEyeX + browLen}
          y2={browY + browOffset + browAngleL * s * 0.1}
          stroke={c.headDark}
          strokeWidth={s * 0.015}
          strokeLinecap="round"
        />
        <line
          x1={rightEyeX - browLen}
          y1={browY + browOffset + browAngleR * s * 0.1}
          x2={rightEyeX + browLen}
          y2={browY + browOffset}
          stroke={c.headDark}
          strokeWidth={s * 0.015}
          strokeLinecap="round"
        />

        {/* Mouth */}
        {mouth}
      </g>

      {/* Scribe notebook detail */}
      {agentId === 'scribe' && (
        <g>
          <rect x={cx - s * 0.07} y={bodyY + s * 0.08} width={s * 0.14} height={s * 0.18} rx={s * 0.01} fill="#0a0e0a" opacity="0.4" />
          <line x1={cx - s * 0.04} y1={bodyY + s * 0.12} x2={cx + s * 0.04} y2={bodyY + s * 0.12} stroke={c.headColor} strokeWidth={s * 0.007} opacity="0.5" />
          <line x1={cx - s * 0.04} y1={bodyY + s * 0.15} x2={cx + s * 0.04} y2={bodyY + s * 0.15} stroke={c.headColor} strokeWidth={s * 0.007} opacity="0.5" />
          <line x1={cx - s * 0.04} y1={bodyY + s * 0.18} x2={cx + s * 0.02} y2={bodyY + s * 0.18} stroke={c.headColor} strokeWidth={s * 0.007} opacity="0.5" />
        </g>
      )}

      {/* Scanlines */}
      <line x1={s * 0.06} y1={s * 0.23} x2={s * 0.94} y2={s * 0.23} stroke="#0a0e0a" strokeWidth={s * 0.005} opacity="0.3" />
      <line x1={s * 0.06} y1={s * 0.47} x2={s * 0.94} y2={s * 0.47} stroke="#0a0e0a" strokeWidth={s * 0.005} opacity="0.3" />
      <line x1={s * 0.06} y1={s * 0.7} x2={s * 0.94} y2={s * 0.7} stroke="#0a0e0a" strokeWidth={s * 0.005} opacity="0.3" />
    </svg>
  );
}
