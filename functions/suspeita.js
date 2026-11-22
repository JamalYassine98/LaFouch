// Reserva suspeita (aprovado pelo dono 22/11/2026 15:19–15:20; nenhuma tela muda nesta parte — regra 6b).
// O site NÃO limita peças por pedido (quem quer 5+ iguais compra normal). No lugar, a nuvem marca a reserva que parece abuso
// e o TITAN avisa o dono, que cancela e solta as peças pelo app (como no comprovante falso). Gatilhos aprovados:
//   · iguais: o pedido segura GATILHO.iguais ou mais unidades da mesma peça (ref + cor) sem pagar;
//   · rede:   a mesma rede tem GATILHO.rede ou mais pedidos com reserva aberta (não paga, não cancelada) na mesma hora.
// Parte 1: só grava em suspeitas/<pedido> (o app lê); a notificação entra quando o app já souber mostrar o aviso.
// Regra pura: db = { anota(redeId, pid, refs, agora) -> [{pid, refs}] da rede na última hora, aberta({pid, refs}) -> bool
//   (reserva válida e não paga/cancelada), grava(pid, o) }
'use strict';

const HORA = 36e5;
const GATILHO = { iguais: 5, rede: 3 };

// itens [{ref, cor, q}] → a maior quantidade de uma mesma peça (ref + cor)
function maiorIgual(itens) {
  const soma = {};
  for (const i of itens || []) { const k = String(i.ref || '') + '~' + String(i.cor || '').trim().toLowerCase(); soma[k] = (soma[k] || 0) + (Math.round(+i.q) || 0); }
  return Math.max(0, ...Object.values(soma));
}

// depois de uma reserva feita: confere e, se for o caso, grava. Nunca derruba a reserva (quem chama ignora erro).
async function confere(db, pid, itens, redeId, agora, exp) {
  const motivos = [];
  const iguais = maiorIgual(itens);
  if (iguais >= GATILHO.iguais) motivos.push('iguais');
  const refs = Array.from(new Set((itens || []).map((i) => String(i.ref || '')).filter(Boolean)));
  const daRede = await db.anota(redeId, pid, refs, agora);
  const abertas = [];
  for (const x of daRede) if (x.pid === pid || (await db.aberta(x))) abertas.push(x.pid);
  if (abertas.length >= GATILHO.rede) motivos.push('rede');
  if (!motivos.length) return null;
  const o = {
    ts: agora, pedido: pid, motivos, iguais, abertas: abertas.slice(0, 20), exp: +exp || 0,
    itens: (itens || []).slice(0, 30).map((i) => ({ ref: String(i.ref || ''), cor: String(i.cor || ''), q: Math.round(+i.q) || 0 })),
  };
  await db.grava(pid, o);
  return o;
}

module.exports = { HORA, GATILHO, maiorIgual, confere };
