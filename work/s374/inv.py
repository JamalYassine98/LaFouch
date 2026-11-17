# S374 · inventário de peças do app (dono 17/11 12:32: "padronizada" — nada pode ser diferente entre as abas).
# Abre cada tela do app (claro), acha as peças de cada tipo, agrupa pela aparência (assinatura) e guarda um recorte de cada variação.
# Saída: /tmp/inv/inv.json + /tmp/inv/<tipo>_<n>.png
import sys,os,json,hashlib;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
OUT='/tmp/inv/';os.makedirs(OUT,exist_ok=True)
TELAS=[('Início',"()=>window.__LF.setView('inicio')"),('Vender',"()=>window.__LF.setView('vendas')"),
 ('Vender › peça',"()=>{window.__LF.setView('vendas');setTimeout(()=>document.querySelectorAll('#v-vendas .pcard')[1].click(),300)}"),
 ('Inventário',"()=>window.__LF.setView('estoque')"),('Inventário › peça',"()=>{window.__LF.setView('estoque');setTimeout(()=>document.querySelectorAll('#v-estoque .pcard')[1].click(),300)}"),
 ('Estúdio',"()=>window.__LF.inicioGo('est')"),
 ('Resultados › Dia',"()=>window.__LF.inicioGo('hoje')"),('Resultados › Histórico',"()=>window.__LF.inicioGo('hist')"),
 ('Giro',"()=>window.__LF.inicioGo('giro')"),('Preços',"()=>window.__LF.inicioGo('prec')"),('Reservas',"()=>window.__LF.inicioGo('din')"),
 ('Caixa',"()=>window.__LF.setView('caixa')"),('Despesas',"()=>window.__LF.setView('desp')"),('Câmbio',"()=>window.__LF.setView('fx')"),
 ('Site',"()=>window.__LF.setView('site')"),('Pedidos',"()=>window.__LF.setView('ped')"),
 ('Marketing',"()=>window.__LF.inicioGo('mkt')"),('Cartões',"()=>window.__LF.inicioGo('cup')"),
 ('Clientes',"()=>window.__LF.setView('clientes')"),('Atacado',"()=>window.__LF.setView('ata')"),
 ('Ajustes',"()=>window.__LF.setView('ajustes')"),('Avisos',"()=>window.__LF.setView('notif')")]
COLETA=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.05&&e.offsetParent!==null};
 const raiz=document.querySelector('.ljJn.mkJn')||document.querySelector('.estOv:not([hidden])')||document.querySelector('.view:not([hidden])')||document.body;
 const cs=e=>getComputedStyle(e),px=v=>Math.round(parseFloat(v)||0),cor=c=>c.replace(/\s/g,'');
 const sig=(e,t)=>{const s=cs(e),r=e.getBoundingClientRect();return [t,s.backgroundColor==='rgba(0,0,0,0)'||s.backgroundColor==='transparent'?'semfundo':'fundo',s.borderTopWidth!=='0px'&&s.borderTopStyle!=='none'?'borda':'semborda',
   px(s.borderTopLeftRadius)>=r.height/2-1?'pílula':px(s.borderTopLeftRadius)+'r',Math.round(r.height/4)*4+'h',px(s.fontSize)+'px',s.fontWeight,s.textTransform==='uppercase'?'MAIÚSC':'',cor(s.color)].join('|')};
 const out=[];const add=(e,t)=>{if(!vis(e)||!raiz.contains(e))return;const r=e.getBoundingClientRect();out.push({t,sig:sig(e,t),txt:(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,40),x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height})};
 const vist=new Set();const marca=(sel,t)=>raiz.querySelectorAll(sel).forEach(e=>{if(vist.has(e))return;vist.add(e);add(e,t)});
 marca('[data-act=dfold],details>summary,.ajR,.fxH','bloco que abre');
 marca('[role=tab],.lfAbas button,.nav button,.fnTabs button','aba');
 marca('.chip,.seg button,.sg77 button,.mkObj button,[aria-pressed]','opção');
 marca('.kpi,.stN','número');
 [...raiz.querySelectorAll('button,a,[role=button]')].forEach(e=>{if(vist.has(e))return;const t=(e.textContent||'').trim();vist.add(e);
   if(/›\s*$/.test(t)&&t.length>2){add(e,'linha/link com ›');return}
   if(t.length<=2||!t){add(e,'botão de ícone');return}
   add(e,'botão')});
 raiz.querySelectorAll('*').forEach(e=>{if(e.children.length||vist.has(e))return;const s=cs(e),t=(e.textContent||'').trim();if(t.length<3||t.length>40)return;
   if((s.textTransform==='uppercase'||(t===t.toUpperCase()&&/[A-ZÀ-Ú]{3}/.test(t)))&&parseFloat(s.fontSize)<15&&!e.closest('button,a'))add(e,'título de seção')});
 raiz.querySelectorAll('section.card,.card,.gp77,.cx97,.ajGrp,.fxF').forEach(e=>{if(vist.has(e))return;vist.add(e);add(e,'cartão')});
 return out}"""
res={}
with sync_playwright() as pw:
    for nome,js in TELAS:
        b,pg,w=ap.abre(pw,'inicio',False);w(600)
        try:
            pg.evaluate(js);w(1600)
            H=pg.evaluate("()=>document.documentElement.scrollHeight")
            itens=pg.evaluate(COLETA)
            for it in itens:
                k=it['sig'];d=res.setdefault(it['t'],{}).setdefault(k,{'n':0,'telas':[],'ex':[]})
                d['n']+=1
                if nome not in d['telas']: d['telas'].append(nome)
                if len(d['ex'])<1:
                    fn=OUT+hashlib.md5(k.encode()).hexdigest()[:10]+'.png'
                    try:
                        pg.evaluate("y=>scrollTo({top:Math.max(0,y-200),behavior:'instant'})",it['y']);w(150)
                        sy=pg.evaluate("()=>scrollY");pg.screenshot(path=fn,clip={'x':max(0,it['x']-6),'y':max(0,it['y']-sy-6),'width':min(it['w']+12,390),'height':min(it['h']+12,260)})
                        d['ex'].append({'tela':nome,'txt':it['txt'],'img':fn})
                    except Exception as e: d['ex'].append({'tela':nome,'txt':it['txt'],'img':'','err':str(e)[:60]})
        except Exception as e: print('ERRO',nome,str(e)[:100])
        b.close();print(nome,'ok')
json.dump(res,open(OUT+'inv.json','w'),ensure_ascii=False,indent=1)
for t,d in res.items(): print(t,len(d),'variações')
