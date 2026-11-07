import { useState } from 'react';
import { CONFIG, PROVIDER_LABEL, backendReady, oauthUrl } from '../lib/backend.js';
import { play } from '../lib/sound.js';

const GENDERS = ['Mulher', 'Homem', 'Pessoa não binária', 'Outro', 'Prefiro não informar'];
const RACES = ['Preta', 'Parda', 'Branca', 'Amarela', 'Indígena', 'Prefiro não informar']; // categorias do IBGE
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export default function Register({ initial, auth, onSubmit, onPrivacy, onBack }) {
  const [f, setF] = useState(() => ({
    name: auth?.name || initial.name || '',
    age: initial.age || '',
    gender: initial.gender || '',
    email: auth?.email || initial.email || '',
    phone: initial.phone || '',
    race: initial.race || '',
    privacy: false,
    marketing: false,
    guardian: false,
  }));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const set = (k, v) => { setF((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const age = Number(f.age);
  const minor = f.age !== '' && age < 18;

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Informe seu nome.';
    if (!f.age || age < 10 || age > 110) er.age = 'Informe uma idade válida.';
    if (!f.gender) er.gender = 'Escolha uma opção (pode ser "Prefiro não informar").';
    if (!EMAIL_RE.test(f.email.trim())) er.email = 'Informe um e-mail válido.';
    if (f.phone && f.phone.replace(/\D/g, '').length < 10) er.phone = 'Use DDD + número (ou deixe em branco).';
    if (!f.privacy) er.privacy = 'É preciso aceitar a política para continuar.';
    if (minor && !f.guardian) er.guardian = 'Menores de 18 anos precisam de autorização do responsável.';
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setSending(true);
    play('next');
    await onSubmit({
      name: f.name.trim(), age, gender: f.gender, email: f.email.trim().toLowerCase(), phone: f.phone.trim(), race: f.race,
      marketing: f.marketing, guardian: minor ? f.guardian : null, consentAt: new Date().toISOString(),
    });
    setSending(false);
  };

  const field = 'w-full rounded-xl border border-gold-deep bg-night px-3 py-2.5 text-parchment placeholder:text-faint focus:border-ember focus:outline-none';
  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-sm text-ember" role="alert">{errors[k]}</p> : null);

  return (
    <section className="fade-in mx-auto max-w-3xl pt-2">
      <div className="panel p-5 sm:p-7">
        <p className="font-display text-xs tracking-[.25em] text-faint">ÚLTIMO PORTAL ANTES DA REVELAÇÃO</p>
        <h1 className="title-glow mb-1 text-2xl font-black sm:text-3xl">Registre seu herói na Guilda</h1>
        <p className="mb-5 text-mist">Sua classe já foi definida! Registre-se para revelar sua carreira recomendada e receber sua trilha de estudos.</p>

        {backendReady() && CONFIG.providers.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-sm text-mist">Entre com uma conta para preencher mais rápido:</p>
            <div className="flex flex-wrap gap-2">
              {CONFIG.providers.map((p) => (
                <a key={p} className="btn-ghost !py-2 text-sm" href={oauthUrl(p)}>Entrar com {PROVIDER_LABEL[p] || p}</a>
              ))}
            </div>
            {auth && <p className="mt-2 text-sm text-ember">✔ Conectado via {PROVIDER_LABEL[auth.provider] || auth.provider}</p>}
          </div>
        )}

        <form onSubmit={submit} noValidate className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="f-name" className="mb-1 block text-sm font-semibold text-gold">Nome</label>
              <input id="f-name" className={field} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
              <Err k="name" />
            </div>
            <div>
              <label htmlFor="f-age" className="mb-1 block text-sm font-semibold text-gold">Idade</label>
              <input id="f-age" className={field} type="number" inputMode="numeric" min={10} max={110} value={f.age} onChange={(e) => set('age', e.target.value)} aria-invalid={!!errors.age} />
              <Err k="age" />
            </div>
            <div>
              <label htmlFor="f-gender" className="mb-1 block text-sm font-semibold text-gold">Gênero</label>
              <select id="f-gender" className={field} value={f.gender} onChange={(e) => set('gender', e.target.value)} aria-invalid={!!errors.gender}>
                <option value="">Selecione…</option>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
              <Err k="gender" />
            </div>
            <div>
              <label htmlFor="f-email" className="mb-1 block text-sm font-semibold text-gold">E-mail</label>
              <input id="f-email" className={field} type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
              <Err k="email" />
            </div>
            <div>
              <label htmlFor="f-phone" className="mb-1 block text-sm font-semibold text-gold">Contato (WhatsApp) <span className="font-normal text-faint">opcional</span></label>
              <input id="f-phone" className={field} type="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={f.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} />
              <Err k="phone" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="f-race" className="mb-1 block text-sm font-semibold text-gold">Cor/raça com que você se identifica <span className="font-normal text-faint">opcional</span></label>
              <select id="f-race" className={field} value={f.race} onChange={(e) => set('race', e.target.value)} aria-describedby="race-help">
                <option value="">Selecione…</option>
                {RACES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <p id="race-help" className="mt-1 text-xs text-faint">Usada só para escolher a ilustração do seu personagem. Fica apenas neste navegador e não é enviada ao nosso banco de dados.</p>
            </div>
            <fieldset className="sm:col-span-2 space-y-3 rounded-xl border border-gold-deep p-3 text-sm">
              <legend className="px-1 font-semibold text-gold">Privacidade (LGPD)</legend>
              <label className="flex gap-2">
                <input id="f-privacy" type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-gold" checked={f.privacy} onChange={(e) => set('privacy', e.target.checked)} />
                <span>Li e aceito a <button type="button" className="text-ember underline" onClick={onPrivacy}>Política de Privacidade</button> e autorizo o uso dos meus dados para gerar e guardar meu resultado. <span className="text-faint">(obrigatório)</span></span>
              </label>
              <Err k="privacy" />
              <label className="flex gap-2">
                <input type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-gold" checked={f.marketing} onChange={(e) => set('marketing', e.target.checked)} />
                <span>Quero receber por e-mail alertas de <strong>cursos gratuitos</strong> e promoções na área do meu resultado. Posso cancelar quando quiser. <span className="text-faint">(opcional)</span></span>
              </label>
              {minor && (
                <>
                  <label className="flex gap-2">
                    <input id="f-guardian" type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-gold" checked={f.guardian} onChange={(e) => set('guardian', e.target.checked)} />
                    <span>Tenho menos de 18 anos e meu/minha responsável autorizou este cadastro.</span>
                  </label>
                  <Err k="guardian" />
                </>
              )}
            </fieldset>
          </div>

          <div className="flex flex-wrap justify-between gap-3 ">
            <button type="button" className="btn-ghost" onClick={onBack}>← Revisar respostas</button>
            <button type="submit" className="btn-rune" disabled={sending}>{sending ? 'Registrando…' : '✨ Revelar minha classe'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
