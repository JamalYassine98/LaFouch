// Erro esperado das regras da nuvem, num lugar só (20/11/2026, regra 12: antes cada módulo tinha a sua cópia).
// motivo = a palavra que o site/app lê · status = código HTTP da resposta (400 se não disser) · extra = campos a mais na resposta.
'use strict';

class Falha extends Error {
  constructor(motivo, status, extra) {
    super(motivo);
    this.motivo = motivo;
    this.status = status || 400;
    this.extra = extra || {};
  }
}

module.exports = { Falha };
