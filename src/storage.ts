import { DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import type { AdditionalOutputs, AppState, FormValues, Project } from './types';

const STORAGE_KEY_V1 = 'business-doc-prompt-maker:v1';
const STORAGE_KEY = 'business-doc-prompt-maker:v2';

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createEmptyProject(name = '新しい資料設計'): Project {
  return {
    id: newId(),
    name,
    values: { ...EMPTY_VALUES },
    outputs: { ...DEFAULT_OUTPUTS },
    updatedAt: Date.now(),
  };
}

function normalizeProject(p: Partial<Project>): Project {
  return {
    id: typeof p.id === 'string' ? p.id : newId(),
    name: typeof p.name === 'string' && p.name.trim() !== '' ? p.name : '名称未設定',
    values: { ...EMPTY_VALUES, ...((p.values ?? {}) as FormValues) },
    outputs: { ...DEFAULT_OUTPUTS, ...((p.outputs ?? {}) as AdditionalOutputs) },
    updatedAt: typeof p.updatedAt === 'number' ? p.updatedAt : Date.now(),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      if (Array.isArray(parsed?.projects) && parsed.projects.length > 0) {
        const projects = parsed.projects.map(normalizeProject);
        const currentProjectId =
          typeof parsed.currentProjectId === 'string' &&
          projects.some((p) => p.id === parsed.currentProjectId)
            ? parsed.currentProjectId
            : projects[0].id;
        return { projects, currentProjectId };
      }
    }
    // v1 からの移行
    const v1raw = localStorage.getItem(STORAGE_KEY_V1);
    if (v1raw) {
      const parsed = JSON.parse(v1raw) as {
        values?: Partial<FormValues>;
        outputs?: Partial<AdditionalOutputs>;
      };
      const migrated = normalizeProject({
        name: '以前の入力内容',
        values: parsed.values as FormValues | undefined,
        outputs: parsed.outputs as AdditionalOutputs | undefined,
      });
      return { projects: [migrated], currentProjectId: migrated.id };
    }
  } catch {
    // ignore
  }
  const first = createEmptyProject('はじめての資料設計');
  return { projects: [first], currentProjectId: first.id };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage が使えない場合はスキップ
  }
}
