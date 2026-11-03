// @vitest-environment jsdom
import '@/test/setup-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PropertyDef } from '@/schemas/database.schema';

import { SelectCell } from './select-cell';

const data = vi.hoisted(() => ({
  toggleRecordOption: vi.fn(() => Promise.resolve()),
  addOption: vi.fn(() => Promise.resolve({ id: 'new', name: 'Review', color: 'blue' as const })),
}));
vi.mock('@/lib/data/databases', () => data);

const status: PropertyDef = {
  id: 'status',
  name: 'Status',
  type: 'select',
  options: [
    { id: 'todo', name: 'To do', color: 'gray' },
    { id: 'done', name: 'Done', color: 'green' },
  ],
};

beforeEach(() => vi.clearAllMocks());

describe('SelectCell', () => {
  it('names the chosen option and picks another one', async () => {
    render(<SelectCell databaseId="db" recordId="r1" property={status} value="todo" />);
    await userEvent.click(screen.getByRole('button', { name: 'Status: To do' }));
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(data.toggleRecordOption).toHaveBeenCalledWith('r1', 'status', 'done', false);
  });

  it('filters as you type and creates a missing option on Enter', async () => {
    render(<SelectCell databaseId="db" recordId="r1" property={status} value={null} />);
    await userEvent.click(screen.getByRole('button', { name: 'Status: —' }));
    await userEvent.keyboard('Review');
    expect(screen.queryByRole('button', { name: 'Done' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Review/ })).toBeInTheDocument();

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(data.addOption).toHaveBeenCalledWith('db', 'status', 'Review'));
    expect(data.toggleRecordOption).toHaveBeenCalledWith('r1', 'status', 'new', false);
  });

  it('cannot be opened read-only', () => {
    render(<SelectCell databaseId="db" recordId="r1" property={status} value="todo" readOnly />);
    expect(screen.getByRole('button', { name: 'Status: To do' })).toBeDisabled();
  });
});
