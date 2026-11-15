// S312 — esboço da ANÁLISE CRÍTICA (roda DEPOIS do luxo.js): topo só com o logo; no celular "Copiar código" vem primeiro e o QR fica menor, para outro aparelho; final do comprovante com número do pedido e sem anel girando.
() => {
  const o = document.getElementById('pkok'); if (!o) return 'sem tela';
  const st = document.createElement('style');
  st.textContent = '#mnb,#contabtn,#sbtn,#bagbtn{visibility:hidden!important}#pkok .pkl{display:none!important}' +
    '#pkok .cxH{margin:0;font-size:13px;line-height:1.4;color:#6e6067;text-align:center}' +
    '#pkok .cxQ{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;padding-top:14px;border-top:1px solid rgba(60,30,45,.1)}#pkok .cxQ .pgq{width:auto!important;height:auto!important;min-height:0!important;padding:0!important;margin:0!important;background:none!important}#pkok .cxQ .pgq svg{width:140px!important;height:140px!important;display:block}' +
    '#pkok .cxN{margin:2px 0 10px;font-size:14px;letter-spacing:.04em;color:#6e6067;text-align:center;font-variant-numeric:tabular-nums}' +
    '#pkok .cxK{width:64px;height:64px;border-radius:50%;border:1.5px solid #1f8f4e;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#1f8f4e}';
  document.head.appendChild(st);
  const card = o.querySelector('.lxC');
  if (card) { // pagar
    const cp = card.querySelector('.lxP'), q = card.querySelector('#pgq');
    const h = document.createElement('p'); h.className = 'cxH'; h.textContent = 'Cole no app do seu banco, em “Pix copia e cola”.';
    const bx = document.createElement('div'); bx.className = 'cxQ'; const h2 = document.createElement('p'); h2.className = 'cxH'; h2.textContent = 'Pagando por outro aparelho? Leia o QR:';
    bx.append(h2, q); card.append(cp, h, bx); card.style.gap = '12px'; card.style.paddingTop = '20px';
    return 'pagar';
  }
  if (o.querySelector('[data-pkrenova]')) return 'venceu';
  const ring = o.querySelector('.pkc');
  if (ring) { // comprovante enviado
    const k = document.createElement('div'); k.className = 'cxK'; k.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'; ring.replaceWith(k);
    const h = o.querySelector('h2'); const n = document.createElement('p'); n.className = 'cxN'; n.textContent = 'Pedido LF-4821'; h.after(n);
    const t = o.querySelector('.pkt span'); if (t) t.textContent = 'Vamos conferir o seu pagamento e avisar aqui e em Minha conta. Pode sair desta tela: sua peça continua reservada.';
    return 'comp';
  }
  return 'nada';
}
