/* ESTUDO S416 — RÉGUA ÚNICA DE LETRAS (fase 1).
   1) 9 tamanhos só (medidos no desenho do celular, 406 px): 11,5 · 12,5 · 14 · 16 · 18 · 21 · 24 · 28 · 36.
   2) Cada texto vai para o degrau mais perto do que tem hoje no celular (muda no máximo 1 px).
   3) Telas: celular e tablet = como hoje (o site inteiro escala pela largura); computador = régua × 1,15 para TODOS os textos
      (hoje cada texto do computador tem um tamanho próprio, de 0,66× a 1,54× o do celular). */
(() => {
  const DEG = [11.5, 12.5, 14, 16, 18, 21, 24, 28, 36], F = 1.15, R = window.__REGUA || { txt: {}, papel: {} };
  const perto = (v) => DEG.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) || (Math.abs(b - v) === Math.abs(a - v) && b > a)) ? b : a);
  const papel = (e) => { const k = (e.className && e.className.baseVal === undefined ? e.className : '') + ' ' + (e.parentElement ? e.parentElement.className : ''); return (e.tagName + '.' + k.trim().split(/\s+/).slice(0, 3).join('.')).slice(0, 60); };
  function aplica() {
    const pc = innerWidth >= 1100, bz = parseFloat(getComputedStyle(document.body).zoom) || 1;
    document.querySelectorAll('body *').forEach((e) => {
      if (e.dataset.lxf || e.closest('#gw,svg,canvas')) return;
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const r = e.getBoundingClientRect(); if (!r.width) return;
      let z = 1; for (let x = e; x; x = x.parentElement) z *= parseFloat(getComputedStyle(x).zoom) || 1; // só o zoom (não as animações)
      const px = parseFloat(getComputedStyle(e).fontSize) * z;
      let des;
      if (!pc) des = px / bz;
      else { const p = papel(e), t = (e.innerText || '').trim().split('\n')[0].slice(0, 20); des = R.txt[p + '|' + t] || R.papel[p] || px / (bz * F); }
      const alvo = perto(des) * bz * (pc ? F : 1);
      const bt = e.closest('a,button,[role=button],label'); const hb = bt ? bt.getBoundingClientRect().height / ((bt.getBoundingClientRect().height / (bt.offsetHeight || 1)) || 1) : 0;
      e.style.setProperty('font-size', (alvo / z).toFixed(3) + 'px', 'important'); e.dataset.lxf = '1';
      if (bt && hb && !bt.dataset.lxh) { bt.dataset.lxh = '1'; bt.style.setProperty('min-height', hb.toFixed(2) + 'px'); } // botão não encolhe
    });
  }
  let tm = 0; const go = () => { clearTimeout(tm); tm = setTimeout(aplica, 80); };
  new MutationObserver(go).observe(document.body, { childList: true, subtree: true }); addEventListener('load', go); go();
})();
