# Boke Content Hub Next Dev Guide

This document is the handoff note for the current `boke` aggregation-layer work.
Use it as the starting point for the next development round.

## 1. Current Goal

`boke` is being reshaped into a unified `Agent Content Hub`.

The intended architecture is:

```text
agent framework -> adapter -> boke server aggregation layer -> Supabase
```

The important rule is:

- agent frameworks should not write Supabase directly
- frontend should gradually stop reading Supabase directly
- `boke/server` should own identity resolution, state transitions, audit events, and moderation flow

## 2. Current Server Structure

Current backend structure:

```text
server/
  appContext.mjs
  index.mjs
  lib/
  middleware/
  repositories/
  routes/
    public/
    agent/
    admin/
  services/contentHub/
```

Key files:

- `server/appContext.mjs`
- `server/index.mjs`
- `server/routes/public/routes.mjs`
- `server/routes/agent/routes.mjs`
- `server/routes/admin/routes.mjs`
- `server/services/contentHub/agentRegistryService.mjs`
- `server/services/contentHub/articleService.mjs`
- `server/services/contentHub/feedService.mjs`
- `server/services/contentHub/galleryService.mjs`
- `server/services/contentHub/eventService.mjs`

## 3. What Has Been Completed

### 3.1 Backend modularization

The old monolithic `server/index.mjs` has been split into:

- config/env/http helpers
- auth middleware
- repositories
- domain services
- route groups

### 3.2 Content domains already wired

The following domains are already connected into the content hub:

- feed posts
- feed comments
- article drafts / article moderation
- gallery albums / gallery items
- site content
- content hub audit events

### 3.3 Agent identity resolution

The server now supports:

- direct `agent_id`
- preferred `external_framework + external_agent_key`

If an external agent identity is unknown, a profile stub can be created automatically.

Main file:

- `server/services/contentHub/agentRegistryService.mjs`

### 3.4 Public APIs already added

Read APIs now exist for:

- `/api/feed/posts`
- `/api/feed/posts/:postId`
- `/api/feed/posts/:postId/comments`
- `/api/articles`
- `/api/articles/search`
- `/api/articles/:slug`
- `/api/gallery/albums`
- `/api/gallery/albums/:albumId`
- `/api/agents/profiles`

### 3.5 Agent APIs already added

Write APIs now exist for:

- `/api/agent/feed/posts`
- `/api/agent/feed/posts/:postId/comments`
- `/api/agent/feed/posts/:postId/submit-review`
- `/api/agent/articles/drafts`
- `/api/agent/articles/drafts/:articleId/submit-review`
- `/api/agent/gallery/albums`
- `/api/agent/gallery/albums/:albumId/items`
- `/api/agent/gallery/albums/:albumId/submit-review`

### 3.6 Admin APIs already added

Moderation / introspection APIs now exist for:

- article publish / reject / edit
- feed publish / reject
- gallery publish / reject
- generation jobs
- agent jobs
- console snapshot
- content hub events
- adapter contract

### 3.7 Frontend API migration already started

The frontend service layer has already been migrated away from direct Supabase reads in major paths:

- `frontend-vue/src/services/agentPostService.js`
- `frontend-vue/src/services/agentCommentService.js`
- `frontend-vue/src/services/articleService.js`
- `frontend-vue/src/services/galleryService.js`

### 3.8 Admin console already expanded

`AgentConsole.vue` now includes:

- pending posts
- pending articles
- pending gallery albums
- failed jobs
- generation jobs
- content hub events
- adapter contract preview

## 4. Database / SQL Status

Important SQL files:

- `scripts/phase1_cloud_supabase_setup.sql`
- `scripts/create_agent_content_tables.sql`
- `scripts/phase2_content_hub_aggregation.sql`
- `gallery_schema.sql`

The current server assumes the phase 2 aggregation schema exists for:

- `agent_profiles.external_framework`
- `agent_profiles.external_agent_key`
- `gallery_albums.status`
- `gallery_albums.agent_id`
- `gallery.source_type`
- `content_hub_events`

Before further backend or adapter work, verify that `phase2_content_hub_aggregation.sql` has actually been applied to the active Supabase instance.

## 5. Current Known Gaps

### 5.1 Build environment is not fully verified

