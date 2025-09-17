# PollQR — QR-first Polling & Voting Platform

**One-line:** A web service to create polls, generate QR codes (static & dynamic), collect votes from mobile users, and analyze scan → vote conversion — built for events, classrooms, retail, and hybrid experiences.

---

## Project Title & Description

**Project Title:** PollQR

**What you’re building:**  
A QR-first polling platform where creators make polls, generate shareable QR codes (PNG/SVG/PDF), distribute them offline or online, and collect votes from scanners on mobile-friendly pages. Supports anonymous or authenticated voting, dynamic QR repointing, audit logs, and analytics.

**Who it’s for:**  
Event organizers, community managers, product teams, educators, and anyone needing frictionless feedback from physical or hybrid audiences.

**Why it matters:**  
QR lowers barrier-to-vote, enables reuse of on-site signage (dynamic repointing), and provides trustworthy results through idempotency, audit trails, and optional voter verification.

---

## Tech Stack

- **Frontend:** Next.js (React, TypeScript), Tailwind CSS, React Query  
- **Backend:** NestJS (TypeScript) with TypeORM  
- **Database:** PostgreSQL (primary), Redis (caching, idempotency, rate-limiting)  
- **Storage & CDN:** S3-compatible storage, CloudFront/Cloudflare  
- **Auth & Messaging:** Auth0 / NextAuth (SSO); Twilio for optional SMS verification  
- **Testing:** Vitest/Jest (unit), SuperTest (integration), Playwright (E2E)  
- **CI/CD & Infra:** GitHub Actions, Terraform; Vercel/Netlify for frontend (optional)  
- **Monitoring:** Prometheus + Grafana, Sentry  
- **Vector DB (AI Context):** Weaviate / Pinecone (optional)  
- **Dev tools:** Prettier, ESLint, Husky, Stryker (mutation testing)

---

## Architecture & Key Components (high-level)

- **Poll Service** — poll lifecycle, options, settings, write-ins, results visibility  
- **Vote Service** — atomic ingestion, idempotency, anti-fraud hooks  
- **QR Service** — generate static/dynamic QR images, map tokens to polls, repointing  
- **Analytics Service** — capture scans, opens, votes; compute funnel metrics  
- **Auth Service** — login/verification flows (optional)  
- **Storage & CDN** — host QR assets and poster templates  
- **Audit Log** — immutable event store for admin actions

---

## Minimal Data Model

```text
Poll { id, ownerId, title, description, visibility, startAt, endAt, settings... }
Option { id, pollId, text, count }
Vote { id, pollId, optionIds[], createdAt, receiptId, clientVoteId, meta }
QRCode { token, pollId, dynamic, expiresAt, ownerId }
AuditLog { id, actorId, action, payload, timestamp }
```

---

## Core API (examples)

- `POST /api/polls` — create poll  
- `GET  /api/polls/:id` — poll metadata  
- `POST /api/polls/:id/vote` — submit vote (Idempotency-Key header required)  
- `GET  /r/:qrToken` — resolve QR token → redirect to poll URL  
- `POST /api/qrcodes/:token/repoint` — repoint dynamic QR  
- `POST /api/qrcodes/:token/deactivate` — revoke QR

---

## AI Integration Strategy

We treat AI as an augmentation layer across the dev lifecycle: scaffolding, tests, docs, code review suggestions, and context-aware assistance.

### 1) Code generation: IDE / CLI agent scaffolding
- **What:** Use AI (Copilot / Copilot CLI / local LLM agent) to scaffold controllers, services, DTOs, pages, and tests from templates.
- **How:** Provide CLI command like:
  ```bash
  portal gen feature poll:create --stack nest+next --test
  ```
  That generates:
  - NestJS controller + service + DTOs + validation
  - Next.js page + form component + React Query hooks
  - Unit & integration test skeletons
  - OpenAPI spec stub
- **Prompt (example):**  
  > "Scaffold a NestJS controller + service for `POST /api/polls` using TypeORM entities Poll and Option. Include DTOs, class-validator rules, and a unit test skeleton."
- **Guardrails:** All AI-generated code runs through CI (lint, typecheck, tests) and requires human PR review.

### 2) Testing: AI-assisted test generation & mutation testing
- **What:** Use AI to generate unit, integration, and Playwright E2E tests, then improve coverage via mutation testing (Stryker).
- **How:** For new features, run a CLI to generate tests covering edge cases (e.g., `<2 options`, `start>end`, idempotency). Use prompts like:
  > "Write Vitest unit tests for PollService.create covering missing title, fewer than two options, start>end, and idempotent re-submission."
- **Workflow:** Generated tests are run in CI; Stryker highlights weak spots and AI suggests additional tests.

### 3) Documentation: docstrings, inline comments, README maintenance
- **What:** Keep docs in sync by generating docstrings, API docs, and README updates from code and OpenAPI.
- **How:** On PR/merge, run an action that provides code diffs + OpenAPI spec to an AI job that proposes concise API README updates and TSDoc/JSDoc blocks. Human reviews before committing.
- **Prompt (example):**  
  > "Generate a TSDoc block for PollService.repointQr(qrToken, targetPollId). Mention authorization checks and audit logging."

### 4) Context-aware techniques: feeding specs, file trees, diffs
- **What:** Provide AI with scoped, relevant context (OpenAPI, file tree, diffs) to produce accurate outputs.
- **How:**
  - Ingest `openapi.yaml`, relevant source files, and recent git diffs.
  - Use a vector DB to index large docs and perform top-K retrieval for the most relevant snippets when running an AI task.
  - CLI helpers:
    ```bash
    gh poll-ai suggest --context openapi.yaml --files src/polls/* --diff HEAD~3..HEAD
    ```
  - The agent returns a suggested patch or test additions referencing the supplied context.
