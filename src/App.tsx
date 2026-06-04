import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

type FieldType = 'text' | 'textarea' | 'select';

type FieldConfig = {
  key: keyof FormData;
  label: string;
  example: string;
  type?: FieldType;
  options?: string[];
};

type SectionConfig = {
  id: string;
  title: string;
  description: string;
  fields: FieldConfig[];
};

type FormData = {
  title: string;
  documentType: string;
  purpose: string;
  audience: string;
  usageScene: string;
  language: string;
  slideCount: string;
  presentationTime: string;
  keyMessage: string;
  desiredAction: string;
  decisionPoint: string;
  desiredImpression: string;
  successState: string;
  readerAttributes: string;
  readerKnowledge: string;
  readerInterests: string;
  readerConcerns: string;
  resonantExpression: string;
  background: string;
  currentState: string;
  issues: string;
  causes: string;
  proposal: string;
  conclusion: string;
  evidence: string;
  data: string;
  examples: string;
  benefits: string;
  disadvantages: string;
  risks: string;
  countermeasures: string;
  schedule: string;
  roles: string;
  faq: string;
  requiredKeywords: string;
  requiredMessage: string;
  requiredPages: string;
  prohibitedContent: string;
  avoidedExpressions: string;
  confidentiality: string;
  aspectRatio: string;
  colorScheme: string;
  mainColor: string;
  accentColor: string;
  backgroundColor: string;
  designMood: string;
  fontMood: string;
  whitespace: string;
  textAmount: string;
  imageQuality: string;
  diagramAmount: string;
  illustration: string;
  photo: string;
  animation: string;
};

type ExtraOutput =
  | 'onePageSummary'
  | 'appendix'
  | 'qa'
  | 'email'
  | 'speakerNotes'
  | 'powerPointRequest';

type AppState = {
  form: FormData;
  extras: Record<ExtraOutput, boolean>;
};

const STORAGE_KEY = 'business-doc-prompt-maker-state-v1';
const LEGACY_STORAGE_KEY = 'business-deck-prompt-maker-state-v1';

const defaultForm: FormData = {
  title: '',
  documentType: '',
  purpose: '',
  audience: '',
  usageScene: '',
  language: '',
  slideCount: '',
  presentationTime: '',
  keyMessage: '',
  desiredAction: '',
  decisionPoint: '',
  desiredImpression: '',
  successState: '',
  readerAttributes: '',
  readerKnowledge: '',
  readerInterests: '',
  readerConcerns: '',
  resonantExpression: '',
  background: '',
  currentState: '',
  issues: '',
  causes: '',
  proposal: '',
  conclusion: '',
  evidence: '',
  data: '',
  examples: '',
  benefits: '',
  disadvantages: '',
  risks: '',
  countermeasures: '',
  schedule: '',
  roles: '',
  faq: '',
  requiredKeywords: '',
  requiredMessage: '',
  requiredPages: '',
  prohibitedContent: '',
  avoidedExpressions: '',
  confidentiality: '',
  aspectRatio: '',
  colorScheme: '',
  mainColor: '',
  accentColor: '',
  backgroundColor: '',
  designMood: '',
  fontMood: '',
  whitespace: '',
  textAmount: '',
  imageQuality: '',
  diagramAmount: '',
  illustration: '',
  photo: '',
  animation: '',
};

const defaultExtras: Record<ExtraOutput, boolean> = {
  onePageSummary: false,
  appendix: false,
  qa: false,
  email: false,
  speakerNotes: false,
  powerPointRequest: false,
};

