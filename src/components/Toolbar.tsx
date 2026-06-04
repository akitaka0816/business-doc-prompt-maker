import { useRef } from 'react';
import type { AdditionalOutputs, FormValues } from '../types';

interface ImportPayload {
  values: FormValues;
  outputs: AdditionalOutputs;
  name?: string;
}

interface Props {
  values: FormValues;
  outputs: AdditionalOutputs;
  currentName: string;
  onImport: (payload: ImportPayload) => void;
  onReset: () => void;
}

function Toolbar({ values, outputs, currentName, onImport, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const payload = { name: currentName, values, outputs };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = currentName.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60).trim();
    a.download = `${safe || 'business-doc-prompt'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePickFile = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<ImportPayload>;
      if (
        parsed &&
        typeof parsed === 'object' &&
        'values' in parsed &&
        'outputs' in parsed
      ) {
        onImport(parsed as ImportPayload);
      } else {
        window.alert('JSONの形式が想定と異なります。');
      }
    } catch {
      window.alert('JSONを読み込めませんでした。');
    } finally {
      e.target.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('この資料設計の入力内容をすべてリセットします。よろしいですか？')) {
      onReset();
    }
  };

  return (
    <div className="toolbar">
      <button type="button" className="btn" onClick={handleExport}>
        JSONエクスポート
      </button>
      <button type="button" className="btn" onClick={handlePickFile}>
        JSONインポート
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button type="button" className="btn btn--ghost" onClick={handleReset}>
        リセット
      </button>
    </div>
  );
}

export default Toolbar;
