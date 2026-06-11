import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deletePlanning } from './deletePlanning';

const { deleteMock } = vi.hoisted(() => ({
  deleteMock: vi.fn(),
}));

vi.mock('../httpClient', () => ({
  httpClient: {
    delete: deleteMock,
  },
}));

describe('deletePlanning', () => {
  beforeEach(() => {
    deleteMock.mockReset();
  });

  it('deletes the planning by id', async () => {
    const response = {
      statusCode: 204,
      message: 'removed',
      error: null,
    };

    deleteMock.mockResolvedValue({ data: response });

    const result = await deletePlanning('plan-42');

    expect(deleteMock).toHaveBeenCalledWith('/plannings/plan-42');
    expect(result).toEqual(response);
  });
});
