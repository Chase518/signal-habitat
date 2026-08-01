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
