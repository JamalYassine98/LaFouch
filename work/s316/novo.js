// S316 — tela de pagar REFEITA (só esboço). Ideia: a "ficha da reserva" — um cartão só, que começa pela PEÇA reservada; o fio dourado da contagem é a própria divisória do cartão.
// Tudo alinhado à esquerda (menos empilhado no centro), uma ação cheia, ações secundárias em linhas com "›". Letra, cores e voltar do próprio site.
() => {
  const o = document.getElementById('pkok'); if (!o) return 'sem tela';
  const pix = !!o.querySelector('#pgq'), T = (s) => { const e = o.querySelector(s); return e ? e.innerText.trim() : ''; };
  const valor = T('.pgv'), tempo = T('#cdxt'), u = o.querySelector('#cdxb'), pct = u ? parseFloat(u.style.width) || 93 : 93;
  const qr = pix ? o.querySelector('#pgq svg') : null, japag = o.querySelector('#pgcl') && !o.querySelector('#pgcl').hidden;
  const linhas = [...o.querySelectorAll('.pgr')].map((r) => [r.querySelector('small').innerText, r.querySelector('b').innerText]);
  const tit = T('.pgtit').replace(/^Titular:\s*/, '');
  const card = document.querySelector('[data-open="SL2210"]'), im = (card && (card.closest('.card') || card).querySelector('img')) || document.querySelector('.card img');
  const foto = im ? im.currentSrc || im.src : '', serif = getComputedStyle(o.querySelector('h2')).fontFamily;
  const topo = document.querySelector('.top').getBoundingClientRect().bottom;
  const st = document.createElement('style');
  st.textContent = `
#zb{position:fixed;left:0;right:0;z-index:10000;display:flex;align-items:center;padding:12px 16px 12px 14px;background:var(--bg);border-bottom:1px solid var(--ln);box-sizing:border-box;zoom:calc(1/var(--z,1))}
#zb button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:10px 6px 10px 2px;background:none;border:0;border-radius:10px;color:var(--ac);font:600 16px Inter,system-ui,sans-serif}
#pkok.zz{display:block;text-align:left;padding-left:20px;padding-right:20px;padding-bottom:28px}
#pkok.zz .zw{max-width:400px;margin:0 auto}
#pkok.zz h2{font-size:27px;line-height:1.15;margin:0 0 16px;text-align:left;animation:none}
.zc{background:var(--pn);border:1px solid var(--ln);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px -44px rgba(90,30,65,.55)}
.zp{display:flex;align-items:center;gap:14px;padding:16px 18px}
.zp img{flex:none;width:58px;height:58px;border-radius:14px;object-fit:contain;background:var(--bg)}
.zp div{flex:1;min-width:0}.zp b{display:block;font:600 15px/1.3 Inter,system-ui,sans-serif;color:var(--tx)}.zp small{display:block;margin-top:2px;font:400 13px/1.3 Inter,system-ui,sans-serif;color:var(--mu)}
.zp time{flex:none;text-align:right;font:600 17px/1.1 Inter,system-ui,sans-serif;color:var(--tx);font-variant-numeric:tabular-nums}.zp time small{display:block;margin:0 0 3px;font:400 12px/1 Inter,system-ui,sans-serif;color:var(--mu)}
.zf{height:2px;background:var(--ln2)}.zf i{display:block;height:100%;background:#e6a64c}
.zm{padding:18px 18px 18px}
.zl{font:400 13px/1.3 Inter,system-ui,sans-serif;color:var(--mu)}
.zv{margin:2px 0 2px;font:800 32px/1.1 Inter,system-ui,sans-serif;color:var(--ac);letter-spacing:-.01em}
.zP{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;margin:16px 0 8px;border:0;border-radius:16px;background:#1f8f4e;color:#fff;font:600 16px Inter,system-ui,sans-serif;letter-spacing:.01em;box-shadow:0 12px 24px -16px rgba(31,143,78,.95)}
.zq{display:flex;align-items:center;gap:14px;margin-top:16px;padding-top:16px;border-top:1px solid var(--ln)}
.zq svg{flex:none;width:104px!important;height:104px!important;border-radius:10px;background:#fff}
.zq b{display:block;font:600 14px/1.3 Inter,system-ui,sans-serif;color:var(--tx)}
.zr{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;border-top:1px solid var(--ln)}
.zr.z1{margin-top:16px}
.zh{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}.zh button{flex:none;min-height:44px;padding:0 2px 0 12px;background:none;border:0;color:var(--ac);font:600 14px Inter,system-ui,sans-serif}
.zr b{display:block;font:600 16px/1.3 Inter,system-ui,sans-serif;color:var(--tx);overflow-wrap:anywhere}
.zr button{flex:none;min-height:44px;padding:0 2px 0 12px;background:none;border:0;color:var(--ac);font:600 14px Inter,system-ui,sans-serif}
.zs{display:flex;align-items:center;gap:10px;padding:13px 18px;background:var(--bg);border-top:1px solid var(--ln);font:400 13.5px/1.35 Inter,system-ui,sans-serif;color:var(--mu)}
.zs .spn{width:14px;height:14px;border-width:2px}
.za{margin-top:10px}
.za a{display:flex;align-items:center;justify-content:space-between;min-height:54px;padding:0 4px;border-bottom:1px solid var(--ln);color:var(--tx);font:500 15px Inter,system-ui,sans-serif;text-decoration:none}
.za a svg{color:var(--mu);flex:none}
#pkok.zz .tm{margin:14px 4px 0;text-align:left;max-width:none}`;
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'zb'; bar.style.top = topo + 'px';
  bar.innerHTML = '<button type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Minha conta</span></button>';
  document.body.appendChild(bar);
  const SETA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const peca = '<div class="zp">' + (foto ? '<img alt="" src="' + foto + '">' : '') + '<div><b>Óculos de sol Hexagonal</b><small>1 peça, retirada na loja</small></div><time><small>reservada por</small>' + tempo + '</time></div><div class="zf"><i style="width:' + pct + '%"></i></div>';
  let meio, rod, acoes = '';
  if (pix) {
    meio = '<div class="zl">Total</div><div class="zv">' + valor + '</div><div class="zl">Pague o valor exato, com os centavos.</div>' +
      '<button type="button" class="zP">Copiar código PIX</button><div class="zl">Cole no app do seu banco, em “Pix copia e cola”.</div>' +
      '<div class="zq"><span id="zqr"></span><div><b>Pagando por outro aparelho?</b><div class="zl">Abra o app do banco nele e leia este QR.</div></div></div>';
    rod = 'Confirmamos sozinhos assim que o PIX chegar.';
    if (japag) acoes += '<a href="#">Já paguei, enviar comprovante' + SETA + '</a>';
  } else {
    meio = '<div class="zl">Total a transferir</div><div class="zh"><div class="zv">' + valor + '</div><button type="button">Copiar</button></div><div class="zl">Transfira o valor exato.</div>' +
      linhas.slice(0, 1).map((l) => '<div class="zr z1"><div><div class="zl">' + l[0] + '</div><b>' + l[1] + '</b></div><button type="button">Copiar</button></div>').join('') +
      '<div class="zr"><div><div class="zl">Titular</div><b>' + tit + '</b></div></div>' +
      '<button type="button" class="zP" style="margin-bottom:0">Já transferi, enviar comprovante</button>';
    rod = 'Confirmamos o pedido assim que conferirmos o comprovante.';
  }
  acoes += '<a href="#">Precisa de ajuda? Fale com a loja' + SETA + '</a>';
  const termos = o.querySelector('.tm').outerHTML, titulo = pix ? 'Pague com PIX' : 'Transferência<br>Banco Familiar';
  o.classList.add('zz');
  o.innerHTML = '<div class="zw"><h2>' + titulo + '</h2><div class="zc">' + peca + '<div class="zm">' + meio + '</div><div class="zs"><span class="spn"></span><span>' + rod + '</span></div></div><div class="za">' + acoes + '</div>' + termos + '</div>';
  if (qr) o.querySelector('#zqr').replaceWith(qr);
  o.style.paddingTop = (topo + bar.getBoundingClientRect().height + 22) + 'px';
  return 'ok ' + (foto ? 'com foto' : 'SEM FOTO');
}
