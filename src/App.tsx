import { useEffect, useMemo, useState } from 'react';
import AdditionalOutputsPanel from './components/AdditionalOutputsPanel';
import CategorySection from './components/CategorySection';
import MissingInfoNotice from './components/MissingInfoNotice';
import ModeToggle from './components/ModeToggle';
import ProjectBar from './components/ProjectBar';
import PromptPreview from './components/PromptPreview';
import ShareDialog from './components/ShareDialog';
import TemplatePicker from './components/TemplatePicker';
import Toolbar from './components/Toolbar';
import { CATEGORIES, DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import { buildPrompt } from './promptGenerator';
import {
  buildShareUrl,
  clearShareFromUrl,
  decodeShare,
  readShareFromUrl,
} from './shareLink';
import { createEmptyProject, loadState, newId, saveState } from './storage';
import { TEMPLATES, applyTemplate } from './templates';
import type {
  AdditionalOutputs,
  AiTarget,
  AppState,
  FormMode,
  FormValues,
  Project,
} from './types';

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [templateOpen, setTemplateOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // 起動時、URLに共有データがあれば取り込み
  useEffect(() => {
    const token = readShareFromUrl();
    if (!token) return;
    const decoded = decodeShare(token);
    clearShareFromUrl();
    if (!decoded) {
      window.alert('共有URLを読み込めませんでした。');
      return;
    }
    const ok = window.confirm(
      `共有された資料設計「${decoded.name}」を読み込みますか？\n（既存の資料設計はそのまま残り、新しい資料として追加します）`,
    );
    if (!ok) return;
    setState((prev) => {
      const project: Project = {
        id: newId(),
        name: `${decoded.name}（共有）`,
        values: decoded.values,
        outputs: decoded.outputs,
        updatedAt: Date.now(),
      };
      return {
        ...prev,
        projects: [...prev.projects, project],
        currentProjectId: project.id,
      };
    });
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentProject =
    state.projects.find((p) => p.id === state.currentProjectId) ??
    state.projects[0];

  const updateCurrent = (mut: (p: Project) => Project) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === prev.currentProjectId
          ? { ...mut(p), updatedAt: Date.now() }
          : p,
      ),
    }));
  };

  const updateValue = (key: string, value: string) => {
    updateCurrent((p) => ({ ...p, values: { ...p.values, [key]: value } }));
  };

  const updateOutputs = (outputs: AdditionalOutputs) => {
    updateCurrent((p) => ({ ...p, outputs }));
  };

  const handleSelectProject = (id: string) => {
    setState((prev) => ({ ...prev, currentProjectId: id }));
  };

  const handleCreateBlank = () => {
    const p = createEmptyProject();
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, p],
      currentProjectId: p.id,
    }));
  };

  const handlePickTemplate = (templateId: string) => {
    const t = TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    const { values, outputs } = applyTemplate(t);
    const project: Project = {
      id: newId(),
      name: t.name,
      values,
      outputs,
      updatedAt: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
      currentProjectId: project.id,
    }));
    setTemplateOpen(false);
  };

  const handleRename = (id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      ),
    }));
  };

  const handleDuplicate = (id: string) => {
    const src = state.projects.find((p) => p.id === id);
    if (!src) return;
    const copy: Project = {
      ...src,
      id: newId(),
      name: `${src.name}（コピー）`,
      updatedAt: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, copy],
      currentProjectId: copy.id,
    }));
  };

  const handleDelete = (id: string) => {
    setState((prev) => {
      const projects = prev.projects.filter((p) => p.id !== id);
      const safe = projects.length > 0 ? projects : [createEmptyProject()];
      const currentProjectId =
        prev.currentProjectId === id ? safe[0].id : prev.currentProjectId;
      return { ...prev, projects: safe, currentProjectId };
    });
  };

  const handleImportJson = (payload: {
    values: FormValues;
    outputs: AdditionalOutputs;
    name?: string;
  }) => {
    const project: Project = {
      id: newId(),
      name: payload.name ?? 'JSONから取り込み',
      values: { ...EMPTY_VALUES, ...payload.values },
      outputs: { ...DEFAULT_OUTPUTS, ...payload.outputs },
      updatedAt: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
      currentProjectId: project.id,
    }));
  };

  const handleResetCurrent = () => {
    updateCurrent((p) => ({
      ...p,
      values: { ...EMPTY_VALUES },
      outputs: { ...DEFAULT_OUTPUTS },
    }));
  };

  const setMode = (mode: FormMode) => {
    setState((prev) => ({ ...prev, ui: { ...prev.ui, mode } }));
  };

  const setAiTarget = (aiTarget: AiTarget) => {
    setState((prev) => ({ ...prev, ui: { ...prev.ui, aiTarget } }));
  };

  const shareUrl = useMemo(
    () =>
      buildShareUrl(
        currentProject.name,
        currentProject.values,
        currentProject.outputs,
      ),
    [currentProject.name, currentProject.values, currentProject.outputs],
  );

  const prompt = useMemo(
    () =>
      buildPrompt(
        currentProject.values,
        currentProject.outputs,
        state.ui.aiTarget,
      ),
    [currentProject.values, currentProject.outputs, state.ui.aiTarget],
  );

  const filledTotal = useMemo(
    () =>
      Object.values(currentProject.values).filter((v) => v.trim() !== '').length,
    [currentProject.values],
  );

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
            <ProjectBar
              projects={state.projects}
              currentId={currentProject.id}
              onSelect={handleSelectProject}
              onCreateBlank={handleCreateBlank}
              onCreateFromTemplate={() => setTemplateOpen(true)}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onShare={() => setShareOpen(true)}
            />

            <Toolbar
              values={currentProject.values}
              outputs={currentProject.outputs}
              currentName={currentProject.name}
              onImport={handleImportJson}
              onReset={handleResetCurrent}
            />

            <MissingInfoNotice values={currentProject.values} />

            <ModeToggle mode={state.ui.mode} onChange={setMode} />

            {CATEGORIES.map((cat, i) => (
              <CategorySection
                key={cat.id}
                category={cat}
                values={currentProject.values}
                onChange={updateValue}
                mode={state.ui.mode}
                defaultOpen={i === 0}
              />
            ))}

            <AdditionalOutputsPanel
              outputs={currentProject.outputs}
              onChange={updateOutputs}
            />
          </div>

          <aside className="grid__right">
            <PromptPreview
              prompt={prompt}
              aiTarget={state.ui.aiTarget}
              onChangeAi={setAiTarget}
            />
          </aside>
        </div>
      </main>

      <footer className="footer">
        入力内容はお使いのブラウザのlocalStorageに保存されます。サーバーへは送信されません。
      </footer>

      <TemplatePicker
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onPick={handlePickTemplate}
      />

      <ShareDialog
        open={shareOpen}
        url={shareUrl}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}

export default App;
