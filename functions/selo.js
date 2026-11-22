// App Check (20/11/2026, dono: "implementar"): as portas públicas da nuvem conferem o selo do reCAPTCHA (cabeçalho X-Firebase-AppCheck).
// Um lugar só (regra 12c): MODO decide para todas as portas. 'anotar' = só conta (com selo / sem / inválido) por dia e por porta;
// 'exigir' = recusa quem vem sem selo válido. O app do dono não passa por aqui (entra com o login do dono).
// Conferir o selo é local (assinatura), não gasta conferência do reCAPTCHA.
'use strict';

const MODO = 'anotar';

const dia = (agora) => new Date(agora - 3 * 3600 * 1000).toISOString().slice(0, 10); // dia do Paraguai (UTC-3)

// 22/11: de onde veio (cabeçalho Origin, que o navegador sempre manda nestas chamadas): 'site' = lafouch.com, 'local' = teste no
// computador, 'robo' = sem Origin ou de outro endereço (nossas sondas e o teste de compra, ou robôs de fora). Assim a contagem mostra
// quantos CLIENTES do site chegam sem selo, sem misturar com os nossos próprios testes. site = lista de endereços aceitos (CORS_SITE).
function origem(req, site) {
  const o = String((req.get && req.get('Origin')) || '');
  if (!o || !(site || []).includes(o)) return 'robo';
  return /^http:\/\/localhost(:|$)/.test(o) ? 'local' : 'site';
}

// verifica(token) -> resolve se válido, rejeita se não. conta(diaId, campo) soma 1. Campo = porta_estado_origem (ex.: reserva_sem_site).
async function confere(req, porta, agora, verifica, conta, site) {
  const tok = String((req.get && req.get('X-Firebase-AppCheck')) || '');
  let estado = 'sem';
  if (tok) {
    try { await verifica(tok); estado = 'com'; } catch (e) { estado = 'ruim'; }
  }
  try { await conta(dia(agora), porta.replace(/[^a-z0-9]/gi, '') + '_' + estado + '_' + origem(req, site)); } catch (e) {}
  return { estado, passa: MODO !== 'exigir' || estado === 'com' };
}

module.exports = { MODO, confere, dia, origem };
