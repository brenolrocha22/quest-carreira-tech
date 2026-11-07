// Integração opcional com Supabase (banco + login social) via REST, sem SDK.
// Sem as variáveis de ambiente, o site funciona normalmente e guarda o cadastro só no navegador.
const ENV = import.meta.env;

export const CONFIG = {
  supabaseUrl: (ENV.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
  supabaseKey: ENV.VITE_SUPABASE_ANON_KEY || '',
  providers: (ENV.VITE_AUTH_PROVIDERS || 'google,azure,apple').split(',').map((s) => s.trim()).filter(Boolean),
  adsenseClient: ENV.VITE_ADSENSE_CLIENT || '',
  adSlots: { result: ENV.VITE_ADSENSE_SLOT_RESULT || '', trail: ENV.VITE_ADSENSE_SLOT_TRAIL || '', home: ENV.VITE_ADSENSE_SLOT_HOME || '' },
  contact: ENV.VITE_CONTACT_EMAIL || '',
  policyVersion: '2026-11',
};

export const backendReady = () => !!(CONFIG.supabaseUrl && CONFIG.supabaseKey);

export const PROVIDER_LABEL = { google: 'Google', azure: 'Microsoft', apple: 'Apple' };

export function oauthUrl(provider) {
  const back = window.location.origin + window.location.pathname;
  return `${CONFIG.supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(back)}`;
}

/** Lê o retorno do login social (token no fragmento da URL) e busca nome/e-mail. */
export async function readOAuthReturn() {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const token = hash.get('access_token');
  if (!token || !backendReady()) return null;
  history.replaceState(null, '', window.location.pathname + window.location.search);
  try {
    const res = await fetch(`${CONFIG.supabaseUrl}/auth/v1/user`, { headers: { apikey: CONFIG.supabaseKey, Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const u = await res.json();
    return {
      token,
      userId: u.id,
      email: u.email || '',
      name: u.user_metadata?.full_name || u.user_metadata?.name || '',
      provider: u.app_metadata?.provider || '',
    };
  } catch {
    return null;
  }
}

/** Insere o lead. A tabela só aceita INSERT pela chave pública (RLS); ninguém lê pela API. */
export async function saveLead(lead, auth) {
  if (!backendReady()) return { stored: 'local' };
  const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: CONFIG.supabaseKey,
      Authorization: `Bearer ${auth?.token || CONFIG.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: lead.name,
      age: lead.age,
      gender: lead.gender,
      email: lead.email,
      phone: lead.phone || null,
      class_id: lead.classId,
      subclass_id: lead.subId,
      marketing_opt_in: lead.marketing,
      guardian_consent: lead.guardian ?? null,
      consent_at: lead.consentAt,
      policy_version: CONFIG.policyVersion,
      auth_provider: auth?.provider || null,
      user_id: auth?.userId || null,
    }),
  });
  if (!res.ok) throw new Error(`Falha ao salvar cadastro (${res.status})`);
  return { stored: 'remote' };
}
