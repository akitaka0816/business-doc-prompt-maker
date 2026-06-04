import type { FieldDef } from '../types';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

function FormField({ field, value, onChange }: Props) {
  const id = `field-${field.key}`;
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={id}
          className="field__input field__input--textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.example}
        />
      ) : (
        <input
          id={id}
          className="field__input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.example}
        />
      )}
      <p className="field__example">{field.example}</p>
    </div>
  );
}

export default FormField;
