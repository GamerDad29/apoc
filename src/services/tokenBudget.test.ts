import { describe, expect, it } from 'vitest';
import { canSpend, getUsage, recordUsage, resetSession } from './tokenBudget';

describe('tokenBudget', () => {
  it('tracks usage and blocks spending once the session limit is reached', () => {
    expect(canSpend('oracle', 50000)).toBe(true);

    recordUsage('oracle', 49999);
    expect(canSpend('oracle', 1)).toBe(true);
    expect(canSpend('oracle', 2)).toBe(false);

    const usage = getUsage('oracle');
    expect(usage.sessionTokensUsed).toBe(49999);
    expect(usage.dailyTokensUsed).toBe(49999);
  });

  it('resets only the session counter', () => {
    recordUsage('scout', 1500);
    resetSession('scout');

    const usage = getUsage('scout');
    expect(usage.sessionTokensUsed).toBe(0);
    expect(usage.dailyTokensUsed).toBe(1500);
  });
});
