# Decision Log — Signal: Habitat

Key architectural decisions and the reasoning behind them, kept so they can
be reused directly in interviews / application materials.

## 2026-07-29　Project positioning and scope

**Decision:** This is a job-application portfolio demo, not a system meant to be delivered to Zukunftslabor. The goal is "runs, screenshots well, every design decision can be explained layer by layer" — not production-grade completeness.

**Reasoning:** Early discussions repeatedly drifted toward scope creep (wanting to build a general-purpose agentic framework, a fully pluggable architecture, etc.). Once this boundary was made explicit, any "should we add X" hesitation could be resolved against this single standard.

## 2026-07-29　Business question narrowed to a single question

**Decision:** There is exactly one core business question — "is there an observable correlation between temperature/humidity and wildlife activity frequency" — no second research question runs alongside it.

**Reasoning:** One question told well is more convincing than several told shallowly, and it maps directly onto the Naturschutz/Frühwarnung (nature conservation / early warning) language in the Zukunftslabor job posting.

## 2026-07-29　Python analysis service treated as an outbound adapter in the hexagonal architecture

**Decision:** The code in the Java/Quarkus backend that calls the Python analysis service (FastAPI) lives in `adapters/out/analysis/`, treated the same way as `adapters/out/persistence/`.

**Reasoning:** The core value of hexagonal architecture is that external dependencies are replaceable. Extending that idea to a cross-language analysis service means that swapping the analysis engine later (even to a different language) only requires swapping this one adapter, without touching domain logic. This is an architectural decision worth explaining directly in an interview.

## 2026-07-29　Analysis method: upgraded from linear to quadratic polynomial regression, neural networks deliberately deferred

**Decision:** The core fitting model is quadratic polynomial regression (still linear in its parameters, solvable directly via least squares). The frontend keeps a "neural network fitting" option as a UI placeholder, not actually implemented.

**Reasoning:**
1. The ecological relationship is likely non-linear (activity frequency probably rises then falls with temperature, not a monotonic relationship) — plain linear regression can't capture that shape.
2. Quadratic polynomial regression is more interpretable than a neural network (regression coefficients carry clear statistical meaning and support significance testing); for an analysis tool meant for public-facing display, interpretability is prioritized over raw fitting accuracy — a deliberate engineering trade-off.
3. Honest addition for the record: this choice was also genuinely shaped by time constraints — but on reflection, the choice that time pressure forced is also the more prudent one; the two aren't in conflict.

## 2026-07-29　Frontend reuses the feature-based convention from the module-planner project

**Decision:** Rather than redesigning the frontend structure from scratch, it directly reuses the pattern already proven in an earlier `module-planner` project: feature-based rather than type-based, `index.js` barrel exports, no direct cross-feature component imports (only read-only selectors are allowed across features), tests mirror the `src` tree, and `mocks/` stays in place long-term as the swappable implementation detail behind each feature's `api/*.js`.

**Reasoning:** This pattern has already been battle-tested in a real project, so there's no need to re-learn its pitfalls; it also demonstrates, in an interview, that there's an established, transferable engineering convention rather than every project inventing its structure from zero.

## 2026-07-29　Naming: the Signal series / this project is Signal: Habitat

**Decision:** Project naming follows a "parent brand + sub-domain" structure; this project is named `Signal: Habitat`.

**Reasoning:** Further data projects in other domains are planned (e.g. a bakery staff-scheduling / inventory-forecasting project), and using one parent brand across different domains ties them together into a coherent "body of work." During naming, "Vantage" was found to already be used by Nozomi Networks' OT/IoT security product, and "FieldPulse" by a commercial field service management tool — name collisions aren't a real problem for a student demo project, but landing on the Signal series naturally avoided both coincidences anyway.

## 2026-08-01　Backend package structure aligned with a real prior project

