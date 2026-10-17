import test from 'node:test';
import assert from 'node:assert/strict';
import { api } from './api.js';
test('account requests include session cookies and the CSRF header', async () => {
  const original=globalThis.fetch; let sent;
  globalThis.fetch=async(url,options)=>{sent={url,options};return {ok:true,json:async()=>({name:'Farmer'})};};
  try { assert.equal((await api('/me')).name,'Farmer'); assert.equal(sent.url,'/api/me'); assert.equal(sent.options.credentials,'same-origin'); assert.equal(sent.options.headers['X-Crop-Client'],'web'); }
  finally { globalThis.fetch=original; }
});
test('expired sessions expose an actionable error', async () => {
  const original=globalThis.fetch;
  globalThis.fetch=async()=>({ok:false,status:401,json:async()=>({detail:'Your session expired. Please sign in again.'})});
  try { await assert.rejects(api('/history'), e=>e.status===401&&e.message.includes('sign in again')); }
  finally { globalThis.fetch=original; }
});
