# Sam assistant setup (non-secret checklist)

Sam calls OpenAI only from the server through `POST /api/chat`. The only required deployment secret is:

- `OPENAI_API_KEY` — set in the hosting platform's server/runtime environment secret settings (not in source, `.env` committed files, browser variables, backups, or logs).

If the variable is absent, `/api/chat` deliberately stays in labeled demo mode and makes no external API call. Never paste the value into this repository or a chat transcript. After adding the secret in the deployment environment, rebuild/restart the server. The current model is `gpt-4o-mini` with a 220-token output cap.
