import { Planning } from '@/app/models/Planning';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelectPlanningController } from './useSelectPlanningController';

const navigateMock = vi.fn();
const setSelectedPlanningMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

const plannings: Planning[] = [
  {
    id: 'default',
    description: 'Default',
    currency: 'USD',
    currentBalance: 0,
    expectedBalance: 0,
    dateOfCreation: '2024-01-01',
    active: true,
    isDefault: true,
  },
  {
    id: 'trip',
    description: 'Trip',
    currency: 'EUR',
    currentBalance: 0,
    expectedBalance: 0,
    dateOfCreation: '2024-01-02',
    active: true,
  },
];

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock('@/app/hooks/usePlanning', () => ({
  usePlanning: () => ({
    plannings,
    selectedPlanning: plannings[1],
    setSelectedPlanning: setSelectedPlanningMock,
  }),
}));

const createPlanningMock = vi.fn();
const updatePlanningMock = vi.fn();
const deletePlanningMock = vi.fn();
const fetchCurrenciesMock = vi.fn();

vi.mock('@/services/planningsService', () => ({
  planningsService: {
    fetchCurrencies: (...args: unknown[]) => fetchCurrenciesMock(...args),
    createPlanning: (...args: unknown[]) => createPlanningMock(...args),
    updatePlanning: (...args: unknown[]) => updatePlanningMock(...args),
    deletePlanning: (...args: unknown[]) => deletePlanningMock(...args),
  },
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useSelectPlanningController', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    setSelectedPlanningMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    createPlanningMock.mockReset();
    updatePlanningMock.mockReset();
    deletePlanningMock.mockReset();
    fetchCurrenciesMock.mockReset();
    fetchCurrenciesMock.mockResolvedValue([{ id: 'USD', name: 'US Dollar' }]);
    localStorage.clear();
  });

  it('selects a planning and navigates home', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    const { result } = renderHook(() => useSelectPlanningController(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.handleSelect(plannings[0]);
    });

    expect(setSelectedPlanningMock).toHaveBeenCalledWith(plannings[0]);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('creates a planning and selects it', async () => {
    const created = {
      ...plannings[1],
      id: 'new-plan',
      description: 'Vacation',
    };

    createPlanningMock.mockResolvedValue(created);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSelectPlanningController(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.setCreateName('Vacation');
      result.current.setCreateCurrency('EUR');
    });

    await act(async () => {
      result.current.handleCreate();
    });

    await waitFor(() => {
      expect(createPlanningMock).toHaveBeenCalledWith({
        description: 'Vacation',
        currency: 'EUR',
      });
    });

    expect(setSelectedPlanningMock).toHaveBeenCalledWith(created);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['planning'] });
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  it('selects the next planning when deleting the selected one', async () => {
    deletePlanningMock.mockResolvedValue({
      statusCode: 204,
      message: 'removed',
      error: null,
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    const { result } = renderHook(() => useSelectPlanningController(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.openDelete(plannings[1]);
    });

    await act(async () => {
      result.current.handleDelete();
    });

    await waitFor(() => {
      expect(deletePlanningMock).toHaveBeenCalledWith('trip');
    });

    expect(setSelectedPlanningMock).toHaveBeenCalledWith(plannings[0]);
  });
});
