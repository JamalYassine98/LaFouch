// Prova do CUPOM na nuvem de verdade do PROJETO DE TESTE (28/11/2026, NUVEM; dono 18:17: "Sim" — pacote do cupom só no lafouch-teste).
// Faz o que o app (dono) e o site (cliente logada) fazem e TENTA BURLAR: cartão da loja sem e-mail, abaixo de G$ 150.000, por quem não é
// o dono, dois cartões para a mesma cliente (inclusive 5 toques ao mesmo tempo), usar antes do dia 7, usar sem conta, com outro e-mail,
// com e-mail não confirmado, usar duas vezes ao mesmo tempo, desfazer a venda; e confere que o e-mail do dia 7 NÃO sai (vira saidas/).
// No fim APAGA tudo o que criou. Roda só no GitHub (workflow teste-cupom.yml), com a conta de publicação DO TESTE, sem chave guardada.
'use strict';
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const admin = require('firebase-admin');

const PROJ = 'lafouch-teste'; // fixo: esta prova nunca roda na loja real
const B = 'https://southamerica-east1-' + PROJ + '.cloudfunctions.net';
process.env.GCLOUD_PROJECT = PROJ;
const P = require('../../functions/ambiente.js'); // dono e chave pública do TESTE vêm do mesmo lugar que as funções usam
if (!P.TESTE) throw new Error('não é o projeto de teste');
// a conta entra pelo GitHub (Workload Identity): o firebase-admin não lê esse tipo de credencial, então recebe só o token de acesso
// (google-auth-library lê); o Firestore usa o cliente do Google direto, como tools/teste-compra/compra.js
const { GoogleAuth } = require('google-auth-library');
const { Firestore } = require('@google-cloud/firestore');
const gauth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
admin.initializeApp({ projectId: PROJ, serviceAccountId: 'github-publica@' + PROJ + '.iam.gserviceaccount.com',
  credential: { getAccessToken: async () => ({ access_token: await gauth.getAccessToken(), expires_in: 1800 }) } });
const db = new Firestore({ projectId: PROJ }), auth = admin.auth();

let falhas = 0;
const ok = (c, t, extra) => { console.log((c ? '  ok     ' : '  FALHA  ') + t + (extra ? '  ' + JSON.stringify(extra).slice(0, 200) : '')); if (!c) falhas++; return c; };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const post = async (body, tok) => {
  const r = await fetch(B + '/cupom', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json', Origin: 'https://lafouch.com' }, tok ? { Authorization: 'Bearer ' + tok } : {}), body: JSON.stringify(body) });
  let j = {}; try { j = await r.json(); } catch (e) {}
  return Object.assign({ http: r.status }, j);
};
async function entra(custom) {
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + P.CHAVE_PUBLICA, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: custom, returnSecureToken: true }) });
  const j = await r.json(); if (!j.idToken) throw new Error('login: ' + JSON.stringify(j).slice(0, 200)); return j.idToken;
}

