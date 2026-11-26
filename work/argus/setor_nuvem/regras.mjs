// ARGUS · setor NUVEM · as REGRAS do banco no emulador do Firebase (o Firestore de verdade, só que vazio e local).
// Para cada coleção da planta da nuvem (planta_nuvem.json) e cada pessoa — sem login, cliente, outra cliente, dono, dono falso
// (uid certo e e-mail errado; e-mail certo e uid errado) — tenta ler um, listar, criar, mudar e apagar, e confere com a planta.
// Fecha por padrão: qualquer erro do emulador ou resposta inesperada é FALHA, nunca "ok".
// Também prova a si mesmo: cópias do firestore.rules com um estrago de propósito têm de dar falha.
// Uso (dentro de "firebase emulators:exec --only firestore"):  node regras.mjs <firestore.rules> <saida.json>
import fs from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const [, , ARQ_REGRAS, SAIDA] = process.argv;
const PLANTA = JSON.parse(fs.readFileSync(new URL('./planta_nuvem.json', import.meta.url)));
const DONO = PLANTA.dono;
const CLI = 'argusCliente1', OUTRA = 'argusCliente2';
const PESSOAS = {
  'sem login': null,
  'cliente': { uid: CLI, email: 'cliente@exemplo.com' },
  'outra cliente': { uid: OUTRA, email: 'outra@exemplo.com' },
  'dono': { uid: DONO.uid, email: DONO.email },
  'dono falso (e-mail errado)': { uid: DONO.uid, email: 'golpe@exemplo.com' },
  'dono falso (uid errado)': { uid: 'argusGolpe', email: DONO.email },
};
const ACOES = ['get', 'list', 'create', 'update', 'delete'];

// quem a planta deixa: 'todos' | 'dono' | 'dona_do_doc' (o documento testado da cliente tem o nome = uid dela)
function pode(regra, acao, pessoa, idDoc) {
  if (regra === 'fechada') return false;
  const q = regra[acao] || [];
  if (q.includes('todos')) return true;
  if (!pessoa) return false;
  if (q.includes('dono') && pessoa.uid === DONO.uid && pessoa.email === DONO.email) return true;
  if (q.includes('dona_do_doc') && pessoa.uid === idDoc) return true;
  return false;
}
function tenta(db, col, id, acao) {
  const r = doc(db, col, id);
  if (acao === 'get') return getDoc(r);
  if (acao === 'list') return getDocs(collection(db, col));
  if (acao === 'create') return setDoc(doc(db, col, id + 'novo'), { argus: 1 });
  if (acao === 'update') return updateDoc(r, { argus: 2 });
  return deleteDoc(r);
}

async function confere(regrasTexto, nome) {
  const env = await initializeTestEnvironment({ projectId: 'demo-argus-' + nome.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 20), firestore: { rules: regrasTexto } });
  const R = [];
  try {
    for (const [col, regra] of Object.entries(PLANTA.colecoes)) {
      // a cliente testa no documento dela (clientes/<uid>); as outras coleções num documento qualquer (posto de novo antes de cada tentativa)
      const id = col === 'clientes' ? CLI : 'argusDoc';
      for (const [quem, p] of Object.entries(PESSOAS)) {
        for (const acao of ACOES) {
          if (acao === 'create' && col === 'clientes') continue;   // criar = o próprio documento: conferido abaixo
          await env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), col, id), { argus: 0 }); });
          const db = p ? env.authenticatedContext(p.uid, { email: p.email, email_verified: true }).firestore() : env.unauthenticatedContext().firestore();
          const deve = pode(regra, acao, p, id);
          try { await (deve ? assertSucceeds : assertFails)(tenta(db, col, id, acao)); R.push([col, quem, acao, deve, true, '']); }
          catch (e) { R.push([col, quem, acao, deve, false, String(e && e.message || e).slice(0, 160)]); }
        }
      }
    }
    // a cliente cria o PRÓPRIO cadastro (até 30 campos); nunca o de outra; nunca com 31 campos
    const campos = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => ['c' + i, i]));
    const extra = [
      ['clientes', 'cliente', 'cria o próprio cadastro (30 campos)', true, (db) => setDoc(doc(db, 'clientes', CLI), campos(30))],
      ['clientes', 'cliente', 'cria o próprio cadastro com 31 campos', false, (db) => setDoc(doc(db, 'clientes', CLI), campos(31))],
      ['clientes', 'cliente', 'cria o cadastro de outra cliente', false, (db) => setDoc(doc(db, 'clientes', OUTRA), campos(3))],
      ['clientes', 'cliente', 'lista todas as clientes', false, (db) => getDocs(collection(db, 'clientes'))],
    ];
    for (const [col, quem, o_que, deve, f] of extra) {
      await env.clearFirestore();
      const p = PESSOAS[quem], db = env.authenticatedContext(p.uid, { email: p.email, email_verified: true }).firestore();
      try { await (deve ? assertSucceeds : assertFails)(f(db)); R.push([col, quem, o_que, deve, true, '']); }
      catch (e) { R.push([col, quem, o_que, deve, false, String(e && e.message || e).slice(0, 160)]); }
    }
  } finally { await env.cleanup(); }
  return R;
}

// estragos de propósito numa cópia das regras: cada um TEM de ser visto (senão o conferidor está cego)
const ESTRAGOS = [
  ['cupons abertos para todos', (t) => t.replace(/match \/databases\/\{database\}\/documents \{/, (m) => m + '\n    match /cupons/{d} { allow read: if true; }')],
  ['dono() sem conferir o e-mail', (t) => t.replace(/\n\s*&& request\.auth\.token\.email == '[^']+'/, '')],
  ['cliente lê o cadastro de qualquer uma', (t) => t.replace(/allow get: if \(request\.auth != null && request\.auth\.uid == uid\) \|\| dono\(\);/, 'allow get: if request.auth != null;')],
  ['site cria pedido direto no banco', (t) => t.replace(/match \/pedidos\/\{d\} \{/, (m) => m + '\n      allow create: if true;')],
];

const regras = fs.readFileSync(ARQ_REGRAS, 'utf8');
const out = { regras: await confere(regras, 'hoje'), estragos: [] };
for (const [nome, f] of ESTRAGOS) {
  const t = f(regras);
  if (t === regras) { out.estragos.push([nome, false, 'o estrago não coube nas regras de hoje (o texto mudou): refazer o estrago']); continue; }
  const r = await confere(t, nome);
  const vistos = r.filter((x) => !x[4]);
  out.estragos.push([nome, vistos.length > 0, vistos.length + ' resultado(s) fora da planta' + (vistos[0] ? ' · ex.: ' + vistos[0].slice(0, 3).join(' · ') : '')]);
}
fs.writeFileSync(SAIDA, JSON.stringify(out, null, 1));
const falhas = out.regras.filter((x) => !x[4]);
for (const x of falhas) console.log('FALHA  ' + x[0] + ' · ' + x[1] + ' · ' + x[2] + ' · a planta diz ' + (x[3] ? 'PODE' : 'NÃO PODE') + (x[5] ? ' · ' + x[5] : ''));
for (const [n, v, d] of out.estragos) console.log((v ? 'ok     ' : 'FALHA  ') + 'estrago visto: ' + n + ' · ' + d);
console.log('regras: ' + (out.regras.length - falhas.length) + '/' + out.regras.length + ' iguais à planta · estragos vistos: ' + out.estragos.filter((x) => x[1]).length + '/' + out.estragos.length);
process.exit(falhas.length || out.estragos.some((x) => !x[1]) ? 1 : 0);
