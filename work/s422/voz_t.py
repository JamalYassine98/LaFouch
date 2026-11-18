import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
exec(open('t_mochi.py').read().split('res={}')[0].split("porta=int")[0])
lang=sys.argv[1]
with sync_playwright() as p:
    b,pg,er=base.abre(p,lang=lang,W=390,H=844,ls={'t_perm':'granted'})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    REQ=[];pg.on('request',lambda r:REQ.append(r.url.split('/')[-1]) if '/voz/' in r.url else None);pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8990/');pg.wait_for_timeout(3500)
    U='http://localhost:8990/'
    import types
    pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");pg.wait_for_timeout(2500);pg.click('#gzcom')
    pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=90000);pg.wait_for_timeout(1500)
    print('vm',pg.evaluate("__LFGZ.Z.vm"),'antes',pg.evaluate("__al.map(x=>x.f).slice(-4)"))
    pg.evaluate('()=>{__LFGZ.Z.falando=0;__LFGZ.pp(2)}');pg.wait_for_timeout(9000)
    for d in range(30,20,-1):pg.evaluate("()=>window.__dist=%d"%d);pg.wait_for_timeout(250)
    pg.wait_for_timeout(6000);print('pedidos voz novos:',[x for x in REQ if '10_' in x]);print('depois',pg.evaluate("__al.map(x=>x.f).slice(-10)"),pg.evaluate("__ss.slice(-4)"))
    b.close()
