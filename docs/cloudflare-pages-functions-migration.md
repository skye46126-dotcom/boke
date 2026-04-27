# Cloudflare Pages Functions Migration

This project now uses Cloudflare Pages for both the Vue frontend and the
Content Hub API.

## Target Runtime

- Frontend: `frontend-vue/dist`
- API: `functions/api/[[path]].js`
- Public API base URL: `https://chencc.me`
- API routes: `https://chencc.me/api/*`

The Pages Function imports `server/apiHandler.mjs`, so local Node development
and Cloudflare production share the same route table, services, repositories,
and adapter contract.

## Cloudflare Pages Settings

Use these build settings in Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `frontend-vue/dist`
- Root directory: repository root

`wrangler.toml` also declares:

```toml
name = "boke-cd2"
compatibility_date = "2026-04-27"
pages_build_output_dir = "frontend-vue/dist"
```

## Required Environment Variables

Configure these in Cloudflare Pages project settings.

Production variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
AGENT_API_TOKEN=Chenc
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend as a `VITE_*` value.
It must only exist as a Pages Functions environment variable.

Optional local-only variable:

```env
BOKE_ALLOW_DEV_ADMIN_PASSWORD=true
```

This allows the local server to use the fallback admin password `admin` when no
admin password is configured. Do not enable it in production.

## Verification

After deployment, these endpoints must return JSON:

```bash
curl -i https://chencc.me/api/health
curl -i https://chencc.me/api/contract
```

Expected behavior:

- `/api/health` returns `{"ok":true,...}`
- `/api/contract` returns the framework adapter contract
- HTML from the Vue app means the Function route is not deployed or not matched

Then `VCPToolBox/Plugin/BokeBridge/config.env` can use:

```env
BOKE_API_BASE_URL=https://chencc.me
BOKE_AGENT_TOKEN=Chenc
```

## Local Development

The original Node server remains available:

```bash
npm run dev:api
```

To test the Pages Functions runtime locally, build the frontend first and then
start Wrangler:

```bash
npm run build
npm run dev:pages
```

The Cloudflare entry point is separate and uses the same core API handler:

```text
functions/api/[[path]].js -> server/apiHandler.mjs -> routes/services/repos
```
