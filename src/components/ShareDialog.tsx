import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  url: string;
  onClose: () => void;
}

function ShareDialog({ open, url, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">共有URL</h2>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
        <p className="modal__desc">
          現在の入力内容をURLに埋め込みました。URLを開いた相手は、この設計を新しい資料として読み込めます。
        </p>
        <div className="share-url">
          <input
            type="text"
            className="field__input"
            value={url}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
          />
          <button type="button" className="btn btn--primary" onClick={handleCopy}>
            {copied ? 'コピーしました' : 'URLをコピー'}
          </button>
        </div>
        <p className="modal__note">
          ※ サーバーには送信されません。URLそのものに入力内容が含まれるため、機密情報を含む場合は共有先と取り扱いにご注意ください。
        </p>
      </div>
    </div>
  );
}

export default ShareDialog;
