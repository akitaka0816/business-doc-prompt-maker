import { DEFAULT_OUTPUTS, EMPTY_VALUES } from './formConfig';
import type { AdditionalOutputs, FormValues } from './types';

interface SharePayload {
  n: string;
  v: FormValues;
  o: AdditionalOutputs;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(s: string): string {
  let r = s.replace(/-/g, '+').replace(/_/g, '/');
  while (r.length % 4) r += '=';
  return r;
}

export function buildShareUrl(
  name: string,
  values: FormValues,
  outputs: AdditionalOutputs,
): string {
  const payload: SharePayload = { n: name, v: values, o: outputs };
  const token = toUrlSafe(utf8ToBase64(JSON.stringify(payload)));
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#share=${token}`;
}

export function decodeShare(
  token: string,
): { name: string; values: FormValues; outputs: AdditionalOutputs } | null {
  try {
    const json = base64ToUtf8(fromUrlSafe(token));
    const data = JSON.parse(json) as Partial<SharePayload>;
    if (!data || typeof data !== 'object') return null;
    return {
      name: typeof data.n === 'string' ? data.n : '共有された設計',
      values: { ...EMPTY_VALUES, ...(data.v ?? {}) },
      outputs: { ...DEFAULT_OUTPUTS, ...(data.o ?? {}) },
    };
  } catch {
    return null;
  }
}

export function readShareFromUrl(): string | null {
  const m = window.location.hash.match(/share=([^&]+)/);
  return m ? m[1] : null;
}

export function clearShareFromUrl(): void {
  if (window.location.hash) {
    history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    );
  }
}
