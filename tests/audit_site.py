#!/usr/bin/env python3
"""Auditoria de responsividade do site (lafouch.com).
Uso: python3 audit_site.py [--vp 390x844,1366x768] [--zoom 0,1,2] [--screens home,vitrine] [--out /tmp/audit] [--base http://localhost:8765/index.html]
Abre o site em várias resoluções/zooms e procura: rolagem horizontal, elementos que passam da tela,
texto cortado, sobreposição e texto minúsculo. Salva fotos em --out e um JSON com os achados."""
import sys, json, argparse, os, itertools
from playwright.sync_api import sync_playwright

VPS = "320x568,360x640,390x844,430x932,600x960,768x1024,820x1180,844x390,1024x768,1180x820,1280x720,1366x768,1440x900,1536x864,1920x1080,2560x1440"
SCREENS = "home,vitrine,rosto,atacado,como,duvidas,login,conta,sacola,produto"

CHECK = r"""
() => {
  const W = innerWidth, H = innerHeight, out = [];
  const zf = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const sel = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; else if (e.className && typeof e.className === 'string') s += '.' + e.className.trim().split(/\s+/).slice(0,2).join('.'); return s; };
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .05; };
  const hiddenAnc = e => { for (let a = e; a && a !== document.documentElement; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || a.hasAttribute('hidden') || a.getAttribute('aria-hidden') === 'true' && !/^(svg|path)$/i.test(a.tagName) && a.id !== 'layer') return true; } return false; };
  const clipped = e => { for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) { const cs = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) { const r = a.getBoundingClientRect(); if (r.left >= -2 && r.right <= W + 2) return true; } } return false; };
  const lay = document.getElementById('layer'), pop = document.querySelector('.sec.pop');
  const root = (lay && lay.children.length && lay.getBoundingClientRect().height > 20 && getComputedStyle(lay).display !== 'none') ? lay : (pop || document.body);
  const onTop = e => { const r = e.getBoundingClientRect(); const cx = Math.min(Math.max(r.left + r.width / 2, 1), W - 1), cy = Math.min(Math.max(r.top + r.height / 2, 1), H - 1); const hit = document.elementFromPoint(cx, cy); return !hit || e.contains(hit) || hit.contains(e); };
  const all = [...root.querySelectorAll('*')].filter(e => !/^(script|style|link|meta|path|g|defs|use|circle|rect|polygon|line|polyline|ellipse|svg)$/i.test(e.tagName) && vis(e) && !hiddenAnc(e) && onTop(e));
  if (document.documentElement.scrollWidth > W + 1) out.push({k: 'hscroll', d: document.documentElement.scrollWidth + ' > ' + W});
  const seen = new Set();
  for (const e of all) {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    if ((r.right > W + 2 || r.left < -2) && r.width < W * 3 && !clipped(e) && cs.position !== 'fixed') {
      const s = sel(e); if (!seen.has('o' + s)) { seen.add('o' + s); out.push({k: 'fora-da-tela', s, d: Math.round(r.left) + '..' + Math.round(r.right) + ' de ' + W}); }
    }
    const txt = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (txt) {
      const fs = parseFloat(cs.fontSize) * zf;
      if (fs < 10.5) { const s = sel(e); if (!seen.has('f' + s)) { seen.add('f' + s); out.push({k: 'texto-pequeno', s, d: fs.toFixed(1) + 'px: ' + e.textContent.trim().slice(0, 24)}); } }
      if (/(hidden|clip)/.test(cs.overflowX) && cs.textOverflow !== 'ellipsis' && e.scrollWidth > e.clientWidth + 2 && cs.whiteSpace !== 'normal') { const s = sel(e); if (!seen.has('c' + s)) { seen.add('c' + s); out.push({k: 'texto-cortado-x', s, d: e.scrollWidth + '>' + e.clientWidth + ': ' + e.textContent.trim().slice(0, 24)}); } }
      if (/(hidden|clip)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 3 && !/(auto|scroll)/.test(cs.overflowY) && cs.display !== 'inline') { const s = sel(e); if (!seen.has('y' + s)) { seen.add('y' + s); out.push({k: 'texto-cortado-y', s, d: e.scrollHeight + '>' + e.clientHeight + ': ' + e.textContent.trim().slice(0, 24)}); } }
    }
  }
  // sobreposição entre elementos de fluxo normal (botões, campos, títulos, textos)
  const cand = all.filter(e => { const cs = getComputedStyle(e); if (/^(absolute|fixed)$/.test(cs.position)) return false; if (e.closest('.cdl,#toast,.toast,[data-nooverlap]')) return false; if (!/^(BUTTON|A|INPUT|SELECT|H1|H2|H3|P|LABEL|SPAN|LI|SMALL|B|EM)$/.test(e.tagName)) return false; if (e.tagName === 'SPAN' || e.tagName === 'B' || e.tagName === 'EM' || e.tagName === 'SMALL') { if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return false; } const r = e.getBoundingClientRect(); return r.top < H && r.bottom > 0 && r.left < W && r.right > 0; });
  const reps = new Set();
  for (let i = 0; i < cand.length && i < 400; i++) for (let j = i + 1; j < cand.length && j < 400; j++) {
    const a = cand[i], b = cand[j]; if (a.contains(b) || b.contains(a)) continue;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (x > 6 && y > 6) { const m = Math.min(ra.width * ra.height, rb.width * rb.height); if (x * y > m * .3) { const k = sel(a) + ' x ' + sel(b); if (!reps.has(k)) { reps.add(k); out.push({k: 'sobreposicao', s: k, d: Math.round(x) + 'x' + Math.round(y) + 'px'}); } } }
  }
  return out;
}
"""

