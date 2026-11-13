// DESIGNER DE E-COMMERCE (13/11/2026, pedido do dono): critérios de loja online profissional, medidos na tela real.
// Devolve uma lista de textos "ECOM: ...". Rodado pelo kit (kit.py) e pelo porteiro (parte 8).
(() => {
  const out = [], W = innerWidth, H = innerHeight, mob = W < 700;
  const vis = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && r.bottom > 0 && r.top < H * 3; };
  const nome = (e) => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')) + ' “' + (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 28) + '”';
  const naCamada = (e) => !!e.closest('#layer .scrim') || !document.querySelector('#layer .scrim');
  // 1 · alvo de toque (celular): mínimo 40×40 (padrão Apple/Google 44; 40 já é o limite)
  if (mob) {
    const peq = [...document.querySelectorAll('button,a[href],[role=button],input,select')].filter((e) => vis(e) && naCamada(e) && !e.closest('[aria-hidden=true]')).filter((e) => { const r = e.getBoundingClientRect(); return (r.width < 40 || r.height < 32) && !e.closest('p,li,.lfft,footer'); });
    if (peq.length) out.push('ECOM toque: ' + peq.length + ' botão(ões) pequenos demais para o dedo (< 40 px) · ex.: ' + peq.slice(0, 3).map(nome).join(', '));
  }
  // 2 · letra pequena demais (menos de 11 px no celular, 12 no PC) em texto de verdade
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), mini = new Set();
  while (tw.nextNode()) { const t = tw.currentNode, p = t.parentElement; if (!p || !t.textContent.trim() || t.textContent.trim().length < 3 || !vis(p) || !naCamada(p)) continue; const fs = parseFloat(getComputedStyle(p).fontSize); if (fs < (mob ? 11 : 12)) mini.add(p); }
  if (mini.size) out.push('ECOM letra: ' + mini.size + ' texto(s) com letra menor que ' + (mob ? 11 : 12) + ' px · ex.: ' + [...mini].slice(0, 3).map(nome).join(', '));
  // 3 · contraste do texto (WCAG AA 4,5:1; 3:1 para texto grande)
  const cor = (s) => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 1]; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const fundo = (e) => { for (let x = e; x; x = x.parentElement) { const b = cor(getComputedStyle(x).backgroundColor); if (b.length < 4 || b[3] > 0.6) return b; if (getComputedStyle(x).backgroundImage !== 'none') return null; } return [255, 255, 255, 1]; };
  const baixo = [];
  [...mini].concat([...document.querySelectorAll('p,span,b,small,a,button,h1,h2,h3,label,em,i')]).forEach((e) => {
    if (baixo.length > 40 || !vis(e) || !naCamada(e) || !(e.innerText || '').trim() || e.children.length > 2) return;
    const s = getComputedStyle(e), f = fundo(e); if (!f) return;
    const a = lum(cor(s.color)), b = lum(f), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), gr = parseFloat(s.fontSize) >= 18.6 || (parseFloat(s.fontSize) >= 14 && +s.fontWeight >= 700);
    if (r < (gr ? 3 : 4.5)) baixo.push(nome(e) + ' ' + r.toFixed(1) + ':1');
  });
  if (baixo.length) out.push('ECOM contraste: ' + baixo.length + ' texto(s) abaixo do mínimo de leitura · ex.: ' + baixo.slice(0, 3).join(', '));
  // 4 · (decisão do dono 11/11 e 13/11) o cartão mostra formato + código (SKU), não o nome; a cor o cliente escolhe na peça → não medir nome cortado
  // 5 · preços desalinhados na mesma fileira (vitrine profissional = preços na mesma linha)
  const linhas = {};
  [...document.querySelectorAll('.card .pr,.hc .hp')].filter(vis).forEach((e) => { const c = e.closest('.card,.hc').getBoundingClientRect(); const k = (e.closest('#grid,.hgr,.hcar,section,div[id]') || document.body).id + '|' + Math.round(c.top / 8); (linhas[k] = linhas[k] || []).push(Math.round(e.getBoundingClientRect().top)); });
  const des = Object.values(linhas).filter((l) => l.length > 1 && Math.max(...l) - Math.min(...l) > 3);
  if (des.length) out.push('ECOM vitrine: ' + des.length + ' fileira(s) com preços em alturas diferentes (até ' + Math.max(...des.map((l) => Math.max(...l) - Math.min(...l))) + ' px)');
  // 6 · (decisão do dono 13/11) o botão Comprar NÃO acompanha a rolagem e fica no lugar dele → não exigir na primeira tela
  // 7 · PC: categorias visíveis no topo (loja sem menu aparente perde clique)
  if (!mob) { const nav = [...document.querySelectorAll('header a,header button,.top a,.top button')].filter((e) => vis(e) && /solar|sol|lectura|leitura|armaz|arma|oferta/i.test(e.innerText || '')); if (!nav.length) out.push('ECOM navegação: no PC as categorias não aparecem no topo (só o menu ☰)'); }
  // 8 · mesma foto repetida em muitos blocos da página inicial
  const fotos = {}; [...document.querySelectorAll('#home img')].filter(vis).forEach((i) => { const s = (i.currentSrc || i.src || i.getAttribute('data-lfqo') || '').split('?')[0]; if (s) fotos[s] = (fotos[s] || 0) + 1; });
  const rep = Object.entries(fotos).filter((x) => x[1] >= 4);
  if (rep.length) out.push('ECOM fotos: ' + rep.length + ' foto(s) repetida(s) 4+ vezes no Início (cansa e parece catálogo pequeno)');
  // 9 · botão flutuante tampando conteúdo
  const wa = document.querySelector('a.wa'); if (wa && vis(wa)) { const r = wa.getBoundingClientRect(), x = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find((e) => e !== wa && !wa.contains(e) && /^(BUTTON|A)$/.test(e.tagName) && !e.closest('a.wa')); if (x) out.push('ECOM flutuante: botão do WhatsApp em cima de ' + nome(x)); }
  return out;
})()
