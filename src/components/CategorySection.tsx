import { useState } from 'react';
import type { CategoryDef, FormValues } from '../types';
import FormField from './FormField';

interface Props {
  category: CategoryDef;
  values: FormValues;
  onChange: (key: string, value: string) => void;
  defaultOpen?: boolean;
}

function CategorySection({ category, values, onChange, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const filledCount = category.fields.filter(
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
          {filledCount} / {category.fields.length} 入力済み
          <span className="category__chevron" aria-hidden>
            {open ? '▾' : '▸'}
          </span>
        </span>
      </button>
      {open && (
        <div className="category__body">
          {category.fields.map((field) => (
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
