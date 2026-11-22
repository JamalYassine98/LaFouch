// Limites por rede (aprovado pelo dono 22/11/2026 15:01; nenhuma tela muda — regra 6b). UM lugar só para:
//  · o que é "a mesma rede": IPv4 inteiro; IPv6 pelos 64 primeiros bits (uma casa/um celular tem um bloco /64 inteiro e
//    troca o fim do endereço à vontade — contar o endereço inteiro deixava escapar);
//  · a REDE DA LOJA: o app do dono, aberto na loja, avisa "esta é a rede da loja" (reserva acao 'loja'); por 12 horas essa rede
//    não tem limite por rede — na Black Friday todos os clientes no Wi-Fi da loja saem pelo mesmo endereço;
//  · os números (por hora): crescer não esbarra neles, porque cada cliente em casa/4G é outra rede.
// Regra pura: db = { get(id) -> {ate}|null, set(id, o) }  (lojaRede/<id>, só a nuvem lê e grava)
'use strict';
const crypto = require('crypto');

const HORA = 36e5;
const LOJA_MS = 12 * HORA;
// por rede, por hora (o pedido também por telefone: tel)
const LIMITE = { reserva: 30, pedido: 30, tel: 5, comp: 10, cancel: 20, avise: 10 };

// endereço → chave da rede ('' se não veio endereço)
function chave(ip) {
  let s = String(ip || '').split(',')[0].trim().toLowerCase(); // x-forwarded-for: o primeiro é o cliente
  if (!s) return '';
  s = s.replace(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/, '$1'); // IPv4 escrito como IPv6
  if (s.indexOf(':') < 0) return s;
  s = s.replace(/%.*$/, '');
  const [a, b] = s.split('::');
  const ini = a ? a.split(':') : [], fim = b !== undefined && b ? b.split(':') : [];
  const meio = b !== undefined ? Array(Math.max(0, 8 - ini.length - fim.length)).fill('0') : [];
  const g = ini.concat(meio, fim).slice(0, 4).map((x) => (parseInt(x, 16) || 0).toString(16));
  while (g.length < 4) g.push('0');
  return g.join(':') + '::/64';
}

const id = (k) => crypto.createHash('sha256').update('lf-rede|' + k).digest('hex').slice(0, 40);

// { k: chave da rede, loja: true se é a rede da loja agora }
async function de(db, ip, agora) {
  const k = chave(ip);
  if (!k) return { k: '?', loja: false };
  let loja = false;
  try { const o = await db.get(id(k)); loja = !!o && +o.ate > agora; } catch (e) { loja = false; }
  return { k, loja };
}

// o app do dono, aberto na loja: marca a rede de onde ele chama
async function marcaLoja(db, ip, agora) {
  const k = chave(ip);
  if (!k) return { ok: false, motivo: 'rede' };
  await db.set(id(k), { ts: agora, ate: agora + LOJA_MS });
  return { ok: true, ate: agora + LOJA_MS };
}

module.exports = { HORA, LOJA_MS, LIMITE, chave, de, marcaLoja };
