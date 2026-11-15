# S352 AUDITORIA (pedido do dono 15/11 17:20): abre cada tela do app REAL (dados de teste), abre tudo o que é recolhido, e
#  (1) INVENTÁRIO: títulos de bloco e pares "rótulo → valor" de cada tela, para achar o que se repete entre telas;
#  (2) BOTÕES: toca cada botão (sessão nova por toque); marca os que NÃO mudam nada na tela; e mede campos/botões pequenos demais.
# Uso: audit.py inv | audit.py bot <parte 0..2>. Celular, tema escuro. Só leitura do resultado.
import sys,json,os,re;modo=sys.argv[1];parte=int(sys.argv[2]) if len(sys.argv)>2 else 0;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
TELAS=[('Início','inicio',''),('Catálogo','vendas',''),('Inventário','estoque',''),('Dinheiro','caixa',''),('Despesas','desp',''),('Câmbio','fx',''),('Clientes','clientes',''),('Pedidos','ped',''),('Loja online','onl',''),
 ('Dashboard (dia)','dia',''),('Resumo','dash','hoje'),('Reservas','dash','din'),('Giro','dash','giro'),('Preços','dash','prec'),('Online (aba)','dash','onl'),('Histórico','hist',''),('Ajustes','ajustes',''),('Notificações','notif','')]
B=[None];C=[None]
def nova(pw):
    if not B[0]: B[0]=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    if C[0]:
        try: C[0].close()
        except Exception: pass
    c=C[0]=B[0].new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();pg.set_default_timeout(9000);return pg
def vai(pw,t):
    pg=nova(pw);pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(700)
    if t[1]!='inicio': pg.evaluate("a=>{const L=window.__LF;if(a[1])L.S.dTab=a[1];L.setView(a[0])}",[t[1],t[2]]);pg.wait_for_timeout(900)
    return pg
VIS="()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);return v?v.id:''}"
ABRE="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);let n=0;for(let k=0;k<3;k++){[...v.querySelectorAll('details:not([open])>summary,[aria-expanded=false]')].forEach(e=>{if(e.offsetParent){try{e.click();n++}catch(x){}}})}return n}"""
INV="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const T=e=>(e.innerText||e.textContent||'').replace(/\\s+/g,' ').replace(/[›⌄▾v∨∧^]$/,'').trim();
 const tit=[];v.querySelectorAll('h1,h2,h3,summary,.famRot').forEach(e=>{if(e.offsetParent){const t=T(e).slice(0,60);if(t.length>2&&!tit.includes(t))tit.push(t)}});
 const par=[];v.querySelectorAll('.kpi,.sl,.grow,.ln').forEach(e=>{if(!e.offsetParent)return;const l=e.querySelector('.lbl,span,small');const b=e.querySelector('b');if(l&&b){const a=T(l).split(' · ')[0].slice(0,40),c=T(b).slice(0,24);if(a.length>2)par.push([a,c])}});
 v.querySelectorAll('.lbl').forEach(e=>{if(e.offsetParent){const a=T(e).slice(0,40);if(a.length>2&&!par.some(p=>p[0]===a))par.push([a,''])}});
 const peq=[...v.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]),select,textarea')].filter(e=>e.offsetParent&&e.getBoundingClientRect().width<64).map(e=>{const r=e.getBoundingClientRect();const c=e.closest('section,details,.card')||e.parentElement;return (T(c.querySelector('h2,h3,summary,.lbl')||c).slice(0,40))+' → campo de '+(r.width|0)+'×'+(r.height|0)+' px'});
 return {tit,par,peq,alt:document.scrollingElement.scrollHeight,bot:v.querySelectorAll('button,[data-act]').length}}"""
CAND="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const o=[];[...v.querySelectorAll('button,[data-act],[role=button],summary,a[href]')].forEach(e=>{if(!e.offsetParent||e.disabled)return;const r=e.getBoundingClientRect();if(r.width<6||r.height<6)return;const t=((e.getAttribute('aria-label')||e.innerText||e.getAttribute('data-act')||'')+'').replace(/\\s+/g,' ').trim().slice(0,44);const k=(e.getAttribute('data-act')||e.tagName)+'|'+t.replace(/[0-9.,]+/g,'#');
 if(/mcLiga|modo cliente|modo loja|sair|logout|apag|exclu|zerar|restaur|backup|export|import|imprim|instalar|apkgo|bio|sincron|whats|compartilh/i.test(k))return;if(o.some(x=>x.k===k))return;if(e.classList.contains('pcard')&&o.filter(x=>x.pc).length>=1)return;o.push({k,t,pc:e.classList.contains('pcard'),h:r.height|0,w:r.width|0})});return o}"""
