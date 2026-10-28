import { Ban } from 'lucide-react';

import { cn } from '@/lib/utils';
import { OPTION_COLORS } from '@/schemas/database.schema';
import { STROKE_WIDTHS, type Ink } from '@/schemas/scene.schema';

import { useWhiteboardTranslation } from '../i18n';
import { useWhiteboardStore } from '../stores/whiteboard.store';
import { INK_BG } from '../utils/ink';

const INKS: Ink[] = ['ink', ...OPTION_COLORS];
const SWATCH =
  'flex size-6 items-center justify-center rounded-full ring-offset-2 ring-offset-(--color-background) transition-transform hover:scale-110';
const DRAW_TOOLS = ['pen', 'rectangle', 'ellipse', 'arrow', 'line', 'text'];

export function StylePanel() {
  const t = useWhiteboardTranslation();
  const style = useWhiteboardStore((s) => s.style);
  const tool = useWhiteboardStore((s) => s.tool);
  const hasSelection = useWhiteboardStore((s) => s.selected.length > 0);
  const setStyle = useWhiteboardStore((s) => s.setStyle);

  if (!hasSelection && !DRAW_TOOLS.includes(tool)) return null;

  return (
    <div className="bg-background shadow-raised absolute top-16 left-3 z-10 flex w-[11.5rem] flex-col gap-3 rounded-xl p-3">
      <section>
        <p className="eyebrow mb-2">{t.stroke}</p>
        <div className="grid grid-cols-5 gap-1.5">
          {INKS.map((ink) => (
            <button
              key={ink}
              type="button"
              aria-label={t.colors[ink]}
              title={t.colors[ink]}
              aria-pressed={style.stroke === ink}
              onClick={() => setStyle({ stroke: ink })}
              className={cn(SWATCH, INK_BG[ink], style.stroke === ink && 'ring-primary ring-2')}
            />
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow mb-2">{t.fill}</p>
        <div className="grid grid-cols-5 gap-1.5">
          <button
            type="button"
            aria-label={t.noFill}
            title={t.noFill}
            aria-pressed={style.fill === null}
            onClick={() => setStyle({ fill: null })}
            className={cn(SWATCH, 'border', style.fill === null && 'ring-primary ring-2')}
          >
            <Ban className="text-muted-foreground size-3.5" />
          </button>
          {OPTION_COLORS.map((ink) => (
            <button
              key={ink}
              type="button"
              aria-label={t.colors[ink]}
              title={t.colors[ink]}
              aria-pressed={style.fill === ink}
              onClick={() => setStyle({ fill: ink })}
              className={cn(
                SWATCH,
                INK_BG[ink],
                'opacity-60',
                style.fill === ink && 'ring-primary opacity-100 ring-2',
              )}
            />
          ))}
        </div>
      </section>
      <section>
        <p className="eyebrow mb-2">{t.width}</p>
        <div className="bg-well flex rounded-lg p-0.5">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              type="button"
              aria-label={t.widths[width]}
              title={t.widths[width]}
              aria-pressed={style.strokeWidth === width}
              onClick={() => setStyle({ strokeWidth: width })}
              className={cn(
                'flex h-7 flex-1 items-center justify-center rounded-md',
                style.strokeWidth === width && 'bg-background shadow-raised',
              )}
            >
              <span className="bg-foreground w-5 rounded-full" style={{ height: width + 0.5 }} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
