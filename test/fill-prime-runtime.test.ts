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
