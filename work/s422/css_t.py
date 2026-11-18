# seletores do index.html que não acharam nenhum elemento em nenhum estado do passeio (candidatos a CSS morto)
import sys,json,re;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
CONTA=json.dumps({'nome':'Maria González','email':'m@e.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[{'nome':'Casa','cidade':'Ciudad del Este','dep':'Alto Paraná','end':'Calle 1','ref':''}]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'m@e.com'})
J="""()=>{const out=window.__cs||(window.__cs={});const f=(rules)=>{for(const r of rules){if(r.cssRules&&!r.selectorText){f(r.cssRules);continue}if(!r.selectorText)continue;for(let s of r.selectorText.split(',')){s=s.trim();const b=s.replace(/::?(before|after|placeholder|selection|marker|first-line|first-letter|backdrop|-webkit-[a-z-]+|view-transition[a-z-]*(\\([^)]*\\))?)/g,'').replace(/:(hover|focus|focus-visible|focus-within|active|visited|checked|disabled|empty|invalid|valid|target|placeholder-shown|autofill|-webkit-autofill)/g,'')||'*';if(out[s])continue;try{if(document.querySelector(b))out[s]=1;else if(!(s in out))out[s]=0}catch(e){out[s]=1}}}};for(const sh of document.styleSheets){try{if(!sh.href)f(sh.cssRules)}catch(e){}}return out}"""
import subprocess,time;SRV=subprocess.Popen([sys.executable,'/home/claude/lafouch/work/s415/srv.py','8990','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TOT={}
EST=[('/',''),('/',"#bagbtn"),('/',"#contabtn"),('/',"#mnb"),('/',"#sbtn"),('/?r=armacoes',''),('/?r=armacoes',"#fbtn"),('/',"[data-open]"),('/#atacado',''),('/#duvidas',''),('/#como',''),('/#vitrine',''),('/#rosto',''),('/',"GZ")]
with sync_playwright() as p:
  for W,H,ev in [(390,844,''),(1440,900,'natal'),(820,1180,'bf'),(390,844,'halloween'),(1440,900,'anonovo'),(390,844,'maes'),(390,844,'pais')]:
    ls={'lf_conta':CONTA,'lf_auth':AUTH}
    if ev:ls['lf_cfg']=json.dumps({'evento':{'tema':ev,'ini':0,'fim':0}})
    b,pg,er=base.abre(p,W=W,H=H,ls=ls);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    for rota,cl in EST:
        pg.goto('http://localhost:8990'+rota);pg.wait_for_timeout(1800)
        try:
            if cl=='GZ':pg.evaluate("window.__lfGzAbre&&window.__lfGzAbre()")
            elif cl:pg.evaluate("s=>{const e=document.querySelector(s);e&&e.click()}",cl)
        except Exception:pass
        pg.wait_for_timeout(1300)
        for k in range(3):
            r=pg.evaluate(J)
            for s,v in r.items():TOT[s]=TOT.get(s,0) or v
            pg.evaluate("()=>{[document.scrollingElement,...document.querySelectorAll('#layer .scrim,#vscr')].forEach(e=>e&&(e.scrollTop+=innerHeight*1.5))}");pg.wait_for_timeout(300)
    b.close()
nunca=sorted(s for s,v in TOT.items() if not v)
print('seletores:',len(TOT),'nunca acharam nada:',len(nunca))
json.dump(nunca,open('/tmp/css_nunca.json','w'),ensure_ascii=False,indent=0)
