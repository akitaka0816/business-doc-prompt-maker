import { ADDITIONAL_OUTPUT_OPTIONS } from '../formConfig';
import type { AdditionalOutputs } from '../types';

interface Props {
  outputs: AdditionalOutputs;
  onChange: (next: AdditionalOutputs) => void;
}

function AdditionalOutputsPanel({ outputs, onChange }: Props) {
  return (
    <section className="category">
      <div className="category__header category__header--static">
        <span className="category__title">7. 追加出力</span>
        <span className="category__meta">プロンプトに追加する成果物を選んでください</span>
      </div>
      <div className="category__body">
        <div className="checkbox-grid">
          {ADDITIONAL_OUTPUT_OPTIONS.map((opt) => (
            <label key={opt.key} className="checkbox">
              <input
                type="checkbox"
                checked={outputs[opt.key]}
                onChange={(e) =>
                  onChange({ ...outputs, [opt.key]: e.target.checked })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdditionalOutputsPanel;
