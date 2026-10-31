import { readFileSync, lstatSync } from 'node:fs';
import { isAbsolute } from 'node:path';

export interface PrimeRuntime { socket: string; provider: string; model: string; env: Record<string, string>; }
export function primeRuntime(source: NodeJS.ProcessEnv = process.env): PrimeRuntime {
 const file = source.MADARCH_PRIME_RUNTIME_READY;
 if (!file) throw new Error('MADARCH_PRIME_RUNTIME_READY is required to start prime-agent');
 if (!isAbsolute(file)) throw new Error(`MADARCH_PRIME_RUNTIME_READY must be an absolute path: ${file}`);
 let ready: any; try { ready = JSON.parse(readFileSync(file, 'utf8')); } catch { throw new Error(`Cannot read prime-agent runtime file ${file}`); }
 if (ready.phase !== 'ready') throw new Error(`Prime-agent runtime is not ready: ${file}`);
 if (!isAbsolute(ready.socket)) throw new Error(`Prime-agent socket path is invalid in ${file}`);
 try { const st=lstatSync(ready.socket); if (!st.isSocket() || st.dev !== ready.socket_dev || st.ino !== ready.socket_ino) throw new Error(); } catch { throw new Error(`Prime-agent daemon socket is missing or changed: ${ready.socket}`); }
 for (const row of [...(ready.processes ?? []), ready.controller].filter(Boolean)) {
  try { const fields=readFileSync(`/proc/${row.pid}/stat`,'utf8').split(') ').slice(1).join(') ').trim().split(/\s+/); if(fields[0]==='Z'||fields[19]!==row.ticks) throw new Error(); } catch { throw new Error(`Prime-agent daemon process is missing or changed: ${row.pid}`); }
 }
 if (ready.env === null || typeof ready.env !== 'object' || Array.isArray(ready.env) || Object.values(ready.env).some((value) => typeof value !== 'string')) throw new Error(`Prime-agent runtime environment in ${file} must be an object of strings`);
 const provider=source.MADARCH_PRIME_PROVIDER, model=source.MADARCH_PRIME_MODEL;
 if (!provider) throw new Error('MADARCH_PRIME_PROVIDER is required'); if (!model) throw new Error('MADARCH_PRIME_MODEL is required');
 return { socket: ready.socket, provider, model, env: ready.env };
}
