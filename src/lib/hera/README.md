# HERA

- `system-instructions.ts` and `knowledge.ts` hold the stable, server-only HERA policy and approved service facts. Keep their prefix stable for prompt caching.
- `openai.ts` calls the OpenAI Responses API with `gpt-5.4-mini`, low reasoning effort, strict structured outputs, no tools, no retries, and `store: false`.
- `app/api/hera/chat/route.ts` validates bounded conversation history and rate-limits chat requests before calling OpenAI.
- Conversation history stays in browser memory while the widget is open. Anonymous conversations are not written to Supabase.
- `app/api/hera/leads/route.ts` calls the summarizer only after explicit consent and a valid contact form submission. The server validates summary service names and maps the structured summary into the existing `hera_leads` columns. If AI summary generation is unavailable, it stores a bounded visitor-authored transcript so a valid lead can still be saved.
- The existing `supabase-leads.ts`, lead schema, consent, and server-only secret handling remain in place.

## Server environment

Set `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the local/server environment. Never use a `NEXT_PUBLIC_` prefix for these secrets.

## Limits and deployment

Chat accepts up to 25 visitor turns and 1,800 characters per message. When conversation history exceeds 28,000 characters, the server preserves the initial goal and the latest exchanges. It allows up to 45 chat requests per client IP per 15-minute process window. Lead submission retains its separate 5-per-15-minute process limit. The current rate limiter is in-memory and intended for local development/single process use; replace it with shared/distributed storage before scaling across multiple production instances.
