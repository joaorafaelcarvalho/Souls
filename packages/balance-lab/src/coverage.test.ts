import { describe, expect, it } from 'vitest';
import { loadNodeCardCatalog } from './catalog.js';
import { runInvocationCoverage } from './coverage.js';

describe('deterministic invocation coverage', () => {
  it('legally invokes one card at every level without changing normal rules', () => {
    const coverage = runInvocationCoverage(loadNodeCardCatalog().byId);

    expect(coverage.allLevelsCovered).toBe(true);
    expect(coverage.invocationsByLevel).toEqual({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 });
    expect(coverage.scenarios.filter((scenario) => scenario.invoked)).toHaveLength(5);
  });

  it('rejects each positive level when the controlled scenario is one Soul short', () => {
    const coverage = runInvocationCoverage(loadNodeCardCatalog().byId);
    const insufficient = coverage.scenarios.filter((scenario) => scenario.reason === 'insufficient-souls');

    expect(insufficient.map((scenario) => scenario.level)).toEqual([1, 2, 3, 4]);
    expect(insufficient.every((scenario) => !scenario.legal && !scenario.invoked)).toBe(true);
  });
});
