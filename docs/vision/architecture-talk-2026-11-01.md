# The architecture talk of 2026-11-01: agreed points with the owner's words

The owner and the coordinator went through the architecture of the fill and the walk one question at a time on 2026-11-01. Each point below is what was agreed, with the owner's words in Russian as he gave them. Decision 0033 is written from this record.

1. Traversal unit is one file. A file's pass reads only its bytes and writes its own facts
   (symbols with global names, mentions, imports as written, gaps). Cross-file links are
   resolved per file by querying the graph by global name, never from an in-memory table.
   Owner: «Да, по файлу. Мы с тобой так и договаривались.» (0026 stages 3/4.)
2. Deterministic architecture checks in bun run check and CI, for the whole architecture, not
   only the fill: one writer per store, one entry point per job, no unreachable code; rules in
   one config in the repository, changed only by a commit carrying the owner's decision.
   Owner: «Да. И это касается не только заполнения. А вообще всей архитектуры.»
3. One workflow (the owner's word for it; 0027's orchestrator and stage registry): the only
   runner of every fill job. The wiki button, the CLI and MCP start it; the knowledge fill
   worker's own loop, the extract driver and whatever is left unused are folded in or deleted.
   Writer pages become agent stages of the same registry. Owner: «Один каркас конечно. Только я
   привык называть это workflow».
4. Layered discovery: the file pass creates the graph's nodes; every next step builds on what
   the earlier steps found (reads it from the graph). Every step is a background worker pool,
   its number of threads configurable. The workflow is customizable, or several workflows are
   supported. Owner: «workflow должен быть кастомизируемым. Или просто поддерживать несколько
   workflow ... проход по файлам создает вершины графа, а потом каждый следующий шаг опирается
   на то, что уже обнаружили предыдущие ... на каждый шаг нужен фоновый воркер, возможно в
   несколько потоков, это должно быть настраиваемо.»
5. A workflow is a business process; there can be several (first fill, update on commit, code
   only, a chosen history point...). Declaring them in the product repository (engine ships a
   starter set, stages stay engine code referenced by id): owner «интересное предложение,
   возможно это хорошо» — leaning yes, not final.
6. Owner expects every database interaction to go through the abstraction («У нас
   взаимодействие с БД происходит через абстракцию, у нас же так и должно работать»).
   Found: about 25 modules outside src/graph and src/adapters write SQL themselves
   (orchestrator-store, state-store, fact-store, knowledge/graph-read, writer/view,
   knowledge/product, extract/driver ...).
7. One storage layer: one interface per store (graph, workflow state, queue); only that layer
   writes SQL or holds a database connection; workers, wiki, writer, MCP use the interfaces only.
   Locally the interface forwards to the database owner's process (PGlite), on a server it talks
   to PostgreSQL. A static check fails any module outside the layer that imports the connection
   or runs a query. Owner: «Да, конечно, только один слой. И добавь статическую проверку на это».
8. Greenfield: all old code is deleted, no dead code, no backward compatibility. Writer units
   become agent stages of the one workflow; useful parts of 0026's agent stages 8-13 move in.
   Owner: «Весь старый код удаляем, никакого мертвого кода и обратной совместимости, у нас
   greenfield.»
9. Traversal by entities: the product manifest's kinds (only kinds the engine extracts from code
   are listed), kinds depend on each other. Static extractors give a draft; the agent re-checks
   everything — adds/removes edges, creates nodes, renames — and is responsible for the final
   result. Owner: «нужно идти по сущностям ... агент должен перепроверить даже то, что было
   обнаружено статическими экстракторами ... За окончательный результат отвечает агент.»
10. Not one agent per entity. Every node and edge must be verified by an agent; an agent walks
   from node to node marking what it verified; when its context runs out the turn ends (and the
   next continues). Owner: «все вершины и ребра должны быть проверены агентом ... пусть он идет
   от одной вершины к другой попутно отмечая то, что проверил. Как только контекст кончается -
   ход завершается.»
11. Order: top down by kinds (product -> domains -> scenarios/requirements -> services ->
   modules -> files/symbols), within a level large/important first; a top node is marked
   verified only once confirmed down to code (reflexion model); jev checks edges in bulk, the
   agent takes what jev is unsure of; nodes no path from above reaches get their own turns last.
   Owner: «Да.» Reason he gave: the agent starts from ideas and hypotheses and ends in code,
   filling its context with related knowledge, and the logic gets checked too.
12. Parallel agents: nothing is hidden; every agent navigates the whole graph. A node being
   verified carries a reservation, so another agent does not verify it at the same time.
   Owner: «Агент ориентируется по графу. Просто нужно ставить резерв.»
