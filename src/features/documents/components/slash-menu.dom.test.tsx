// @vitest-environment jsdom
import '@/test/setup-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSlashMenuStore } from '../stores/slash-menu.store';
import { SlashMenu } from './slash-menu';

const rect = { top: 100, bottom: 120, left: 40, right: 60, width: 20, height: 20 } as DOMRect;

beforeEach(() => act(() => useSlashMenuStore.getState().hide()));

describe('SlashMenu', () => {
  it('stays hidden until "/" is typed', () => {
    render(<SlashMenu />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('filters blocks by the query and hands the picked one back to the editor', () => {
    const pick = vi.fn();
    render(<SlashMenu />);
    act(() => useSlashMenuStore.getState().show({ query: 'head', rect, pick }));

    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual([
      expect.stringContaining('Heading 1'),
      expect.stringContaining('Heading 2'),
      expect.stringContaining('Heading 3'),
    ]);
    expect(useSlashMenuStore.getState().items.map((i) => i.id)).toEqual([
      'heading1',
      'heading2',
      'heading3',
    ]);

    fireEvent.mouseDown(screen.getByText('Heading 2'));
    expect(pick).toHaveBeenCalledWith(expect.objectContaining({ id: 'heading2' }));
  });

  it('says so when nothing matches', () => {
    render(<SlashMenu />);
    act(() => useSlashMenuStore.getState().show({ query: 'xyz-nothing', rect, pick: vi.fn() }));
    expect(screen.getByText('No matching blocks')).toBeInTheDocument();
  });
});
