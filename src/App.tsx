import { useEffect, useMemo, useState } from 'react';
import AdditionalOutputsPanel from './components/AdditionalOutputsPanel';
import CategorySection from './components/CategorySection';
import MissingInfoNotice from './components/MissingInfoNotice';
import PromptPreview from './components/PromptPreview';
import Toolbar from './components/Toolbar';
import { CATEGORIES, DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import { buildPrompt } from './promptGenerator';
import type { AppState, FormValues } from './types';

const STORAGE_KEY = 'business-doc-prompt-maker:v1';

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { values: { ...EMPTY_VALUES }, outputs: { ...DEFAULT_OUTPUTS } };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      values: { ...EMPTY_VALUES, ...(parsed.values ?? {}) },
      outputs: { ...DEFAULT_OUTPUTS, ...(parsed.outputs ?? {}) },
    };
  } catch {
    return { values: { ...EMPTY_VALUES }, outputs: { ...DEFAULT_OUTPUTS } };
  }
}

function App() {
  const [state, setState] = useState<AppState>(() => loadInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorageが使えない環境では保存をスキップ
    }
  }, [state]);

  const updateValue = (key: string, value: string) => {
    setState((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));
  };

  const updateOutputs = (outputs: AppState['outputs']) => {
    setState((prev) => ({ ...prev, outputs }));
  };

  const handleImport = (next: AppState) => {
    setState({
      values: { ...EMPTY_VALUES, ...next.values },
      outputs: { ...DEFAULT_OUTPUTS, ...next.outputs },
    });
  };

  const handleReset = () => {
    setState({ values: { ...EMPTY_VALUES }, outputs: { ...DEFAULT_OUTPUTS } });
  };

  const prompt = useMemo(
    () => buildPrompt(state.values, state.outputs),
    [state],
  );

  const filledTotal = useFilledCount(state.values);

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div>
            <h1 className="header__title">ビジネス資料設計プロンプトメーカー</h1>
            <p className="header__sub">
              入力フォームに沿って情報を整理すると、ChatGPTに貼り付けるための高品質な資料作成プロンプトを自動生成します。
            </p>
          </div>
          <div className="header__meta">入力済み {filledTotal} 項目</div>
        </div>
      </header>

      <main className="main">
        <div className="grid">
          <div className="grid__left">
            <Toolbar state={state} onImport={handleImport} onReset={handleReset} />

            <MissingInfoNotice values={state.values} />

            {CATEGORIES.map((cat, i) => (
              <CategorySection
                key={cat.id}
                category={cat}
                values={state.values}
                onChange={updateValue}
                defaultOpen={i === 0}
              />
            ))}

            <AdditionalOutputsPanel
              outputs={state.outputs}
              onChange={updateOutputs}
            />
          </div>

          <aside className="grid__right">
            <PromptPreview prompt={prompt} />
          </aside>
        </div>
      </main>

      <footer className="footer">
        入力内容はお使いのブラウザのlocalStorageに保存されます。サーバーへは送信されません。
      </footer>
    </div>
  );
}

function useFilledCount(values: FormValues): number {
  return useMemo(
    () => Object.values(values).filter((v) => v.trim() !== '').length,
    [values],
  );
}

export default App;