**Decision:** Java package renamed from the stale `com.signalfield` (a leftover from the project's earlier name, "Signal: Field") to `com.signalhabitat`. Also added `adapters/in/api/dto/`, `adapters/in/api/exception/`, `adapters/out/persistence/repositories/`, and a separate `application/services/` layer (distinct from `application/domain/services/`).

**Reasoning:** These additions mirror the structure of an earlier hexagonal-architecture Java/Quarkus backend project, reused here because it's a proven, working convention rather than something to redesign from scratch. Deliberately **not** copied over: pagination/filtering (`query/`), domain events, and a HATEOAS link builder — these reflect that project's production maturity, and adding them here would be unnecessary complexity for a 3–4 endpoint demo, conflicting with this project's stated goal of staying at portfolio-demo scope rather than production completeness.

## 2026-08-01　Python analysis core: aggregation strategy and regression implementation

**Decision:** Rather than regressing raw per-reading detections (0/1) directly against temperature, readings are first bucketed into 1°C temperature bins (after confidence filtering) and an `activity_frequency` (detections / readings) is computed per bucket. `fit_activity_model(X, y, degree)` then fits this frequency curve via OLS on a Vandermonde design matrix (`[1, x, x², ...]`), using `statsmodels` to get per-coefficient p-values directly rather than deriving them by hand.

**Reasoning:** Regressing a continuous frequency against temperature gives a much cleaner, more interpretable curve for a public-facing chart than a linear probability model fit on raw binary outcomes, and it matches the business question's own phrasing ("activity **frequency**"). Using `statsmodels.OLS` instead of `numpy.polyfit` was a deliberate trade-off: `polyfit` alone doesn't expose p-values, and re-deriving standard errors/p-values manually from the normal equations would be extra code solving an already-solved problem.

**Also decided:** One of the 5 simulated sensors (`S5`) is deliberately modeled with a faster battery drain and periodic RSSI dropouts, specifically so the battery/RSSI confidence filter (`app/quality.py`) has real low-quality data to remove in the demo run rather than being a no-op. Without this, the filter step would look inert in any screenshot or walkthrough.

## 2026-08-02　First frontend slice scoped to the `analysis` feature only, calling the live API directly

**Decision:** The first working frontend build implements only the `analysis` feature (chart + model toggle), not `sensors`/`detections`/`alerts`. `features/analysis/api/analysisApi.js` calls the FastAPI service directly over `fetch` rather than returning mock data, since a real analysis endpoint already existed by this point.

**Reasoning:** The project's own development order puts "a first screenshottable visualization" as the highest-priority near-term deliverable (see 项目总纲.md), and the explicit-exclusions discipline established early in this project (see the scope-creep history in 进度追踪.md) argues against building out the other three feature skeletons before there's a reason to. The feature-based convention (self-contained feature, single `api/*.js` swap point) still holds — `sensors`/`detections`/`alerts` remain mock-backed skeletons until there's a real vertical slice needing them, at which point they follow the same pattern already proven here.

## 2026-08-03　Frontend layout pass: header nav without a router, shared design tokens from the data-viz palette

**Decision:** `src/layouts/AppLayout.jsx` adds a header with project branding and a tab-style nav; `Sensors`/`Detections`/`Alerts` render as visually-disabled "soon" placeholders rather than real links. No routing library was introduced. `src/shared/` gained `Card`/`StatTile`/`SegmentedControl` as the first reusable building blocks, and chart/UI colors were switched from ad hoc hex values to the project's data-viz-skill reference palette's dark categorical slots (blue/orange), centralized as CSS custom properties in `index.css`.

**Reasoning:** The nav communicates the full intended surface of the platform (matching the four features already scaffolded per 项目总纲.md) without the cost of standing up routing for pages that don't exist yet — adding `react-router` for a single real route would be complexity ahead of need. The shared component set exists because `StatTile`/`Card` are already needed twice (stat row + chart card) and will be needed again once `sensors`/`detections`/`alerts` get real pages, so it's reuse-driven rather than speculative. Colors moved to the validated data-viz palette instead of hand-picked hex specifically to get a legend-safe, CVD-checked pairing for the two chart series (observed vs. fitted) for free rather than eyeballing contrast.

## 2026-08-03　Java backend: plain JDBC over Hibernate/Panache, JSON-blob cache table, in-memory 10-minute TTL

**Decision:** `backend-java`'s persistence adapter (`adapters/out/persistence/`) talks to SQLite through raw JDBC (`sqlite-jdbc` + `DriverManager`) rather than Hibernate ORM/Panache. The single `analysis_result` table stores the whole `AnalysisResult` as a JSON blob (`payload_json`) plus a `computed_at` column for ordering, instead of normalizing points/model coefficients into child tables. `AnalysisApplicationService` treats a cached row as fresh for 10 minutes before calling the Python service again.

**Reasoning:** This 1-table cache doesn't need an ORM's dialect/mapping machinery, and a hand-rolled JDBC adapter keeps the port boundary (`AnalysisResultRepositoryPort`) obvious without Hibernate's own conventions leaking through it — consistent with the project's standing rule to skip production-grade machinery a 3–4 endpoint demo doesn't need (see the 2026-08-01 backend package-structure entry). Storing the domain object as JSON rather than a normalized schema is a deliberate simplification: `sensor_reading`/`sensor_metadata`/`detection_event` (the other three tables named in 项目总纲.md) aren't implemented yet because Java doesn't own raw sensor ingestion in the current vertical slice — Python still generates and owns the simulated data — so only the one table this slice actually exercises (`analysis_result` as a cache) was built. The 10-minute TTL exists so the interview narrative has something to point at ("avoid hammering the Python service on every request") even though the simulated data is deterministic and would be byte-identical either way.

**Also decided:** The frontend's `analysisApi.js` now points at the Java backend (`localhost:8080`) instead of the Python service directly, completing the chain the README's architecture diagram always described (React → Java → Python → SQLite). This only required changing one base-URL constant — the payoff of the feature-based frontend convention's "single swap point" rule.

## 2026-08-03　Frontend: Redux Toolkit and React Router added, superseding the earlier "no router" call

**Decision:** `frontend/src/app/store.js` (Redux Toolkit) now holds an `analysisSlice` with a `createAsyncThunk`-based fetch, replacing `AnalysisPanel`'s local `useEffect`/`useState`. `react-router-dom` now provides four real routes (`/`, `/sensors`, `/detections`, `/alerts`), with the latter three pointing at a shared `ComingSoonPage` placeholder; `AppLayout`'s nav uses `NavLink` for real active-route highlighting instead of static disabled spans.

**Reasoning:** README's "Repo layout" section had named `app/store.js (Redux Toolkit)` since the project's very first version — it was already decided tech, not a new proposal. It got silently skipped when the analysis feature was first built (single page, one API call, no state complexity to justify it at the time), and that omission should have been surfaced instead of decided unilaterally, per this project's own rule about not overriding documented architecture without checking first. The user also wants Redux Toolkit and React Router specifically because they're current coursework material, which is itself a legitimate reason independent of whether this demo strictly needs them. This entry explicitly supersedes the "no routing library was introduced" call in the 2026-08-03 layout-pass entry above — that reasoning (avoid complexity ahead of need) was sound at the time but is superseded now that there's a concrete reason to add it.

## 2026-08-03　Docker Compose: repo-root build contexts, %prod-profile for container networking

**Decision:** All three Dockerfiles live in `docker/` but build with the repo root as context (`context: ..` in `docker-compose.yml`), so each can `COPY` only its own subtree without needing sibling directories pulled in. The Java backend's outbound URLs switch via Quarkus's `%prod.` config-profile prefix (active by default in a packaged run, never under `quarkus:dev`) rather than a separate properties file or env-var-only setup: `%prod.quarkus.rest-client...url` points at the `analysis` service by its Compose hostname instead of `localhost`, and `%prod.signalhabitat.sqlite.path` points at `/data` (the bind-mounted volume) instead of the relative dev-mode path.

**Reasoning:** A single `docker-compose.yml` build context per service (rather than three separate per-directory contexts) keeps the Dockerfiles simple `COPY <subdir>/...` statements instead of needing `..`-relative COPY paths, which Docker doesn't allow past the build context boundary anyway. Using Quarkus's built-in `%prod` profile instead of a bespoke `docker` profile or manual env-var mapping means the container-vs-local distinction the code already needs to make (Python's hostname, SQLite's path) falls out of "is this a packaged run or `quarkus:dev`" for free, with zero risk of the container config leaking into local development by accident. Verified by building and running the full compose stack end-to-end and confirming a new cache row written from inside the `backend` container appeared in the host-side `data/signal-habitat.db` through the bind mount.

## 2026-08-03　Frontend: Neural Network UI placeholder restored, client-side prediction input added

**Decision:** `SegmentedControl` now accepts a `disabled` flag per option, rendered greyed-out with the same "soon" badge the nav uses for unimplemented pages. The model toggle uses it for a third "Neural Network" option. Separately, `PredictionInput` lets the viewer type a temperature and see the currently-selected model's predicted activity frequency, computed client-side from its `coefficients` (shared `evaluatePolynomial` util, also used by the chart's fitted curve) — with a visible warning when the input falls outside the observed temperature range, since evaluating a fitted polynomial past its training data is extrapolation, not a supported prediction.

**Reasoning:** 项目总纲.md's scope section always specified neural-network fitting as "UI placeholder only, not implemented" — a deliberate interpretability-over-power trade-off already recorded in the 2026-07-29 analysis-method decision — but the placeholder itself never got built when the model toggle was first implemented, another instance of documented scope silently not making it into the UI (see the Redux Toolkit entry above for the same pattern). The prediction input exists because a static fitted-curve chart doesn't actually let a viewer ask "what would this predict at a specific temperature," which is the more concrete, interview-demonstrable form of "this model makes predictions" — and the extrapolation warning turns a potential footgun (a quadratic curve happily returning a negative, meaningless frequency far outside its data) into an explicit teaching point about the same interpretability trade-off.
