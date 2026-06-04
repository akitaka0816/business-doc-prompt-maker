import { getMissingHints } from '../missingInfo';
import type { FormValues } from '../types';

interface Props {
  values: FormValues;
}

function MissingInfoNotice({ values }: Props) {
  const hints = getMissingHints(values);
  if (hints.length === 0) {
    return (
      <div className="notice notice--ok">
        必要な情報は揃っています。プロンプトの品質が高まりやすい状態です。
      </div>
    );
  }
  return (
    <div className="notice">
      <div className="notice__title">品質向上のための補足</div>
      <ul className="notice__list">
        {hints.map((h) => (
          <li key={h.key}>{h.message}</li>
        ))}
      </ul>
      <p className="notice__sub">
        未入力でもプロンプトは生成できます。ChatGPT側で合理的に補完するよう指示が含まれます。
      </p>
    </div>
  );
}

export default MissingInfoNotice;
