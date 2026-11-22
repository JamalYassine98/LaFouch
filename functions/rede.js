// Limites por rede (aprovado pelo dono 22/11/2026 15:01; "rede da loja" retirada pelo dono às 15:10 — complicado demais;
// nenhuma tela muda — regra 6b). UM lugar só para:
//  · o que é "a mesma rede": IPv4 inteiro; IPv6 pelos 64 primeiros bits (uma casa/um celular tem um bloco /64 inteiro e
//    troca o fim do endereço à vontade — contar o endereço inteiro deixava escapar);
//  · os números (por hora): crescer não esbarra neles, porque cada cliente em casa/4G é outra rede. 30 por rede dá folga
//    para a Black Friday no Wi-Fi da loja (todos saem pelo mesmo endereço).
'use strict';

const HORA = 36e5;
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

module.exports = { HORA, LIMITE, chave };
