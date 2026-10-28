import type { Editor } from '@tiptap/react';
import { Check, Unlink } from 'lucide-react';
import { useState } from 'react';

import { normalizeUrl } from '@/utils/safe-url';

import { useDocumentsTranslation } from '../i18n';

export function LinkInput({ editor, onDone }: { editor: Editor; onDone: () => void }) {
  const t = useDocumentsTranslation();
  const current = editor.getAttributes('link').href as string | undefined;
  const [value, setValue] = useState(current ?? '');
  const [invalid, setInvalid] = useState(false);

  function apply() {
    if (!value.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      onDone();
      return;
    }
    const href = normalizeUrl(value);
    if (!href) {
      setInvalid(true);
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    onDone();
  }

  return (
    <form
      className="flex items-center gap-0.5"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <input
        autoFocus
        value={value}
        placeholder={t.format.linkPlaceholder}
        aria-label={t.format.link}
        aria-invalid={invalid}
        onChange={(event) => {
          setValue(event.target.value);
          setInvalid(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            editor.commands.focus();
            onDone();
          }
        }}
        className="aria-invalid:text-destructive h-7 w-60 bg-transparent px-2 text-[13px] outline-none"
      />
      {current ? (
        <button
          type="button"
          aria-label={t.format.removeLink}
          title={t.format.removeLink}
          onClick={() => {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            onDone();
          }}
          className="text-muted-foreground hover:bg-hover hover:text-foreground flex size-7 items-center justify-center rounded-md"
        >
          <Unlink className="size-4" />
        </button>
      ) : null}
      <button
        type="submit"
        aria-label={t.format.applyLink}
        title={t.format.applyLink}
        className="btn-primary size-7 justify-center p-0"
      >
        <Check className="size-4" />
      </button>
    </form>
  );
}
