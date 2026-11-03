// @vitest-environment jsdom
import '@/test/setup-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ShortcutsDialog } from './shortcuts-dialog';

describe('ShortcutsDialog', () => {
  it('opens on ? anywhere outside a text field', async () => {
    render(<ShortcutsDialog />);
    await userEvent.keyboard('?');
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lets you type a question mark into a field', async () => {
    render(
      <>
        <input aria-label="Note" />
        <ShortcutsDialog />
      </>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Note' }), 'why?');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('why?');
  });
});
