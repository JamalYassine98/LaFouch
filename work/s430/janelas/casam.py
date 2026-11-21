import sys,json
sys.path.insert(0,'/tmp/esc')
from playwright.sync_api import sync_playwright
import importlib.util
J=json.load(open('/tmp/var/css650.json'))
C=[{'k':'C%d'%i,'med':x[0],'sel':x[1].split('*/')[-1].strip()} for i,x in enumerate(J['cortes'])]+[{'k':'S%d'%i,'med':x[0],'sel':x[1].split('*/')[-1].strip()} for i,x in enumerate(J['sumidas'])]
src=open('/tmp/esc/janelas.py').read()
g={}
exec(src.split("with sync_playwright() as p:")[0].replace("PORTA=sys.argv[1]; OUT=sys.argv[2]",""),g)
def msg(pg): pg.evaluate("(()=>{const e=document.querySelector('[data-msg],[data-cta=msg]');e&&e.click()})()");pg.wait_for_timeout(1200)
JS="""C=>{const R=[...document.querySelectorAll('#layer .scrim:not(.pg),#dlgb,#cad,#cpov,#mapw')];const out=[];if(!R.length)return out;
 for(const c of C){try{if(c.med){const m=c.med.replace(/^@media\\s*/,'');if(m&&m!=='all'&&!matchMedia(m).matches)continue}
  if(R.some(r=>r.matches(c.sel)||r.querySelector(c.sel)))out.push(c.k)}catch(e){}}return out}"""
A=set()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    for nome,fn in (('rosto',g['rosto']),('cmp',g['cmp_'])):
        for W in (390,820,1440):
            c=b.new_context(bypass_csp=True,viewport={'width':W,'height':844},is_mobile=W<700,has_touch=W<1000,permissions=['camera'])
            c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}")
            pg=c.new_page();pg.goto('http://localhost:8701/');pg.wait_for_timeout(3000)
            try: fn(pg)
            except Exception as e: print('EXC',nome,W,str(e)[:80])
            r=pg.evaluate(JS,C);A|=set(r);print(nome,W,len(r));c.close()
    b.close()
json.dump(sorted(A),open('/tmp/var/casam.json','w'))
K={c['k']:c for c in C}
for k in sorted(A): print(k,K[k]['med'][:30],'|',K[k]['sel'][:80])
