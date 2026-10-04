create table if not exists public.hera_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  company text check (company is null or char_length(company) <= 200),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 40),
  service_interest text check (
    service_interest is null or service_interest in (
      'IA y Automatización',
      'Software Personalizado',
      'Integración de Sistemas',
      'Capacitación & Upskilling'
    )
  ),
  problem_summary text check (problem_summary is null or char_length(problem_summary) <= 2000),
  current_process text check (current_process is null or char_length(current_process) <= 1000),
  requirements text check (requirements is null or char_length(requirements) <= 1000),
  conversation_summary text not null check (char_length(conversation_summary) between 1 and 12000),
  status text not null default 'new',
  source text not null default 'HERA',
  consent_at timestamptz not null,
  check (email is not null or phone is not null)
);

comment on table public.hera_leads is
  'Technology-service inquiries submitted with explicit consent through HERA.';

comment on column public.hera_leads.service_interest is
  'Set only from a service explicitly selected by the visitor; otherwise null.';

comment on column public.hera_leads.conversation_summary is
  'Visitor-authored messages only until a real AI summary service is connected.';

alter table public.hera_leads enable row level security;

-- No browser-facing policies: inserts use the server-only Supabase service role key.
