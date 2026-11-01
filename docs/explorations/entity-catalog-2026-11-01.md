# Entity kinds for a product knowledge graph across the software life cycle

Research for madarch's product manifest: which entity kinds (and main relations) to declare.
Date: 2026-11-01. Sources are the specifications and official documentation themselves.

**How to read the tables.**
- **Source tags.** **[F]** means the definition was fetched and read in this session. **[U]** means
  unverified: the source exists, but its text could not be read here (paywall, login, Cloudflare,
  or a timeout), or the claim comes from memory. **[none]** means no standard or catalog defines
  the kind. It is a common practice name only.
- **Extractable from a repository.** **yes** means a parser of a declared file format yields the
  node deterministically. **partly** means the node yields, but its meaning or links need an agent
  or a person. **no** means no repository file holds it.
- **Relations.** Where a standard names the relation, that name is used (Backstage `ownedBy`,
  SPDX `hasTest` and so on). Otherwise the relation is a plain verb, which is a proposal.
- **Status.** 🟢 means madarch already has the kind (the list in the brief). Unmarked rows are
  missing.

---

## 1. Strategy and idea

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Vision / Product Goal | Scrum Guide 2020: the Product Goal is the commitment of the Product Backlog [F] https://scrumguides.org/scrum-guide.html. arc42 §1 "Introduction & Goals" [F] https://arc42.org/overview | no (a vision document, if one exists) | product → has goal; goal → refined by objective / feature |
| Goal, Outcome, Driver, Stakeholder, Principle, Constraint, Assessment | ArchiMate 3.2 Motivation elements [U]: the text sits behind an Open Group login at https://pubs.opengroup.org/architecture/archimate32-doc/ | no | stakeholder → has driver → assessed by assessment → goal → realised by outcome → requirement |
| Objective / Key Result (OKR) | [none]: no standards body defines OKR | no | objective → measured by key result → linked to metric / SLI; feature → contributes to objective |
| Hypothesis (product / benefit hypothesis) | [none] as a standard. SAFe "benefit hypothesis" [U]: the fetch of https://framework.scaledagile.com/features-and-capabilities timed out | no | hypothesis → tested by experiment → measured by metric; feature → carries hypothesis |
| Persona / Actor / User role | C4 "Person: actors, roles, personas, named individuals" [F] https://c4model.com/abstractions. ArchiMate business actor/role [U] | no | persona → performs use case / user flow; persona → has job-to-be-done |
| Job-to-be-done | [none]: a practice from Christensen / Ulwick, with no specification | no | persona → has job; feature / capability → serves job |
| Business capability | ArchiMate 3.2 Strategy: Capability [U]. TOGAF Business Capabilities guide [U] (login) | no | capability → realised by system / component; value-stream stage → enabled by capability; capability → part of capability |
| Value stream (stage) | ArchiMate 3.2 Strategy: Value Stream [U]. BIZBOK [U] (paywalled) | no | value stream → has stage → enabled by capability; delivers value to stakeholder |
| Course of action / initiative | ArchiMate 3.2 Strategy [U] | no | course of action → realises goal; → realised by epic |
| Epic | ISTQB glossary: "a description of a stakeholder need which is typically larger than what can be implemented in a single iteration" [F] https://glossary.istqb.org/en_US/term/epic (API `api.glossary.istqb.org/v1/terms/epic`) | partly (tracker issue type) | epic → contains feature / user story; epic → realises goal |
| Feature | SAFe Feature and Capability [U]. Note: ISTQB's "feature" entry is the ML-input sense only [F] | partly (tracker labels, Gherkin `Feature:` files [F] https://cucumber.io/docs/gherkin/reference/) | feature → part of epic; → refined by user story / requirement; → toggled by feature flag; → realised by component |
| Roadmap item / Release plan | [none] | no (planning tool) | roadmap item → schedules epic / feature → targets release / milestone |
| Product Backlog item, Sprint, Increment, Definition of Done | Scrum Guide 2020 [F] | partly (tracker) | backlog item → planned in sprint → done in increment, under the Definition of Done |
| Product 🟢, Domain 🟢 | Backstage Domain [F] https://backstage.io/docs/features/software-catalog/system-model | partly (catalog-info.yaml) | domain → has part system |

## 2. Requirements

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Requirement 🟢 (stakeholder / system / software; functional / non-functional; constraint) | ISO/IEC/IEEE 29148:2018 [F, abstract only]: "provisions for processes and products related to engineering requirements… attributes and characteristics of requirements… information items", https://standards.ieee.org/ieee/29148/6937/ and https://committee.iso.org/standard/72089.html. The type names (StRS / SyRS / SRS, BRS, ConOps) are **[U]**: the abstracts do not name them. ISTQB "requirement: a provision that contains criteria to be fulfilled" [F] | partly (requirement documents in the repository; code yields "derived" requirements only through an agent) | requirement → derived from / refines requirement; → satisfied by component / use case; → verified by test case; → traces to goal |
| Information item (requirements specification document) | ISO/IEC/IEEE 29148 [F abstract: "information items… required contents and format"] | partly (a docs file) | document → contains requirement |
| User story | ISTQB "a short narrative describing a need from a user's perspective together with the expected benefit" [F] | no / partly (tracker) | story → part of epic / feature; → has acceptance criterion; → implemented by commit / PR |
| Use case 🟢 | No ISTQB entry [F: not found]. UML / Jacobson [U]. arc42 §6 runtime scenarios [F] | no | actor → performs use case; use case → includes / extends use case; → realised by components; → verified by test |
| Acceptance criterion | ISTQB "acceptance criteria: the criteria that a work product must satisfy to be accepted by the stakeholders" [F]. Gherkin Scenario / Example [F] | partly (Gherkin `.feature` files yes; prose criteria no) | criterion → of story / requirement → verified by test case / scenario |
| Business rule 🟢 | Gherkin `Rule` keyword [F]. ArchiMate Principle / Constraint [U] | partly | rule → enforced by symbol / policy; → illustrated by scenario |
| Quality characteristic / quality attribute | ISO/IEC 25010:2023 (second edition, 2023-11): "nine characteristics… further subdivided into subcharacteristics" [F, abstract] https://committee.iso.org/standard/78176.html. ISTQB "quality characteristic" [F]. The names of the nine (functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, safety) are **[U]**: the ISO page is behind Cloudflare | no (it is a taxonomy) | quality requirement → concerns quality characteristic; → measured by metric / SLO |
| Quality scenario / quality requirement | arc42 §10 "quality tree and concrete quality scenarios" [F] | no | quality scenario → refines quality characteristic → verified by test (performance, security, …) |
| Architecturally significant requirement | adr.github.io: "a requirement that measurably affects a system's architecture and quality" [F] https://adr.github.io/ | no | ASR → addressed by decision |
| Constraint | arc42 §2 [F]. ArchiMate Constraint [U] | no | constraint → restricts decision / component |
| Term 🟢 (glossary) | arc42 §12 Glossary, "ubiquitous language" [F]. DDD Reference "Ubiquitous Language" [F] | partly (glossary file) | term → used in bounded context; → names entity / symbol |

