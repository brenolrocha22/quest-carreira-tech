-- Tabela de cadastros (leads) da Quest de Carreira Tech.
-- Rode no Supabase em: SQL Editor > New query > Run.
-- LGPD: a chave pública só consegue INSERIR. Ninguém lê os dados pela API pública;
-- a leitura é feita apenas no painel do Supabase ou com a service role key (nunca no site).
-- Cor/raça NÃO é armazenada (dado sensível; usado só no navegador para escolher a ilustração).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  age int not null check (age between 10 and 110),
  gender text,
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  phone text,
  class_id text not null,
  subclass_id text,
  marketing_opt_in boolean not null default false,
  guardian_consent boolean,
  consent_at timestamptz not null,
  policy_version text not null,
  auth_provider text,
  user_id uuid
);

alter table public.leads enable row level security;

drop policy if exists "leads_insert_only" on public.leads;
create policy "leads_insert_only" on public.leads
  for insert to anon, authenticated
  with check (true);

-- Sem políticas de SELECT/UPDATE/DELETE: a API pública não lê nem altera cadastros.
-- Para atender pedidos de exclusão (art. 18 da LGPD), apague pelo painel:
--   delete from public.leads where email = 'pessoa@exemplo.com';
