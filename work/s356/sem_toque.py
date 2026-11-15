# S356: ESTUDO do app inteiro com o olhar aprovado em 15/11 18:56 — informação que PEDE UMA AÇÃO (trocar, repor, pagar, falta, vence, corrigir…)
# mas NÃO tem toque (não é botão, nem está dentro de um). App real, celular, blocos recolhidos abertos. Só leitura.
import sys,json,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
TELAS=[('Início','inicio',''),('Catálogo','vendas',''),('Inventário','estoque',''),('Dinheiro','caixa',''),('Despesas','desp',''),('Câmbio','fx',''),('Clientes','clientes',''),('Pedidos','ped',''),('Dashboard (dia)','dia',''),('Resumo','dash','hoje'),('Reservas','dash','din'),('Giro','dash','giro'),('Preços','dash','prec'),('Online (aba)','dash','onl'),('Histórico','hist',''),('Ajustes','ajustes',''),('Notificações','notif','')]
ABRE="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);let n=0;[...v.querySelectorAll('details:not([open])>summary,[aria-expanded=false],.dfold')].forEach(e=>{if(e.offsetParent&&!/on|open/.test(e.className)){try{e.click();n++}catch(x){}}});return n}"""
JS="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const rx=/\\b(trocar|troque|repor|reponha|pagar|pague|falta[m]?|vence[u]?|venc[ei]|corrigir|ajustar|registrar|fotografar|sem custo|sem foto|sem detalhe|abaixo d[oa]|acabando|vão acabar|parado|pedir|comprar|conferir|fechar o dia|não bate|cobrar)\\b/i;const o=[];const w=document.createTreeWalker(v,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const t=n.textContent.replace(/\\s+/g,' ').trim();if(t.length<8||!rx.test(t))continue;const e=n.parentElement;if(!e||!e.offsetParent||e.closest('svg,script,style,.pcard,#rows,#vRows,input,textarea,label'))continue;
  const toque=e.closest('button,a[href],[data-act],summary,[role=button]');const bloco=e.closest('section,details,.card,.kpi')||e.parentElement;const temBotao=bloco&&bloco.querySelector('button,a[href],[data-act]');const ti=bloco&&(bloco.querySelector('h2,h3,.lbl,summary,b')||{}).innerText;
  o.push({t:t.slice(0,110),toque:!!toque,blocoTemBotao:!!temBotao,bloco:(ti||'').replace(/\\s+/g,' ').slice(0,34)})}return o}"""
R={}
with sync_playwright() as pw:
    for nome,tela,aba in TELAS:
        b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("a=>{const L=window.__LF;if(a[1])L.S.dTab=a[1];L.setView(a[0])}",[tela,aba]);w(1500)
        if tela!='caixa': pg.evaluate(ABRE);w(700)
        R[nome]=pg.evaluate(JS);b.close()
json.dump(R,open('/home/claude/lafouch/work/s356/sem_toque.json','w'),ensure_ascii=False,indent=0)
for k,v in R.items():
    s=[x for x in v if not x['toque']];print('\n## %s · %d frases que pedem ação, %d sem toque'%(k,len(v),len(s)))
    vis=set()
    for x in s:
        c=re.sub(r'\d[\d.,]*','#',x['t'])[:60]
        if c in vis: continue
        vis.add(c);print('   %s[%s] %s'%('· ' if x['blocoTemBotao'] else '✗ ',x['bloco'],x['t'][:95]))
