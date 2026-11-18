import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
W=int(sys.argv[1]);H=int(sys.argv[2])
M="""()=>{const m=__LFGZ.Z.m;if(!m||!m.el)return null;const r=m.el.getBoundingClientRect(),b=document.querySelector('#gzbal'),B=b&&b.classList.contains('on')?b.getBoundingClientRect():null,bt=[...document.querySelectorAll('#gzbt .gzgo')].map(e=>e.getBoundingClientRect()).filter(x=>x.width);
const d=(R)=>Math.max(R.left-r.right,r.left-R.right,R.top-r.bottom,r.top-R.bottom);return {x:Math.round(r.left),y:Math.round(r.top),fora:r.left<-2||r.right>innerWidth+2||r.top<-2||r.bottom>innerHeight+2,dbal:B?Math.round(d(B)):99,dbt:bt.length?Math.round(Math.min(...bt.map(d))):99,anda:!!__LFGZ.Z.passeio}}"""
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=W,H=H,ls={'t_perm':'granted'})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8990/');pg.wait_for_timeout(3500)
    pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");pg.wait_for_timeout(2500);pg.click('#gzcom')
    pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=90000)
    L=[]
    for i in range(80):
        pg.wait_for_timeout(500);e=pg.evaluate(M)
        if e:L.append(e)
    pos=set((e['x'],e['y']) for e in L);ruins=[e for e in L if e['fora'] or e['dbal']<12 or e['dbt']<12]
    print(W,'posições',len(pos),'ruins',len(ruins),ruins[:3],[x for x in er if 'Failed' not in x][:3])
    b.close()
