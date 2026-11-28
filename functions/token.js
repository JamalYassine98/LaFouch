// S1 (19/11/2026, aprovado e "implementar" do dono): token de entrega em reservasTok/<pedido> (só o dono e o servidor leem).
// A cliente pede o token à função mostrando o telefone do pedido.
// Regra pura (sem Firebase) para dar para testar: db = { get(path) -> objeto|null, set(path, dados) (merge) }.
'use strict';

const { Falha } = require('./falha');
const ERROS_MAX = 5; // telefone errado 5 vezes → espera
const TRAVA_MS = 60 * 60 * 1000; // 1 hora
// 24/11: confere o número INTEIRO, com o país (antes: os 6 últimos dígitos). A regra mora em fone.js.
const { fone } = require('./fone');
function mesmoTel(doPedido, informado) {
  const a = fone(doPedido), b = fone(informado);
  return !!a && a === b;
}
const pidOk = (pid) => /^[A-Za-z0-9_-]{4,40}$/.test(String(pid || ''));

async function pedir(db, agora, pid, tel) {
  if (!pidOk(pid)) throw new Falha('pedido');
  const priv = (await db.get('reservasTok/' + pid)) || {};
  if (+priv.trava > agora) throw new Falha('espera');
  const ped = await db.get('pedidos/' + pid);
  if (!ped || !mesmoTel(ped.tel, tel)) {
    const erros = (+priv.erros || 0) + 1;
    await db.set('reservasTok/' + pid, erros >= ERROS_MAX ? { erros: 0, trava: agora + TRAVA_MS } : { erros });
    throw new Falha('telefone');
  }
  if (priv.erros) await db.set('reservasTok/' + pid, { erros: 0 });
  return { ok: true, tok: priv.tok || null };
}

module.exports = { Falha, pedir, mesmoTel, ERROS_MAX, TRAVA_MS };
