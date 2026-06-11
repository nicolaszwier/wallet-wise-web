import { Planning } from '@/app/models/Planning';
import { describe, expect, it } from 'vitest';
import {
  canDeletePlanning,
  getInitialPlanningCurrency,
  resolveNextSelectedPlanning,
} from './planningManagementUtils';

function makePlanning(overrides: Partial<Planning> = {}): Planning {
  return {
    id: 'plan-1',
    description: 'Personal',
    currency: 'USD',
    currentBalance: 0,
    expectedBalance: 0,
    dateOfCreation: '2024-01-01',
    active: true,
    ...overrides,
  };
}

describe('canDeletePlanning', () => {
  it('returns false when only one planning exists', () => {
    const planning = makePlanning();
    expect(canDeletePlanning([planning], planning)).toBe(false);
  });

  it('returns false for default planning', () => {
    const defaultPlanning = makePlanning({ id: 'default', isDefault: true });
    const other = makePlanning({ id: 'other' });
    expect(canDeletePlanning([defaultPlanning, other], defaultPlanning)).toBe(false);
  });

  it('returns true for non-default planning when multiple exist', () => {
    const defaultPlanning = makePlanning({ id: 'default', isDefault: true });
    const other = makePlanning({ id: 'other' });
    expect(canDeletePlanning([defaultPlanning, other], other)).toBe(true);
  });
});

describe('resolveNextSelectedPlanning', () => {
  it('returns undefined when no plannings remain', () => {
    const planning = makePlanning();
    expect(resolveNextSelectedPlanning([planning], planning.id)).toBeUndefined();
  });

  it('prefers the default planning among remaining items', () => {
    const defaultPlanning = makePlanning({ id: 'default', isDefault: true });
    const deleted = makePlanning({ id: 'deleted' });
    const other = makePlanning({ id: 'other' });

    expect(resolveNextSelectedPlanning([defaultPlanning, deleted, other], deleted.id)).toEqual(
      defaultPlanning,
    );
  });

  it('falls back to the first remaining planning', () => {
    const first = makePlanning({ id: 'first' });
    const deleted = makePlanning({ id: 'deleted' });
    const second = makePlanning({ id: 'second' });

    expect(resolveNextSelectedPlanning([first, deleted, second], deleted.id)).toEqual(first);
  });
});

describe('getInitialPlanningCurrency', () => {
  it('uses planning currency when provided', () => {
    const planning = makePlanning({ currency: 'EUR' });
    expect(getInitialPlanningCurrency('en', planning)).toBe('EUR');
  });

  it('defaults to BRL for Portuguese', () => {
    expect(getInitialPlanningCurrency('pt-BR')).toBe('BRL');
  });

  it('defaults to USD for other languages', () => {
    expect(getInitialPlanningCurrency('en')).toBe('USD');
  });
});
