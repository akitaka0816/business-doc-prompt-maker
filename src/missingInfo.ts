import type { FormValues } from './types';

interface MissingHint {
  key: string;
  message: string;
}

const HINTS: MissingHint[] = [
  {
    key: 'purpose',
    message:
      '資料の目的を入力すると、ChatGPTがより適切な構成を作りやすくなります。',
  },
  {
    key: 'audience',
    message:
      '対象者を入力すると、読み手に合ったトーンや説明レベルに調整しやすくなります。',
  },
  {
    key: 'mainMessage',
    message:
      '一番伝えたいことを入力すると、資料全体の軸がブレずに仕上がります。',
  },
  {
    key: 'issues',
    message:
      '課題を入力すると、提案の必要性がより伝わる構成にしやすくなります。',
  },
  {
    key: 'conclusion',
    message:
      '結論を入力すると、相手に取ってほしい行動が明確な資料になります。',
  },
  {
    key: 'pages',
    message:
      '希望枚数を入力すると、情報量と密度のバランスを整えやすくなります。',
  },
  {
    key: 'designMood',
    message:
      'デザインの雰囲気を入力すると、3パターン作成の方向性が定めやすくなります。',
  },
];

export function getMissingHints(values: FormValues): MissingHint[] {
  return HINTS.filter((h) => !values[h.key] || values[h.key].trim() === '');
}
