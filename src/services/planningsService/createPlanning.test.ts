import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlanning } from './createPlanning';

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock('../httpClient', () => ({
  httpClient: {
    post: postMock,
  },
}));

describe('createPlanning', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('posts description and currency to /plannings', async () => {
    const planning = {
      id: 'plan-1',
      description: 'Trip',
      currency: 'USD',
      currentBalance: 0,
      expectedBalance: 0,
      dateOfCreation: '2024-01-01',
      active: true,
    };

    postMock.mockResolvedValue({ data: planning });

    const result = await createPlanning({ description: 'Trip', currency: 'USD' });

    expect(postMock).toHaveBeenCalledWith('/plannings', {
      description: 'Trip',
      currency: 'USD',
    });
    expect(result).toEqual(planning);
  });
});
