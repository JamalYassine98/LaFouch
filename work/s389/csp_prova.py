# S390: prova de que a regra de segurança (CSP) do site barra as duas peças que o login com Google precisa: o programa apis.google.com e a moldura do firebaseapp.com
import sys,subprocess,time,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8872','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("window.__v=[];document.addEventListener('securitypolicyviolation',e=>window.__v.push(e.effectiveDirective+' '+e.blockedURI))")
    pg.goto('http://localhost:8872/');pg.wait_for_timeout(3000);pg.evaluate("()=>{window.__v.length=0;const s=document.createElement('script');s.src='https://apis.google.com/js/api.js';document.head.appendChild(s);const f=document.createElement('iframe');f.src='https://lafouch-2f6bd.firebaseapp.com/__/auth/iframe';f.style.display='none';document.body.appendChild(f)}");pg.wait_for_timeout(1500)
    print('barrado pela regra de segurança:',pg.evaluate("()=>window.__v.filter(x=>/apis.google|firebaseapp/.test(x))"));b.close()
finally: srv.terminate()