const sections: SectionConfig[] = [
  {
    id: 'basic',
    title: '基本情報',
    description: '資料全体の前提を指定します。未入力でも自然な前提で補完できます。',
    fields: [
      { key: 'title', label: '資料タイトル', example: '景品表示法研修資料、新サービス提案書、役員向け報告資料' },
      { key: 'documentType', label: '資料の種類', example: '提案書、報告資料、研修資料、説明資料、企画書、比較資料', type: 'select', options: ['', '提案書', '報告資料', '研修資料', '説明資料', '企画書', '比較資料', 'その他'] },
      { key: 'purpose', label: '資料の目的', example: '経営層に新施策の必要性を理解してもらい、実施承認を得たい', type: 'textarea' },
      { key: 'audience', label: '対象者', example: '法務に詳しくない営業部門の管理職、全社員、経営層、顧客' },
      { key: 'usageScene', label: '利用シーン', example: '会議で説明、メール添付、研修受講用、役員会用', type: 'select', options: ['', '会議で説明', 'メール添付', '研修受講用', '役員会用', '顧客提案', 'その他'] },
      { key: 'language', label: '使用言語', example: '日本語、英語、日英併記', type: 'select', options: ['', '日本語', '英語', '日英併記', 'その他'] },
      { key: 'slideCount', label: '希望枚数', example: '5枚、10枚、20枚' },
      { key: 'presentationTime', label: '発表時間', example: '5分、10分、15分、30分' },
    ],
  },
  {
    id: 'goal',
    title: '資料のゴール',
    description: '相手に何を理解・判断・行動してほしいかを整理します。',
    fields: [
      { key: 'keyMessage', label: '一番伝えたいこと', example: '景表法違反は広告部門だけでなく、営業資料やサービス説明でも起こり得る', type: 'textarea' },
      { key: 'desiredAction', label: '相手に取ってほしい行動', example: 'NG表現を理解し、迷ったら法務に相談してほしい', type: 'textarea' },
      { key: 'decisionPoint', label: '判断してほしい事項', example: 'この施策を進めてよいか判断してほしい', type: 'textarea' },
      { key: 'desiredImpression', label: '相手に残したい印象', example: 'わかりやすい、信頼できる、前向き、緊急性がある' },
      { key: 'successState', label: '成功の状態', example: '研修後に従業員が危ない表現に気づけるようになる', type: 'textarea' },
    ],
  },
  {
    id: 'reader',
    title: '読み手情報',
    description: '読み手の知識量・関心・不安に合わせた構成を作りやすくします。',
    fields: [
      { key: 'readerAttributes', label: '読み手の属性', example: '経営層、部長、一般社員、営業担当、顧客' },
      { key: 'readerKnowledge', label: '読み手の前提知識', example: '初心者、ある程度知っている、専門家', type: 'select', options: ['', '初心者', 'ある程度知っている', '専門家', '混在', 'その他'] },
      { key: 'readerInterests', label: '読み手の関心事', example: 'コスト、リスク、売上、効率化、法令遵守', type: 'textarea' },
      { key: 'readerConcerns', label: '読み手が不安に思いそうな点', example: '工数が増える、現場負担が重い、費用対効果が不明', type: 'textarea' },
      { key: 'resonantExpression', label: '読み手に響く表現', example: '数字重視、事例重視、リスク重視、メリット重視' },
    ],
  },
  {
    id: 'content',
    title: '内容情報',
    description: '背景から対応策まで、資料に入れたい実質情報を入力します。',
    fields: [
      { key: 'background', label: '背景', example: '法改正により対応が必要になった', type: 'textarea' },
      { key: 'currentState', label: '現状', example: '現在は明確な運用ルールがない', type: 'textarea' },
      { key: 'issues', label: '課題', example: '担当者ごとに判断がばらついている', type: 'textarea' },
      { key: 'causes', label: '原因', example: 'ルールが周知されていない', type: 'textarea' },
      { key: 'proposal', label: '提案内容', example: 'チェックリストを導入し、研修を実施する', type: 'textarea' },
      { key: 'conclusion', label: '結論', example: '早期に社内運用を整備すべき', type: 'textarea' },
      { key: 'evidence', label: '根拠', example: '法令、社内事例、外部事例、アンケート結果', type: 'textarea' },
      { key: 'data', label: '数値・データ', example: '件数、コスト、人数、スケジュール', type: 'textarea' },
      { key: 'examples', label: '具体例', example: '社内で起こりそうなケース、NG例、OK例', type: 'textarea' },
      { key: 'benefits', label: 'メリット', example: 'リスク低減、品質向上、判断の標準化', type: 'textarea' },
      { key: 'disadvantages', label: 'デメリット', example: '導入負荷、運用定着までの時間', type: 'textarea' },
      { key: 'risks', label: 'リスク', example: '法令違反、炎上、取引先トラブル、監査指摘', type: 'textarea' },
      { key: 'countermeasures', label: '対応策', example: '研修、チェックリスト、相談窓口、承認フロー', type: 'textarea' },
      { key: 'schedule', label: 'スケジュール', example: '6月準備、7月展開、8月運用開始', type: 'textarea' },
      { key: 'roles', label: '役割分担', example: '法務、事業部、人事、情シス', type: 'textarea' },
      { key: 'faq', label: 'FAQに入れたい内容', example: 'どこまで対応が必要か、誰に相談すべきか', type: 'textarea' },
    ],
  },
  {
    id: 'mustavoid',
    title: '入れてほしい内容・避けたい内容',
    description: '必須要素とNG要素を明確にし、業務利用時の安全性を高めます。',
    fields: [
      { key: 'requiredKeywords', label: '必ず入れたいキーワード', example: 'コンプライアンス、レピュテーションリスク、現場判断', type: 'textarea' },
      { key: 'requiredMessage', label: '必ず入れたいメッセージ', example: '迷ったら法務に相談してください', type: 'textarea' },
      { key: 'requiredPages', label: '必ず入れたいページ', example: '表紙、全体像、比較表、ロードマップ、まとめ', type: 'textarea' },
      { key: 'prohibitedContent', label: '入れてはいけない内容', example: '未確定情報、社外秘情報、強すぎる表現', type: 'textarea' },
      { key: 'avoidedExpressions', label: '避けたい表現', example: '絶対、必ず違法、責任を問う、などの断定的表現', type: 'textarea' },
      { key: 'confidentiality', label: '機密度', example: '社内限り、部内限り、社外提出可', type: 'select', options: ['', '社内限り', '部内限り', '社外提出可', '機密', 'その他'] },
    ],
  },
  {
    id: 'design',
    title: 'デザイン情報',
    description: '見た目の方向性や図解量を指定します。',
    fields: [
      { key: 'aspectRatio', label: '資料の縦横比', example: '16:9、4:3、A4縦、A4横', type: 'select', options: ['', '16:9', '4:3', 'A4縦', 'A4横', 'その他'] },
      { key: 'colorScheme', label: '配色', example: '青系、緑系、グレー系、コーポレートカラー' },
      { key: 'mainColor', label: 'メインカラー', example: 'ネイビー、ブルー、グリーン、オレンジ' },
      { key: 'accentColor', label: 'アクセントカラー', example: '赤、黄色、ライトブルー' },
      { key: 'backgroundColor', label: '背景色', example: '白背景、薄いグレー、濃色背景' },
      { key: 'designMood', label: 'デザインの雰囲気', example: 'シンプル、コンサル風、柔らかい、高級感、ポップ', type: 'select', options: ['', 'シンプル', 'コンサル風', '柔らかい', '高級感', 'ポップ', 'その他'] },
      { key: 'fontMood', label: 'フォントの雰囲気', example: 'かため、柔らかめ、モダン、読みやすさ重視' },
      { key: 'whitespace', label: '余白', example: '余白多め、情報量多め、バランス型', type: 'select', options: ['', '余白多め', '情報量多め', 'バランス型', 'その他'] },
      { key: 'textAmount', label: '文字量', example: '少なめ、標準、多め、読み物資料レベル', type: 'select', options: ['', '少なめ', '標準', '多め', '読み物資料レベル'] },
      { key: 'imageQuality', label: '画像の質', example: '高品質、軽量優先、印刷でもきれいに' },
      { key: 'diagramAmount', label: '図解の量', example: '少なめ、標準、多め', type: 'select', options: ['', '少なめ', '標準', '多め'] },
      { key: 'illustration', label: 'イラスト', example: 'フラットイラスト、人物イラスト、不要', type: 'select', options: ['', 'フラットイラスト', '人物イラスト', '不要', '必要なら使用'] },
      { key: 'photo', label: '写真', example: '使用したい、使用しない、必要なら使用', type: 'select', options: ['', '使用したい', '使用しない', '必要なら使用'] },
      { key: 'animation', label: 'アニメーション', example: 'なし、最小限、プレゼン用に少し', type: 'select', options: ['', 'なし', '最小限', 'プレゼン用に少し'] },
    ],
  },
];

