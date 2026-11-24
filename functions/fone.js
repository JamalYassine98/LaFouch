// Telefone completo, com o código do país (24/11/2026, dono: "correção de todo furo"). Um lugar só para toda a nuvem:
// cupons, compradores, VIP, limite de pedidos por telefone e o token de entrega comparam o número INTEIRO.
// Antes: 9 (ou 6) últimos dígitos — um número do Brasil e um do Paraguai podiam coincidir.
// Entra como vier (site manda +595…/+55…; o app pode mandar 0981…); sai só dígitos com o país (595981555111) ou '' se não der.
function fone(t) {
  let d = String(t || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2); // 00595… / 0055…
  if (d.length < 6 || /(\d)\1{6,}/.test(d)) return '';
  if (/^5959[6-9]\d{7}$/.test(d)) return d; // Paraguai, celular
  if (/^55[1-9][1-9]9?\d{8}$/.test(d)) return d; // Brasil (celular 9 + 8, ou fixo 8)
  if (/^54\d{10,11}$/.test(d)) return d; // Argentina
  if (/^09[6-9]\d{7}$/.test(d)) return '595' + d.slice(1); // Paraguai sem o país: 0981 555 111
  if (/^9[6-9]\d{7}$/.test(d)) return '595' + d; // Paraguai sem o 0: 981 555 111
  if (/^[1-9][1-9]9\d{8}$/.test(d)) return '55' + d; // Brasil sem o país: (45) 99999-9999
  if (d.length >= 10 && d.length <= 15) return d; // outro país, já com o código: compara inteiro
  return '';
}
module.exports = { fone };
