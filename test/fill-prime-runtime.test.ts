import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { primeRuntime } from '../src/fill/prime-runtime.js';

describe('prime-agent runtime configuration', () => {
 test('uses configured provider and model with only runtime allowlisted environment', async () => {
  const dir=mkdtempSync(join(tmpdir(),'prime-runtime-'));
  const socket=join(dir,'daemon.sock'); const server=createServer();
  await new Promise<void>((resolve)=>server.listen(socket,resolve));
  try {
   const file=join(dir,'runtime.json');
   const st=(await import('node:fs')).lstatSync(socket);
   writeFileSync(file,JSON.stringify({phase:'ready',socket,socket_dev:st.dev,socket_ino:st.ino,processes:[],controller:{pid:process.pid,ticks:(await import('node:fs')).readFileSync(`/proc/${process.pid}/stat`,'utf8').split(') ').slice(1).join(') ').trim().split(/\s+/)[19]},env:{PATH:'/usr/bin',HOME:dir,PRIME_AGENT_DAEMON_SOCKET:socket}}));
   const value=primeRuntime({MADARCH_PRIME_RUNTIME_READY:file,MADARCH_PRIME_PROVIDER:'provider-group',MADARCH_PRIME_MODEL:'model-x'} as NodeJS.ProcessEnv);
   expect(value).toEqual({socket,provider:'provider-group',model:'model-x',env:{PATH:'/usr/bin',HOME:dir,PRIME_AGENT_DAEMON_SOCKET:socket}});
  } finally { server.close(); rmSync(dir,{recursive:true,force:true}); }
 });
 test('refuses absent runtime configuration without falling back',()=>{
  expect(()=>primeRuntime({} as NodeJS.ProcessEnv)).toThrow('MADARCH_PRIME_RUNTIME_READY is missing');
 });
 test('names missing provider and model settings after a valid runtime',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'prime-runtime-missing-')); const socket=join(dir,'daemon.sock'); const server=createServer(); await new Promise<void>(resolve=>server.listen(socket,resolve));
  try { const fs=await import('node:fs'); const st=fs.lstatSync(socket); const fields=fs.readFileSync(`/proc/${process.pid}/stat`,'utf8').split(') ').slice(1).join(') ').trim().split(/\s+/); const file=join(dir,'runtime.json'); writeFileSync(file,JSON.stringify({phase:'ready',socket,socket_dev:st.dev,socket_ino:st.ino,processes:[],controller:{pid:process.pid,ticks:fields[19]},env:{PATH:'/usr/bin'}}));
   expect(()=>primeRuntime({MADARCH_PRIME_RUNTIME_READY:file,MADARCH_PRIME_MODEL:'model'} as NodeJS.ProcessEnv)).toThrow('MADARCH_PRIME_PROVIDER is missing');
   expect(()=>primeRuntime({MADARCH_PRIME_RUNTIME_READY:file,MADARCH_PRIME_PROVIDER:'provider'} as NodeJS.ProcessEnv)).toThrow('MADARCH_PRIME_MODEL is missing');
  } finally {server.close();rmSync(dir,{recursive:true,force:true});}
 });
});


describe('prime-agent runtime refusals', () => {
  async function readyFile(dir: string, changes: Record<string, unknown> = {}): Promise<string> {
    const socket = join(dir, 'daemon.sock');
    const server = createServer();
    await new Promise<void>((resolve) => server.listen(socket, resolve));
    const fs = await import('node:fs');
    const stat = fs.lstatSync(socket);
    const fields = fs.readFileSync(`/proc/${process.pid}/stat`, 'utf8').split(') ').slice(1).join(') ').trim().split(/\s+/);
    const file = join(dir, 'runtime-ready.json');
    writeFileSync(file, JSON.stringify({
      phase: 'ready', socket, socket_dev: stat.dev, socket_ino: stat.ino,
      processes: [], controller: { pid: process.pid, ticks: fields[19] }, env: { PATH: '/usr/bin' }, ...changes,
    }));
    server.unref();
    return file;
  }

  function expectRuntimeRefusal(file: string, provider = 'provider', model = 'model'): Error {
    try { primeRuntime({ MADARCH_PRIME_RUNTIME_READY: file, MADARCH_PRIME_PROVIDER: provider, MADARCH_PRIME_MODEL: model } as NodeJS.ProcessEnv); }
    catch (error) { return error as Error; }
    throw new Error('expected primeRuntime refusal');
  }

  test('names the full path of an unreadable runtime file', () => {
    const file = join(tmpdir(), 'missing-prime-runtime-ready.json');
    expect(expectRuntimeRefusal(file).message).toContain(file);
  });

  test('names the full path of a runtime that is not ready', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-phase-'));
    try { const file = await readyFile(dir, { phase: 'starting' }); expect(expectRuntimeRefusal(file).message).toContain(file); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names the runtime file and missing socket', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-socket-'));
    try { const file = await readyFile(dir); const value = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8')); (await import('node:fs')).unlinkSync(value.socket); const error = expectRuntimeRefusal(file); expect(error.message).toContain(file); expect(error.message).toContain(value.socket); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names the runtime file and changed socket identity', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-socket-changed-'));
    try { const file = await readyFile(dir); const value = JSON.parse((await import('node:fs')).readFileSync(file, 'utf8')); value.socket_ino += 1; writeFileSync(file, JSON.stringify(value)); const error = expectRuntimeRefusal(file); expect(error.message).toContain(file); expect(error.message).toContain(value.socket); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names the runtime file and gone daemon process', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-process-'));
    try { const file = await readyFile(dir, { controller: { pid: 2147483647, ticks: '1' } }); expect(expectRuntimeRefusal(file).message).toContain(file); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names the runtime file when env is not an object of strings', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-env-'));
    try { const file = await readyFile(dir, { env: { PATH: 42 } }); expect(expectRuntimeRefusal(file).message).toContain(file); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names missing provider setting', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-provider-'));
    try { const file = await readyFile(dir); expect(expectRuntimeRefusal(file, '', 'model').message).toContain('MADARCH_PRIME_PROVIDER'); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('names missing model setting', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'prime-runtime-model-'));
    try { const file = await readyFile(dir); expect(expectRuntimeRefusal(file, 'provider', '').message).toContain('MADARCH_PRIME_MODEL'); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