- **Security:** Strip secrets and environment files before sending data to external models.

---

## Development Workflow & Conventions

- Branching: `feature/*`, `fix/*`, `chore/*`  
- PRs: require code review and passing CI (lint, types, tests)  
- Idempotency: clients send `Idempotency-Key` header for create/vote actions (stored in Redis)  
- Time handling: store UTC timestamps, display localized times in UI  
- Audit: every admin action writes an immutable `AuditLog` entry

---

## CI / CD & Automation

- **CI (GitHub Actions):** install → lint → typecheck → unit tests → integration tests → build → security scan  
- **Post-merge:** deploy to staging → run Playwright canary tests → manual or automated promotion to prod  
- **Docs automation:** post-merge action runs AI doc updater that proposes README/API doc edits as PRs for human review  
- **Release:** semantic-release + AI-assisted changelog summaries

---

## Security & Privacy Considerations

- **QR tokens:** dynamic QR tokens are HMAC-signed; server verifies signature on resolve  
- **Anti-fraud:** layered heuristics (cookie + localStorage + IP + device fingerprint). Progressive challenges (CAPTCHA/email) on suspicion  
- **PII & Compliance:** minimal PII collection, consent capture for analytics where required; support GDPR/CCPA data deletion/pseudonymization  
- **Secrets:** stored in a vault (AWS Secrets Manager / GitHub Secrets); strip secrets from logs and AI inputs

---

## Roadmap & Milestones (3 months)

1. **Week 1–2:** Repo scaffold, DB schema, auth, create-poll flow, unit tests  
2. **Week 3–4:** QR generation (static + dynamic), share panel, short URLs, basic analytics  
3. **Week 5–6:** Voting endpoint with idempotency, anti-duplication heuristics, mobile voting UI  
4. **Week 7–8:** Results pages, creator analytics export, audit log, admin features  
5. **Week 9–12:** E2E hardening (load tests, mutation testing), AI-assisted docs & test automation, deploy to production

---

## Acceptance Criteria (MVP)

- Create poll → returns `pollId`, `shortUrl`, and `QR` downloadable (PNG/SVG).  
- Scanning QR → opens voting page; submitting vote returns `receipt_id` and increments counts exactly once (idempotency enforced).  
- Admin can repoint a dynamic QR; conversions (scans → votes) recorded.  
- Basic duplicate-prevention using idempotency keys + cookie heuristics.  
- Playwright E2E covers the full scan → vote → confirm path.

---

## How to run locally (quickstart)

```bash
# clone
git clone git@github.com:your-org/pollqr.git
cd pollqr

# environment
cp .env.example .env
# configure PostgreSQL and Redis locally or via docker-compose

# install & run
pnpm install    # or npm/yarn
pnpm dev:db     # optional: start dev db via docker-compose
pnpm dev        # start backend + frontend concurrently

# tests
pnpm test       # unit
pnpm test:e2e   # Playwright E2E (requires running dev server)
```

---

## Example API usage

**Create poll**
```http
POST /api/polls
Content-Type: application/json
Idempotency-Key: <uuid-v4>

{
  "title":"Lunch options",
  "description":"Pick your favourite",
  "options": [{"text":"Pizza"},{"text":"Sushi"}],
  "type":"single",
  "startAt":"2025-09-20T10:00:00Z",
  "endAt":"2025-09-21T10:00:00Z",
  "settings": {"allowWriteIn": true}
}
```

**Submit vote**
```http
POST /api/polls/:id/vote
Idempotency-Key: <uuid-v4>
{
  "client_vote_id":"uuid-v4",
  "option_ids":["opt_1"],
  "write_in": null
}
```

---

## Example AI prompts (copy/paste)

- **Scaffolding controller**
  > "Generate a NestJS controller + service for `POST /api/polls` using TypeORM. Include DTO validation and an idempotency handler that reads `Idempotency-Key` from headers."

- **Test generation**
  > "Create Vitest unit tests for `PollService.create` covering: missing title, fewer than 2 options, start>end validation, and idempotent re-submission."

- **Doc update**
  > "Given the updated OpenAPI spec (attached), update `docs/api.md` explaining the `POST /api/polls/:id/vote` payload and response in under 200 words."

- **Context-aware patch**
  ```bash
  gh poll-ai suggest --context openapi.yaml --files src/polls/* --diff HEAD~3..HEAD
  ```

---

## Metrics to track (initial)

- Polls created, QR generated (static/dynamic)  
- QR downloads by format (PNG/SVG/PDF)  
- Scans: total, unique devices, geo distribution, hourly scans  
- Conversion rate: scans → votes  
- Scan → Vote funnel and lag time  
- CAPTCHA / fraud challenge triggers

---

## Notes & Best Practices

- Store all timestamps in **UTC**; show localized times in UI.  
- Make vote submission **idempotent** (client-generated `client_vote_id`).  
- Use **atomic DB transactions** or event-sourcing to avoid lost updates under concurrency.  
- For print materials prefer **vector (SVG/PDF)** QR assets and dynamic QR if you expect repointing.  
- Keep AI-generated outputs under human review; treat AI as a productivity tool, not an autonomous committer.

---

## Want me to scaffold this repo?
If you want, I can generate:
- a starter repo file tree with core files (NestJS + Next.js skeleton), or  
- an OpenAPI v3 skeleton for core endpoints, or  
- an initial Playwright E2E test that covers QR → vote → confirm.

Tell me which artifact you want and I’ll produce it inline.