## 3. R&D

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Decision 🟢 (ADR) | adr.github.io: AD, ADR, decision log [F]. MADR 4.0.0 (2024-09-17): status, date, decision-makers, consulted, informed, context and problem statement, decision drivers, considered options, decision outcome, consequences, confirmation [F] https://adr.github.io/madr/ | yes for ADR files (`docs/decisions/NNNN-*.md` with MADR front matter); partly for decisions found only in code | decision → addresses ASR / requirement; → supersedes decision; → considers option; → affects component; → confirmed by test / check |
| Considered option / decision driver | MADR [F] | yes (inside ADR files) | option → of decision; driver → motivates decision |
| Experiment / A-B test | [none] as a specification. Its pieces are standard: OpenFeature "Flag Set", "Fractional Evaluation" and "Tracking Event: … action or application state tied to a business outcome" [F] https://openfeature.dev/specification/glossary | partly (flag definitions and tracking calls in code; the hypothesis and the result are not in code) | experiment → tests hypothesis; → uses feature flag variant; → measured by tracking event / metric; → concludes with finding |
| Spike | [none] (an agile practice) | no (tracker) | spike → answers question → produces finding / decision |
| Prototype | [none] | partly (a throwaway branch or folder) | prototype → explores option → informs decision |
| Research finding / evidence | [none] in the product sense. CycloneDX `declarations.evidence` / `claims` is the nearest schema, but it serves attestation [F, schema 1.6] | no | finding → supports / refutes hypothesis; → cited by decision |
| Risk / technical debt | arc42 §11 "Risks & Technical Debt" [F]. ISTQB "risk", "product risk" [F] | partly (TODO / FIXME markers, debt issues) | risk → threatens goal / quality attribute; → mitigated by decision / control |

## 4. Design, UX and frontend

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Design token | W3C DTCG Design Tokens Format Module 2025.10 (stable 2025-10-28; a Community Group report, not a W3C Standard): token = object with `$value`; `$type`, `$description`, `$extensions`, `$deprecated`; files `.tokens` / `.tokens.json`, media type `application/design-tokens+json` [F] https://www.designtokens.org/TR/2025.10/format/ | **yes** (`*.tokens.json`; also Style Dictionary sources, CSS custom properties: partly) | token → in group; token → aliases token (`{a.b}` / `$ref`); token → used by component style |
| Token group | DTCG Format [F] | yes | group → contains token / group |
| Token type (color, dimension, fontFamily, fontWeight, duration, cubicBezier, number; composite strokeStyle, border, transition, shadow, gradient, typography) | DTCG Format §8–9 [F] | yes | attribute of token (not a node) |
| Token set / theme (modifier, context: e.g. light/dark) | DTCG Resolver Module 2025.10: sets, modifiers, contexts, resolution order, `.resolver.json` [F] https://www.designtokens.org/TR/2025.10/resolver/ | yes (`*.resolver.json`) | theme context → selects token set; set → overrides set |
| Color space / color value | DTCG Color Module 2025.10 [F, listed] https://www.designtokens.org/TR/2025.10/color/ | yes | attribute of token |
| Design system | [none] as a schema. It is the bundle of the tokens, components and docs above | partly (a package that exports tokens and components) | design system → provides token / component; product → uses design system |
| UI component and its variants / stories | Storybook Component Story Format (CSF): default export = meta (`component`, `title`, `args`, …), each named export = a story. Storybook calls it "an open standard based on ES6 modules" [F] https://storybook.js.org/docs/api/csf | **yes** (`*.stories.(ts\|tsx\|js\|mdx)`; component source files via the code graph) | story → renders component with args; component → uses token; screen → composes component |
| Style / stylesheet | [none] (CSS is the standard; no catalog defines "style" as an entity) | yes (CSS / SCSS files, CSS-in-JS via a parser) | style → applies to component; → references token |
| Screen / page / view | [none] | partly (a frontend router config and page files) | screen → routed by frontend route; → part of user flow; → composes components |
| Frontend route | [none] (framework-specific: file-system routers, route configs) | yes (route files and configs, framework by framework) | route → renders screen; → calls API operation |
| User flow / journey | [none] | no (a design tool or docs). Partly from end-to-end tests that walk it | persona → walks user flow → through screens; → realises use case; → verified by e2e test |
| i18n message key / message | Unicode MessageFormat 2 (MF2): message, variables `{$name}`, `.input`, `.match`, variants [F] https://messageformat.unicode.org/ | **yes** (locale catalogs: JSON / PO / XLIFF / MF2 resources; key use sites via the code graph) | message → has translation per locale; symbol / component → uses message |
| Accessibility success criterion | WCAG 2.2 (W3C Recommendation, 12 Dec 2024): 4 principles → 13 guidelines → 87 numbered SCs (4.1.1 removed), levels A / AA / AAA, numbered `guideline.sc` [F] https://www.w3.org/TR/WCAG22/ | the catalog: no (reference data). Conformance findings: partly (axe or a similar tool, report output) | component / screen → conforms to / violates SC; test → checks SC |
| Asset / icon | [none] (SVG and image formats only) | yes (files in an assets folder; import sites) | component → uses asset |
| Design-tool frame / prototype | [none] (vendor: Figma file / node is one example, [U]) | no (design tool API) | frame → specifies screen / component |

