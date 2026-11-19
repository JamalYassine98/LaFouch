// S430: em cada estado da página, descobre, para cada declaração do index.html, se ela vale (ganha a cascata) em algum elemento.
// Recebe R (regras da fonte, com data-lfsi = número do <style>). Devolve {m:[[r,d]...] casou, w:[[r,d]...] ganhou, o:[[r,d]...] perdeu para OUTRA regra}
(R) => {
  const ESTADO = /:(hover|active|focus|focus-visible|focus-within|visited|target|checked|disabled|enabled|placeholder-shown|invalid|valid|indeterminate|empty|playing|paused|fullscreen|autofill|-webkit-autofill|user-invalid|open|modal|popover-open)\b/;
  const PSE = /(::[\w-]+|:(before|after|first-letter|first-line)\b)(\([^)]*\))?/g;
  const tst = document.createElement('div').style;
  const LH = {};
  function longs(prop, val) {
    const k = prop + ':' + val; if (LH[k]) return LH[k];
    if (prop.startsWith('--')) return (LH[k] = [prop]);
    tst.cssText = ''; tst.setProperty(prop, val);
    const o = []; for (let i = 0; i < tst.length; i++) o.push(tst[i]);
    return (LH[k] = o);
  }
  function spec(sel) {
    // especificidade aproximada [a,b,c]
    let s = sel.replace(PSE, (m) => { return ' '; }), a = 0, b = 0, c = 0;
    const fn = /:(not|is|has|where|nth-child|nth-last-child)\(/;
    // trata funções: :where = 0; :not/:is/:has = maior argumento
    let guard = 0;
    while (fn.test(s) && guard++ < 20) {
      const m = fn.exec(s); let i = m.index + m[0].length, d = 1;
      while (i < s.length && d) { if (s[i] === '(') d++; else if (s[i] === ')') d--; i++; }
      const arg = s.slice(m.index + m[0].length, i - 1), nome = m[1];
      let add = [0, 0, 0];
      if (nome === 'where') add = [0, 0, 0];
      else if (nome.startsWith('nth')) { add = [0, 1, 0]; const of = arg.split(/\s+of\s+/)[1]; if (of) { const x = spec(of); add = [x[0], x[1] + 1, x[2]]; } }
      else { for (const p of arg.split(/,(?![^(]*\))/)) { const x = spec(p); if (x[0] > add[0] || (x[0] === add[0] && (x[1] > add[1] || (x[1] === add[1] && x[2] > add[2])))) add = x; } }
      a += add[0]; b += add[1]; c += add[2];
      s = s.slice(0, m.index) + ' ' + s.slice(i);
    }
    s = s.replace(/\[[^\]]*\]/g, () => { b++; return ' '; });
    s.replace(/#[\w-]+/g, () => { a++; return ''; });
    s.replace(/\.[\w-]+/g, () => { b++; return ''; });
    s.replace(/:[\w-]+/g, () => { b++; return ''; });
    s.replace(/(^|[\s>+~(])([a-zA-Z][\w-]*)/g, () => { c++; return ''; });
    return [a, b, c];
  }
  function balde(sel) {
    const s = sel.replace(PSE, '').trim();
    // último composto (depois do último combinador fora de parênteses)
    let d = 0, cut = 0;
    for (let i = 0; i < s.length; i++) { const ch = s[i]; if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--; else if (!d && /[\s>+~]/.test(ch)) cut = i + 1; }
    const last = s.slice(cut).replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
    let m = last.match(/#([\w-]+)/); if (m) return '#' + m[1];
    m = last.match(/\.([\w-]+)/); if (m) return '.' + m[1];
    m = last.match(/^([a-zA-Z][\w-]*)/); if (m) return m[1].toLowerCase();
    return '*';
  }
  function pseudoDe(sel) { let m = sel.match(/::([\w-]+)/); if (m) return '::' + m[1]; m = sel.match(/:(before|after|first-letter|first-line)\b/); return m ? '::' + m[1] : ''; }
  const mq = {}; function midia(L) { for (const c of L) { let ok = mq[c]; if (ok === undefined) { if (c.startsWith('@media')) ok = matchMedia(c.slice(6).trim()).matches; else if (c.startsWith('@supports')) { try { ok = CSS.supports(c.slice(9).trim()); } catch (e) { ok = true; } } else ok = null; mq[c] = ok; } if (ok !== true) return ok; } return true; }
  // ordem dos <style> no documento
  const sheets = [...document.querySelectorAll('style,link[rel=stylesheet]')], ordS = new Map(); sheets.forEach((e, i) => ordS.set(e, i));
  const fonte = new Map(); sheets.forEach((e) => { if (e.dataset && e.dataset.lfsi != null) fonte.set(+e.dataset.lfsi, ordS.get(e)); });
  const B = {}; const put = (k, x) => { (B[k] = B[k] || []).push(x); };
  // candidatos da fonte
  R.forEach((r, ri) => {
    if (!fonte.has(r.si)) return; const ok = midia(r.media); if (!ok) return;
    const so = fonte.get(r.si);
    for (const part of r.sel.split(/,(?![^(]*\))/)) {
      const p = part.trim(); if (!p) continue; if (ESTADO.test(p)) continue;
      const q = p.replace(PSE, '').trim() || '*';
      put(balde(p), { ri, src: 1, q, ps: pseudoDe(p), sp: spec(p), ord: so * 1e6 + ri, decs: r.decs });
    }
  });
  // concorrentes: estilos que não vêm do index.html (postos pelo programa)
  let oi = 0;
  sheets.forEach((e) => {
    if (e.dataset && e.dataset.lfsi != null) return; let rs; try { rs = e.sheet && e.sheet.cssRules; } catch (_) { return; } if (!rs) return;
    const walk = (L, ok) => { for (const r of L) { if (r.media && r.cssRules) { walk(r.cssRules, ok && matchMedia(r.media.mediaText).matches); continue; } if (r.cssRules && !r.selectorText) { walk(r.cssRules, ok); continue; } if (!r.selectorText || !ok) continue; oi++;
      const ds = []; for (let i = 0; i < r.style.length; i++) { const n = r.style[i]; ds.push([n, r.style.getPropertyValue(n), r.style.getPropertyPriority(n) === 'important']); }
      for (const part of r.selectorText.split(/,(?![^(]*\))/)) { const p = part.trim(); if (ESTADO.test(p)) continue; put(balde(p), { ri: -1, src: 0, q: p.replace(PSE, '').trim() || '*', ps: pseudoDe(p), sp: spec(p), ord: ordS.get(e) * 1e6 + oi, ds }); } } };
    walk(rs, true);
  });
  const M = new Set(), W = new Set(), O = new Set(), X = new Set();
  const melhor = (a, b) => { // a ganha de b?
    if (a.imp !== b.imp) return a.imp;
    if (a.inl !== b.inl) return a.imp ? a.inl : a.inl;
    for (let i = 0; i < 3; i++) if (a.sp[i] !== b.sp[i]) return a.sp[i] > b.sp[i];
    return a.ord > b.ord;
  };
  const els = document.querySelectorAll('*');
  for (const el of els) {
    const cand = [];
    const ks = ['*', el.tagName.toLowerCase()]; if (el.id) ks.push('#' + el.id); for (const c of el.classList) ks.push('.' + c);
    for (const k of ks) { const L = B[k]; if (!L) continue; for (const x of L) { let ok = false; try { ok = el.matches(x.q); } catch (e) { ok = false; } if (ok) cand.push(x); } }
    const win = {}; // (pseudo|longhand) -> melhor
    const reg = (key, c) => { const w = win[key]; if (!w || melhor(c, w)) win[key] = c; };
    for (const x of cand) {
      if (x.src) x.decs.forEach((d, di) => { const L = longs(d[0], d[1]); for (const lh of L) { M.add(x.ri + ':' + di); reg(x.ps + '|' + lh, { imp: d[2], inl: false, sp: x.sp, ord: x.ord + di / 1e4, ri: x.ri, di }); } });
      else x.ds.forEach((d, di) => reg(x.ps + '|' + d[0], { imp: d[2], inl: false, sp: x.sp, ord: x.ord + di / 1e4, ri: -1, di }));
    }
    const st = el.style; for (let i = 0; i < st.length; i++) { const n = st[i]; reg('|' + n, { imp: st.getPropertyPriority(n) === 'important', inl: true, sp: [9, 9, 9], ord: 9e12, ri: -2 }); }
    for (const k in win) { const w = win[k]; if (w.ri >= 0) W.add(w.ri + ':' + w.di); }
    // quem perdeu para OUTRA regra
    for (const x of cand) if (x.src) x.decs.forEach((d, di) => { for (const lh of longs(d[0], d[1])) { const w = win[x.ps + '|' + lh]; if (!w || w.ri === x.ri) continue; if (w.ri >= 0) O.add(x.ri + ':' + di); else X.add(x.ri + ':' + di); } });
  }
  return { m: [...M], w: [...W], o: [...O], x: [...X], n: els.length };
}
