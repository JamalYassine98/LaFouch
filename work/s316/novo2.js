// S317 — tela de pagar, 2ª versão (só esboço). Raciocínio de e-commerce: o cliente JÁ conferiu as peças e o total três vezes (sacola, entrega, pagamento);
// esta tela tem um trabalho só — fazer pagar sem dúvida. Então: nada de peça nem total gigante; os dados viram LINHAS de recibo (rótulo à esquerda, valor à direita),
// o mesmo componente serve PIX e transferência; uma ação cheia; o fio dourado da reserva é a única coisa "com cor" além do botão.
() => {
  const o = document.getElementById('pkok'); if (!o) return 'sem tela';
  const pix = !!o.querySelector('#pgq'), T = (s) => { const e = o.querySelector(s); return e ? e.innerText.trim() : ''; };
  const valor = T('.pgv'), tempo = T('#cdxt'), u = o.querySelector('#cdxb'), pct = u ? parseFloat(u.style.width) || 93 : 93;
  const qr = pix ? o.querySelector('#pgq svg') : null, japag = o.querySelector('#pgcl') && !o.querySelector('#pgcl').hidden;
  const alias = (o.querySelector('.pgr b') || {}).innerText || '', tit = T('.pgtit').replace(/^Titular:\s*/, '');
  const topo = document.querySelector('.top').getBoundingClientRect().bottom;
  const st = document.createElement('style');
  st.textContent = `
#zb{position:fixed;left:0;right:0;z-index:10000;display:flex;align-items:center;padding:12px 16px 12px 14px;background:var(--bg);border-bottom:1px solid var(--ln);box-sizing:border-box;zoom:calc(1/var(--z,1))}
#zb button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:10px 6px 10px 2px;background:none;border:0;border-radius:10px;color:var(--ac);font:600 16px Inter,system-ui,sans-serif}
#pkok.zz{display:block;text-align:left;padding-left:22px;padding-right:22px;padding-bottom:28px}
#pkok.zz .zw{max-width:400px;margin:0 auto}
#pkok.zz h2{font-size:28px;line-height:1.15;margin:0;text-align:left;animation:none}
.zn{margin:6px 0 20px;font:400 14px/1.3 Inter,system-ui,sans-serif;color:var(--mu);font-variant-numeric:tabular-nums}
.zc{background:var(--pn);border:1px solid var(--ln);border-radius:22px;overflow:hidden}
.zr{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:54px;padding:0 18px;border-top:1px solid var(--ln);font:400 14.5px/1.3 Inter,system-ui,sans-serif;color:var(--mu)}
.zc>.zr:first-child{border-top:0}
.zr b{font:600 15.5px/1.3 Inter,system-ui,sans-serif;color:var(--tx);font-variant-numeric:tabular-nums;text-align:right;overflow-wrap:anywhere}
.zr span.zk{display:inline-flex;align-items:center;gap:12px}
.zr button{flex:none;min-height:44px;padding:0;background:none;border:0;color:var(--ac);font:600 14px Inter,system-ui,sans-serif}
.zf{height:2px;background:var(--ln2)}.zf i{display:block;height:100%;background:#e6a64c}
.zm{padding:18px}
.zP{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;margin:0;border:0;border-radius:16px;background:#1f8f4e;color:#fff;font:600 16px Inter,system-ui,sans-serif;letter-spacing:.01em}
.zl{margin-top:10px;font:400 13px/1.4 Inter,system-ui,sans-serif;color:var(--mu)}
.zq{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;border-top:1px solid var(--ln);font:400 14.5px/1.35 Inter,system-ui,sans-serif;color:var(--mu)}
.zq svg{flex:none;width:92px!important;height:92px!important;border-radius:8px;background:#fff}
.zs{display:flex;align-items:center;gap:10px;margin:16px 2px 6px;font:400 13.5px/1.35 Inter,system-ui,sans-serif;color:var(--mu)}
.zs .spn{width:14px;height:14px;border-width:2px}
.za a{display:flex;align-items:center;justify-content:space-between;min-height:52px;padding:0 2px;border-top:1px solid var(--ln);color:var(--tx);font:500 15px Inter,system-ui,sans-serif;text-decoration:none}
.za a:last-child{border-bottom:1px solid var(--ln)}
.za a svg{color:var(--mu);flex:none}
#pkok.zz .tm{margin:14px 2px 0;text-align:left;max-width:none}
@media (min-width:800px){#pkok.zz .zw{max-width:720px}.zG{display:grid;grid-template-columns:300px 1fr}.zQ{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 20px;border-right:1px solid var(--ln)}.zQ svg{width:232px!important;height:232px!important;border-radius:10px;background:#fff}.zE{display:flex;flex-direction:column}.zE .zm{margin-top:auto}.zP.zO{background:none;color:#14713c;border:1.5px solid #1f8f4e}}`;
  document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'zb'; bar.style.top = topo + 'px';
  bar.innerHTML = '<button type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Minha conta</span></button>';
  document.body.appendChild(bar);
  const SETA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const L = (r, v, cp) => '<div class="zr"><span>' + r + '</span><span class="zk"><b>' + v + '</b>' + (cp ? '<button type="button">Copiar</button>' : '') + '</span></div>';
  const reserva = L('Reservada para você por', tempo) + '<div class="zf"><i style="width:' + pct + '%"></i></div>';
  let corpo, estado, acoes = '';
  if (pix) {
    if (innerWidth >= 800) corpo = '<div class="zG"><div class="zQ"><span id="zqr"></span><div class="zl" style="margin:12px 0 0;text-align:center">Abra o app do seu banco no celular<br>e leia o QR.</div></div><div class="zE">' + L('Valor', valor) + reserva +
      '<div class="zm"><div class="zl" style="margin:0 0 10px">Prefere copiar? Cole no app do banco, em “Pix copia e cola”.</div><button type="button" class="zP zO">Copiar código PIX</button></div></div></div>';
    else corpo = L('Valor', valor) + reserva +
      '<div class="zm"><button type="button" class="zP">Copiar código PIX</button><div class="zl">Cole no app do seu banco, em “Pix copia e cola”. O valor já vai no código.</div></div>' +
      '<div class="zq"><span>Vai pagar por outro aparelho?<br>Leia o QR com o app do banco.</span><span id="zqr"></span></div>';
    estado = '<div class="zs"><span class="spn"></span><span>Confirmamos sozinhos assim que o PIX chegar.</span></div>';
    if (japag) acoes += '<a href="#">Já paguei, enviar comprovante' + SETA + '</a>';
  } else {
    corpo = L('Valor exato', valor, 1) + L('Alias (celular)', alias, 1) + L('Titular', tit) + reserva +
      '<div class="zm"><button type="button" class="zP">Já transferi, enviar comprovante</button><div class="zl">Transfira o valor exato pelo app do seu banco e envie o comprovante aqui.</div></div>';
    estado = '<div class="zs"><span>Confirmamos o pedido assim que conferirmos o comprovante.</span></div>';
  }
  acoes += '<a href="#">Precisa de ajuda? Fale com a loja' + SETA + '</a>';
  const termos = o.querySelector('.tm').outerHTML;
  o.classList.add('zz');
  o.innerHTML = '<div class="zw"><h2>' + (pix ? 'Pague com PIX' : 'Transferência Banco Familiar') + '</h2><p class="zn">Pedido LF-4821</p><div class="zc">' + corpo + '</div>' + estado + '<div class="za">' + acoes + '</div>' + termos + '</div>';
  if (qr) o.querySelector('#zqr').replaceWith(qr);
  o.style.paddingTop = (topo + bar.getBoundingClientRect().height + 24) + 'px';
  return 'ok';
}