const extraOptions: { key: ExtraOutput; label: string }[] = [
  { key: 'onePageSummary', label: '1枚要約' },
  { key: 'appendix', label: 'Appendix' },
  { key: 'qa', label: '想定Q&A' },
  { key: 'email', label: '送付メール文' },
  { key: 'speakerNotes', label: 'スピーカーノート' },
  { key: 'powerPointRequest', label: 'ChatGPTでPowerPointファイル作成まで依頼する文言' },
];

const missingChecks: { key: keyof FormData; label: string; message: string }[] = [
  { key: 'purpose', label: '資料の目的', message: '資料の目的を入力すると、ChatGPTがより適切な構成を作りやすくなります。' },
  { key: 'audience', label: '対象者', message: '対象者を入力すると、読み手に合わせた言葉選びや粒度に調整しやすくなります。' },
  { key: 'keyMessage', label: '一番伝えたいこと', message: '一番伝えたいことを入力すると、資料全体のメッセージがぶれにくくなります。' },
  { key: 'issues', label: '課題', message: '課題を入力すると、背景・提案・結論のつながりが明確になります。' },
  { key: 'conclusion', label: '結論', message: '結論を入力すると、最終スライドや要約の説得力が高まります。' },
  { key: 'slideCount', label: '希望枚数', message: '希望枚数を入力すると、情報量とスライド構成のバランスを取りやすくなります。' },
  { key: 'designMood', label: 'デザインの雰囲気', message: 'デザインの雰囲気を入力すると、用途に合う見た目の指示を作りやすくなります。' },
];

