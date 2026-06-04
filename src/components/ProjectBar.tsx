import type { Project } from '../types';

interface Props {
  projects: Project[];
  currentId: string;
  onSelect: (id: string) => void;
  onCreateBlank: () => void;
  onCreateFromTemplate: () => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: () => void;
}

function ProjectBar({
  projects,
  currentId,
  onSelect,
  onCreateBlank,
  onCreateFromTemplate,
  onRename,
  onDuplicate,
  onDelete,
  onShare,
}: Props) {
  const current = projects.find((p) => p.id === currentId);

  const handleRename = () => {
    if (!current) return;
    const name = window.prompt('資料設計の名前を変更', current.name);
    if (name && name.trim() !== '') {
      onRename(current.id, name.trim());
    }
  };

  const handleDelete = () => {
    if (!current) return;
    if (projects.length <= 1) {
      window.alert('最後の1件は削除できません。新規作成してから削除してください。');
      return;
    }
    if (window.confirm(`「${current.name}」を削除します。よろしいですか？`)) {
      onDelete(current.id);
    }
  };

  return (
    <div className="projectbar">
      <div className="projectbar__row">
        <label className="projectbar__label" htmlFor="project-select">
          資料設計
        </label>
        <select
          id="project-select"
          className="projectbar__select"
          value={currentId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="projectbar__actions">
        <button type="button" className="btn" onClick={onCreateFromTemplate}>
          ＋ テンプレートから
        </button>
        <button type="button" className="btn" onClick={onCreateBlank}>
          ＋ 新規作成
        </button>
        <button type="button" className="btn" onClick={handleRename}>
          名称変更
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => current && onDuplicate(current.id)}
        >
          複製
        </button>
        <button type="button" className="btn btn--primary" onClick={onShare}>
          共有URL
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleDelete}>
          削除
        </button>
      </div>
    </div>
  );
}

export default ProjectBar;