13. The agent's decision outranks the static extractors. Every agent correction is a record with
   its basis (what, why, cited lines), kept in the product repository (0029); the graph is the
   extractors' result with the corrections over it; a correction whose basis changed loses its
   verified mark and goes back to the list. Owner: «Да, ты прав, решение агента важнее
   статических проверок.»
14. Owner questions exclusive reservation: «А почему другой агент не может проверять? Возможно
   нужно учитывать комментарии другого агента при коммите транзакции?» -> proposing optimistic
   concurrency, reservation as a soft hint.
15. Optimistic concurrency: any agent may verify any node; the reservation is a soft hint the
   orchestrator uses to spread agents; each agent records the versions it read; at commit an
   element another agent changed meanwhile is refused, the agent gets the other's change with
   its basis and comment and agrees, amends or disputes; the rest of its transaction passes; an
   unresolved dispute becomes a question for a person with both positions on the node's page.
   Owner: «Да».
16. Notes on nodes AND edges: what was confirmed, corrected, suspected, with grounds; a handoff
   note at the frontier when a turn ends; the previous agent's summary is kept for the next.
   Notes are workflow data in the graph, not wiki content. Owner: «Да, заметки на вершинах, да
   и на связях - это отличная идея. Можно оставлять резюме прошлого агента.»
17. Entity catalog: add the kinds extractors already emit (repository, directory, broker, metric,
   probe/healthcheck, field, debt, document-section), the idea level (goals, hypotheses, roles,
   capabilities, scenarios, quality attributes, systems, external systems, domain entities,
   state machines, screens, scheduled jobs) and engine-made groups (<= ~50 children per node,
   0026 Scale). Owner: «Добавляем конечно. Тут в сущностях много чего нет. Нужно поисследовать
   и найти все возможные сущности»: design/components/styles/frontend, R&D, fuller testing,
   CI/CD, security (SCA, SAST/DAST, SBOM, ...). Research launched against primary sources.
