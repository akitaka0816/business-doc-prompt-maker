import { useState } from 'react';

interface Props {
  prompt: string;
}

function PromptPreview({ prompt }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="preview">
      <div className="preview__head">
        <h2 className="preview__title">生成プロンプト</h2>
        <button type="button" className="btn btn--primary" onClick={handleCopy}>
          {copied ? 'コピーしました' : 'コピー'}
        </button>
      </div>
      <textarea
        className="preview__text"
        value={prompt}
        readOnly
        spellCheck={false}
      />
      <p className="preview__hint">
        このプロンプトをそのままChatGPTに貼り付けてご利用ください。
      </p>
    </div>
  );
}

export default PromptPreview;
