# S255 · Mochi quadro a quadro: amostra o esqueleto a cada quadro (inclinação, pulo, achatar, braços, piscar, olhar, rosto, balão) na entrada e parada.  python3 mede.py
import json, os, subprocess, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
AM = """()=>{const m=document.querySelector('.mochi');if(!m)return 'sem mochi';const q=s=>m.querySelector(s);window.__mz=[];const t0=performance.now();let ult='';
 const num=s=>(String(s||'').match(/-?\\d*\\.?\\d+/g)||[]).map(Number);
 const f=()=>{if(!window.__mzOn)return;const pu=num(q('.pulo')&&q('.pulo').getAttribute('transform')),sq=num(q('.sq')&&q('.sq').style.transform),ti=num(q('.tilt')&&q('.tilt').style.transform);
  const arm=c=>{const e=q('.'+c);return e?num(e.getAttribute('transform')).slice(0,4):[]};const op=c=>{const e=q('.'+c);return e?+(e.style.opacity!==''?e.style.opacity:(e.getAttribute('opacity')??1)):-1};
  const bal=document.querySelector('#gw .gzbl,#gw .gzb,#gzbal,#gw [class*=bal]');const tx=bal?bal.textContent.trim():'';
  window.__mz.push({t:Math.round(performance.now()-t0),hop:pu.length>=8?-pu[7]:0,rot:pu[8]||0,sx:pu[9]||1,sy:pu[10]||1,fx:pu[2]||1,sq:sq,ti:ti[0]||0,aBe:arm('aBe'),aBd:arm('aBd'),aFe:arm('aFe'),aFd:arm('aFd'),pis:q('.pis').classList.contains('p')?1:0,pup:num(q('.pup').style.transform),oF:op('olhosF'),oZ:op('olhosZ'),o:op('olhos'),bW:op('bW'),bO:op('bO'),bF:op('bF'),bH:op('bH'),bY:op('bY'),pon:op('pon'),x:Math.round(m.getBoundingClientRect().left),y:Math.round(m.getBoundingClientRect().top),bal:tx!==ult?tx.slice(0,60):null});ult=tx;requestAnimationFrame(f)};
 window.__mzOn=1;requestAnimationFrame(f);return 'ok '+[...m.querySelectorAll('g[class]')].map(g=>g.getAttribute('class')).slice(0,60).join(',')}"""
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
    c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg = c.new_page(); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#mnb').click()"); pg.wait_for_timeout(1200)
    pg.evaluate("document.querySelector('[data-gzopen]').click()"); pg.wait_for_timeout(350)
    print(pg.evaluate(AM)[:700])
    pg.wait_for_timeout(45000); d1 = pg.evaluate("()=>{window.__mzOn=0;return window.__mz}"); print('entrada+parada', len(d1), 'quadros')
    print('botões', pg.evaluate("()=>[...document.querySelectorAll('#gw button')].filter(e=>e.getClientRects().length).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,20)).join(' | ')"))
    pg.evaluate(AM); pg.evaluate("()=>{const b=[...document.querySelectorAll('#gw button')].find(e=>/empezar/i.test(e.innerText));b&&b.click()}"); pg.wait_for_timeout(25000); d2 = pg.evaluate("()=>{window.__mzOn=0;return window.__mz}"); print('depois de Empezar', len(d2), 'quadros')
    pg.screenshot(path='/tmp/mochi_fim.png'); print('botões', pg.evaluate("()=>[...document.querySelectorAll('#gw button')].filter(e=>e.getClientRects().length).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,20)).join(' | ')"))
    json.dump({'intro': d1, 'empezar': d2}, open(A + 'mochi.json', 'w'))