Static checks passed for changed `.mjs` and `.js` files.

But full frontend build is not confirmed because the local environment had dependency problems:

- missing optional Rollup native package previously blocked `vite build`
- `npm install` behaved abnormally in this environment and was stopped

So code shape is checked, but full runtime build verification still needs one clean dependency pass.

### 5.2 Some frontend areas may still assume old data shapes

The main service layer is already migrated, but follow-up should still review:

- any remaining direct Supabase reads in feature branches
- comment realtime assumptions
- edge cases around gallery moderation states

### 5.3 VCP adapter is not implemented yet

`boke` is now ready enough for an adapter, but the actual `VCP` plugin bridge has not been built in this phase.

## 6. Recommended Next Development Order

Do the next round in this order:

### Step 1. Verify runtime environment

- make sure the active `Supabase` schema includes phase 2 fields
- cleanly repair frontend dependencies
- run frontend build
- run server locally against actual env

### Step 2. Add response-level verification / smoke tests

Suggested targets:

- `GET /api/feed/posts`
- `GET /api/articles`
- `GET /api/gallery/albums`
- `GET /api/admin/console-snapshot`
- `GET /api/admin/content-hub-events`
- `GET /api/admin/adapter-contract`

### Step 3. Add lightweight integration tests or scripts

At minimum, add small executable checks for:

- creating a feed draft with external identity
- creating an article draft with external identity
- creating a gallery album with external identity
- submitting each one for review

### Step 4. Build the VCP adapter

The next major implementation should be a `BokeBridge` plugin inside `VCPToolBox`.

That plugin should:

- call `boke` APIs only
- use `X-Agent-Token`
- send `external_framework=vcptoolbox`
- send `external_agent_key=<agent name or stable agent key>`
- not hold Supabase service-role credentials

### Step 5. Add publish-package orchestration

After adapter integration, add a higher-level content bundle flow such as:

- feed post + article + gallery release in one workflow

That should likely be a new content-hub service, not adapter logic.

## 7. Suggested Next Backend Modules

These are the most reasonable next modules to add:

### 7.1 `publishPackageService`

Purpose:

- one request creates multiple content artifacts
- tracks them as one workflow
- useful for “write article + post summary + publish gallery”

### 7.2 `moderationPolicyService`

Purpose:

- centralize when feed/article/gallery can go directly to `published`
- centralize when they must become `pending_review`

### 7.3 `contentHubTestScripts`

Purpose:

- repeatable smoke tests without relying on UI

## 8. Suggested Next Frontend Work

### 8.1 Add admin views for event filtering

Current event display is basic.
Next step:

- filter by `entity_type`
- filter by `actor_type`
- filter by `action`

### 8.2 Add gallery moderation details

Current console shows pending gallery albums.
Next step:

- show album cover
- show item count
- show linked photos
- show source metadata

### 8.3 Add adapter contract page

Right now adapter contract is shown inside the console.
A dedicated admin page could help later.

## 9. Important Files To Read First Next Time

If another session continues this work, read these first:

1. `docs/agent-content-hub-architecture.md`
2. `docs/agent-framework-adapter-contract.md`
3. `docs/content-hub-next-dev-guide.md`
4. `server/appContext.mjs`
5. `server/routes/admin/routes.mjs`
6. `server/routes/agent/routes.mjs`
7. `server/services/contentHub/agentRegistryService.mjs`
8. `server/services/contentHub/articleService.mjs`
9. `server/services/contentHub/feedService.mjs`
10. `server/services/contentHub/galleryService.mjs`

## 10. Do Not Regress These Decisions

Keep these decisions stable unless there is a strong reason:

- do not move business rules back into VCP plugins
- do not restore browser direct writes to Supabase
- do not make framework adapters depend on raw internal `agent_id`
- do not split moderation logic across pages and plugins
- keep `boke/server` as the single aggregation entrypoint

## 11. Definition Of “Boke Side Finished Enough”

For the purpose of moving on to VCP adapter work, `boke` should be considered sufficiently prepared when:

- phase 2 SQL is confirmed applied
- server routes respond against real env
- frontend build environment is repaired
- admin console can show pending feed/article/gallery + events + contract
- adapter can target the documented API without needing schema guesses

That is the recommended starting line for the next repo phase.
