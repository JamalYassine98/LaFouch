# S351: o que cada aba do "Resumo ▾" mostra × o que cada tela solta (atalho do Início) mostra — títulos e rótulos dos blocos, no app real.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
BL="""sel=>{const v=document.querySelector(sel);if(!v)return [];const o=[];v.querySelectorAll('h2,h3,.lbl,summary,.famRot').forEach(e=>{if(!e.offsetParent)return;const t=(e.innerText||'').replace(/\\s+/g,' ').replace(/[›⌄▾]/g,'').trim();if(t.length>2&&t.length<46&&!o.includes(t))o.push(t)});return o}"""
R={}
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'dash',True);w(1500)
    abas=pg.evaluate("()=>{document.querySelector('#v-dash .dHdT').click();return 1}");w(900)
    ids=pg.evaluate("()=>[...document.querySelectorAll('[data-act=dTabVai],[data-act=dtab],[data-act]')].filter(e=>e.offsetParent&&/Giro|Reservas|Preços|Online|Resumo/.test(e.innerText)&&e.innerText.length<70).map(e=>[e.getAttribute('data-act'),e.getAttribute('data-id'),e.innerText.split('\\n')[0]])")
    print(ids);b.close()
    for act,i,nome in ids:
        if not i: continue
        b,pg,w=ap.abre(pw,'dash',True);pg.evaluate("a=>{window.__LF.ACT[a[0]](a[1])}",[act,i]);w(2000)
        R['aba '+nome]={'blocos':pg.evaluate(BL,'#v-dash'),'alt':pg.evaluate("()=>document.scrollingElement.scrollHeight")};b.close()
    for nome,tela in (('Dashboard (dia)','dia'),('Dinheiro','caixa'),('Despesas','desp'),('Câmbio','fx'),('Histórico','hist'),('Loja online','onl'),('Pedidos','ped')):
        b,pg,w=ap.abre(pw,tela,True);w(1500);R['tela '+nome]={'blocos':pg.evaluate(BL,'#v-'+tela),'alt':pg.evaluate("()=>document.scrollingElement.scrollHeight")};b.close()
    b,pg,w=ap.abre(pw,'inicio',True);w(1200)
    R['atalhos do Início']=pg.evaluate("()=>[...document.querySelectorAll('#v-inicio [data-act=inicioGo],#v-inicio .tile,#v-inicio [data-id]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-id')||'')+':'+e.innerText.replace(/\\s+/g,' ').slice(0,40))");b.close()
json.dump(R,open('/home/claude/lafouch/work/s351/abas.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items(): print('\n##',k,v if isinstance(v,list) else '(%d px) '%v['alt']+' | '.join(v['blocos']))
