# ESBOCO 24/11: o "voltar" do app real (www do main) nos 3 jeitos: a seta/versalete da tela, o voltar do navegador/PWA (history.back) e o do Android (Capacitor)
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
ONDE=r"""()=>{const S=__LF.S;const v=document.querySelector('.view:not([hidden])');const h=v&&[...v.querySelectorAll('h1,h2,.nvTit,.vTit')].find(e=>e.getBoundingClientRect().height);
 const bk=v&&[...v.querySelectorAll('[data-act=nvVolta]')].find(e=>e.getBoundingClientRect().height);
 return {view:S.view,tab:S.dTab||'',set:S.tiSet||'',titulo:h?h.textContent.trim().slice(0,30):'',seta:bk?bk.textContent.trim().slice(0,20):'',pilha:(S.nvP||[]).join('>'),hash:location.hash}}"""
CLICA=r"""(t)=>{const els=[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act],nav button,.tabbar button')].filter(e=>e.getBoundingClientRect().height>0);
 const e=els.find(e=>e.textContent.trim().replace(/\s+/g,' ').startsWith(t))||els.find(e=>e.textContent.includes(t));if(!e)return 'nao achei '+t;e.click();return 'ok'}"""
SETA="()=>{const v=document.querySelector('.view:not([hidden])');const b=v&&[...v.querySelectorAll('[data-act=nvVolta]')].find(e=>e.getBoundingClientRect().height);if(!b)return 'sem seta';b.click();return 'ok'}"
# caminhos: (nome, [toques a partir do Início])
CAM=[('Preços › Regras',['Preços','Regras']),('Preços › Ofertas',['Preços','Ofertas']),('Site › Pedidos',['Site','Pedidos']),
     ('Resultados',['Resultados']),('Clientes',['Clientes']),('Marketing',['Marketing']),('Atacado',['Atacado'])]
R=[]
with sync_playwright() as pw:
  for nome,toq in CAM:
    for modo in ('seta','navegador','android'):
      b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800)
      trilha=[pg.evaluate(ONDE)]
      for t in toq:
        r=pg.evaluate(CLICA,t);w(900);o=pg.evaluate(ONDE);o['toque']=t+(' ('+r+')' if r!='ok' else '');trilha.append(o)
      for i in range(len(toq)):
        if modo=='seta': r=pg.evaluate(SETA)
        elif modo=='navegador':
          n0=pg.evaluate('history.length');pg.evaluate("()=>{setTimeout(()=>history.back(),0)}");r='ok (historico %d)'%n0
        else: r=pg.evaluate("()=>{if(!window.__nvVoltarAndroid)return 'sem';window.__nvVoltarAndroid();return 'ok'}")
        w(900)
        try:o=pg.evaluate(ONDE)
        except Exception as e:
          o={'view':'SAIU DO APP','tab':'','set':'','titulo':pg.url[:60],'seta':'','pilha':'','hash':''}
        o['toque']='voltar/'+modo+(' ('+r+')' if r!='ok' else '');trilha.append(o)
        if o['view']=='SAIU DO APP':break
      R.append({'caminho':nome,'modo':modo,'trilha':trilha});b.close()
json.dump(R,open('voltar.json','w'),ensure_ascii=False,indent=1)
for x in R:
  print('==',x['caminho'],'·',x['modo'])
  for o in x['trilha']:print('   ',o.get('toque','início'),'→',o['view'],o['tab'],o['set'],'|',o['titulo'],'| seta:',o['seta'],'| pilha:',o['pilha'],o['hash'])
