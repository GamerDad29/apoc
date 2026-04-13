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
  scout: { headColor: '#e07030', headDark: '#a85020', bgColor: '#1a1208', borderColor: '#3a2610' },
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

  // Body
  const bodyY = s * 0.56;
  const bodyH = s * 0.38;

  // Agent-specific details
  let agentDetails = null;
  let agentAccessory = null;
  if (agentId === 'gemma') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR} ${headY - s * 0.03} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.05} ${cx} ${headY - headR - s * 0.02} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.05} ${cx + headR} ${headY - s * 0.03}`} fill={c.headDark} />
        <path d={`M${cx - s * 0.11} ${headY - s * 0.09} L${cx - s * 0.06} ${headY - s * 0.2} L${cx - s * 0.02} ${headY - s * 0.1}`} fill="#9c7b55" opacity="0.9" />
        <path d={`M${cx + s * 0.11} ${headY - s * 0.09} L${cx + s * 0.06} ${headY - s * 0.2} L${cx + s * 0.02} ${headY - s * 0.1}`} fill="#9c7b55" opacity="0.9" />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx - s * 0.19} ${bodyY + s * 0.02} Q${cx} ${bodyY + s * 0.16} ${cx + s * 0.19} ${bodyY + s * 0.02} L${cx + s * 0.15} ${bodyY + s * 0.15} Q${cx} ${bodyY + s * 0.23} ${cx - s * 0.15} ${bodyY + s * 0.15} Z`} fill="#8f7354" opacity="0.88" />
        <path d={`M${cx - s * 0.15} ${bodyY + s * 0.05} Q${cx} ${bodyY + s * 0.14} ${cx + s * 0.15} ${bodyY + s * 0.05}`} fill="none" stroke="#d9c1a0" strokeWidth={s * 0.01} opacity="0.6" />
      </g>
    );
  } else if (agentId === 'mistral') {
    agentDetails = (
      <g>
        <polygon points={`${cx - s * 0.1},${headY - s * 0.08} ${cx - s * 0.06},${headY - s * 0.2} ${cx - s * 0.03},${headY - s * 0.1}`} fill={c.headDark} />
        <polygon points={`${cx - s * 0.03},${headY - s * 0.12} ${cx},${headY - s * 0.24} ${cx + s * 0.03},${headY - s * 0.12}`} fill={c.headDark} />
        <polygon points={`${cx + s * 0.03},${headY - s * 0.1} ${cx + s * 0.06},${headY - s * 0.2} ${cx + s * 0.1},${headY - s * 0.08}`} fill={c.headDark} />
        <path d={`M${cx - s * 0.1} ${headY - s * 0.13} Q${cx - s * 0.02} ${headY - s * 0.22} ${cx + s * 0.12} ${headY - s * 0.08}`} fill="none" stroke="#d8bf78" strokeWidth={s * 0.015} strokeLinecap="round" />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx + s * 0.03} ${bodyY + s * 0.02} Q${cx + s * 0.15} ${bodyY + s * 0.1} ${cx + s * 0.07} ${bodyY + s * 0.26}`} fill="none" stroke="#d8bf78" strokeWidth={s * 0.02} strokeLinecap="round" />
        <path d={`M${cx + s * 0.07} ${bodyY + s * 0.26} L${cx + s * 0.12} ${bodyY + s * 0.34}`} fill="none" stroke="#c45745" strokeWidth={s * 0.018} strokeLinecap="round" />
      </g>
    );
  } else if (agentId === 'scribe') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR - s * 0.04} ${headY + s * 0.01} Q${cx - headR} ${headY - headR - s * 0.08} ${cx} ${headY - headR - s * 0.05} Q${cx + headR} ${headY - headR - s * 0.08} ${cx + headR + s * 0.04} ${headY + s * 0.01}`} fill={c.headDark} fillOpacity="0.9" />
        {/* Glasses */}
        <circle cx={leftEyeX} cy={eyeY} r={s * 0.04} fill="none" stroke="#5a5a3a" strokeWidth={s * 0.012} />
        <circle cx={rightEyeX} cy={eyeY} r={s * 0.04} fill="none" stroke="#5a5a3a" strokeWidth={s * 0.012} />
        <line x1={leftEyeX + s * 0.04} y1={eyeY} x2={rightEyeX - s * 0.04} y2={eyeY} stroke="#5a5a3a" strokeWidth={s * 0.01} />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx + s * 0.12} ${bodyY + s * 0.05} L${cx + s * 0.18} ${bodyY + s * 0.22}`} stroke="#e6d4a3" strokeWidth={s * 0.014} strokeLinecap="round" />
        <path d={`M${cx + s * 0.18} ${bodyY + s * 0.22} L${cx + s * 0.2} ${bodyY + s * 0.18}`} stroke="#e6d4a3" strokeWidth={s * 0.01} strokeLinecap="round" />
      </g>
    );
  } else if (agentId === 'cipher') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR} ${headY - s * 0.02} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.02} ${cx} ${headY - headR - s * 0.01} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.02} ${cx + headR} ${headY - s * 0.02}`} fill={c.headDark} />
        <rect x={leftEyeX - s * 0.05} y={eyeY - s * 0.025} width={rightEyeX - leftEyeX + s * 0.1} height={s * 0.04} rx={s * 0.01} fill="#0a0e0a" opacity="0.6" />
        <rect x={leftEyeX - s * 0.05} y={eyeY - s * 0.025} width={rightEyeX - leftEyeX + s * 0.1} height={s * 0.04} rx={s * 0.01} fill="none" stroke={c.headColor} strokeWidth={s * 0.008} opacity="0.7" />
        <path d={`M${cx - s * 0.13} ${headY + s * 0.02} Q${cx} ${headY - s * 0.08} ${cx + s * 0.13} ${headY + s * 0.02}`} fill="none" stroke="#10161a" strokeWidth={s * 0.04} opacity="0.6" />
      </g>
    );
    agentAccessory = (
      <g>
        <rect x={cx - s * 0.028} y={bodyY + s * 0.07} width={s * 0.056} height={s * 0.08} rx={s * 0.012} fill="#0f1f1b" opacity="0.9" />
        <path d={`M${cx + s * 0.1} ${bodyY + s * 0.01} L${cx + s * 0.15} ${bodyY + s * 0.1} L${cx + s * 0.12} ${bodyY + s * 0.12} L${cx + s * 0.07} ${bodyY + s * 0.04} Z`} fill="#4f565d" opacity="0.85" />
      </g>
    );
  } else if (agentId === 'oracle') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR - s * 0.02} ${headY + s * 0.02} Q${cx - headR - s * 0.01} ${headY - headR - s * 0.04} ${cx} ${headY - headR - s * 0.03} Q${cx + headR + s * 0.01} ${headY - headR - s * 0.04} ${cx + headR + s * 0.02} ${headY + s * 0.02}`} fill={c.headDark} />
        <path d={`M${cx - headR + s * 0.02} ${headY - headR + s * 0.03} Q${cx} ${headY - headR - s * 0.01} ${cx + headR - s * 0.02} ${headY - headR + s * 0.03}`} fill="none" stroke="#e0c0ff" strokeWidth={s * 0.012} strokeLinecap="round" />
        <circle cx={cx} cy={headY - headR + s * 0.01} r={s * 0.015} fill="#e0c0ff" opacity="0.8" />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx - s * 0.17} ${bodyY + s * 0.03} Q${cx} ${bodyY - s * 0.02} ${cx + s * 0.17} ${bodyY + s * 0.03}`} fill="none" stroke="#a48ef5" strokeWidth={s * 0.016} opacity="0.65" />
        <path d={`M${cx + s * 0.16} ${bodyY - s * 0.02} Q${cx + s * 0.24} ${bodyY + s * 0.02} ${cx + s * 0.18} ${bodyY + s * 0.11}`} fill="#2d243a" opacity="0.9" />
      </g>
    );
  } else if (agentId === 'jinx') {
    agentDetails = (
      <g>
        <polygon points={`${cx - s * 0.12},${headY - s * 0.06} ${cx - s * 0.08},${headY - s * 0.22} ${cx - s * 0.04},${headY - s * 0.08}`} fill={c.headDark} />
        <polygon points={`${cx - s * 0.04},${headY - s * 0.1} ${cx - s * 0.01},${headY - s * 0.26} ${cx + s * 0.04},${headY - s * 0.1}`} fill={c.headDark} />
        <polygon points={`${cx + s * 0.02},${headY - s * 0.08} ${cx + s * 0.07},${headY - s * 0.2} ${cx + s * 0.11},${headY - s * 0.04}`} fill={c.headDark} />
        <polygon points={`${cx + s * 0.08},${headY - s * 0.1} ${cx + s * 0.14},${headY - s * 0.18} ${cx + s * 0.12},${headY - s * 0.06}`} fill={c.headDark} opacity="0.8" />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx - s * 0.14} ${bodyY + s * 0.02} L${cx - s * 0.18} ${bodyY + s * 0.18} L${cx - s * 0.12} ${bodyY + s * 0.18}`} fill="#5f5b67" opacity="0.9" />
        <rect x={cx - s * 0.15} y={bodyY + s * 0.16} width={s * 0.06} height={s * 0.018} rx={s * 0.008} fill="#2f1d1a" />
      </g>
    );
  } else if (agentId === 'sage') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR - s * 0.05} ${headY + s * 0.02} Q${cx - headR - s * 0.01} ${headY - headR - s * 0.1} ${cx} ${headY - headR - s * 0.06} Q${cx + headR + s * 0.01} ${headY - headR - s * 0.1} ${cx + headR + s * 0.05} ${headY + s * 0.02}`} fill={c.headDark} fillOpacity="0.85" />
        <path d={`M${cx - s * 0.06} ${mouthY + s * 0.01} Q${cx - s * 0.04} ${mouthY + s * 0.08} ${cx} ${mouthY + s * 0.1} Q${cx + s * 0.04} ${mouthY + s * 0.08} ${cx + s * 0.06} ${mouthY + s * 0.01}`} fill={c.headDark} opacity="0.6" />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx - s * 0.18} ${bodyY + s * 0.02} Q${cx} ${bodyY + s * 0.2} ${cx + s * 0.18} ${bodyY + s * 0.02}`} fill="#7b6e5c" opacity="0.8" />
        <line x1={cx + s * 0.15} y1={bodyY - s * 0.02} x2={cx + s * 0.15} y2={bodyY + bodyH + s * 0.06} stroke="#8b7550" strokeWidth={s * 0.022} strokeLinecap="round" />
        <circle cx={cx + s * 0.15} cy={bodyY - s * 0.05} r={s * 0.03} fill="none" stroke="#9dd9df" strokeWidth={s * 0.012} opacity="0.8" />
      </g>
    );
  } else if (agentId === 'scout') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR - s * 0.04} ${headY + s * 0.02} Q${cx - headR} ${headY - headR - s * 0.08} ${cx} ${headY - headR - s * 0.04} Q${cx + headR} ${headY - headR - s * 0.08} ${cx + headR + s * 0.04} ${headY + s * 0.02}`} fill={c.headDark} fillOpacity="0.9" />
        <path d={`M${cx - s * 0.03} ${headY - s * 0.12} L${cx + s * 0.1} ${headY - s * 0.19}`} stroke="#7f5c32" strokeWidth={s * 0.018} strokeLinecap="round" />
        <circle cx={cx + s * 0.1} cy={headY - s * 0.19} r={s * 0.018} fill="none" stroke="#d9b983" strokeWidth={s * 0.01} />
      </g>
    );
    agentAccessory = (
      <g>
        <path d={`M${cx - s * 0.18} ${bodyY + s * 0.04} Q${cx - s * 0.28} ${bodyY + s * 0.19} ${cx - s * 0.12} ${bodyY + bodyH + s * 0.02}`} fill="none" stroke="#91673a" strokeWidth={s * 0.022} strokeLinecap="round" />
        <path d={`M${cx - s * 0.2} ${bodyY + s * 0.03} Q${cx - s * 0.14} ${bodyY + s * 0.02} ${cx - s * 0.11} ${bodyY + s * 0.1}`} fill="none" stroke="#d7c0a0" strokeWidth={s * 0.012} />
        <path d={`M${cx + s * 0.14} ${bodyY + s * 0.02} L${cx + s * 0.18} ${bodyY + s * 0.12}`} stroke="#5f3b20" strokeWidth={s * 0.02} strokeLinecap="round" />
      </g>
    );
  } else if (agentId === 'christopher') {
    agentDetails = (
      <g>
        <path d={`M${cx - headR} ${headY - s * 0.03} Q${cx - headR + s * 0.01} ${headY - headR - s * 0.03} ${cx} ${headY - headR - s * 0.01} Q${cx + headR - s * 0.01} ${headY - headR - s * 0.03} ${cx + headR} ${headY - s * 0.03}`} fill={c.headDark} />
        <path d={`M${cx - s * 0.12} ${headY + s * 0.08} Q${cx - s * 0.12} ${headY + s * 0.03} ${cx - s * 0.08} ${headY + s * 0.03}`} fill="none" stroke="#1a3030" strokeWidth={s * 0.02} strokeLinecap="round" />
        <path d={`M${cx + s * 0.12} ${headY + s * 0.08} Q${cx + s * 0.12} ${headY + s * 0.03} ${cx + s * 0.08} ${headY + s * 0.03}`} fill="none" stroke="#1a3030" strokeWidth={s * 0.02} strokeLinecap="round" />
      </g>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      style={{ borderRadius: 2 }}
    >
      {/* Background — warm Wyrdroom dark, matching --bg-deep */}
      <rect width={s} height={s} fill="#1a1510" />
      <rect x={s * 0.03} y={s * 0.03} width={s * 0.94} height={s * 0.94} fill={c.bgColor} rx={s * 0.03} stroke={c.borderColor} strokeWidth={s * 0.015} />

      {/* Cape (Christopher only) — moss green, Norse forest-ranger vibe,
          matching --moss / --moss-light from the Mead & Modem palette. */}
      {agentId === 'christopher' && (
        <g className="avatar-cape">
          <path
            d={`M${cx - s * 0.14} ${bodyY + s * 0.02} Q${cx - s * 0.22} ${bodyY + s * 0.2} ${cx - s * 0.18} ${bodyY + bodyH + s * 0.04} L${cx + s * 0.18} ${bodyY + bodyH + s * 0.04} Q${cx + s * 0.22} ${bodyY + s * 0.2} ${cx + s * 0.14} ${bodyY + s * 0.02}`}
            fill="#5a7a3a"
            opacity="0.85"
          />
          <path
            d={`M${cx - s * 0.14} ${bodyY + s * 0.02} Q${cx - s * 0.20} ${bodyY + s * 0.2} ${cx - s * 0.16} ${bodyY + bodyH + s * 0.02} L${cx + s * 0.16} ${bodyY + bodyH + s * 0.02} Q${cx + s * 0.20} ${bodyY + s * 0.2} ${cx + s * 0.14} ${bodyY + s * 0.02}`}
            fill="#3d5220"
            opacity="0.5"
          />
        </g>
      )}

      {/* Body */}
      <rect x={cx - s * 0.16} y={bodyY} width={s * 0.32} height={bodyH} rx={s * 0.04} fill={c.headColor} opacity="0.9" />
      {agentAccessory}

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