const fieldLabels = new Map<keyof FormData, string>(
  sections.flatMap((section) => section.fields.map((field) => [field.key, field.label] as [keyof FormData, string])),
);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const normalizeImportedState = (value: unknown): AppState | null => {
  if (!isRecord(value)) return null;
  const rawForm = isRecord(value.form) ? value.form : value;
  const rawExtras = isRecord(value.extras) ? value.extras : {};

  const form = { ...defaultForm };
  Object.keys(defaultForm).forEach((key) => {
    const rawValue = rawForm[key];
    form[key as keyof FormData] = typeof rawValue === 'string' ? rawValue : '';
  });

  const extras = { ...defaultExtras };
  Object.keys(defaultExtras).forEach((key) => {
    extras[key as ExtraOutput] = Boolean(rawExtras[key]);
  });

  return { form, extras };
};

const valueOrPlaceholder = (value: string) => (value.trim() ? value.trim() : '未入力（AIが自然な前提で補完）');

const buildPrompt = (form: FormData, extras: Record<ExtraOutput, boolean>) => {
  const sectionText = sections
    .map((section) => {
      const rows = section.fields.map((field) => `- ${field.label}: ${valueOrPlaceholder(form[field.key])}`).join('\n');
      return `## ${section.title}\n${rows}`;
    })
    .join('\n\n');

  const selectedExtras = extraOptions.filter((option) => extras[option.key]).map((option) => option.label);
  const extraText = selectedExtras.length
    ? selectedExtras.map((label) => `- ${label}`).join('\n')
    : '- 追加出力の指定なし（必要に応じて最小限の補足のみ）';

  const powerPointInstruction = extras.powerPointRequest
    ? '\n- 可能であれば、上記スライド案をもとにPowerPointファイル作成まで進めるための手順・依頼文も最後に出力してください。'
    : '';

  return `あなたは、経営層向け提案書・研修資料・報告資料を設計できるビジネス資料作成の専門家です。以下の情報をもとに、ChatGPT上でそのまま資料作成に進められる高品質なビジネス資料案を作成してください。\n\n# 重要な進め方\n- 入力された情報を整理し、資料の目的・読み手・論点・デザイン要件に沿って構成してください。\n- 未入力項目は、資料の種類や文脈からAIが自然で合理的な前提を補完してください。\n- 補完した前提は、最後に「補完した前提一覧」として明記してください。\n- 事実と推測を混同せず、未確定情報・機密情報・個人情報は慎重な表現にしてください。\n- 過度に断定的な表現を避け、「可能性がある」「留意が必要」「検討する」などビジネス利用に適した表現にしてください。\n- ビジネス利用に耐える品質、論理性、読みやすさ、実務での使いやすさを重視してください。\n\n# 入力情報\n${sectionText}\n\n## 追加出力\n${extraText}\n${powerPointInstruction}\n\n# 必ず作成するデザイン違いの3パターン\n以下のA案・B案・C案を必ず作成してください。各案ごとに、構成方針、デザイン方針、向いている利用シーン、スライド一覧を出してください。\n\n## A案：端正でシンプルなビジネス資料\n- 白背景\n- ネイビー・グレー中心\n- 余白を確保\n- 社内会議や上司説明で使いやすい\n\n## B案：コンサル風で整理された資料\n- ロジカル\n- 比較表、マトリクス、ロードマップを活用\n- 情報整理感を重視\n- 役員説明や提案資料に向く\n\n## C案：親しみやすく図解が多い資料\n- 図解、アイコン、イラストを多めに使用\n- 文字量は少なめ\n- 初心者や全社員向けでも理解しやすい\n- 研修資料や説明資料に向く\n\n# 各スライドの出力形式\n各案の各スライドは、必ず以下の形式で出力してください。\n\n- スライド番号\n- スライドタイトル\n- このスライドで伝えたいメッセージ\n- 本文\n- 図解案\n- デザイン指示\n- スピーカーノート${extras.speakerNotes ? '（発表で読み上げやすい粒度で作成）' : '（必要に応じて簡潔に作成）'}\n\n# 出力してほしい内容\n1. 入力情報の要約\n2. 想定した読み手・利用シーン・資料ゴール\n3. 全体ストーリーライン\n4. A案・B案・C案の比較\n5. A案のスライド案\n6. B案のスライド案\n7. C案のスライド案\n${extras.onePageSummary ? '8. 1枚要約案\n' : ''}${extras.appendix ? '9. Appendix案\n' : ''}${extras.qa ? '10. 想定Q&A\n' : ''}${extras.email ? '11. 送付メール文\n' : ''}${extras.powerPointRequest ? '12. PowerPointファイル作成まで依頼するための文言\n' : ''}- 補完した前提一覧\n\n# 注意事項\n- 不明点があっても、合理的な前提を置いてまずは作成してください。\n- 補完した前提は最後に一覧で明記してください。\n- 本編はわかりやすさを優先し、詳細情報はAppendixに回してください。\n- 可能な限り、図解・表・比較・ロードマップを活用してください。\n- ビジネス資料としてそのまま使える水準を目指してください。\n- 機密情報・個人情報・未確定情報については、慎重な表現にしてください。`;
};

