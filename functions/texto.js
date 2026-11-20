// Texto que chega do site, num lugar só (20/11/2026, regra 12c: antes cada módulo tinha a sua cópia destas regras).
'use strict';

// e-mail válido (o mesmo em todas as portas)
const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
// uma linha: sem caracteres de controle nem < >, espaços juntados, cortada em n
const linha = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
// um bloco (mensagem): mantém as quebras de linha, tira o resto igual à linha
const bloco = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u0008\u000b-\u001f<>]/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, n);

module.exports = { EMAIL_OK, linha, bloco };
