/* ESTUDO S416 — RÉGUA ÚNICA DE LETRAS (fase 1, v2).
   1) 9 tamanhos (no desenho do celular, 406 px): 11,5 · 12,5 · 14 · 16 · 18 · 21 · 24 · 28 · 36.
   2) Cada texto vai para o degrau mais perto do que tem hoje no celular (≤1 px).
   3) Celular e tablet = como hoje (o site inteiro escala pela largura); computador = degrau × 1,20 para TODOS.
   4) Letra dentro de outra (o "mm" do 54mm, o itálico do título) guarda a proporção que tem hoje com a de fora.
   5) Rodapé um degrau abaixo (é informação secundária).
   6) Cartão do Início = cartão do catálogo (mesma função = mesma aparência): nome forte 14, preço forte 21.
   7) Nome do Destaque no maior degrau (36), em duas linhas: nome em cima, a palavra em itálico embaixo.
   8) Nome do produto nos cartões em até 2 linhas, com o espaço das 2 linhas reservado em todos (a fileira não desalinha).
   9) Piso de 11 px: nenhum texto fica menor que isso em tela nenhuma. */
(() => {
  const DEG = [11.5, 12.5, 14, 16, 18, 21, 24, 28, 36], F = 1.2, R = window.__REGUA || { txt: {}, papel: {} };
  const GEN = /^(A|B|I|P|SPAN|EM|SMALL|DIV|STRONG|U|H2|H3|LABEL)\.$/;
  const perto = (v) => DEG.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) || (Math.abs(b - v) === Math.abs(a - v) && b > a)) ? b : a);
  const papel = (e) => { const k = (e.className && e.className.baseVal === undefined ? e.className : '') + ' ' + (e.parentElement ? e.parentElement.className : ''); return (e.tagName + '.' + k.trim().split(/\s+/).slice(0, 3).join('.')).slice(0, 60); };
  const zoomDe = (e) => { let z = 1; for (let x = e; x; x = x.parentElement) z *= parseFloat(getComputedStyle(x).zoom) || 1; return z; };
  const temTexto = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const st = document.createElement('style');
  st.textContent = '#home .hc .hn{font-weight:700!important;color:var(--tx)!important}#home .hc .hp{font-weight:800!important;color:var(--tx)!important}'+
    '#hdst h1 em{display:block}'+
    '#home .hc .hn,#grid .card .nm{white-space:normal!important;overflow:hidden!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.22!important;min-height:2.44em;box-sizing:content-box!important}';
  document.head.appendChild(st);
  function aplica() {
    const pc = innerWidth >= 1100, bz = (parseFloat(getComputedStyle(document.body).zoom) || 1) * (parseFloat(getComputedStyle(document.documentElement).zoom) || 1), S = bz * (pc ? F : 1);
    const novos = [...document.querySelectorAll('body *')].filter((e) => !e.dataset.lxf && !e.closest('#gw,svg,canvas') && temTexto(e) && e.getBoundingClientRect().width);
    const velho = new Map(novos.map((e) => [e, parseFloat(getComputedStyle(e).fontSize) * zoomDe(e)]));
    const dentro = (e) => /^(I|EM|SMALL|SUP|SUB)$/.test(e.tagName) && e.parentElement && temTexto(e.parentElement) && velho.has(e.parentElement);
    const novo = new Map();
    novos.filter((e) => !dentro(e)).forEach((e) => {
      const px = velho.get(e); let des;
      if (e.matches('#home .hc .hn')) des = 14; else if (e.matches('#home .hc .hp')) des = 21; else if (e.matches('#hdst h1')) des = 36;
      else if (!pc) des = px / bz;
      else { const p = papel(e), t = (e.innerText || '').trim().split('\n')[0].slice(0, 20); des = R.txt[p + '|' + t] || (GEN.test(p) ? 0 : R.papel[p]) || px / S; }
      let i = DEG.indexOf(perto(des)); if (e.closest('footer')) i = Math.max(0, i - 1);
      novo.set(e, DEG[i] * S);
    });
    novos.filter(dentro).forEach((e) => { const pai = e.parentElement; const pn = novo.get(pai) || velho.get(pai); novo.set(e, pn * velho.get(e) / velho.get(pai)); });
    novo.forEach((alvo, e) => { alvo = Math.max(11, alvo); e.style.setProperty('font-size', (alvo / zoomDe(e)).toFixed(3) + 'px', 'important'); e.dataset.lxf = '1'; });
  }
  let tm = 0; const go = () => { clearTimeout(tm); tm = setTimeout(aplica, 80); };
  new MutationObserver(go).observe(document.body, { childList: true, subtree: true }); addEventListener('load', go); go();
})();
