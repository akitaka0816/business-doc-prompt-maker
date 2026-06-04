import { DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import type { AdditionalOutputs, FormValues } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  values: Record<string, string>;
  outputs?: Partial<AdditionalOutputs>;
}

export const TEMPLATES: Template[] = [
  {
    id: 'proposal',
    name: '役員向け提案書',
    description: '経営層に新施策の承認を得るための提案資料。',
    values: {
      docType: '提案書',
      purpose: '経営層に新施策の必要性を理解してもらい、実施承認を得る',
      audience: '経営層・役員',
      scene: '役員会、四半期経営会議',
      language: '日本語（敬体）',
      pages: '15〜20枚（Appendix含む）',
      duration: '20分（質疑応答10分）',
      impression: 'データに基づく堅実な提案、実行可能な計画',
      readerInterest: '費用対効果、リスク、実行可能性',
      designMood: '白背景、ネイビー基調、文字少なめ、図解とグラフを活用',
      aspectRatio: '16:9',
    },
    outputs: { summaryOnePage: true, qa: true, speakerNotes: true, appendix: true },
  },
  {
    id: 'training',
    name: '社内研修資料',
    description: '全社員向けの研修・説明資料。',
    values: {
      docType: '研修資料',
      purpose: '対象者に知識を習得してもらい、業務で実践できる状態にする',
      audience: '全社員（部門・役職を問わず）',
      scene: '社内研修、eラーニング、配布資料',
      language: '日本語（敬体）',
      pages: '20〜30枚',
      duration: '60分',
      impression: 'わかりやすく、自分ごととして捉えられる',
      readerKnowledge: '専門知識は乏しい、業務での基礎知識はある',
      designMood: '白背景、青系、文字少なめ、図解・アイコン多めで柔らかい雰囲気',
      aspectRatio: '16:9',
      textVolume: '1スライド5行以内、見出しと要点のみ',
    },
    outputs: { qa: true, speakerNotes: true, summaryOnePage: true },
  },
  {
    id: 'report',
    name: '業務報告書',
    description: '進捗・結果を報告する社内資料。',
    values: {
      docType: '報告書',
      purpose: '関係者に進捗や成果を共有し、次のアクションを判断してもらう',
      audience: '上長、関連部門の責任者',
      scene: '定例報告会、月次レビュー',
      language: '日本語（敬体）',
      pages: '10枚程度',
      duration: '15分',
      impression: '事実ベース、簡潔、論点が明快',
      designMood: '白背景、ネイビー・グレー中心、表・グラフを活用、装飾は控えめ',
      aspectRatio: '16:9',
      textVolume: '要点を端的に、表とグラフ中心',
    },
    outputs: { summaryOnePage: true, appendix: true, speakerNotes: true },
  },
  {
    id: 'sales',
    name: '顧客向け営業資料',
    description: '見込み顧客への提案・サービス紹介資料。',
    values: {
      docType: '営業資料',
      purpose: '顧客に自社サービスの価値を理解してもらい、次商談に進める',
      audience: '見込み顧客の意思決定者・担当者',
      scene: '初回商談、提案プレゼン',
      language: '日本語（敬体）',
      pages: '15〜25枚',
      duration: '30分',
      impression: '信頼感、専門性、顧客課題への理解',
      readerConcern: '導入コスト、運用負荷、効果の不確実性',
      designMood: '白背景＋コーポレートカラー、写真や事例を活用、洗練された雰囲気',
      aspectRatio: '16:9',
    },
    outputs: { qa: true, emailDraft: true, summaryOnePage: true, appendix: true },
  },
];

export function applyTemplate(t: Template): {
  values: FormValues;
  outputs: AdditionalOutputs;
} {
  return {
    values: { ...EMPTY_VALUES, ...t.values },
    outputs: { ...DEFAULT_OUTPUTS, ...(t.outputs ?? {}) },
  };
}
