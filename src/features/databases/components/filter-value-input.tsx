import type { Filter, PropertyDef, PropertyType } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { SELECT_CLASS } from '../utils/view-fields';

// The value half of a filter row, shaped by the property type: an option picker for
// selects, yes/no for checkboxes, and a typed input for everything else.
export function FilterValueInput({
  filter,
  type,
  property,
  onChange,
}: {
  filter: Filter;
  type: PropertyType;
  property: PropertyDef | undefined;
  onChange: (value: Filter['value']) => void;
}) {
  const t = useDatabasesTranslation();
  const text = typeof filter.value === 'string' ? filter.value : '';

  if (type === 'select' || type === 'multiSelect') {
    return (
      <select
        value={text}
        onChange={(event) => onChange(event.target.value || null)}
        className={`${SELECT_CLASS} w-full`}
      >
        <option value="">{t.choose}</option>
        {property?.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'checkbox') {
    return (
      <select
        value={filter.value === true ? 'yes' : 'no'}
        onChange={(event) => onChange(event.target.value === 'yes')}
        className={`${SELECT_CLASS} w-full`}
      >
        <option value="yes">{t.yes}</option>
        <option value="no">{t.no}</option>
      </select>
    );
  }

  return (
    <input
      type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
      value={typeof filter.value === 'number' ? filter.value : text}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === '' ? null : type === 'number' ? Number(raw) : raw);
      }}
      className={`${SELECT_CLASS} w-full px-2`}
    />
  );
}
