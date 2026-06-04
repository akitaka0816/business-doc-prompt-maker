import { CATEGORIES } from './formConfig';
import type { AdditionalOutputs, AiTarget, FormValues } from './types';

function formatValue(v: string): string {
  const trimmed = v.trim();
  return trimmed === '' ? '（未入力 → 合理的に補完してください）' : trimmed;
}

function buildInputSection(values: FormValues): string {
  const lines: string[] = [];
  for (const cat of CATEGORIES) {
    lines.push(`【${cat.title}】`);
    for (const f of cat.fields) {
      lines.push(`- ${f.label}：${formatValue(values[f.key] ?? '')}`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

function buildAdditionalOutputSection(outputs: AdditionalOutputs): string {
  const items: string[] = [];
  if (outputs.summaryOnePage) {
    items.push(
      '- 1枚要約：本資料の要点を1枚にまとめたサマリースライドを作成してください。',
    );
  }
  if (outputs.appendix) {
    items.push(
      '- Appendix：本編に入れない補足データ・参考情報・用語解説をAppendixとして作成してください。',
    );
  }
  if (outputs.qa) {
    items.push(
      '- 想定Q&A：読み手から出そうな質問を5〜10件挙げ、それぞれに回答案を作成してください。',
    );
  }
  if (outputs.emailDraft) {
    items.push(
      '- 送付メール文：資料を送付する際のメール本文（件名・宛名・本文・締め）を作成してください。',
    );
  }
  if (outputs.speakerNotes) {
    items.push(
      '- スピーカーノート：各スライドに、発表者が話す内容のスピーカーノートを作成してください。',
    );
  }
  if (outputs.pptxRequest) {
    items.push(
      '- PowerPoint作成依頼：最後に「上記の内容をPowerPointファイルとして作成してください。スライドごとに分け、デザイン指示を反映してください。」という依頼文を加えてください。',
    );
  }
  if (items.length === 0) return '';
  return ['【追加で作成してほしい成果物】', ...items].join('\n');
}

const DESIGN_PATTERNS = `【作成してほしい3パターンのデザイン】
ユーザーが選びやすいよう、必ず以下の3パターンすべてを作成してください。

A案：端正でシンプルなビジネス資料
- 白背景
- ネイビー・グレー中心の配色
- 余白を十分に確保
- 社内会議や上司説明で使いやすい落ち着いたトーン

B案：コンサル風で整理された資料
- ロジカルな構成
- 比較表、マトリクス、ロードマップを活用
- 情報整理感を重視
- 役員説明や提案資料に向く、シャープなトーン

C案：親しみやすく図解が多い資料
- 図解、アイコン、イラストを多めに使用
- 文字量は少なめ
- 初心者や全社員向けでも理解しやすい
- 研修資料や説明資料に向く、柔らかいトーン`;

const SLIDE_FORMAT = `【各スライドの出力形式】
各パターンについて、スライドごとに以下の形式で出力してください。

---
スライド番号：（例：1）
スライドタイトル：
このスライドで伝えたいメッセージ：
本文：（箇条書き、3〜5項目を目安に）
図解案：（どんな図・表・配置にするかを文章で説明）
デザイン指示：（配色・余白・フォント・強調箇所など、PowerPoint作成者が再現できるレベルで具体的に）
スピーカーノート：（発表時に話す内容）
---`;

const GUIDELINES = `【全体ルール】
- 入力された情報は忠実に活用してください。
- 未入力項目は、対象者・目的・資料の種類から合理的な前提を置いて補完してください。
- 補完した前提は、出力の最後に「補完した前提一覧」としてまとめて明記してください。
- 過度に断定的な表現は避け、必要に応じて「〜と考えられます」「〜の可能性があります」など、ビジネスで使いやすい表現にしてください。
- 機密情報・個人情報・未確定情報は慎重に扱い、安易に具体名・数値を作り出さず、「（要確認）」などのマーカーを付けてください。
- 数値やデータは、入力されたもののみを使用し、不明な場合は「（要数値確認）」と明記してください。
- 各パターンの最初に「このパターンが向くシーン」を1〜2行で書いてください。`;

interface AiProfile {
  intro: string;
  extraTip: string;
}

const AI_PROFILES: Record<AiTarget, AiProfile> = {
  chatgpt: {
    intro:
      'あなたはビジネス資料作成の専門家です。以下の情報をもとに、ビジネスでそのまま使える資料を作成してください。',
    extraTip:
      'Markdownの表・箇条書きを活用し、読み手が一目で構造を把握できる形で出力してください。',
  },
  claude: {
    intro:
      'あなたはビジネス資料作成のプロフェッショナルです。提供された情報を丁寧に分析し、実務でそのまま活用できる資料を作成してください。',
    extraTip:
      'まず全体の構成案を提示してから、各パターン・各スライドの詳細を順に展開してください。論理の飛躍を避け、根拠と結論を明確に対応づけてください。',
  },
  gemini: {
    intro:
      'あなたはビジネス資料作成の専門家です。以下の情報をもとに、ビジネスでそのまま使える資料を作成してください。',
    extraTip:
      '明確で構造化された応答を心がけ、表・図解・スライドごとの区切りをはっきり示してください。各セクションは見出しで区切ってください。',
  },
};

export function buildPrompt(
  values: FormValues,
  outputs: AdditionalOutputs,
  aiTarget: AiTarget = 'chatgpt',
): string {
  const profile = AI_PROFILES[aiTarget];

  const sections = [
    profile.intro,
    '',
    '【入力情報】',
    buildInputSection(values),
    '',
    DESIGN_PATTERNS,
    '',
    SLIDE_FORMAT,
    '',
    GUIDELINES,
  ];

  const extras = buildAdditionalOutputSection(outputs);
  if (extras) {
    sections.push('', extras);
  }

  sections.push(
    '',
    '【出力順序】',
    '1. A案の全スライド',
    '2. B案の全スライド',
    '3. C案の全スライド',
    '4. 選択された追加成果物（1枚要約・Appendix・想定Q&A・送付メール文 など）',
    '5. 補完した前提一覧',
    '',
    `【出力のヒント】\n${profile.extraTip}`,
  );

  return sections.join('\n');
}
