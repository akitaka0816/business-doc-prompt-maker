import { useState } from 'react';
import type { AiTarget } from '../types';

interface AiOption {
  id: AiTarget;
  label: string;
  url: string;
}

const AI_OPTIONS: AiOption[] = [
  { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'claude', label: 'Claude', url: 'https://claude.ai/new' },
  { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/app' },
];

interface Props {
  prompt: string;
  aiTarget: AiTarget;
  onChangeAi: (target: AiTarget) => void;
}

function PromptPreview({ prompt, aiTarget, onChangeAi }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const currentAi = AI_OPTIONS.find((o) => o.id === aiTarget) ?? AI_OPTIONS[0];

  const handleCopyAndOpen = async () => {
    await handleCopy();
    window.open(currentAi.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="preview">
      <div className="preview__head">
        <h2 className="preview__title">生成プロンプト</h2>
        <div className="preview__actions">
          <button type="button" className="btn" onClick={handleCopy}>
            {copied ? 'コピーしました' : 'コピー'}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleCopyAndOpen}
            title={`コピーして${currentAi.label}を開きます`}
          >
            コピーして {currentAi.label} を開く
          </button>
        </div>
      </div>

      <div className="ai-tabs" role="group" aria-label="対象AI">
        {AI_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ai-tabs__btn${aiTarget === opt.id ? ' is-active' : ''}`}
            onClick={() => onChangeAi(opt.id)}
            aria-pressed={aiTarget === opt.id}
          >
            {opt.label}
          </button>
        ))}
        <span className="ai-tabs__hint">対象AIに合わせてプロンプトを最適化します</span>
      </div>

      <textarea
        className="preview__text"
        value={prompt}
        readOnly
        spellCheck={false}
      />
      <p className="preview__hint">
        このプロンプトをそのまま {currentAi.label} に貼り付けてご利用ください。
      </p>
    </div>
  );
}

export default PromptPreview;
