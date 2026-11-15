// S308 — PROPOSTA (só esboço): menos botões nas telas de pagamento. Recebe 'aberto' para mostrar "Mais opções" aberto.
(aberto) => {
  const o = document.getElementById('pkok'); if (!o) return 'sem tela';
  const st = document.createElement('style');
  st.textContent = '#pkok .s8j{display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin:14px 0 0;border:1.5px solid #1f8f4e;border-radius:16px;color:#14713c;font:600 16px/1.2 inherit;background:#fff;cursor:pointer;box-sizing:border-box}' +
    '#pkok .s8m{display:block;margin:18px auto 0;min-height:44px;padding:0 14px;background:none;border:0;color:inherit;font:500 15px/1.2 inherit;text-decoration:underline;text-underline-offset:3px;opacity:1;cursor:pointer}' +
    '#pkok .s8o{flex:0 0 auto;align-self:stretch;margin:4px 0 0;border:1px solid rgba(0,0,0,.12);border-radius:16px;background:#fff;overflow:hidden}#pkok .s8o>*{display:flex!important;align-items:center;justify-content:center;width:100%;min-height:50px;margin:0!important;padding:0 16px!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;font:500 15px/1.2 inherit!important;text-decoration:none!important;box-sizing:border-box;color:inherit}#pkok .s8o>*+*{border-top:1px solid rgba(0,0,0,.1)!important}#pkok .s8o>.pgx{color:#b3261e!important}' +
    '#pkok .pkb .s8p{display:flex;align-items:center;justify-content:center;gap:8px}';
  document.head.appendChild(st);
  const cl = o.querySelector('#pgcl');
  if (cl) { // tela de pagar
    cl.hidden = false; cl.className = ''; cl.style.cssText = 'align-self:stretch;width:' + getComputedStyle(o.querySelector('.pgc')).width + ';max-width:100%;margin:0 auto'; cl.innerHTML = '<label for="pgf" class="s8j">Já paguei · enviar comprovante</label>';
    const v = o.querySelector('a.vend'), d = o.querySelector('.pgs'), x = o.querySelector('.pgx');
    const m = document.createElement('button'); m.type = 'button'; m.className = 's8m'; m.textContent = aberto ? 'Mais opções ▴' : 'Mais opções ▾';
    d.parentNode.insertBefore(m, d);
    const box = document.createElement('div'); box.className = 's8o'; box.style.cssText = 'align-self:center;width:' + getComputedStyle(o.querySelector('.pgc')).width + ';max-width:100%'; m.after(box);
    d.textContent = 'Pagar depois'; box.append(d, v, x); if (!aberto) box.hidden = true;
    return 'pagar';
  }
  const wa = o.querySelector('.pkb a.pkw');
  if (wa) { // reserva encerrada
    const b = o.querySelector('.pkb'), r = b.querySelector('[data-pkrenova]');
    const g = getComputedStyle(wa), l = document.createElement('label'); l.className = 's8p'; l.textContent = 'Já paguei · enviar comprovante';
    ['background', 'color', 'borderRadius', 'padding', 'font', 'boxShadow', 'minHeight', 'width', 'margin', 'boxSizing', 'textDecoration'].forEach((k) => { l.style[k] = g[k]; });
    wa.replaceWith(l); b.insertBefore(l, r); const fim = b.querySelector('[data-pkfim]'); r.style.flexBasis = '100%'; fim.style.flexBasis = '100%';
    return 'venceu';
  }
  const z = o.querySelector('a.pgwa'); if (z) { z.remove(); return 'comp'; }
  return 'nada';
}