## 5. Architecture

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Person (C4) | C4 [F] https://c4model.com/abstractions | no | person → uses software system / container |
| Software system 🟢 (as "product" / system) | C4 [F]. Backstage System: "a collection of components and resources that exposes one or more public APIs" [F] | partly (`catalog-info.yaml` kind System; otherwise an agent) | system → hasPart component / API / resource; → partOf domain |
| Container (C4: "applications and data stores") 🟢 service / database | C4 [F] | partly (Dockerfile, compose service, k8s Deployment, package with an entry point) | container → part of system; → uses container (via protocol); → deployed on deployment node |
| Component (C4 / Backstage) | C4 "implemented by one or more code elements" [F]. Backstage Component (web site, backend service, data pipeline…) [F] | partly (Backstage yes; C4 components need an agent to group modules) | component → providesApi / consumesApi API; → dependsOn component / resource; → ownedBy group; → partOf system |
| Code element 🟢 (module, file, symbol) | C4 "Code" [F] | yes | symbol → in file → in module → realises component |
| Deployment node / infrastructure node / deployment environment | C4 deployment diagram [F] https://c4model.com/diagrams/deployment | partly (IaC, k8s, compose) | container instance → runs on deployment node → in environment; infrastructure node (DNS, LB, firewall) → supports |
| API (Backstage) 🟢 (as contract) | Backstage API: "a boundary between components, defined in a machine-readable format" [F] | yes when an OpenAPI / AsyncAPI / proto / GraphQL file exists | component → providesApi / consumesApi API |
| Resource (Backstage) | "infrastructure a component needs at runtime, such as databases, topics, buckets, CDNs" [F] | partly | component → dependsOn resource |
| Group, User (Backstage) | [F]; relations `memberOf` / `hasMember`, `parentOf` / `childOf`, `ownedBy` / `ownerOf` [F] https://backstage.io/docs/features/software-catalog/well-known-relations | yes from `catalog-info.yaml` / org data; partly from CODEOWNERS | user → memberOf group; any entity → ownedBy group / user |
| Location, Template (Backstage) | [F] | yes | location → points to catalog files; template → scaffolds component |
| External system | C4 (a software system outside scope) [F]. arc42 §3 Context & Scope: "external systems… and those interfaces" [F] | partly (outbound HTTP clients, SDK dependencies, env-var URLs) | system → uses external system via interface |
| arc42 views: building block, runtime scenario, deployment view, crosscutting concept, solution strategy | arc42 §4–8 [F] | partly (building blocks from the code; the rest are documents) | concept → applies to components; runtime scenario → sequence over containers |
| Bounded context, Context map relationship (Partnership, Shared Kernel, Customer/Supplier, Conformist, Anticorruption Layer, Open-host Service, Published Language, Separate Ways) | DDD Reference (Evans, 2015, CC BY 4.0) [F, table of contents] https://www.domainlanguage.com/ddd/reference/ | partly (packages / modules, as a draft) | bounded context → contains aggregate; context A → upstream / downstream of B with a pattern |
| Aggregate, Entity, Value object, Domain event, Domain service, Repository, Factory, Module | DDD Reference "Building Blocks" (Domain Events marked as new since 2004) [F] | partly (class / type names, annotations, folder conventions; the role needs an agent) | aggregate → has root entity, contains entities / value objects; → emits domain event; repository → persists aggregate |
| Core domain / generic subdomain | DDD Reference "Distillation" [F] | no | subdomain → classified core / generic; bounded context → serves subdomain |
| Command, Policy (EventStorming) | **[none]** in the DDD Reference: "command" appears once, only in the sense of a method in CQRS segregation, and "policy" does not appear [F]. These are EventStorming (Brandolini) terms with no specification | partly (command / handler classes) | command → handled by aggregate → emits event → triggers policy → issues command |

