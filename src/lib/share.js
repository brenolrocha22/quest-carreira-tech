export const questUrl = () => window.location.origin + window.location.pathname;

export async function nodeToBlob(node, opts = {}) {
  if (document.fonts?.ready) await document.fonts.ready;
  const { default: html2canvas } = await import('html2canvas'); // carregado só quando necessário
  const canvas = await html2canvas(node, { backgroundColor: '#0b0a1f', scale: 2, useCORS: true, logging: false, ...opts });
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Falha ao gerar imagem'))), 'image/png'));
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Web Share API. Retorna 'shared' | 'cancelled' | 'unsupported'. */
export async function nativeShare({ blob, filename, text, url }) {
  if (!navigator.share) return 'unsupported';
  const data = { title: 'Quest de Carreira Tech', text, url };
  if (blob) {
    const file = new File([blob], filename, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) data.files = [file];
  }
  try {
    await navigator.share(data);
    return 'shared';
  } catch (e) {
    return e?.name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}

export async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

// O texto já contém o link da quest.
export const intents = {
  x: (t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`,
  threads: (t) => `https://www.threads.net/intent/post?text=${encodeURIComponent(t)}`,
  whatsapp: (t) => `https://wa.me/?text=${encodeURIComponent(t)}`,
  linkedin: (t) => `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(t)}`,
};
