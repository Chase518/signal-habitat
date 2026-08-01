# Signal: Habitat

> Part of the *Signal* series — turning raw field data into public, understandable insight.
> This module: environmental sensor data → wildlife activity correlation.

## Business Question

In a monitored forest area, is there an observable relationship between
environmental conditions (temperature, humidity) and wildlife activity
frequency (camera-trap detections)?

## Scope

- 5 simulated LoRaWAN-style sensor nodes, 15-minute reporting interval
- 7 days of simulated data
- Environmental readings: temperature, humidity, battery, RSSI
- Camera-trap detection events (simulated trigger probability, AI-based
  detection on sample images)
- Data-quality filtering based on battery/signal confidence
- Correlation analysis: polynomial regression (degree switchable) +
  significance testing (p-value)

**Explicitly out of scope for this iteration:** drone data, multi-species
fine-grained classification, user auth, real LoRaWAN hardware integration,
neural-network fitting (placeholder only), agentic/self-extending analysis
tools.

## Architecture

```
┌─────────────┐      REST       ┌──────────────────┐      HTTP       ┌────────────────────┐
│   React     │ ───────────────▶│  Java / Quarkus   │ ───────────────▶│  Python / FastAPI   │
│  Frontend   │◀─────────────── │  (Hexagonal Arch) │◀─────────────── │  Analysis Service    │
└─────────────┘                 └──────────┬────────┘                 └─────────────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │   SQLite    │
                                     └─────────────┘
```

The Python analysis service is treated as an **outbound adapter** from the
Java backend's perspective (`adapters/out/analysis/`) — swappable in
principle, same as the persistence adapter.

### Repo layout

```
signal-habitat/
├── CLAUDE.md                    # Claude Code entry point, points to 进度规则与记录/
├── analysis-python/     # FastAPI service: interpolation, regression, detection
├── backend-java/         # Quarkus, hexagonal architecture
├── frontend/              # React + Recharts, feature-based structure
│   ├── src/
│   │   ├── app/            # store.js (Redux Toolkit) + App.jsx
│   │   ├── routes/
│   │   ├── layouts/
│   │   ├── features/       # sensors / detections / analysis / alerts
│   │   │   └── <feature>/api/   # swap mock → real fetch here only
│   │   ├── shared/
│   │   ├── pages/           # composes features together
│   │   └── mocks/            # local mock data, stays even after real API lands
│   └── tests/                 # mirrors src/ tree
├── docker/                     # Dockerfiles + docker-compose.yml
├── data/                        # generated/sample data (gitignored where large)
├── docs/decisions.md            # architecture decision log (top-level only)
└── 进度规则与记录/                # gitignored — workflow docs, not project code
```

Frontend follows the same feature-based convention as an earlier project
(`module-planner`): each feature is self-contained, exposes a single
barrel export via `index.js`, cross-feature imports are forbidden except
read-only selectors, and page-level components do the wiring. i18n is
out of scope for this project.

## Status

🚧 In active development. Build order: analysis core → API skeleton →
frontend → hexagonal backend hardening → Docker Compose.

## Running locally

_(to be filled in as each layer becomes runnable)_
