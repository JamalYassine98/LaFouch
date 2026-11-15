// S309 — PROPOSTA DE LUXO (só esboço) para as telas de pagamento: mais ar, uma ação cheia por tela, o resto em link fino. Identidade mantida (serifa, vinho, cartão branco, fundo rosado).
(aberto) => {
  const o = document.getElementById('pkok'); if (!o) return 'sem tela';
  const st = document.createElement('style');
  st.textContent =
    '#pkok .lxP{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;margin:0;border:0;border-radius:16px;background:#1f8f4e!important;color:#fff!important;font-family:inherit;font-weight:600!important;font-size:16px!important;line-height:1.2;text-decoration:none!important;letter-spacing:.01em;padding:0 18px;box-shadow:0 10px 24px -14px rgba(31,143,78,.9);cursor:pointer;box-sizing:border-box}' +
    '#pkok .lxL{display:flex;align-items:center;justify-content:center;min-height:44px;margin:0 auto;padding:0 12px;background:none;border:0;box-shadow:none;color:#3a2c33!important;font-family:inherit;font-weight:500!important;font-size:15px!important;line-height:1.2;text-decoration:underline!important;text-decoration-thickness:1px;text-underline-offset:4px;cursor:pointer;width:auto}' +
    '#pkok .lxL.s{font-size:14px!important;color:#6e6067!important}#pkok .lxL.r{color:#a3352c!important}' +
    '#pkok .lxG{display:flex;flex-direction:column;align-items:center;gap:2px;flex:0 0 auto;margin-top:6px}' +
    // contagem calma: uma linha + fio
    '#pkok #cdx.lx{border:0!important;background:none!important;box-shadow:none!important;padding:0!important;margin:2px auto 18px!important;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:0 7px}#pkok #cdx.lx small{font-size:14px;color:#6e6067;margin:0}#pkok #cdx.lx small:last-child{display:none}#pkok #cdx.lx b,#pkok #cdx.lx #cdxt{font-family:inherit!important;font-weight:600!important;font-size:15px!important;line-height:1.2!important;margin:0!important;letter-spacing:.02em;color:#2a1d24;font-variant-numeric:tabular-nums}#pkok #cdx.lx i{flex:0 0 100%;height:2px!important;margin:10px auto 0!important;max-width:150px;border-radius:2px}' +
    // cartão branco com o QR e a ação
    '#pkok .lxC{flex:0 0 auto;align-self:center;box-sizing:border-box;background:#fff;border:1px solid rgba(60,30,45,.09);border-radius:26px;padding:20px 20px 20px;box-shadow:0 24px 50px -34px rgba(70,25,50,.5);display:flex;flex-direction:column;align-items:center;gap:16px}#pkok .lxC .pgq{margin:0!important;box-shadow:none!important;padding:0!important;border:0!important}' +
    '#pkok .lxX{flex:0 0 auto;align-self:center;box-sizing:border-box;margin:10px auto 0;border:1px solid rgba(60,30,45,.14);border-radius:16px;overflow:hidden;background:transparent}#pkok .lxX.ab{background:#fff;box-shadow:0 18px 40px -32px rgba(70,25,50,.5)}' +
    '#pkok .lxXh{display:flex!important;align-items:center;justify-content:space-between;width:100%;min-height:48px;margin:0!important;padding:0 18px!important;background:none!important;border:0!important;box-shadow:none!important;color:#3a2c33!important;font-family:inherit;font-weight:500!important;font-size:15px!important;text-decoration:none!important;cursor:pointer;box-sizing:border-box}#pkok .lxXh svg{color:#8d3a69;flex:0 0 auto}' +
    '#pkok .lxXi{display:flex!important;align-items:center;justify-content:flex-start;width:100%;min-height:48px;margin:0!important;padding:0 18px!important;background:none!important;border:0!important;border-top:1px solid rgba(60,30,45,.1)!important;border-radius:0!important;box-shadow:none!important;color:#6e6067!important;font-family:inherit;font-weight:500!important;font-size:15px!important;text-decoration:none!important;text-align:left;box-sizing:border-box}#pkok .lxXi.r{color:#a3352c!important}' +
    '#pkok .pgau.lx{margin:18px auto 2px!important;justify-content:center;font-size:14px;color:#6e6067;max-width:300px}';
  document.head.appendChild(st);
  const cl = o.querySelector('#pgcl');
  if (cl) { // pagar
    const cp = o.querySelector('.pgc'), q = o.querySelector('#pgq'), w = getComputedStyle(cp).width, cd = o.querySelector('#cdx'), au = o.querySelector('.pgau');
    if (cd) { cd.classList.add('lx'); cd.querySelector('small').textContent = 'Reservada para você por'; }
    const card = document.createElement('div'); card.className = 'lxC'; card.style.width = w; q.before(card); card.append(q, cp); cp.className = 'lxP';
    au.classList.add('lx'); au.querySelectorAll('span')[1].textContent = 'Confirmamos sozinhos assim que o PIX chegar';
    const g = document.createElement('div'); g.className = 'lxG'; au.after(g);
    cl.hidden = false; cl.className = ''; cl.style.cssText = 'margin:0'; cl.innerHTML = '<label for="pgf" class="lxL">Já paguei · enviar comprovante</label>'; g.append(cl);
    const v = o.querySelector('a.vend'), d = o.querySelector('.pgs'), x = o.querySelector('.pgx');
    // "Mais opções" = linha que expande (seta ⌄ / ⌃); aberta vira um cartão branco com as três opções em linhas
    const SETA = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (aberto ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6') + '"/></svg>';
    const cx = document.createElement('div'); cx.className = 'lxX' + (aberto ? ' ab' : ''); cx.style.width = w; g.after(cx);
    const m = document.createElement('button'); m.type = 'button'; m.className = 'lxXh'; m.setAttribute('aria-expanded', aberto ? 'true' : 'false'); m.innerHTML = '<span>Mais opções</span>' + SETA; cx.append(m);
    d.textContent = 'Pagar depois'; v.textContent = 'Falar com um vendedor';
    [d, v, x].forEach((e) => { e.className = 'lxXi' + (e === x ? ' r' : ''); e.removeAttribute('style'); if (aberto) cx.append(e); else e.remove(); });
    return 'pagar';
  }
  const wa = o.querySelector('.pkb a.pkw');
  if (wa) { // reserva encerrada: a ação cheia recupera a venda; quem já pagou tem o link
    const b = o.querySelector('.pkb'), r = b.querySelector('[data-pkrenova]'), fim = b.querySelector('[data-pkfim]');
    b.style.cssText += ';display:flex;flex-direction:column;align-items:center;gap:6px;width:100%';
    r.className = 'lxP'; r.style.maxWidth = '300px'; r.style.marginBottom = '10px';
    const l = document.createElement('label'); l.className = 'lxL'; l.textContent = 'Já paguei · enviar comprovante'; wa.replaceWith(l);
    fim.className = 'lxL s'; b.append(r, l, fim); b.insertBefore(r, l);
    return 'venceu';
  }
  const z = o.querySelector('a.pgwa');
  if (z) { z.remove(); const t = o.querySelector('.pkt span'); if (t) t.textContent = 'Estamos conferindo o seu pagamento. Esta tela atualiza sozinha; o pedido também fica em Minha conta.'; const f = o.querySelector('[data-pkfim]'); if (f) f.className = 'lxL'; return 'comp'; }
  return 'nada';
}
