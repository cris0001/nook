import type { Editor } from '@tiptap/react';
import { Ban } from 'lucide-react';

import type { OptionColor } from '@/schemas/database.schema';

import { useDocumentsTranslation } from '../i18n';
import { useFormatBarStore } from '../stores/format-bar.store';
import { highlightColor, TEXT_COLORS, textColor } from '../utils/text-colors';

const SWATCH =
  'flex size-7 items-center justify-center rounded-md border text-[13px] font-semibold transition-transform hover:scale-110';

export function ColorPanel({ editor }: { editor: Editor }) {
  const t = useDocumentsTranslation();
  const setMode = useFormatBarStore((s) => s.setMode);

  function run(change: () => void) {
    change();
    setMode('marks');
  }

  const setText = (color: OptionColor | null) =>
    run(() => {
      const chain = editor.chain().focus();
      (color ? chain.setColor(textColor(color)) : chain.unsetColor()).run();
    });
  const setHighlight = (color: OptionColor | null) =>
    run(() => {
      const chain = editor.chain().focus();
      (color ? chain.setHighlight({ color: highlightColor(color) }) : chain.unsetHighlight()).run();
    });

  return (
    <div className="w-[21rem] p-1" onMouseDown={(event) => event.preventDefault()}>
      <p className="eyebrow px-1 pb-1.5">{t.format.textColor}</p>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          title={t.format.default}
          onClick={() => setText(null)}
          className={SWATCH}
        >
          A
        </button>
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={t.format.colors[color]}
            aria-label={t.format.colors[color]}
            onClick={() => setText(color)}
            className={SWATCH}
            style={{ color: textColor(color) }}
          >
            A
          </button>
        ))}
      </div>
      <p className="eyebrow px-1 pt-3 pb-1.5">{t.format.highlight}</p>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          title={t.format.noHighlight}
          aria-label={t.format.noHighlight}
          onClick={() => setHighlight(null)}
          className={SWATCH}
        >
          <Ban className="text-muted-foreground size-3.5" />
        </button>
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={t.format.colors[color]}
            aria-label={`${t.format.highlight}: ${t.format.colors[color]}`}
            onClick={() => setHighlight(color)}
            className={SWATCH}
            style={{ background: highlightColor(color) }}
          />
        ))}
      </div>
    </div>
  );
}
