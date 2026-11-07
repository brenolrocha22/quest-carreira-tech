import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../lib/backend.js';
import { load, save } from '../lib/storage.js';

const REPO = 'https://github.com/brenolrocha22/quest-carreira-tech/issues';
export const contactHref = () => (CONFIG.contact ? `mailto:${CONFIG.contact}` : REPO);

export function PrivacyDialog({ open, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose} className="panel m-auto max-h-[85vh] w-[min(42rem,92vw)] overflow-y-auto p-6 text-sm text-mist backdrop:bg-black/70" aria-labelledby="pp-title">
      <h2 id="pp-title" className="title-glow mb-3 text-xl font-bold">Política de Privacidade</h2>
      <div className="space-y-3 leading-relaxed">
        <p><strong className="text-parchment">Quais dados coletamos:</strong> nome, idade, gênero, e-mail, contato (opcional), a aparência do personagem e o resultado da quest.</p>
        <p><strong className="text-parchment">Para quê:</strong> gerar e guardar seu card. Se você autorizar, também enviamos alertas de cursos gratuitos e promoções da área do seu resultado. Não vendemos seus dados.</p>
        <p><strong className="text-parchment">Base legal (LGPD, art. 7º, I):</strong> o seu consentimento. O consentimento para e-mails é separado e opcional. Para menores de 18 anos, pedimos a autorização do responsável.</p>
        <p><strong className="text-parchment">Onde ficam:</strong> em um banco de dados protegido. Pela internet, as informações só podem ser gravadas: a leitura é restrita aos administradores. Seu progresso na trilha fica apenas no seu navegador.</p>
        <p><strong className="text-parchment">Por quanto tempo:</strong> até você pedir a exclusão ou por no máximo 24 meses sem interação.</p>
        <p><strong className="text-parchment">Seus direitos (art. 18):</strong> confirmar, acessar, corrigir, excluir os dados e revogar o consentimento a qualquer momento, pelo <a className="text-ember underline" href={contactHref()} target="_blank" rel="noreferrer">canal de contato</a>.</p>
        <p><strong className="text-parchment">Cookies e anúncios:</strong> o site pode exibir anúncios do Google AdSense, que usa cookies. Você escolhe no aviso de cookies entre anúncios personalizados ou apenas os essenciais.</p>
        <p className="text-faint">Versão {CONFIG.policyVersion}.</p>
      </div>
      <button className="btn-rune mt-5" onClick={onClose} autoFocus>Entendi</button>
    </dialog>
  );
}

export function CookieBanner({ onPrivacy }) {
  const [choice, setChoice] = useState(() => load('qct_cookies', null));
  if (choice) return null;
  const pick = (v) => {
    save('qct_cookies', v);
    setChoice(v);
    window.dispatchEvent(new Event('qct-consent'));
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3" role="region" aria-label="Aviso de cookies">
      <div className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4 text-sm sm:flex-row sm:items-center">
        <p className="flex-1 text-mist">
          🍪 Usamos cookies para exibir anúncios que mantêm o site gratuito. <button className="text-ember underline" onClick={onPrivacy}>Saiba mais</button>
        </p>
        <div className="flex gap-2">
          <button className="btn-ghost !py-2 text-sm" onClick={() => pick('essential')}>Só essenciais</button>
          <button className="btn-rune !py-2 text-sm" onClick={() => pick('all')}>Aceitar</button>
        </div>
      </div>
    </div>
  );
}

// Google AdSense: só carrega com ID configurado e depois da escolha de cookies.
let adsLoaded = false;
function ensureAdsense() {
  const consent = load('qct_cookies', null);
  if (!CONFIG.adsenseClient || !consent) return false;
  window.adsbygoogle = window.adsbygoogle || [];
  if (consent !== 'all') window.adsbygoogle.requestNonPersonalizedAds = 1;
  if (!adsLoaded) {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.adsenseClient}`;
    document.head.appendChild(s);
    adsLoaded = true;
  }
  return true;
}

export function AdSlot({ slot }) {
  const ref = useRef();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const tryLoad = () => setReady(ensureAdsense());
    tryLoad();
    window.addEventListener('qct-consent', tryLoad);
    return () => window.removeEventListener('qct-consent', tryLoad);
  }, []);
  useEffect(() => {
    if (!ready || !ref.current || ref.current.dataset.pushed) return;
    ref.current.dataset.pushed = '1';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* bloqueador de anúncios */ }
  }, [ready]);
  if (!CONFIG.adsenseClient || !slot) return null;
  return (
    <aside className="my-4 text-center" aria-label="Publicidade">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-faint">Publicidade</p>
      {ready && <ins ref={ref} className="adsbygoogle block" data-ad-client={CONFIG.adsenseClient} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />}
    </aside>
  );
}
