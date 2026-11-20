// S5 + S7 (20/11/2026): inscrição nas novidades só vale depois de confirmar o e-mail — inclusive as TENTATIVAS DE BURLAR.
'use strict';
const I = require('./inscricao');
const { Falha } = require('./falha');
let ok = 0; const falhas = [];
const t = (n, c) => { if (c) { ok++; console.log('  ok  ' + n); } else { falhas.push(n); console.log('  FALHA  ' + n); } };
const base = () => {
  const ins = {}, enviados = [];
  return { ins, enviados,
    db: { get: async (id) => ins[id] ? Object.assign({}, ins[id]) : null, set: async (id, o) => { ins[id] = Object.assign({}, ins[id] || {}, o); },
      recentes: async (k, desde) => Object.values(ins).filter((o) => o.ipk === k && o.envTs >= desde).length },
    envia: async (m) => { enviados.push(m); } };
};
const linkDe = (m) => { const x = /confirmar=([a-f0-9]{40})&amp;t=([a-f0-9]{32})|confirmar=([a-f0-9]{40})&t=([a-f0-9]{32})/.exec(m.html); return x ? { id: x[1] || x[3], t: x[2] || x[4] } : null; };
const erro = async (p) => { try { await p; return null; } catch (e) { return e; } };
const URL = 'https://exemplo.test/novidades', T0 = Date.UTC(2026, 10, 20, 15);

(async () => {
  let B = base();
  let r = await I.inscrever(B.db, B.envia, { email: ' Ana@Exemplo.com ', lang: 'es' }, T0, 'rede1', URL);
  const o = Object.values(B.ins)[0];
  t('inscrever: manda 1 e-mail "Confirme" e ainda NÃO entra na lista', r.confirmar && B.enviados.length === 1 && B.enviados[0].to === 'ana@exemplo.com' && !I.vale(o));
  t('o código do link não fica guardado em texto (só o resumo)', o.tok && B.enviados[0].html.indexOf(o.tok) < 0);
  const L = linkDe(B.enviados[0]);
  t('o link leva o id da inscrição e o código', !!L && L.id === I.idDe('ana@exemplo.com'));
  t('BURLA: código errado → recusado', (await erro(I.confirmar(B.db, L.id, 'f'.repeat(32), T0 + 60e3))) instanceof Falha && !I.vale(B.ins[L.id]));
  t('BURLA: link com formato estranho → recusado', (await erro(I.confirmar(B.db, '../x', L.t, T0))) instanceof Falha);
  r = await I.confirmar(B.db, L.id, L.t, T0 + 60e3);
  t('confirmar com o link certo → entra na lista', r.ok && I.vale(B.ins[L.id]) && !B.ins[L.id].tok);
  r = await I.confirmar(B.db, L.id, L.t, T0 + 120e3);
  t('confirmar 2 vezes = igual a 1', r.ok && r.ja);
  r = await I.inscrever(B.db, B.envia, { email: 'ana@exemplo.com' }, T0 + 3600e3, 'rede1', URL);
  t('já confirmada: inscrever de novo não manda outro e-mail', r.conf && B.enviados.length === 1);
  B.ins[L.id].sair = true;
  t('"Não quero mais receber" continua: quem saiu não recebe o tema', !I.vale(B.ins[L.id]));

  B = base();
  await I.inscrever(B.db, B.envia, { email: 'outra@exemplo.com' }, T0, 'rede2', URL);
  await I.inscrever(B.db, B.envia, { email: 'outra@exemplo.com' }, T0 + 60e3, 'rede2', URL);
  t('BURLA: inscrever o e-mail de outra pessoa várias vezes → ela recebe só 1 "Confirme" a cada 10 min, e nada mais', B.enviados.length === 1 && !I.vale(Object.values(B.ins)[0]));
  for (let i = 0; i < 4; i++) await I.inscrever(B.db, B.envia, { email: 'p' + i + '@exemplo.com' }, T0 + i, 'rede2', URL);
  const e6 = await erro(I.inscrever(B.db, B.envia, { email: 'p9@exemplo.com' }, T0 + 9, 'rede2', URL));
  t('6ª inscrição da mesma rede na mesma hora → espera', e6 instanceof Falha && e6.motivo === 'espera' && e6.status === 429);
  t('outra rede não é afetada', (await I.inscrever(B.db, B.envia, { email: 'q@exemplo.com' }, T0, 'rede3', URL)).confirmar);

  B = base();
  await I.inscrever(B.db, B.envia, { email: 'tarde@exemplo.com' }, T0, '', URL);
  const L2 = linkDe(B.enviados[0]);
  t('link de mais de 7 dias → recusado', (await erro(I.confirmar(B.db, L2.id, L2.t, T0 + I.VALE + 1))) instanceof Falha);
  t('e-mail inválido → recusado', (await erro(I.inscrever(B.db, B.envia, { email: 'nao-e-email' }, T0, '', URL))) instanceof Falha);
  t('sem a chave de e-mail → avisa, não grava inscrição sem "Confirme"', (await erro(I.inscrever(base().db, null, { email: 'x@exemplo.com' }, T0, '', URL))) instanceof Falha);
  // limpeza diária: inscrição não confirmada some depois de 7 dias; a confirmada fica
  const Lp = require('./limpeza'), C = { inscricoes: { a: { ts: T0, conf: false }, b: { ts: T0, conf: true }, c: { ts: T0 + 8 * 864e5 } } };
  const ldb = { velhos: async (c, x) => Object.keys(C[c] || {}).filter((k) => C[c][k].ts < x).map((k) => Object.assign({ id: k }, C[c][k])), muda: async () => {}, apaga: async (c, id) => { delete C[c][id]; } };
  await Lp.limpa(ldb, T0 + 8 * 864e5);
  t('limpeza: some a não confirmada de 7+ dias; ficam a confirmada e a recente', !C.inscricoes.a && C.inscricoes.b && C.inscricoes.c);
  console.log(falhas.length ? `inscrição: ${falhas.length} falha(s)` : `inscrição: ${ok} testes ok`);
  process.exit(falhas.length ? 1 : 0);
})();
