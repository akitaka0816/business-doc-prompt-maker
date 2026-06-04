import type { AdditionalOutputs, CategoryDef } from './types';

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'basic',
    title: '1. 基本情報',
    fields: [
      {
        key: 'title',
        label: '資料タイトル',
        example: '例：景品表示法研修資料、新サービス提案書、役員向け報告資料',
        type: 'text',
      },
      {
        key: 'docType',
        label: '資料の種類',
        example: '例：研修資料、提案書、報告書、社内説明資料、営業資料',
        type: 'text',
      },
      {
        key: 'purpose',
        label: '資料の目的',
        example: '例：経営層に新施策の必要性を理解してもらい、実施承認を得たい',
        type: 'textarea',
      },
      {
        key: 'audience',
        label: '対象者',
        example: '例：法務に詳しくない営業部門の管理職、全社員、経営層、顧客',
        type: 'text',
      },
      {
        key: 'scene',
        label: '利用シーン',
        example: '例：四半期報告会、社内研修、役員会、顧客提案、勉強会',
        type: 'text',
      },
      {
        key: 'language',
        label: '使用言語',
        example: '例：日本語、英語、日本語(敬体)',
        type: 'text',
      },
      {
        key: 'pages',
        label: '希望枚数',
        example: '例：10枚程度、15〜20枚、Appendix含めて30枚以内',
        type: 'text',
      },
      {
        key: 'duration',
        label: '発表時間',
        example: '例：15分、30分（質疑応答10分含む）、説明なし配布のみ',
        type: 'text',
      },
    ],
  },
  {
    id: 'goal',
    title: '2. 資料のゴール',
    fields: [
      {
        key: 'mainMessage',
        label: '一番伝えたいこと',
        example:
          '例：景表法違反は広告部門だけでなく、営業資料やサービス説明でも起こり得る',
        type: 'textarea',
      },
      {
        key: 'desiredAction',
        label: '相手に取ってほしい行動',
        example: '例：提案内容に承認を出してほしい、研修後にチェックリストを運用してほしい',
        type: 'textarea',
      },
      {
        key: 'decision',
        label: '判断してほしい事項',
        example: '例：来期の予算配分、ベンダー選定、本施策の正式採用可否',
        type: 'textarea',
      },
      {
        key: 'impression',
        label: '相手に残したい印象',
        example: '例：データに基づく堅実な提案、現場感のある実行可能な計画',
        type: 'text',
      },
      {
        key: 'successState',
        label: '成功の状態',
        example: '例：質疑応答で具体的な実行スケジュールの議論に進む',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'reader',
    title: '3. 読み手情報',
    fields: [
      {
        key: 'readerAttr',
        label: '読み手の属性',
        example: '例：30〜50代の営業部門マネージャー、技術知識は中程度',
        type: 'text',
      },
      {
        key: 'readerKnowledge',
        label: '読み手の前提知識',
        example: '例：自社サービスの概要は把握、業界の最新動向は未把握',
        type: 'textarea',
      },
      {
        key: 'readerInterest',
        label: '読み手の関心事',
        example: '例：費用対効果、現場の運用負荷、リスク管理',
        type: 'text',
      },
      {
        key: 'readerConcern',
        label: '読み手が不安に思いそうな点',
        example: '例：導入コスト、現場の反発、運用後の効果測定',
        type: 'textarea',
      },
      {
        key: 'readerTone',
        label: '読み手に響く表現',
        example: '例：数値根拠、具体事例、シンプルな言い回し',
        type: 'text',
      },
    ],
  },
  {
    id: 'content',
    title: '4. 内容情報',
    fields: [
      {
        key: 'background',
        label: '背景',
        example: '例：法改正により表記基準が厳格化、社内でも複数のヒヤリ事例が発生',
        type: 'textarea',
      },
      {
        key: 'currentState',
        label: '現状',
        example: '例：チェック体制は広告部門のみ。営業部門の資料は未確認',
        type: 'textarea',
      },
      {
        key: 'issues',
        label: '課題',
        example: '例：違反リスクの認知不足、属人的な確認フロー、教育機会の不足',
        type: 'textarea',
      },
      {
        key: 'causes',
        label: '原因',
        example: '例：ガイドラインが現場まで周知されていない、研修が一度きり',
        type: 'textarea',
      },
      {
        key: 'proposal',
        label: '提案内容',
        example: '例：全社向け研修の定期実施、チェックリスト導入、相談窓口設置',
        type: 'textarea',
      },
      {
        key: 'conclusion',
        label: '結論',
        example: '例：来四半期から全部門で研修とチェックリスト運用を開始する',
        type: 'textarea',
      },
      {
        key: 'evidence',
        label: '根拠',
        example: '例：消費者庁の公表事例、社内アンケート結果、他社事例',
        type: 'textarea',
      },
      {
        key: 'data',
        label: '数値・データ',
        example: '例：直近3年で違反事例25％増、社内ヒヤリ事例12件',
        type: 'textarea',
      },
      {
        key: 'examples',
        label: '具体例',
        example: '例：「No.1表記」「効果◯◯％」などの不適切表現の事例',
        type: 'textarea',
      },
      {
        key: 'merits',
        label: 'メリット',
        example: '例：違反リスク低減、ブランド毀損防止、現場の判断スピード向上',
        type: 'textarea',
      },
      {
        key: 'demerits',
        label: 'デメリット',
        example: '例：研修工数の増加、初期コスト発生',
        type: 'textarea',
      },
      {
        key: 'risks',
        label: 'リスク',
        example: '例：研修未受講者の発生、現場運用での形骸化',
        type: 'textarea',
      },
      {
        key: 'countermeasures',
        label: '対応策',
        example: '例：受講管理システム導入、四半期ごとの運用レビュー',
        type: 'textarea',
      },
      {
        key: 'schedule',
        label: 'スケジュール',
        example: '例：Q1:準備、Q2:全社研修、Q3:運用、Q4:振り返り',
        type: 'textarea',
      },
      {
        key: 'roles',
        label: '役割分担',
        example: '例：法務=コンテンツ作成、人事=研修運営、各部=受講管理',
        type: 'textarea',
      },
      {
        key: 'faq',
        label: 'FAQに入れたい内容',
        example: '例：違反かどうか迷ったらどこに相談する？／研修は何分かかる？',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'inclusion',
    title: '5. 入れてほしい内容・避けたい内容',
    fields: [
      {
        key: 'mustKeywords',
        label: '必ず入れたいキーワード',
        example: '例：景品表示法、優良誤認、有利誤認、社内ルール',
        type: 'text',
      },
      {
        key: 'mustMessages',
        label: '必ず入れたいメッセージ',
        example: '例：「自分の業務にも関係がある」と認識してもらう',
        type: 'textarea',
      },
      {
        key: 'mustPages',
        label: '必ず入れたいページ',
        example: '例：表紙、目的、事例、チェックリスト、相談窓口',
        type: 'textarea',
      },
      {
        key: 'forbiddenContent',
        label: '入れてはいけない内容',
        example: '例：個別案件名、未公表の社内事例、社外秘の数値',
        type: 'textarea',
      },
      {
        key: 'avoidExpression',
        label: '避けたい表現',
        example: '例：断定的表現、煽り表現、否定的な言い回し',
        type: 'text',
      },
      {
        key: 'confidentiality',
        label: '機密度',
        example: '例：社外秘、社内限り、関係部署限定',
        type: 'text',
      },
    ],
  },
  {
    id: 'design',
    title: '6. デザイン情報',
    fields: [
      {
        key: 'aspectRatio',
        label: '資料の縦横比',
        example: '例：16:9、4:3、A4縦',
        type: 'text',
      },
      {
        key: 'colorScheme',
        label: '配色',
        example: '例：白基調＋ネイビー＋アクセントにオレンジ',
        type: 'text',
      },
      {
        key: 'mainColor',
        label: 'メインカラー',
        example: '例：ネイビー(#1F3A5F)、コーポレートブルー',
        type: 'text',
      },
      {
        key: 'accentColor',
        label: 'アクセントカラー',
        example: '例：オレンジ(#F18F01)、ゴールド',
        type: 'text',
      },
      {
        key: 'backgroundColor',
        label: '背景色',
        example: '例：白、薄いグレー(#F5F7FA)',
        type: 'text',
      },
      {
        key: 'designMood',
        label: 'デザインの雰囲気',
        example:
          '例：白背景、青系、文字少なめ、図解多め、社内研修らしく柔らかい雰囲気',
        type: 'textarea',
      },
      {
        key: 'fontMood',
        label: 'フォントの雰囲気',
        example: '例：ゴシック系で読みやすく、見出しは太め、本文は標準',
        type: 'text',
      },
      {
        key: 'margin',
        label: '余白',
        example: '例：余白多め、ゆったり、上下左右に十分なスペース',
        type: 'text',
      },
      {
        key: 'textVolume',
        label: '文字量',
        example: '例：1スライド5行以内、見出しと要点のみ',
        type: 'text',
      },
      {
        key: 'imageQuality',
        label: '画像の質',
        example: '例：シンプルなフラットイラスト、実写は使わない',
        type: 'text',
      },
      {
        key: 'diagramVolume',
        label: '図解の量',
        example: '例：1スライド1図解、ロジカルな図を多めに',
        type: 'text',
      },
      {
        key: 'illustration',
        label: 'イラスト',
        example: '例：人物アイコンを活用、線画イラストを少量',
        type: 'text',
      },
      {
        key: 'photo',
        label: '写真',
        example: '例：表紙のみ写真、本編は不使用',
        type: 'text',
      },
      {
        key: 'animation',
        label: 'アニメーション',
        example: '例：使用しない、最小限のフェードのみ',
        type: 'text',
      },
    ],
  },
];

export const ADDITIONAL_OUTPUT_OPTIONS: { key: keyof AdditionalOutputs; label: string }[] = [
  { key: 'summaryOnePage', label: '1枚要約' },
  { key: 'appendix', label: 'Appendix' },
  { key: 'qa', label: '想定Q&A' },
  { key: 'emailDraft', label: '送付メール文' },
  { key: 'speakerNotes', label: 'スピーカーノート' },
  { key: 'pptxRequest', label: 'ChatGPTでPowerPointファイル作成まで依頼する文言' },
];

export const DEFAULT_OUTPUTS: AdditionalOutputs = {
  summaryOnePage: false,
  appendix: false,
  qa: false,
  emailDraft: false,
  speakerNotes: true,
  pptxRequest: false,
};

export const ALL_FIELD_KEYS: string[] = CATEGORIES.flatMap((c) =>
  c.fields.map((f) => f.key),
);

export const EMPTY_VALUES: Record<string, string> = Object.fromEntries(
  ALL_FIELD_KEYS.map((k) => [k, '']),
);
