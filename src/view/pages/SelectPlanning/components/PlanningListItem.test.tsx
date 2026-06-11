import { Planning } from '@/app/models/Planning';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PlanningListItem } from './PlanningListItem';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const planning: Planning = {
  id: 'plan-1',
  description: 'Personal finances',
  currency: 'USD',
  currentBalance: 0,
  expectedBalance: 0,
  dateOfCreation: '2024-01-01',
  active: true,
};

describe('PlanningListItem', () => {
  it('renders planning name and currency', () => {
    render(
      <PlanningListItem
        planning={planning}
        isSelected={false}
        canDelete={false}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('Personal finances')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('shows a checkmark when selected', () => {
    const { container } = render(
      <PlanningListItem
        planning={planning}
        isSelected
        canDelete={false}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(container.querySelector('.lucide-check')).toBeInTheDocument();
  });

  it('hides delete action when canDelete is false', async () => {
    const user = userEvent.setup();

    render(
      <PlanningListItem
        planning={planning}
        isSelected={false}
        canDelete={false}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'selectPlanning.actions.menu' }));

    expect(screen.queryByText('selectPlanning.deletePlanning')).not.toBeInTheDocument();
    expect(screen.getByText('selectPlanning.editPlanning')).toBeInTheDocument();
  });

  it('shows delete action when canDelete is true', async () => {
    const user = userEvent.setup();

    render(
      <PlanningListItem
        planning={planning}
        isSelected={false}
        canDelete
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'selectPlanning.actions.menu' }));

    expect(screen.getByText('selectPlanning.deletePlanning')).toBeInTheDocument();
  });
});
