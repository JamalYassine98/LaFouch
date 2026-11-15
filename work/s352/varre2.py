# S352 VARREDURA COMPLETA: toca cada botão de cada tela (nível 0) e, quando o toque abre um bloco, janela ou folha, toca também cada botão
# novo que apareceu (nível 1). Sessão nova a cada toque. Anota: nada mudou · não deu para tocar · ok. Uso: varre2.py <parte 0..3>
import sys,json,os;parte=int(sys.argv[1]);sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
TELAS=[('Início','inicio',''),('Catálogo','vendas',''),('Inventário','estoque',''),('Dinheiro','caixa',''),('Despesas','desp',''),('Câmbio','fx',''),('Clientes','clientes',''),('Pedidos','ped',''),
 ('Dashboard (dia)','dia',''),('Resumo','dash','hoje'),('Reservas','dash','din'),('Giro','dash','giro'),('Preços','dash','prec'),('Online (aba)','dash','onl'),('Histórico','hist',''),('Ajustes','ajustes',''),('Notificações','notif','')]
ORD=[15,11,12,4,14,3,8,10,2,9,5,0,16,6,7,13,1];TELAS=[TELAS[i] for i in ORD]
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
    pg=nova(pw);pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(600)
    if t[1]!='inicio': pg.evaluate("a=>{const L=window.__LF;if(a[1])L.S.dTab=a[1];L.setView(a[0])}",[t[1],t[2]]);pg.wait_for_timeout(800)
    return pg
JS="""(marca)=>{const cam=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position!=='fixed'||s.display==='none'||s.visibility==='hidden'||+s.opacity<.3)return false;const r=e.getBoundingClientRect();return r.height>90&&r.width>200&&(+s.zIndex||0)>40&&e.id!=='mainnav'&&e.querySelector('button,[data-act],input')}).sort((a,b)=>(+getComputedStyle(b).zIndex||0)-(+getComputedStyle(a).zIndex||0))[0];
 const esc=cam||[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const o=[];document.querySelectorAll('[data-vz]').forEach(e=>e.removeAttribute('data-vz'));
 [...esc.querySelectorAll('button,[data-act],[role=button],summary,a[href]')].forEach(e=>{if(!e.offsetParent||e.disabled)return;const r=e.getBoundingClientRect();if(r.width<6||r.height<6)return;const t=((e.getAttribute('aria-label')||e.innerText||e.getAttribute('data-act')||'')+'').replace(/\\s+/g,' ').trim().slice(0,44);const k=(e.getAttribute('data-act')||e.tagName)+'|'+t.replace(/[0-9.,]+/g,'#');
  if(/mcLiga|modo cliente|modo loja|sair|logout|apag|exclu|zerar|restaur|backup|export|import|imprim|instalar|apkgo|bio|sincron|whats|compartilh|nuvem|conectar|câmera|camera|foto|pix|pagar|finalizar|mandar ao|enviar/i.test(k))return;if(o.some(x=>x.k===k))return;e.scrollIntoView({block:'center',behavior:'instant'});const q=e.getBoundingClientRect();const tp=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);if(!tp||!(tp===e||e.contains(tp)||tp.contains(e)&&tp.closest('button,[data-act],summary,a')===e))return;if(e.classList.contains('pcard')&&o.filter(x=>x.pc).length>=1)return;if(marca)e.setAttribute('data-vz',k);o.push({k,t,pc:e.classList.contains('pcard'),w:r.width|0,h:r.height|0})});return {cam:!!cam,o}}"""
SIG="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const fx=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return s.position==='fixed'&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>.3&&e.getBoundingClientRect().height>30&&(+s.zIndex||0)>40}).length;
 const t=document.body.innerText.replace(/\\d/g,'#');let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;const cl=[...document.querySelectorAll('.on,[aria-pressed=true],[aria-expanded=true],[open],:checked')].map(e=>(e.innerText||e.id||'').slice(0,12)).join('|')+getComputedStyle(document.body).backgroundColor+JSON.stringify(document.documentElement.dataset);return [v?v.id:'',window.__LF.S.dTab||'',fx,h,t.length,document.querySelectorAll('body *').length,cl,(document.activeElement||{}).tagName||'',Math.round(scrollY),document.documentElement.className]}"""
def toca(pg,k):
    pg.evaluate(JS,True);e=pg.query_selector('[data-vz="%s"]'%k.replace('\\','\\\\').replace('"','\\"'))
    if not e: return 'sumiu'
    a=pg.evaluate(SIG)
    try: e.evaluate('e=>e.click()')
    except Exception: return 'nao-tocavel'
    pg.wait_for_timeout(850);d=pg.evaluate(SIG)
    if a==d: return 'nada'
    if a[0]!=d[0] or a[1]!=d[1]: return 'navegou'
    return 'abriu' if (d[2]>a[2] or d[5]>a[5]+3) else 'mudou'
R=[];n=0
with sync_playwright() as pw:
    for t in [x for i,x in enumerate(TELAS) if i%4==parte]:
        try: pg=vai(pw,t);c0=pg.evaluate(JS,False)['o']
        except Exception as e: print(t[0],'ERRO',str(e)[:80],flush=True);continue
        print('#',t[0],len(c0),flush=True);k0=set(c['k'] for c in c0)
        for c in c0[:70]:
            try:
                pg=vai(pw,t);r=toca(pg,c['k']);n+=1;R.append({'tela':t[0],'caminho':[c['t']],'r':r,'w':c['w'],'h':c['h']})
                if r in('nada','nao-tocavel'): print('  %s %s'%('∅' if r=='nada' else '✗',c['t']),flush=True)
                if r in('abriu','mudou'):
                    c1=[x for x in pg.evaluate(JS,False)['o'] if x['k'] not in k0][:22]
                    for x in c1:
                        try:
                            pg=vai(pw,t);toca(pg,c['k']);r2=toca(pg,x['k']);n+=1;R.append({'tela':t[0],'caminho':[c['t'],x['t']],'r':r2,'w':x['w'],'h':x['h']})
                            if r2 in('nada','nao-tocavel'): print('  %s %s › %s'%('∅' if r2=='nada' else '✗',c['t'],x['t']),flush=True)
                        except Exception as e: R.append({'tela':t[0],'caminho':[c['t'],x['t']],'r':'erro'})
            except Exception as e: R.append({'tela':t[0],'caminho':[c['t']],'r':'erro','e':str(e)[:90]});print('  ? erro',c['t'],str(e)[:90],flush=True)
        json.dump(R,open('/home/claude/lafouch/work/s352/varre2-%d.json'%parte,'w'),ensure_ascii=False,indent=0);print('  … %d toques até aqui'%n,flush=True)
    B[0].close()
print('FIM',n)