## 6. Code and contracts

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Service 🟢, package 🟢, module 🟢, file 🟢, symbol 🟢, dependency 🟢, manifest 🟢 | Language toolchains. Package = SPDX 3.0.1 Software/Package, File, Snippet [F] https://spdx.github.io/spdx-spec/v3.0.1/ | yes | package → contains file → defines symbol; symbol → calls / imports symbol |
| HTTP API: Path item, Operation (`operationId`), Parameter, Request body, Response, Schema, Security scheme, Security requirement, Tag, Webhook, Callback, Link, Server | OpenAPI 3.1.1 [F] https://spec.openapis.org/oas/v3.1.1.html | **yes** (`openapi.yaml/json`) | API → has operation; operation → uses schema, requires security scheme; operation → implemented by route handler symbol |
| Route 🟢 (server route) | [none] beyond OpenAPI | yes (framework router calls via the code graph) | route → implements operation; → handled by symbol |
| Async API: Server, Channel, Operation (send / receive), Message, Schema, Message trait, Binding, Correlation ID, Security scheme | AsyncAPI 3.0.0: operation → one channel + action; channel → messages; channel → servers [F] https://www.asyncapi.com/docs/reference/specification/v3.0.0 | **yes** (`asyncapi.yaml`) | channel 🟢 → carries message 🟢; operation → sends / receives on channel; message → payload schema |
| gRPC service / rpc / message (proto) | Protocol Buffers language spec [U, not fetched] https://protobuf.dev/reference/protobuf/proto3-spec/ | yes (`.proto`) | service → has rpc → request / response message |
| GraphQL type / field / query / mutation / subscription | GraphQL specification [U, not fetched] https://spec.graphql.org/ | yes (`.graphql` SDL, introspection) | type → has field; operation → returns type; resolver symbol → resolves field |
| Schema (JSON Schema) | JSON Schema 2020-12, which OpenAPI 3.1 builds on [F via OAS] | yes | schema → $ref schema; used by operation / message / config |
| Contract 🟢 | Covered by the rows above. Consumer-driven contract test files (e.g. Pact [U]) | yes | contract → between consumer and provider component |
| Config / env-var 🟢, feature-flag key | OpenFeature "Flag Key" [F] | partly (flag keys at `getBooleanValue("key")` call sites; flag definitions in the provider's files, e.g. flagd JSON [U]) | flag → gates code path / symbol; → evaluated in context; → has variants |
| Logger 🟢 / log event, metric instrument, span | OpenTelemetry signals: traces, metrics, logs, baggage, profiles [F] https://opentelemetry.io/docs/concepts/signals/ | partly (instrumentation calls via the code graph) | symbol → emits span / metric / log |

## 7. Data

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Database 🟢, table 🟢, column 🟢, migration 🟢 | [none] beyond SQL / ORM formats | yes (migrations, schema files, ORM models) | table → has column; migration → alters table; column → references column (FK) |
| Data entity (logical) | DDD Entity / Aggregate [F]. CycloneDX `data` component type [F] | partly | entity → persisted in table; → part of aggregate |
| Dataset | OpenLineage: "a discrete collection of data, identified by a namespace and name" [F] https://openlineage.io/docs/spec/object-model | partly (static: SQL / dbt models; at runtime: OpenLineage events) | job run → reads input / writes output dataset |
| Job (data job) / Run | OpenLineage Job ("unit of work that consumes or produces datasets", namespace + name) and Run (runId, START / COMPLETE, parent run facet) [F] | partly (DAG definitions: Airflow / dbt; runs only at runtime) | job → has runs; run → parent run; run → input / output datasets |
| Facet (schema, data quality, column lineage) | OpenLineage facets [F] | partly | facet → describes job / run / dataset |
| Data classification / PII category | CycloneDX service `data[]` with `flow`, `classification`, `source`, `destination`, `governance` [F, bom-1.6.schema.json]. GDPR Art. 9 special categories [U, not read] | partly (column naming and annotations: draft only; a person confirms) | column / dataset → classified as category; data flow → carries classification |
| Data subject / personal data category | GDPR Art. 30(1)(c) "categories of data subjects and … personal data" [F, read via the gdpr-info.eu reproduction of the official text; EUR-Lex returned no content] | no | processing activity → concerns data-subject category and personal-data category |
| Data contract / retention | GDPR Art. 30(1)(f) time limits [F, same caveat] | no / partly | dataset → retained for period |

## 8. Testing

All definitions in this section come from the ISTQB glossary (read through its API, `https://api.glossary.istqb.org/v1/terms/<slug>`; site https://glossary.istqb.org) [F] unless the row says otherwise.

| Entity kind | ISTQB definition (short) | Extractable | Main relations |
|---|---|---|---|
| Test basis | "body of knowledge used as the basis for test analysis and design" | no | test condition → derived from basis (requirement, story) |
| Test condition | "a testable aspect of a component or system that is intended to be tested" | partly (Gherkin scenario titles, `describe` names) | condition → derived from requirement; → covered by test case |
| Coverage item / coverage | "derived from one or more test conditions by using a test technique"; coverage = "degree… exercised by a test suite, as a percentage" | yes for code coverage (lcov, Cobertura XML, Istanbul JSON) | test suite → covers file / symbol / coverage item |
| Test case 🟢 | "preconditions, inputs, actions, expected results and postconditions, developed based on test conditions" | yes (Jest / Vitest / bun `test()`, Playwright `test()`, pytest, Go `TestX`; Gherkin Scenario) | test case → verifies requirement / acceptance criterion; → exercises symbol / route / screen |
| Test procedure / test script | "sequence of test cases in execution order…" / "sequence of instructions for the execution of a test" | yes (test files) | procedure → orders test cases |
| Test suite | "a set of test scripts or test procedures to be executed in a specific test run" | yes (test file / `describe` block / config project) | suite → contains test case |
| Test run / test result / test log | "execution of a test suite on a specific version of the test object" / "status of the execution" / "chronological record" | partly (JUnit XML, CTRF JSON, Playwright reports as CI output; JUnit XML is a de facto format with no standard [U]) | run → of suite on commit / build; result → of test case |
| Test level, Test type (functional, performance, security, usability, regression, …) | "a specific instantiation of a test process" / "group of test activities… aimed at specific characteristics" | partly (folder conventions, runner config: unit / integration / e2e) | test case → at level, of type; type → targets quality characteristic |
| Test objective / test plan / test report | "purpose for testing" / "objectives, means and schedule" / "summarizing testing and results" | no | plan → covers test levels / suites |
| Test data / test fixture | "data needed for test execution" / "predefined data and test environment to test software in a repeatable manner" | yes (fixture folders, factories, seed files) | test case → uses fixture |
| Test double / stub / driver / test harness / test automation framework | "replacement component…" / "predefined responses" / "drivers and test doubles needed…" / "test harnesses and libraries" | yes (mock modules, `vi.mock` / `jest.mock`, MSW handlers) | double → replaces component / API in a test |
| Test environment | "hardware, instrumentation, simulators, software tools… needed to perform a test" | partly (compose / testcontainers / CI services) | suite → runs in environment |
| Test oracle | "a source to determine an expected result" | partly (snapshot files, golden files) | test case → judged by oracle |
| Test charter / test session / exploratory testing | "mission statement that guides an exploratory test session" | no | session → follows charter → finds defect |
| Defect / failure | "imperfection or deficiency in a work product…" / "event in which a component… does not meet its requirements" | partly (tracker bug issues; failures from CI runs) | failure → caused by defect → located in symbol / file; defect → fixed by commit |
| Flaky test | **[none]**: no ISTQB entry ("flaky-test" not found) | partly (run history: same commit, differing results) | test case → flagged flaky by run history |
| Mutation score / mutant | **[none]** in ISTQB ("mutation-testing" not found). Stryker report schema [U] (one vendor example) | yes (Stryker `mutation.json`) | mutant → in symbol → killed by test case |
| SPDX test relations | SPDX 3 relationship types `hasTest`, `hasTestCase`, `testedOn` [F] https://spdx.github.io/spdx-spec/v3.0.1/model/Core/Vocabularies/RelationshipType/ | — | names reusable as relation names |

## 9. CI/CD and delivery

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Pipeline 🟢 (ci-workflow) / pipeline run | OTel semconv `cicd.pipeline.name`, `cicd.pipeline.run.id`, `cicd.pipeline.result` [F] https://opentelemetry.io/docs/specs/semconv/registry/attributes/cicd/. GitHub Actions workflow / `on` triggers [F] https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | yes (`.github/workflows/*.yml`, `.gitlab-ci.yml`, …); runs: CI API only | pipeline → triggered by event / branch; → has job; run → on commit |
| Job 🟢 / task / step | GitHub Actions `jobs.<id>`, `needs`, `steps` (`run` / `uses`) [F]. OTel `cicd.pipeline.task.name` / `task.run.id` [F] | yes | job → needs job; job → has step; step → uses action (version-pinned or not); job → runs on runner |
| Runner / worker | OTel `cicd.worker.*` [F] | partly (`runs-on` labels) | job → runs on worker |
| Make target 🟢, scripts | [none] | yes (Makefile, package.json scripts) | job → invokes target |
| Environment (deployment environment) | C4 deployment environment [F]. GitHub `environment` [F, partial]. OTel `deployment.environment` resource attribute [F] | partly (workflow `environment:`, k8s namespaces, Terraform workspaces) | deployment → to environment; environment → protected by rule |
| Deployment | DORA: deployment frequency, change fail rate, failed deployment recovery time, deployment rework rate are counted over deployments [F] https://dora.dev/guides/dora-metrics/ | no (CD system or deploy events) | deployment → of release / commit → to environment; → failed / recovered; → caused by incident |
| Change (for lead time) | DORA "change lead time: from commit… until running in production" [F]. OTel `vcs.change.*` (id, state, title) [F] https://opentelemetry.io/docs/specs/semconv/registry/attributes/vcs/ | partly (git + forge API) | change → contains commits → reaches production in deployment |
| Release / tag / version | Helm release = "a named, deployed instance of a chart" [F] https://helm.sh/docs/topics/charts/. Git tags; SemVer [U, not fetched] | yes (tags, CHANGELOG, package version) | release → contains changes / commits; → produces artifact |
| Build / build artifact | SLSA Provenance v1: `buildDefinition` (buildType, externalParameters, internalParameters, resolvedDependencies), `runDetails` (builder.id, invocationId, byproducts), `subject` = output artifacts [F] https://slsa.dev/spec/v1.0/provenance. SPDX 3 Build profile [F]. CycloneDX `formulation` (formula, workflow, task, step, workspace, trigger) [F] | partly (provenance files emitted by CI; build config) | build → produces artifact (subject); → consumes resolved dependency; → run by builder |
| Image 🟢 / Dockerfile 🟢 / compose-service 🟢 | Dockerfile / OCI image formats [U, not fetched] | yes | image → built from Dockerfile → base image; compose service → runs image |
| Feature flag | OpenFeature: Feature Flag, Flag Key, Variant, Provider, Evaluation Context, Targeting, Rule, Flag Set, Domain, Client [F] https://openfeature.dev/specification/glossary. OTel `feature_flag.*` evaluation event (key, result.variant, provider.name, set.id, version; attributes Release Candidate) [F] https://opentelemetry.io/docs/specs/semconv/feature-flags/feature-flags-events/ | partly (keys from SDK call sites; definitions from provider files) | flag → in flag set; → has variant; → gates feature; → served by provider |
| DORA metric | dora.dev five metrics, in two groups: throughput and instability [F] | partly (computed from deployments, changes, incidents) | metric → computed over deployments / changes / failures |

## 10. Infrastructure / IaC

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Terraform resource, data source, provider, module, state | Terraform language docs [F] https://developer.hashicorp.com/terraform/language/resources (variable and output are named there but not defined; [U] for those) | **yes** (`*.tf` HCL; `terraform show -json` for a plan; state is not in the repository) | module → contains resource; resource → depends on resource; resource → of provider; output → feeds module input |
| Kubernetes objects: Pod, Deployment, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob, HPA, Service, EndpointSlice, Ingress, IngressClass, NetworkPolicy, ConfigMap, Secret, PV, PVC, StorageClass, ServiceAccount, Role, ClusterRole, RoleBinding, ClusterRoleBinding, PodDisruptionBudget, ResourceQuota, LimitRange, Namespace, Node, CRD, admission policies, … | Kubernetes API reference [F] https://kubernetes.io/docs/reference/kubernetes-api/ | **yes** (YAML manifests; Kustomize / Helm after rendering) | Deployment → selects pods via labels; Service → selects pods; Ingress → routes to Service; pod → mounts ConfigMap / Secret; RoleBinding → binds Role to ServiceAccount |
| Helm chart, values, template, chart dependency, release | Helm docs: Chart.yaml (name, version, appVersion, dependencies), values.yaml, templates/, crds/, application / library type, release [F] | yes (chart folders) | chart → depends on chart; chart → renders k8s objects; release → instance of chart in a namespace |
| Cloud resource | Terraform resource types per provider [F]. OTel `cloud.*` resource attributes [F] https://opentelemetry.io/docs/specs/semconv/resource/ | yes via IaC; no otherwise | container → deployed to cloud resource |
| Port 🟢, process 🟢, health / metrics endpoint 🟢 | k8s probes and container ports [U, field level not fetched] | yes | container → exposes port; probe → hits endpoint |

## 11. Operations / SRE

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| SLI / SLO / SLA | Google SRE book: SLI "a carefully defined quantitative measure…", SLO "a target value or range… measured by an SLI", SLA = a contract with consequences [F] https://sre.google/sre-book/service-level-objectives/ | yes if declared (OpenSLO YAML); otherwise no | SLO → measures SLI → for service; SLA → wraps SLO |
| OpenSLO kinds: Service, SLO, SLI, DataSource, AlertPolicy, AlertCondition, AlertNotificationTarget | OpenSLO v1 [U]: the kind list came from a search summary of github.com/OpenSLO/OpenSLO; the spec page fetch returned 404 | yes (OpenSLO YAML) | SLO → indicatorRef SLI → DataSource; SLO → alertPolicyRef |
| Error budget | SRE book [U]: from the SRE book, not quoted in the fetch | no (derived) | error budget → of SLO |
| Alert rule / recording rule / rule group | Prometheus alerting rules: `alert`, `expr`, `for`, `keep_firing_for`, `labels`, `annotations` (runbook links), `groups` [F] https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ | **yes** (rule YAML) | alert → on metric; → links runbook (annotation); → routes to on-call |
| Dashboard | [none] (vendor: Grafana dashboard JSON is one example [U]) | yes (dashboard JSON in the repository) | dashboard → has panel → queries metric |
| Runbook | [none] | partly (docs files linked from alert annotations) | alert → runbook; runbook → for service |
| Incident / postmortem / action item | Google SRE Workbook postmortem: incident summary and duration, impact, root causes and trigger, timeline, lessons, action items (prevent / detect / mitigate, owner, tracking bug) [F] https://sre.google/workbook/postmortem-culture/ | no (incident tool, docs) | incident → affects service; → caused by deployment / change; → has action item → tracked as task |
| On-call schedule / escalation policy | [none] (vendor: PagerDuty is one example [U]) | no | service → paged via schedule → user / group |
| Telemetry entity / resource: service.name, service.version, deployment.environment, host, container, k8s.*, cloud.*, process, telemetry.sdk | OTel resource semantic conventions [F] https://opentelemetry.io/docs/specs/semconv/resource/. OTel Entity data model (type, ID attrs, description attrs; status Development) [F] https://opentelemetry.io/docs/specs/otel/entities/data-model/ | partly (SDK init code, `OTEL_SERVICE_NAME` env) | span / metric / log → emitted by service entity on host / container |
| Span, metric, log record, baggage, profile | OTel signals [F]. Span / instrument fields are [U] (the concepts page does not define them) | partly (instrumentation calls) | span → child of span; span → links span; metric → measured by instrument |

## 12. Security

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Threat model (subject, assumptions, threats, mitigations, validation) | OWASP Threat Modeling page: subject description, assumptions, potential threats, mitigations, validation; STRIDE is named only as a technique [F] https://community.owasp.org/Threat_Modeling | partly (threat-model-as-code files, e.g. OWASP Threat Dragon JSON [U]) | threat model → covers system; threat → mitigated by control |
| Threat (STRIDE category) | STRIDE named on the OWASP page [F]. Category definitions [U] | no | threat → targets asset / data flow → crosses trust boundary |
| Trust boundary / trust zone, data flow | CycloneDX service `trustZone`, `x-trust-boundary`, `data[]` (`flow`, `classification`, `source`, `destination`) [F, schema 1.6] | partly | data flow → from component to component, crosses trust zone |
| Mitigation / security control | OWASP ASVS 5.0: 17 chapters (V1 Encoding & Sanitization … V17 WebRTC), about 350 requirements, levels L1–L3 [F] https://github.com/OWASP/ASVS/tree/master/5.0/en. Requirement ID format (e.g. `v5.0.0-1.2.5`) [U] | the catalog: reference data. Coverage of a control: no / partly | requirement / component → satisfies ASVS requirement; test → verifies it |
| Weakness (CWE) | CWE: "a condition in a software, firmware, hardware, or service component that… could contribute to… vulnerabilities"; ID `CWE-<n>`; CVE records are Observed Examples [F] https://cwe.mitre.org/about/new_to_cwe.html | reference data | finding → instance of CWE; vulnerability → has CWE |
| Vulnerability (CVE / OSV / GHSA) | OSV schema: id, aliases, related, upstream, withdrawn, severity, affected (package ecosystem / name / purl, ranges with introduced / fixed events, versions), references [F] https://ossf.github.io/osv-schema/. SPDX 3 Security `Vulnerability` [F]. CycloneDX `vulnerabilities` [F] | yes (osv-scanner, an SBOM scan → OSV / CycloneDX output) | vulnerability → affects package version; → fixed in version; → aliases vulnerability |
| VEX statement | OpenVEX: document → statements {vulnerability, products, subcomponents, status (not_affected / affected / fixed / under_investigation), justification} [F] https://github.com/openvex/spec/blob/main/OPENVEX-SPEC.md. CycloneDX `analysis.state` (resolved, resolved_with_pedigree, exploitable, in_triage, false_positive, not_affected) and justifications [F]. SPDX 3 `VexAffected/NotAffected/Fixed/UnderInvestigation` assessment relationships [F] | yes (`.openvex.json` or CycloneDX VEX in the repository) | statement → asserts status of vulnerability for product |
| SAST / DAST / SCA / secret-scan finding | OASIS SARIF 2.1.0: sarifLog → run → tool / toolComponent → reportingDescriptor (rule) → result → location (physicalLocation: artifactLocation + region; logicalLocation) → codeFlow / threadFlow, fix, suppression, invocation; baselineState is a result property [F] https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html | **yes** (`*.sarif` from CodeQL, Semgrep, gitleaks, ZAP, …) | result → instance of rule → maps to CWE (taxonomy); result → located in file / region / symbol; suppression → of result |
| SBOM component | CycloneDX 1.6: top level metadata, components, services, externalReferences, dependencies (`ref`, `dependsOn`, `provides`), compositions, vulnerabilities, annotations, formulation, declarations, definitions; component types application, framework, library, container, platform, operating-system, device, device-driver, firmware, file, machine-learning-model, data, cryptographic-asset [F] https://cyclonedx.org/docs/1.6/json/ + schema. SPDX 3.0.1 profiles: Core, Software, Security, Licensing (Simple / Expanded), Dataset, AI, Build, Lite, Extension [F] | **yes** (lockfiles → syft / cdxgen / Trivy → CycloneDX / SPDX) | component → dependsOn component; package → hasDeclaredLicense / hasConcludedLicense license |
| License | SPDX license list / expressions [U, list not fetched]. SPDX 3 `hasDeclaredLicense`, `hasConcludedLicense` [F]. CycloneDX license (id, name, acknowledgement) [F] | yes (package manifests, LICENSE files, SBOM) | package → declared / concluded license |
| Cryptographic asset (algorithm, certificate, protocol, related crypto material) | CycloneDX 1.6 `cryptoProperties.assetType` [F] | partly (CBOM tooling, cert files) | component → uses crypto asset |
| Secret | k8s Secret [F]. Secret-scan findings as SARIF [F] | partly (references: yes; values: never stored) | component → reads secret; finding → leaked secret |
| Permission / role / authz policy | k8s Role / ClusterRole / RoleBinding / ServiceAccount [F]. GitHub Actions `permissions` [F]. ASVS V8 Authorization [F, chapter name] | yes for declared RBAC / IaC IAM / workflow permissions; partly for app-level authz | subject → bound to role → grants verbs on resources |
| Provenance / attestation | SLSA Build track L0–L3 [F] https://slsa.dev/spec/v1.0/levels. Provenance fields [F]. in-toto attestation layers: Envelope, Statement, Predicate, Bundle [F] https://github.com/in-toto/attestation/blob/main/spec/README.md | partly (attestation files from CI; workflow config shows the level) | attestation → about subject artifact; → predicate type; artifact → built by build |
| Scorecard check | OpenSSF Scorecard: Binary-Artifacts, Branch-Protection, CI-Tests, CII-Best-Practices, Code-Review, Contributors, Dangerous-Workflow, Dependency-Update-Tool, Fuzzing, License, Maintained, Packaging, Pinned-Dependencies, SAST, SBOM, Security-Policy, Signed-Releases, Token-Permissions, Vulnerabilities, Webhooks [F] https://github.com/ossf/scorecard/blob/main/docs/checks.md | yes (scorecard JSON / SARIF output) | repository → scored by check → evidence in workflow / file |
| Secure development practice | NIST SSDF SP 800-218 v1.1: groups PO / PS / PW / RV, practices `PO.5`, tasks `PO.1.2` [F] https://csrc.nist.gov/projects/ssdf | reference data | process / pipeline → implements practice |

## 13. Compliance and privacy

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Control catalog / control / parameter | NIST OSCAL Control layer: Catalog (controls, statements, parameters, objectives, assessment methods), Profile (baseline selection and tailoring), Control Mapping [F] https://pages.nist.gov/OSCAL/learn/concepts/layer/ | yes if OSCAL JSON / YAML is kept in the repository; otherwise reference data | profile → selects controls from catalog; control → mapped to control |
| Component definition / implemented requirement / SSP | OSCAL Implementation layer [F] | partly | component → implements control; SSP → for system against profile |
| Assessment plan / results / finding / evidence / POA&M | OSCAL Assessment layer [F]. CycloneDX `declarations` (assessors, attestations, claims, evidence, targets) [F] | partly (CI evidence: test runs, scans) | evidence → supports claim → about control; finding → tracked in POA&M → task |
| Policy (organisational) | [none] beyond OSCAL component type "policy" [F] | no | policy → requires control |
| Standard / framework (ISO 27001, SOC 2, PCI DSS) | ISO/IEC 27001 [U: ISO pages blocked]. CycloneDX `definitions.standards` [F] | reference data | control → part of standard |
| Processing activity (GDPR record) | GDPR Art. 30(1)(a)–(g): controller / DPO, purposes, data-subject categories, personal-data categories, recipients, third-country transfers, erasure time limits, security measures [F, via the gdpr-info.eu text; the official EUR-Lex page returned empty] | no | activity → has purpose; → concerns data-subject category; → shares with recipient; → implemented by system / dataset |
| Data subject category, recipient, transfer, retention period | GDPR Art. 30 [F, same caveat] | no | see above |

## 14. Documentation

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Document / page (README, guide, how-to, reference) | arc42 sections as documentation structure [F]. Diátaxis (tutorials, how-to, reference, explanation) [U, not fetched] | yes (Markdown / MDX / AsciiDoc files) | doc → documents component / API / decision; SPDX `hasDocumentation` [F] |
| Architecture document section (arc42 1–12) | arc42 [F] | partly | section → describes view |
| Changelog / release notes | [none] (Keep a Changelog [U]) | yes | entry → in release → mentions change |
| API reference (generated) | OpenAPI / AsyncAPI [F] | yes | doc → generated from API |

## 15. Organisation

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Group / team, User | Backstage Group, User; `memberOf`, `parentOf`, `ownedBy` [F] | yes from org files / `catalog-info.yaml`; partly from the forge API | user → memberOf team; team → childOf team |
| Owner (code ownership) | GitHub CODEOWNERS: in `.github/`, the root or `docs/`; `pattern owner…`; owners `@user`, `@org/team`, email; the last match wins [F] https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners | **yes** | path pattern → owned by user / team; component → ownedBy (Backstage `spec.owner`) |
| Author 🟢 | git | yes | commit → authored by author → maps to user |
| Scrum accountabilities (Product Owner, Scrum Master, Developers) | Scrum Guide 2020 [F] | no | user → holds role in team |
| Stakeholder | ArchiMate Motivation [U]. ISO/IEC/IEEE 29148 stakeholder requirements [U] | no | stakeholder → has concern / goal |

## 16. History and work

| Entity kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| Repository | OTel `vcs.repository.url.full` / `name`, `vcs.owner.name`, `vcs.provider.name` [F] | yes | repository → contains packages; Backstage Location → repository |
| Commit 🟢 / revision | OTel `vcs.ref.head.revision` [F] | yes (git) | commit → parent commit; → changes file; → authored by; → references task |
| Branch / tag (ref) | OTel `vcs.ref.*.name`, `vcs.ref.type` (branch / tag) [F] | yes | ref → points at commit; release → tagged by tag |
| Pull request / merge request (change) | OTel `vcs.change.id/state(open, closed, merged, wip)/title` [F] | partly (forge API; merge commits locally) | PR → contains commits; → closes issue; → reviewed by user; → ran pipeline |
| Issue / task 🟢 / bug | ISTQB defect [F]. Scrum backlog item [F] | partly (tracker export; commit trailers reference IDs) | task → implements story; → fixed by PR |
| Release | see §9 | yes | — |

## 17. Areas the brief's lists missed

| Area / kind | Defined by | Extractable | Main relations |
|---|---|---|---|
| ML / AI: model, dataset, training run | CycloneDX component type `machine-learning-model`, `data` [F]. SPDX 3 AI and Dataset profiles, relationship `trainedOn` [F] | partly (model cards, training configs) | model → trainedOn dataset; component → uses model |
| Hardware / firmware / device | CycloneDX `device`, `device-driver`, `firmware` [F] | partly | — |
| Cryptography inventory (CBOM) | CycloneDX `cryptoProperties` [F] | partly | above |
| Supply chain: build platform, builder, resolved dependency, byproduct | SLSA provenance [F] | partly | build → resolvedDependencies |
| Product analytics events (tracking plan) | OpenFeature Tracking Event [F]. No general tracking-plan standard [none] | partly (`track("event")` call sites) | event → measures key result / experiment |
| Software catalog scaffolding template | Backstage Template [F] | yes | template → scaffolds component |
| Context / dependency facts from SPDX relationship vocabulary (`generates`, `hasDistributionArtifact`, `packagedBy`, `hasDependencyManifest`, `hasStaticLink`, `hasDynamicLink`, `hasOptionalDependency`, `hasProvidedDependency`, `configures`, `hasHost`, `usesTool`, `fixedIn`, `foundBy`, `affects`, …) | SPDX 3.0.1 RelationshipType [F] | — | a ready-made, standard relation vocabulary for code, build and security edges |
| Process kinds (SDLC process, practice) | NIST SSDF [F]. ISO/IEC/IEEE 12207 / 15288 [U, named only in the 29148 abstract] | no | pipeline / check → implements practice |
| Accessibility conformance report | WCAG conformance [F]. W3C ACT rules / EARL [U] | partly (axe-core JSON) | finding → fails SC on screen |
| Performance budget / benchmark | [none] | partly (bench files, Lighthouse CI config [U]) | budget → constrains screen / route; → part of quality scenario |
| Localisation locale | MF2 / CLDR [F for MF2; CLDR U] | yes (locale folders) | message → translated in locale |

---

## B. Kinds that need an agent or a person, and where their source usually is

| Kind(s) | Why code does not yield them | Usual source |
|---|---|---|
| Vision, Product Goal, goals, OKR objectives / key results, driver, stakeholder, assessment, course of action | Intent, not structure | Strategy docs, planning decks, a vision page; OKR tool |
| Hypothesis, experiment design and result, research finding, spike outcome, prototype verdict | The result lives in analysis, not code | Experiment platform (flag tool + analytics), research notes, ADRs |
| Persona, job-to-be-done, user flow / journey, value stream, business capability map | Business models | UX research repository, design tool (Figma or similar), architecture repository (ArchiMate) |
| Epic, feature, user story, roadmap item, sprint, acceptance criterion in prose | Planning artefacts | Issue tracker (Jira / Linear / GitHub Issues / `br`), roadmap tool. Gherkin files are the exception: extractable |
| Requirement (stakeholder / system), quality scenario, constraint, ASR | Code shows behaviour, not obligation; an agent can draft "derived from code" requirements, which a person confirms | Requirement documents (SRS), arc42 §1, §2, §10 |
| Use case, business rule (meaning), term definitions | Code shows fragments only | Domain docs, glossary, conversations with domain experts |
| Decision rationale (when there is no ADR) | Rationale is not in code | ADR folder, PR discussions, design docs |
| C4 component grouping, bounded-context boundaries, aggregate roles, context-map patterns, core / generic subdomain | Classifications that need judgement over the code graph | Agent proposal over the code graph, confirmed by the architect |
| Screen semantics, design-system membership, component → design-tool frame | Design intent | Design tool, Storybook docs pages |
| Threat model (threats, trust boundaries, mitigations), STRIDE classification | Requires adversarial reasoning | Threat-model documents / Threat Dragon files, security reviews |
| Data classification / PII confirmation, processing activities, data-subject categories, retention, recipients | Legal facts | Privacy register (RoPA), DPO, data catalog |
| Controls, policies, compliance evidence mapping, POA&M | Organisational | GRC tool, OSCAL files if kept, audit evidence folders |
| SLO targets (if not in OpenSLO), error-budget policy, runbook content, on-call schedules, incidents, postmortems, action items | Operational records | Incident / paging tool, SRE docs, postmortem folder |
| Deployments, releases to environments, DORA numbers | Runtime events | CD system / forge API (deployments), incident tool |
| Defects (as reported), PR reviews, issue links | Outside git objects | Forge API, issue tracker |
| Test plan, test objective, test charter / session, test report | Documents | Test management tool, QA docs |

## C. What could not be established (stated plainly)

1. **ISO/IEC 25010:2023 characteristic names.** The ISO pages and OBP sit behind Cloudflare, and
   committee.iso.org gives only the abstract ("nine characteristics"). The nine names in §2 come
   from memory: [U].
2. **ISO/IEC/IEEE 29148:2018 requirement types and information items** (StRS / SyRS / SRS / BRS /
   ConOps). Neither the IEEE nor the ISO abstract names them: [U].
3. **ArchiMate 3.2 Strategy and Motivation elements** (capability, value stream, course of
   action, goal, outcome, driver…). The Open Group publication redirected to a login: [U]. The
   same holds for the TOGAF capability guide and BIZBOK.
4. **SAFe Feature / Capability / Enabler / benefit hypothesis.** The fetch timed out: [U].
5. **OKR, Jobs-to-be-done, persona, roadmap, spike, prototype, research finding, user flow,
   runbook, on-call, dashboard, flaky test, mutation testing, design system, screen, style.** No
   standard or catalog defines these as entities. They are practice names only ([none]); ISTQB
   has no "flaky test", "mutation testing", "use case", "persona" or "test scenario" entry
   (checked through the glossary API).
6. **EventStorming "command" and "policy"** are not in the DDD Reference (checked in the text).
   They have no primary specification.
7. **OpenSLO v1 kinds.** The list rests on a search summary of the GitHub repository; the spec
   page fetch returned 404: [U].
8. **OWASP ASVS 5.0 requirement-ID format.** Not read: [U]. The chapters, levels and the count of
   about 350 requirements were read.
9. **GDPR Art. 30.** The text was read through gdpr-info.eu (a reproduction), because the
   EUR-Lex fetch returned empty. Art. 4 and Art. 9 definitions were not read.
10. **Not fetched in this session, cited from knowledge:** the GraphQL spec, the Protocol
    Buffers spec, JSON Schema (only through OAS), SemVer, Keep a Changelog, the SPDX license
    list, the OCI image spec, CAPEC, CVE record format, ISO/IEC 27001, Diátaxis, W3C ACT / EARL,
    the OTel span / metric data model details, in-toto predicate types, and JUnit XML (it has no
    standard at all).
11. **OpenTelemetry Entity data model** is at status Development, and DTCG 2025.10 is a
    Community Group report, not a W3C Recommendation. Both can still change.
12. **Extractability column.** The "yes / partly / no" judgements are this research's assessment
    of the named formats, not claims from the sources. They were not tested against madarch's
    extractors.
