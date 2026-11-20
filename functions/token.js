// S1 (19/11/2026, aprovado e "implementar" do dono): token de entrega em reservasTok/<pedido> (só o dono e o servidor leem).
// A cliente pede o token à função mostrando o telefone do pedido.
// Regra pura (sem Firebase) para dar para testar: db = { get(path) -> objeto|null, set(path, dados) (merge) }.
'use strict';

class Falha extends Error {
  constructor(motivo) {
    super(motivo);
    this.motivo = motivo;
  }
}
const ERROS_MAX = 5; // telefone errado 5 vezes → espera
const TRAVA_MS = 60 * 60 * 1000; // 1 hora
const so = (t) => String(t || '').replace(/\D/g, '');
// confere os 6 últimos dígitos (o código do país pode vir ou não)
function mesmoTel(doPedido, informado) {
  const a = so(doPedido), b = so(informado);
  return a.length >= 6 && b.length >= 6 && a.slice(-6) === b.slice(-6);
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