const createExportFilename = () => {
  const date = new Date().toISOString().slice(0, 10);
  return `business-doc-prompt-${date}.json`;
};

const getInitialState = (): AppState => {
  const fallback = { form: defaultForm, extras: defaultExtras };
  const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!stored) return fallback;

  try {
    return normalizeImportedState(JSON.parse(stored)) ?? fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const initialState = useMemo(() => getInitialState(), []);
  const [form, setForm] = useState<FormData>(initialState.form);
  const [extras, setExtras] = useState<Record<ExtraOutput, boolean>>(initialState.extras);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section, index) => [section.id, index < 2])),
  );
  const [copyStatus, setCopyStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, extras }));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [form, extras]);

  const prompt = useMemo(() => buildPrompt(form, extras), [form, extras]);
  const missingItems = useMemo(() => missingChecks.filter((item) => !form[item.key].trim()), [form]);

  const updateField = (key: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleSection = (id: string) => {
    setOpenSections((current) => ({ ...current, [id]: !current[id] }));
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopyStatus('生成プロンプトをコピーしました。');
    window.setTimeout(() => setCopyStatus(''), 2400);
  };

  const resetAll = () => {
    const confirmed = window.confirm('入力内容をすべてリセットしますか？');
    if (!confirmed) return;
    setForm(defaultForm);
    setExtras(defaultExtras);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setCopyStatus('');
    setImportStatus('入力内容をリセットしました。');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ form, extras }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = createExportFilename();
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = normalizeImportedState(JSON.parse(String(reader.result)));
        if (!parsed) throw new Error('Invalid JSON format');
        setForm(parsed.form);
        setExtras(parsed.extras);
        setImportStatus('JSONをインポートしました。');
      } catch {
        setImportStatus('JSONの読み込みに失敗しました。形式を確認してください。');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">ChatGPT貼り付け用プロンプト自動生成</p>
          <h1>ビジネス資料設計プロンプトメーカー</h1>
          <p className="hero-text">
            入力フォームに沿って情報を整理するだけで、提案書・報告資料・研修資料などの構成案をChatGPTに依頼するための高品質なプロンプトを生成します。
          </p>
        </div>
        <div className="hero-card" aria-label="アプリの特徴">
          <strong>PowerPoint自体は作成しません</strong>
          <span>出力するのは、ChatGPTへ貼り付ける資料設計プロンプトです。</span>
        </div>
      </header>

      <main className="main-grid">
        <section className="left-column" aria-label="入力フォーム">
          <div className="info-card">
            <h2>使い方</h2>
            <p>
              すべて任意入力です。わかる範囲だけ入力してください。未入力項目は、生成プロンプト内でChatGPTに自然な前提補完を依頼します。
            </p>
          </div>

          <div className="section-stack">
            {sections.map((section) => (
              <section className="form-card" key={section.id}>
                <button className="section-toggle" type="button" onClick={() => toggleSection(section.id)} aria-expanded={openSections[section.id]}>
                  <span>
                    <strong>{section.title}</strong>
                    <small>{section.description}</small>
                  </span>
                  <span className="toggle-mark">{openSections[section.id] ? '−' : '+'}</span>
                </button>

                {openSections[section.id] && (
                  <div className="fields-grid">
                    {section.fields.map((field) => (
                      <label className={field.type === 'textarea' ? 'field field-wide' : 'field'} key={field.key}>
                        <span className="field-label">{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={form[field.key]}
                            onChange={(event) => updateField(field.key, event.target.value)}
                            placeholder={field.example}
                            rows={4}
                          />
                        ) : field.type === 'select' ? (
                          <select value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)}>
                            {field.options?.map((option) => (
                              <option key={option || 'empty'} value={option}>
                                {option || '選択してください（任意）'}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.example} />
                        )}
                        <span className="example">例：{field.example}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <section className="form-card extras-card">
            <div className="card-heading">
              <h2>追加出力</h2>
              <p>必要な成果物を選ぶと、生成プロンプトへ反映されます。</p>
            </div>
            <div className="checkbox-grid">
              {extraOptions.map((option) => (
                <label className="checkbox-item" key={option.key}>
                  <input
                    type="checkbox"
                    checked={extras[option.key]}
                    onChange={(event) => setExtras((current) => ({ ...current, [option.key]: event.target.checked }))}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </section>
        </section>

        <aside className="right-column" aria-label="生成結果と操作">
          <section className="check-card">
            <div className="card-heading">
              <h2>不足情報チェック</h2>
              <p>エラーではありません。入力すると資料の品質が上がります。</p>
            </div>
            {missingItems.length ? (
              <ul className="missing-list">
                {missingItems.map((item) => (
                  <li key={item.key}>
                    <strong>{item.label}</strong>
                    <span>{item.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="complete-message">主要項目が入力されています。より具体的な資料案を生成しやすい状態です。</p>
            )}
          </section>

          <section className="preview-card">
            <div className="preview-header">
              <div>
                <h2>生成プロンプトのプレビュー</h2>
                <p>{prompt.length.toLocaleString()}文字</p>
              </div>
              <button className="primary-button" type="button" onClick={copyPrompt}>コピー</button>
            </div>
            {copyStatus && <p className="status success">{copyStatus}</p>}
            <textarea className="prompt-preview" value={prompt} readOnly aria-label="生成プロンプト" />
          </section>

          <section className="actions-card">
            <h2>データ管理</h2>
            <div className="action-buttons">
              <button type="button" onClick={exportJson}>JSONエクスポート</button>
              <button type="button" onClick={() => fileInputRef.current?.click()}>JSONインポート</button>
              <button className="danger-button" type="button" onClick={resetAll}>リセット</button>
            </div>
            <input ref={fileInputRef} className="sr-only" type="file" accept="application/json,.json" onChange={importJson} />
            {importStatus && <p className="status">{importStatus}</p>}
          </section>

          <section className="summary-card">
            <h2>入力済み項目</h2>
            <p>{Object.entries(form).filter(([, value]) => value.trim()).length} / {Object.keys(form).length} 項目</p>
            <div className="filled-tags">
              {Object.entries(form)
                .filter(([, value]) => value.trim())
                .slice(0, 12)
                .map(([key]) => <span key={key}>{fieldLabels.get(key as keyof FormData)}</span>)}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