MARCA="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const vis=[];[...v.querySelectorAll('button,[data-act],[role=button],summary,a[href]')].forEach(e=>{if(!e.offsetParent||e.disabled)return;const t=((e.getAttribute('aria-label')||e.innerText||e.getAttribute('data-act')||'')+'').replace(/\\s+/g,' ').trim().slice(0,44);const k=(e.getAttribute('data-act')||e.tagName)+'|'+t.replace(/[0-9.,]+/g,'#');if(vis.includes(k))return;vis.push(k);e.setAttribute('data-vz',k)})}"""
SIG="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const fx=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return s.position==='fixed'&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>.3&&e.getBoundingClientRect().height>60&&(+s.zIndex||0)>40}).length;
 const t=document.body.innerText.replace(/\\d/g,'#');let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return [v?v.id:'',window.__LF.S.dTab||'',fx,h,t.length,v?v.querySelectorAll('*').length:0,document.activeElement?document.activeElement.tagName:'',Math.round(scrollY)]}"""
INV2="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const o=[];const w=document.createTreeWalker(v,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.replace(/\\s+/g,' ').trim();if(t.length<4)continue;const e=n.parentElement;if(!e||!e.offsetParent||e.closest('svg,script,style,.pcard,#rows,#vRows'))continue;const s=getComputedStyle(e);const fs=parseFloat(s.fontSize),fw=+s.fontWeight||400;
 o.push([t.slice(0,90),(fs>=17||(/serif|Fraunces|display/i.test(s.fontFamily)&&fs>=15))?'T':(fw>=600?'B':(/uppercase/.test(s.textTransform)?'L':'t'))])}return o}"""
R={}
with sync_playwright() as pw:
    if modo=='inv2':
        for t in TELAS:
            try:
                pg=vai(pw,t)
                if t[1]!='caixa': pg.evaluate(ABRE)
                pg.wait_for_timeout(800);R[t[0]]={'txt':pg.evaluate(INV2),'alt':pg.evaluate('()=>document.scrollingElement.scrollHeight')};print(t[0],len(R[t[0]]['txt']),flush=True)
            except Exception as e: print(t[0],'ERRO',str(e)[:90],flush=True)
        json.dump(R,open('/home/claude/lafouch/work/s352/textos.json','w'),ensure_ascii=False,indent=0);B[0].close();sys.exit()
    if modo=='inv':
        for t in TELAS:
            try:
                pg=vai(pw,t);n=pg.evaluate(ABRE);pg.wait_for_timeout(700);r=pg.evaluate(INV);r['abertos']=n;R[t[0]]=r;print(t[0],r['alt'],'px',len(r['tit']),'títulos',len(r['par']),'rótulos',r['peq'],flush=True)
            except Exception as e: print(t[0],'ERRO',str(e)[:90],flush=True)
        json.dump(R,open('/home/claude/lafouch/work/s352/inventario.json','w'),ensure_ascii=False,indent=1)
    else:
        for t in [x for i,x in enumerate(TELAS) if i%3==parte]:
            try: pg=vai(pw,t);pg.evaluate(ABRE);pg.wait_for_timeout(600);cs=pg.evaluate(CAND)
            except Exception as e: print(t[0],'ERRO',str(e)[:90],flush=True);continue
            print('#',t[0],len(cs),flush=True);R[t[0]]=[]
            for c in cs[:60]:
                try:
                    pg=vai(pw,t);pg.evaluate(ABRE);pg.wait_for_timeout(500);pg.evaluate(MARCA)
                    e=pg.query_selector('[data-vz="%s"]'%c['k'].replace('\\','\\\\').replace('"','\\"'))
                    if not e: continue
                    a=pg.evaluate(SIG)
                    try: e.click(timeout=1500)
                    except Exception: R[t[0]].append({'b':c['t'],'r':'não deu para tocar (tampado ou fora da tela)','h':c['h'],'w':c['w']});print('  ✗',c['t'],'não tocável',flush=True);continue
                    pg.wait_for_timeout(900);d=pg.evaluate(SIG)
                    mud=[i for i in range(len(a)) if a[i]!=d[i]]
                    R[t[0]].append({'b':c['t'],'r':'nada mudou' if not mud else 'ok','h':c['h'],'w':c['w']})
                    if not mud: print('  ∅',c['t'],'| nada mudou',flush=True)
                except Exception as e: print('  ?',c['t'],str(e)[:70],flush=True)
        json.dump(R,open('/home/claude/lafouch/work/s352/botoes-%d.json'%parte,'w'),ensure_ascii=False,indent=1)
    B[0].close()
print('FIM')