(async () => {
  const inicio = Date.now(), rnd = crypto.randomBytes(3).toString('hex');
  const em = (n) => 'prova-cupom-' + n + '-' + rnd + '@example.com';
  const criados = { uids: [], vendas: [] };
  const mes = new Date(inicio).getUTCFullYear() + '-' + String(new Date(inicio).getUTCMonth() + 1).padStart(2, '0');
  const mesAntes = (await db.doc('cupomMes/' + mes).get()).data() || null; // o teto do mês volta ao que era
  const conta = async (n, verificado) => { const u = await auth.createUser({ email: em(n), emailVerified: verificado }); criados.uids.push(u.uid); return entra(await auth.createCustomToken(u.uid)); };
  try {
    const D = await entra(await auth.createCustomToken(P.DONO_UID));
    const A = await conta('a', true), Bt = await conta('b', true), C = await conta('c', false);
    const venda = (n) => { const v = 'pv-' + rnd + '-' + n; criados.vendas.push(v); return v; };
    console.log('== Cartão da loja (Próxima compra): só o dono, com e-mail, venda de G$ 150.000 ou mais');
    ok((await post({ acao: 'emitir', tipo: 'px', venda: venda(0), total: 200000 }, D)).motivo === 'email', 'sem e-mail → recusado');
    ok((await post({ acao: 'emitir', tipo: 'px', email: em('a'), venda: venda(0), total: 149999 }, D)).motivo === 'min', 'G$ 149.999 → recusado (mínimo 150.000)');
    ok((await post({ acao: 'emitir', tipo: 'px', email: em('a'), venda: venda(0), total: 200000 }, A)).http === 403, 'cliente tentando emitir → 403');
    ok((await post({ acao: 'emitir', tipo: 'px', email: em('a'), venda: venda(0), total: 200000 })).http === 403, 'sem login → 403');
    const v1 = venda(1);
    const cinco = await Promise.all([1, 2, 3, 4, 5].map(() => post({ acao: 'emitir', tipo: 'px', email: em('a'), venda: v1, total: 150000 }, D)));
    const cods = [...new Set(cinco.filter((r) => r.ok).map((r) => r.cod))];
    ok(cods.length === 1, '5 toques ao mesmo tempo na mesma venda → UM cartão só', cinco.map((r) => r.cod || r.motivo));
    const cod = cods[0];
    const docs = (await db.collection('cupons').where('email', '==', em('a')).get()).docs;
    ok(docs.length === 1, 'no banco: um cartão para a cliente', docs.length);
    const outras = await Promise.all([2, 3, 4, 5, 6].map((n) => post({ acao: 'emitir', tipo: 'px', email: em('a'), venda: venda(n), total: 300000 }, D)));
    ok(outras.every((r) => r.motivo === 'tem'), 'outras 5 vendas ao mesmo tempo, mesma cliente → todas recusadas (um por vez)', outras.map((r) => r.motivo));
    ok((await post({ acao: 'emitir', tipo: 'px', email: em('A').toUpperCase(), venda: venda(7), total: 300000 }, D)).motivo === 'tem', 'mesmo e-mail em MAIÚSCULAS → recusado (é a mesma cliente)');
    const c0 = (await db.doc('cupons/' + cod).get()).data();
    ok(c0.pct === 10 && c0.max === 1 && Math.abs(c0.ini - (inicio + 7 * 864e5)) < 120000 && c0.fim - c0.ini === 90 * 864e5, '10%, uma compra, começa no dia 7 e vale 90 dias', { pct: c0.pct, max: c0.max });
    console.log('== No site: só a dona, logada com o mesmo e-mail confirmado');
    ok((await post({ acao: 'ver', cod }, A)).motivo === 'cedo', 'antes do dia 7 → "cedo", até para a dona');
    await db.doc('cupons/' + cod).update({ ini: Date.now() - 60000 }); // simula o dia 7
    ok((await post({ acao: 'ver', cod })).motivo === 'conta', 'sem login → pede a conta');
    ok((await post({ acao: 'ver', cod }, Bt)).motivo === 'outro', 'outra cliente logada → recusado');
    ok((await post({ acao: 'ver', cod, email: em('a') }, Bt)).motivo === 'outro', 'outra cliente digitando o e-mail da dona → recusado (vale só o login)');
    ok((await post({ acao: 'ver', cod }, A)).ok === true, 'a dona logada → vale');
    const usos = await Promise.all([1, 2, 3, 4, 5].map((n) => post({ acao: 'usar', cod, pid: 'pp-' + rnd + '-' + n, total: 200000, desc: 20000 }, A)));
    ok(usos.filter((r) => r.ok).length === 1, 'usar 5 vezes ao mesmo tempo → só 1 uso', usos.map((r) => r.ok || r.motivo));
    ok((await post({ acao: 'usar', cod, pid: 'pp-' + rnd + '-9', total: 200000, desc: 20000 }, A)).motivo === 'usado', 'usar de novo depois → "usado"');
    console.log('== E-mail do dia 7: no teste NÃO sai (fica em saidas/)');
    await db.doc('cupons/' + cod).update({ aviso: 'pend' });
    execFileSync('gcloud', ['scheduler', 'jobs', 'run', 'firebase-schedule-presentes-southamerica-east1', '--location=southamerica-east1', '--project=' + PROJ], { stdio: 'inherit' });
    let saiu = null;
    for (let i = 0; i < 30 && !saiu; i++) { await espera(4000); saiu = (await db.collection('saidas').where('ts', '>=', inicio).get()).docs.map((d) => d.data()).find((s) => s.tipo === 'email' && s.resumo && s.resumo.para === em('a')); }
    ok(!!saiu, 'o diário "enviou" o e-mail do cartão → registrado em saidas/, nada saiu para fora', saiu && saiu.resumo);
    ok((await db.doc('cupons/' + cod).get()).data().aviso === 'env', 'marcado como enviado (não manda duas vezes)');
    console.log('== Venda desfeita');
    ok((await post({ acao: 'lojaDesfaz', venda: v1 }, D)).usado === true, 'cartão já usado → não mexe e avisa o dono');
    const w1 = venda('w1'), e1 = await post({ acao: 'emitir', tipo: 'px', email: em('b'), venda: w1, total: 150000 }, D);
    ok(e1.ok, 'cartão novo para outra cliente', e1);
    ok((await post({ acao: 'lojaDesfaz', venda: w1 }, D)).cancelado === true, 'venda desfeita antes do uso → cartão cancelado');
    await db.doc('cupons/' + e1.cod).update({ ini: Date.now() - 60000 });
    ok((await post({ acao: 'ver', cod: e1.cod }, Bt)).motivo === 'cancelado', 'cartão cancelado → não vale nem para a dona');
    ok((await post({ acao: 'emitir', tipo: 'px', email: em('b'), venda: venda('w2'), total: 150000 }, D)).ok === true, 'depois do cancelado, a próxima venda pode gerar cartão');
    console.log('== Cartão VIP: só com e-mail; vale só com o e-mail confirmado');
    ok((await post({ acao: 'emitir', tipo: 'vip', pct: 20 }, D)).motivo === 'email', 'VIP sem e-mail → recusado');
    const vip = await post({ acao: 'emitir', tipo: 'vip', pct: 20, email: em('c') }, D);
    ok(vip.ok && vip.enviou === true, 'VIP com e-mail → criado (e-mail "enviado" = registrado em saidas/)', vip);
    ok((await post({ acao: 'ver', cod: vip.cod }, C)).motivo === 'conta', 'login com e-mail NÃO confirmado → pede a conta (não vale)');
    ok((await post({ acao: 'ver', cod: vip.cod }, A)).motivo === 'outro', 'outra cliente → recusado');
  } catch (e) {
    ok(false, 'erro inesperado: ' + (e && e.stack || e));
  } finally {
    console.log('== Limpeza (só o que esta prova criou)');
    let n = 0;
    const meus = (await db.collection('cupons').where('ts', '>=', inicio - 1000).get()).docs.filter((d) => String(d.data().email || '').indexOf(rnd) >= 0 || String(d.data().de || '').indexOf(rnd) >= 0);
    const cods = new Set(meus.map((d) => d.id));
    for (const d of meus) { await d.ref.delete(); n++; }
    for (const col of ['cupomAvisos', 'saidas']) for (const d of (await db.collection(col).where('ts', '>=', inicio - 1000).get()).docs) {
      const x = d.data(); if (cods.has(x.cod) || JSON.stringify(x).indexOf(rnd) >= 0) { await d.ref.delete(); n++; }
    }
    for (const d of (await db.collection('cupomVez').get()).docs) if (String(d.data().venda || '').indexOf(rnd) >= 0 || cods.has(d.data().cod)) { await d.ref.delete(); n++; }
    if (mesAntes) await db.doc('cupomMes/' + mes).set(mesAntes); else await db.doc('cupomMes/' + mes).delete();
    for (const u of criados.uids) { await auth.deleteUser(u).catch(() => {}); n++; }
    console.log('  apagados: ' + n);
    console.log(falhas ? falhas + ' FALHA(S)' : 'cupom no teste: tudo ok');
    process.exit(falhas ? 1 : 0);
  }
})();
