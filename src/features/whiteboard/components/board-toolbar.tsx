import {
  ArrowUpRight,
  Circle,
  Eraser,
  Hand,
  Minus,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  Type,
  Undo2,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { MOD, SHIFT, shortcut } from '@/utils/platform';

import { TOOL_KEYS } from '../hooks/use-board-keys';
import { useWhiteboardTranslation } from '../i18n';
import { useWhiteboardStore, type Tool } from '../stores/whiteboard.store';

const TOOLS: [Tool, LucideIcon][] = [
  ['select', MousePointer2],
  ['hand', Hand],
  ['pen', Pencil],
  ['rectangle', Square],
  ['ellipse', Circle],
  ['arrow', ArrowUpRight],
  ['line', Minus],
  ['text', Type],
  ['eraser', Eraser],
];

const keyOf = (tool: Tool) => Object.entries(TOOL_KEYS).find(([, t]) => t === tool)?.[0] ?? '';
const BUTTON =
  'flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-35';

export function BoardToolbar() {
  const t = useWhiteboardTranslation();
  const tool = useWhiteboardStore((s) => s.tool);
  const canUndo = useWhiteboardStore((s) => s.past.length > 0);
  const canRedo = useWhiteboardStore((s) => s.future.length > 0);
  const { setTool, undo, redo } = useWhiteboardStore.getState();

  return (
    <div className="bg-background shadow-raised absolute top-3 left-1/2 z-10 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-xl p-1">
      {TOOLS.map(([id, Icon]) => (
        <button
          key={id}
          type="button"
          aria-label={t.tools[id]}
          aria-pressed={tool === id}
          title={`${t.tools[id]} · ${keyOf(id).toUpperCase()}`}
          onClick={() => setTool(id)}
          className={cn(
            BUTTON,
            tool === id ? 'bg-primary-tint text-primary-tint-foreground' : 'hover:bg-hover',
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
      <span aria-hidden className="bg-border mx-1 h-5 w-px shrink-0" />
      <button
        type="button"
        aria-label={t.undo}
        title={`${t.undo} · ${shortcut(MOD, 'Z')}`}
        disabled={!canUndo}
        onClick={undo}
        className={cn(BUTTON, 'enabled:hover:bg-hover')}
      >
        <Undo2 className="size-4" />
      </button>
      <button
        type="button"
        aria-label={t.redo}
        title={`${t.redo} · ${shortcut(MOD, SHIFT, 'Z')}`}
        disabled={!canRedo}
        onClick={redo}
        className={cn(BUTTON, 'enabled:hover:bg-hover')}
      >
        <Redo2 className="size-4" />
      </button>
    </div>
  );
}
