import { DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import type {
  AdditionalOutputs,
  AiTarget,
  AppState,
  FormValues,
  FormMode,
  Project,
  UiPrefs,
} from './types';

export const DEFAULT_UI: UiPrefs = {
  mode: 'detailed',
  aiTarget: 'chatgpt',
};

function normalizeUi(u: Partial<UiPrefs> | undefined): UiPrefs {
  const mode: FormMode = u?.mode === 'minimal' ? 'minimal' : 'detailed';
  const aiTarget: AiTarget =
    u?.aiTarget === 'claude' || u?.aiTarget === 'gemini' ? u.aiTarget : 'chatgpt';
  return { mode, aiTarget };
}

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

function migrateValues(raw: Record<string, unknown>): FormValues {
  const result: FormValues = { ...EMPTY_VALUES };

  // 有効なキーをコピー
  for (const k of Object.keys(EMPTY_VALUES)) {
    const v = raw[k];
    if (typeof v === 'string') result[k] = v;
  }

  // 旧キーを新キーへマージ（中身があれば改行で連結）
  const mergeOld = (newKey: string, oldKey: string) => {
    const v = raw[oldKey];
    if (typeof v !== 'string' || v.trim() === '') return;
    const cur = result[newKey] ?? '';
    result[newKey] = cur.trim() === '' ? v : `${cur}\n${v}`;
  };

  mergeOld('background', 'currentState');
  mergeOld('conclusion', 'proposal');
  mergeOld('demerits', 'risks');
  mergeOld('mustMessages', 'mustPages');
  mergeOld('imageStyle', 'imageQuality');
  mergeOld('imageStyle', 'illustration');
  mergeOld('imageStyle', 'photo');
  mergeOld('designMood', 'fontMood');
  mergeOld('designMood', 'margin');

  return result;
}

function normalizeProject(p: Partial<Project>): Project {
  const rawValues = (p.values ?? {}) as Record<string, unknown>;
  return {
    id: typeof p.id === 'string' ? p.id : newId(),
    name: typeof p.name === 'string' && p.name.trim() !== '' ? p.name : '名称未設定',
    values: migrateValues(rawValues),
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
        return { projects, currentProjectId, ui: normalizeUi(parsed.ui) };
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
      return {
        projects: [migrated],
        currentProjectId: migrated.id,
        ui: { ...DEFAULT_UI },
      };
    }
  } catch {
    // ignore
  }
  const first = createEmptyProject('はじめての資料設計');
  // 新規ユーザーは入力ハードルを下げるため最小限モードで開始
  return {
    projects: [first],
    currentProjectId: first.id,
    ui: { mode: 'minimal', aiTarget: 'chatgpt' },
  };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage が使えない場合はスキップ
  }
}