def run(a):
    os.makedirs(a.out, exist_ok=True)
    res = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for vp in a.vp.split(','):
            w, h = map(int, vp.split('x'))
            for z in a.zoom.split(','):
                ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=(w < 1000), is_mobile=False, locale='pt-BR')
                ctx.add_init_script("try{localStorage.setItem('lf_intro2','1');localStorage.setItem('lf_zoom','%s')}catch(e){}" % z)
                pg = ctx.new_page()
                errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.route('**/*', lambda r: r.continue_() if ('localhost' in r.request.url or r.request.url.startswith('data:')) else r.abort())
                for sc in a.screens.split(','):
                    tag = f'{vp}_z{z}_{sc}'
                    try:
                        url = a.base
                        if sc in ('vitrine', 'rosto', 'atacado', 'como', 'duvidas'): url += '#' + sc
                        if sc == 'produto': url += '#vitrine'
                        pg.goto('about:blank')
                        if sc == 'conta':
                            pg.add_init_script("try{localStorage.setItem('lf_auth',JSON.stringify({uid:'u1',email:'a@b.com',idToken:'x',refresh:'y',exp:Date.now()+3e6,user:'',via:'google',gn:'Maria Souza'}))}catch(e){}")
                        pg.goto(url); pg.wait_for_timeout(900 if sc != 'home' else 1200)
                        if sc in ('vitrine', 'rosto', 'atacado', 'como', 'duvidas'):
                            pg.wait_for_timeout(500)
                            pg.evaluate(f"(()=>{{if(!document.querySelector('.sec.pop')){{var e=document.getElementById('{sc}');if(e)e.scrollIntoView()}}}})()")
                            pg.wait_for_timeout(300)
                            if sc == 'rosto':
                                pg.evaluate("(()=>{var f=document.querySelector('#rosto [data-face],#rosto .fp,#rosto button');})()")
                        if sc in ('login', 'conta'):
                            pg.evaluate("document.getElementById('contabtn').click()"); pg.wait_for_timeout(800)
                        if sc == 'sacola':
                            pg.evaluate("document.getElementById('bagbtn').click()"); pg.wait_for_timeout(800)
                        if sc == 'produto':
                            pg.evaluate("(()=>{var c=document.querySelector('.card [data-open]')||document.querySelector('.card .th,.card img');if(c)c.click()})()"); pg.wait_for_timeout(900)
                        found = pg.evaluate(CHECK)
                        pg.screenshot(path=f'{a.out}/{tag}.jpg', type='jpeg', quality=55)
                        res.append({'vp': vp, 'z': z, 'screen': sc, 'issues': found, 'errs': errs[-2:]})
                    except Exception as ex:
                        res.append({'vp': vp, 'z': z, 'screen': sc, 'fatal': str(ex)[:200], 'issues': []})
                ctx.close()
        b.close()
    json.dump(res, open(a.out + '/report.json', 'w'), ensure_ascii=False, indent=1)
    return res

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--vp', default=VPS); ap.add_argument('--zoom', default='0,1,2'); ap.add_argument('--screens', default=SCREENS)
    ap.add_argument('--out', default='/tmp/audit'); ap.add_argument('--base', default='http://localhost:8765/index.html')
    a = ap.parse_args(); r = run(a)
    n = sum(len(x['issues']) for x in r); print('estados:', len(r), 'achados:', n)
