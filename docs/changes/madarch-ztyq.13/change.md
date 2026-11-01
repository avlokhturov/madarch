# Prime-agent ACP writer using machine-owned runtime access

Change: madarch-ztyq.13
Base: 6f75bbed052101510c12d391d22015518082436a
Tasks: madarch-ztyq.13
Kind: behavior

## Intent
Allow the product wiki writer to use prime-agent over ACP when the machine supplies its runtime-ready file, provider, and model. Madarch validates runtime readiness and launches the configured agent without reading or copying credentials. The machine runtime owns gateway access.

## Out of scope
- Installing, restarting, or managing the machine-owned prime-agent daemon.
- Reading or storing gateway credentials or secrets.
- Trying a different agent or provider when the runtime is unavailable.
- Changing ACP behavior for other writer agents.

## Changes to requirements
- product-wiki/acp-agent (changed): an agent whose access its runtime owns is launched from machine-given settings, receives only its runtime allowlist environment, and is refused with missing settings named and no agent/provider fallback. Scenarios: `acp-machine-owned-runtime`, `prime-agent runtime configuration uses configured provider and model with only runtime allowlisted environment`, `prime-agent runtime configuration refuses absent runtime configuration without falling back`, `prime-agent probe launches the configured ACP binary with daemon runtime options`.

Complete proposed capability text: `capabilities/product-wiki.md`. It is the base capability at `Base:` with only the `acp-agent` requirement and its scenario extended.

## Preserved contracts

## Coverage
- product-wiki/acp-agent: test

## Where it is seen
Kind: command
Place: `madarch fill --probe-acp` and a product wiki fill with the prime-agent writer selected
1. Run the ACP probe and see prime-agent reported as ready or refused with the missing runtime setting named.
2. Run a fill and see the configured prime-agent write product wiki pages, or see the exact runtime refusal without a different agent or provider being selected.

## Blocking questions
None.

## Rationale
The daemon and its access belong to the VM runtime. Madarch should pass only the allowlisted environment and explicit machine settings to a fresh ACP process. It must not infer credentials, provider, or model, and must not fall back to a different writer when the runtime is unavailable.

## Design and decisions
`MADARCH_PRIME_RUNTIME_READY` identifies the machine-created readiness file. `MADARCH_PRIME_PROVIDER` and `MADARCH_PRIME_MODEL` select the machine's configured provider group and model. Runtime values are read and validated at launch; the runtime file's `env` object is the complete child environment allowlist. The ACP child has its own initialization and session. It never reuses a launcher session and madarch does not shut down the shared daemon. The stock CLI still cannot eliminate a race in which the daemon disappears after validation.

## Acceptance evidence
Validation and authorized fixture-fill outcomes are in `/workspace/repo/out/report.md`.

## DONE WHEN
The ACP probe and writer chooser offer prime-agent, runtime settings are passed without credential handling or fallback, and an authorized throwaway product fill completes with pages written using the configured model.
