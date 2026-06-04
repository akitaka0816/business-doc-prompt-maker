import { ALL_FIELD_KEYS, ESSENTIAL_KEYS } from '../formConfig';
import type { FormMode } from '../types';

interface Props {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
}

function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="mode-toggle" role="group" aria-label="表示モード">
      <button
        type="button"
        className={`mode-toggle__btn${mode === 'minimal' ? ' is-active' : ''}`}
        onClick={() => onChange('minimal')}
        aria-pressed={mode === 'minimal'}
      >
        最小限（{ESSENTIAL_KEYS.size}項目）
      </button>
      <button
        type="button"
        className={`mode-toggle__btn${mode === 'detailed' ? ' is-active' : ''}`}
        onClick={() => onChange('detailed')}
        aria-pressed={mode === 'detailed'}
      >
        詳細（全{ALL_FIELD_KEYS.length}項目）
      </button>
      <span className="mode-toggle__hint">
        {mode === 'minimal'
          ? '重要項目だけを表示しています。詳細に切り替えると全項目が編集できます。'
          : 'すべての項目を表示しています。'}
      </span>
    </div>
  );
}

export default ModeToggle;
