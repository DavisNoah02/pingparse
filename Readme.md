# PingParse -StatusPing 🟢

> An open-source, portfolio-grade uptime monitoring SaaS — built in public, from scratch, to production.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-v24+-green)

---

## What am i building?

PingParse is a real-world micro-SaaS uptime monitoring platform built as a learning project in public.

It is **not** a tutorial. It is a portfolio-grade system built with professional standards — proper architecture, testing, CI/CD, Docker, and eventually Kubernetes.

If you are learning backend, DevOps, or SaaS architecture, this repo documents every decision, every mistake, and every fix made along the way.

---

## What It Does

- Register URLs to monitor
- Periodically ping each URL for availability
- Store check results in a database
- Display live status on a dashboard
- (Later) Send alerts when a service goes down
- (Later) Auth, billing, API keys, background workers

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Node.js + Express | REST API |
| Database | SQLite → PostgreSQL | Drizzle ORM |
| Frontend | Next.js | Dashboard UI |
| Testing | Vitest | Unit + integration |
| Containers | Docker + Compose | Dev & prod parity |
| CI/CD | GitHub Actions | Automated pipeline |
| Orchestration | Kubernetes | Phase 4 |
| Cache / Queue | Redis + BullMQ | Phase 4 |

---

## Project Roadmap

### ✅ Phase 1 — Backend MVP
- [x] Monorepo structure
- [x] Express API foundation
- [x] Request logger + error handler middleware
- [x] `/health` endpoint
- [x] Database schema (services + checks)
- [x] Drizzle ORM + migrations
- [X] CRUD endpoints for services
- [x] Health check engine (pinging URLs)
- [x] Scheduler (periodic checks)
- [x] Unit + integration tests

### 🔲 Phase 2 — Frontend MVP
- [ ] Next.js setup
- [ ] Dashboard UI
- [ ] Service management
- [ ] Live status display
- [ ] API integration

### 🔲 Phase 3 — Automation & DevOps
- [ ] Dockerfile for API
- [ ] Dockerfile for UI
- [ ] docker-compose for local dev
- [ ] GitHub Actions CI pipeline
- [ ] Automated test runs on push

### 🔲 Phase 4 — SaaS & Scaling
- [ ] Authentication (JWT)
- [ ] Role-based access control
- [ ] API keys
- [ ] Billing simulation
- [ ] Redis + BullMQ background workers
- [ ] Kubernetes deployment

---

## Monorepo Structure

```
pingparse/
├── apps/
│   ├── api/                  # Express backend
│   │   ├── src/
│   │   │   ├── config/       # Env config
│   │   │   ├── db/           # ORM, schema, migrations
│   │   │   ├── modules/      # Feature modules (services, checks)
│   │   │   ├── middleware/   # Logger, error handler
│   │   │   └── app.js        # Express wiring
│   │   └── server.js         # Entry point
│   └── web/                  # Next.js frontend (Phase 2)
├── drizzle/                  # Generated migration files
├── drizzle.config.js
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js v24+
- Git
- A terminal you are comfortable in

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/pingparse.git
cd pingparse

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Verify It Works

```bash
curl.exe http://localhost:3000/health
# Expected: { "status": "ok" }
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | API server port |
| `DB_PATH` | `./statusping.db` | SQLite database file path |
| `CHECK_INTERVAL_MS` | `60000` | How often to ping services (ms) |

Copy `.env.example` to `.env` and adjust as needed. Never commit `.env`.

---

## Development Log

Every phase of this build is documented through commits. Read the git history to follow the full journey from empty folder to production SaaS.

Key commits to study:

| Commit | What It Covers |
|---|---|
| `feat: initialize monorepo structure` | Repo setup, Express foundation, middleware |
| *(more added as we build)* | |

---

## Contributing

This repo is primarily a learning project built in public. If you are following along and spot something wrong, open an issue. If you want to build your own version, fork it.

---

## License

MIT — use it, learn from it, build on it.

---

## Author

Built by Noah Dave — learning in public, building for real.