18. Update by commit (owner: «по коммиту»). Every branch and worktree, not only the default
   branch: a branch layer over the default branch at the merge-base, static facts for the files
   the branch changes (uncommitted worktree files re-read per file on an MCP query); agent
   verification also runs in the branch on its commits, top down from the highest node the
   change touched, batched in a window, with the branch workflow's own budget; at merge the
   branch's verified marks and corrections carry over without re-verification, except what the
   default branch changed meanwhile (the same commit-time reconciliation with both sides' notes).
   The branch layer never writes the default branch's history. Owner: «А почему только по
   основной ветке? А как же наш граф будет помогать агенту в worktree?» / «статические проверки в
   worktree будет недостаточно» / «Да».
19. All of it runs in the background and never blocks a commit. Owner: «наша работа должна идти в
   фоне и не блокировать коммит».
20. Readers (wiki and MCP) see everything with a state per node, edge and statement: verified
   (by an agent, at which commit, with its note), static only, disputed, stale. Wiki: a badge and
   a "verified only" filter; MCP: the state with every fact; coverage shown per page and for the
   product. Changed nodes and edges move from verified to stale. Owner: «Да. Те узлы и связи,
   которые изменились переводим из проверенных в устарело.»
21. Workers: one background server per machine owns the database, the orchestrator and the
   queue. Every step has its own worker pool sized in the workflow's settings: static steps are
   separate processes (default = cores; memory bounded by one file; a crash or leak is isolated
   and cured by restart); agent steps run many sessions concurrently in one or a few processes,
   bounded by concurrent sessions and the model gateway's limits. Workers reach the graph only
   through the storage interface (locally forwarded to the owner, on a server PostgreSQL), so the
   same code runs on one machine or several through the shared queue (0027). A memory budget in
   the settings; the orchestrator never admits work beyond it. Owner: «Да».
22. Nobody edits the wiki or graph by hand; a person tells the agent, the agent walks the whole
   chain. And the whole SDLC runs in the wiki (owner's pasted vision, 2026-11-01): a product owner
   dictates an idea by voice to the agent in the wiki; together they write user stories; a
   wireframe; an analyst/product engineer writes use cases, functional and non-functional
   requirements, ADRs; then development - all only in the wiki. A new task in the wiki
   automatically becomes an agent's task; the agent brings a PR/MR, a person merges it or returns
   it for rework (an autonomous loop; the wiki is also the tracker, madarch-lk4r). A person's
   statement that contradicts the code (e.g. "service A does not call service B") becomes work:
   remove the link from the code if it exists and is unused. «мы с тобой сейчас делаем систему
   управления продуктом. Общую цельную картину начиная от идеи видения заканчивая разработкой
   тестированием и деплоем».
23. The graph holds two sides: intended (from people via the agent, Markdown in the product
   repository with who said what) and implemented (extracted, agent-verified). A divergence
   becomes a work item. MVP: no autonomy - the item is shown to a person and goes to an agent
   only on their yes; full autonomy (item -> agent -> PR -> person merges or returns) later,
   as a workflow setting. Owner: «сейчас автономность в MVP мы не добавляем, но в будущем - да.»
24. MVP cut as proposed (one workflow, storage layer + checks, per-file static into the graph,
   top-down agent verification with jev/notes/optimistic reconciliation/states, agent corrections
   as records, update by commit on default and branch/worktree in the background, people change
   things only by talking to the agent - text first, old code deleted), EXCEPT the entity catalog:
   the full catalog is in now, unimplemented kinds marked. After MVP: autonomy, voice, full
   tracker, signatures by role. Owner: «полный каталог сущностей должен быть уже сейчас. Мы
   просто нереализованные может пометить.» Research: docs/explorations/entity-catalog-2026-11-01.md
   (17 areas, ~220 kinds; DTCG 2025.10 and SARIF 2.1.0 citations verified).
25. Every kind carries its origin marks (one or several): extractor <id> / conversation / agent
   from the graph / not implemented; a not-implemented kind is shown honestly and can still be
   created by talking to the agent; the agent notes where such a kind would apply. The full
   catalog ships in the engine's starter set as data (with standard relation names from SPDX 3,
   Backstage, C4); a product gets it whole and may remove kinds in its manifest. Each kind also
   links to the standard or source it was taken from, so a person can read it. Owner: «Да. И
   можно ссылаться еще откуда мы взяли эту сущность, чтобы человек мог ознакомиться.»
26. Origin mark "document" too: idea-level kinds usually come from existing documents (README,
   docs/, ADR folders, PRDs) read by meaning by the agent, with the section as basis; the
   conversation adds and corrects. Owner: «видение может быть уже опубликовано в документах репо».
27. Catalog validation without row-by-row reading: the whole researched catalog with marks and
   source links; Codex reviews it for gaps against the standards; agents on real products note
   missing and unused kinds; the catalog is data, cheap to extend. Owner: «Да, давай.»
28. Tie kinds to the wiki's POV (reader roles). Owner: «не забывать что у нас в вики есть POV.
   Можно завязать сущности на POV.»
29. POV extended: groups = catalog areas (strategy, requirements, R&D, design/frontend,
   architecture, CI/CD and delivery, infrastructure, security, compliance/privacy, documentation,
   organisation, plus code, contracts, data, tests, operations, history); roles = the six plus
   designer, security engineer, platform/DevOps, product lead; a kind belongs to exactly one
   group and a role lists its groups; the agent starts from the role's groups when a person of
   that role talks to it. Owner: «Да» (typed «Lf»).
30. Workflows are declared in the product repository (madarch/workflows.yaml beside kinds and
   POV); the engine ships a starter set (first fill, update by commit, branch/worktree, history
   point); stages stay engine code referenced by id; a workflow naming a missing stage or a
   starved input fails the manifest check. Owner: «Да, пусть будет в репо продукта».
31. Catalog in two levels: area -> subgroup -> kind, about 12 kinds per subgroup at most; POV
   roles lead an area or a subgroup. Owner: «Для каталога нужно большие группы разделить еще» /
   «Да». New area resilience and continuity: DR plans, geo-redundancy, backups. Owner: «Еще
   вспомнил DR планы, гео-резерв, бэкапы».
32. Owner's additions to the catalog: «затраты на лицензии и LLM, какая часть процессов
   автоматизирована или выполняется вручную, gitops, задание по безопасности, bug bounty, pen
   testing, сканирование на уязвимости, правила файрвола, зоны, DNS, домены, IP и порты,
   протоколы, технологии, инфра и их версии, роли и доступы, sso, внешние интеграции.»
33. More owner additions: «Категории информации (ПДн, тайна связи, коммерческая тайна),
   информационные потоки с подробностями что конкретно передается (с привязкой к глоссарию),
   проверки данных (ну например связанность в БД), очереди и брокеры, кэши, s3, longhorn, sftp,
   grpc, e-mail отправки и нотификации, изменения и работы (инфра, релизы, обновления,
   обновление БД).»
34. More owner additions: «smpp, waf, балансировщики и прокси, websocket, sse, saas, paas, iam, k8s
   ноды, серверы».
35. A confident jev verdict counts as verified, marked "verified by jev"; what jev is unsure of
   goes to the agent; the wiki shows who verified. Owner: «Согласен». The Codex review's other
   findings (docs/explorations/0033-codex-review-2026-11-01.md) are taken into the decision.
