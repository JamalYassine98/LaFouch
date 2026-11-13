# S215 (13/11): auditoria do site real com os medidores do plugin ux-ui-audit. Só leitura.
import json
from playwright.sync_api import sync_playwright
D='/root/.claude/plugins/synced/822ea0bd-ada8-40dc-a3e5-7471ed562f3a_e89fbfd8-6e26-4d36-8716-9dedb27a22fd/0d07a0ac-4262-4453-bbc9-01ee3cc8d90f/scripts/'
P={k:open(D+'probe-%s.js'%k).read() for k in ('core','heuristics','perception')}
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
TEL=[('inicio','',None),('catalogo','?r=solar',None),('peca','?r=armazones',"()=>document.querySelector('#grid .card .open').click()")]
R={}
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in ((390,844),(1440,900)):
        mob=W<700
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=mob,has_touch=mob,locale='es-PY',service_workers='block')
        c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
        for n,u,a in TEL:
            pg=c.new_page();pg.goto('http://localhost:8811/'+u);pg.wait_for_timeout(2500)
            if a: pg.evaluate(a);pg.wait_for_timeout(1500)
            for k,s in P.items():
                try:
                    v=pg.evaluate(s); R['%s_%d_%s'%(n,W,k)]=json.loads(v) if isinstance(v,str) else v
                except Exception as e: R['%s_%d_%s'%(n,W,k)]={'erro':str(e)[:200]}
            pg.close()
        c.close()
    b.close()
json.dump(R,open('audit.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items(): print(k, list(v.keys())[:25] if isinstance(v,dict) else type(v))
