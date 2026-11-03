// @vitest-environment jsdom
import '@/test/setup-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DoneCircle } from './done-circle';

describe('DoneCircle', () => {
  it('is a labelled checkbox that reports its state and toggles on click', async () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <DoneCircle done={false} label="Mark as done" onToggle={onToggle} />,
    );
    const circle = screen.getByRole('checkbox', { name: 'Mark as done' });
    expect(circle).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(circle);
    expect(onToggle).toHaveBeenCalledOnce();

    rerender(<DoneCircle done label="Mark as done" onToggle={onToggle} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('does nothing when the role may not edit', async () => {
    const onToggle = vi.fn();
    render(<DoneCircle done={false} label="Mark as done" disabled onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
