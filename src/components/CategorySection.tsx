import { useState } from 'react';
import { ESSENTIAL_KEYS } from '../formConfig';
import type { CategoryDef, FormMode, FormValues } from '../types';
import FormField from './FormField';

interface Props {
  category: CategoryDef;
  values: FormValues;
  onChange: (key: string, value: string) => void;
  mode: FormMode;
  defaultOpen?: boolean;
}

function CategorySection({
  category,
  values,
  onChange,
  mode,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const visibleFields =
    mode === 'minimal'
      ? category.fields.filter((f) => ESSENTIAL_KEYS.has(f.key))
      : category.fields;

  if (visibleFields.length === 0) return null;

  const filledCount = visibleFields.filter(
    (f) => (values[f.key] ?? '').trim() !== '',
  ).length;

  return (
    <section className="category">
      <button
        type="button"
        className="category__header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="category__title">{category.title}</span>
        <span className="category__meta">
          {filledCount} / {visibleFields.length} 入力済み
          <span className="category__chevron" aria-hidden>
            {open ? '▾' : '▸'}
          </span>
        </span>
      </button>
      {open && (
        <div className="category__body">
          {visibleFields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={values[field.key] ?? ''}
              onChange={(v) => onChange(field.key, v)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategorySection;
