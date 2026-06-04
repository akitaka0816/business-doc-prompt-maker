import { TEMPLATES } from '../templates';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (templateId: string) => void;
}

function TemplatePicker({ open, onClose, onPick }: Props) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">テンプレートを選ぶ</h2>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
        <p className="modal__desc">
          選んだテンプレートをもとに新しい資料設計を作成します。後から自由に編集できます。
        </p>
        <ul className="template-list">
          {TEMPLATES.map((t) => (
            <li key={t.id} className="template-list__item">
              <div>
                <div className="template-list__name">{t.name}</div>
                <div className="template-list__desc">{t.description}</div>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onPick(t.id)}
              >
                これで作成
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TemplatePicker;
