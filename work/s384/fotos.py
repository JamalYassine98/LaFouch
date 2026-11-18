# S384: fotos de TODAS as telas de dentro (Histórico, Dashboard em outros períodos, janelas de cada aba) para conferir o padrão de luxo.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
L="window.__LF"
def V(v): return "()=>%s.setView('%s')"%(L,v)
def G(k): return "()=>%s.inicioGo('%s')"%(L,k)
def CL(sel,txt=None,i=0): return "()=>{const e=[...document.querySelectorAll(%r)].filter(x=>x.getBoundingClientRect().height)%s[%d];e&&e.click();return !!e}"%(sel,(".filter(x=>/%s/.test(x.innerText||x.getAttribute('aria-label')||''))"%txt) if txt else '',i)
C=[
 ('hist-lista',[V('hist')]),
 ('hist-dia',[V('hist'),CL('#v-hist [data-act=hday],#v-hist .d71,#v-hist [data-act=dayab]')]),
 ('hist-semana',[V('hist'),CL('#v-hist .hSem,#v-hist [aria-expanded=false]')]),
 ('hist-filtros',[V('hist'),CL('#v-hist button','Filtr|filtr')]),
 ('hist-busca',[V('hist'),"()=>{const i=document.querySelector('#v-hist input');i.value='SL';i.dispatchEvent(new Event('input',{bubbles:true}));return 1}"]),
 ('dash-semana',["()=>{%s.S.per='semana';%s.S.dTab='hoje';%s.setView('dash')}"%(L,L,L)]),
 ('dash-mes',["()=>{%s.S.per='mes';%s.S.dTab='hoje';%s.setView('dash')}"%(L,L,L)]),
 ('dash-custom',["()=>{%s.S.per='custom';%s.S.perDe='2026-11-01';%s.S.perAte='2026-11-10';%s.S.dTab='hoje';%s.setView('dash')}"%(L,L,L,L,L)]),
 ('dash-folha-periodo',[G('hoje'),"()=>%s.ACT.dPer()"%L]),
 ('dash-folha-ver',[G('hoje'),CL('[data-act=dVer]')]),
 ('dash-contas-dia',[G('hoje'),CL('#v-dia .kpi','Contas')]),
 ('dash-ver-todas-vendas',[G('hoje'),CL('#v-dia button','Ver todas as vendas')]),
 ('dash-mes-vendido',["()=>{%s.S.per='mes';%s.S.dTab='hoje';%s.setView('dash')}"%(L,L,L),CL('#v-dash .kpi','Vendido|VENDIDO')]),
 ('reservas-para-onde',[G('din'),CL('[data-act=dfold],.g99 .fxH','para onde')]),
 ('reservas-30dias',[G('din'),CL('.g99 .fxH,[data-act=dfold]','30 dias')]),
 ('giro-lista-compras',[G('giro'),CL('.g99 .fxH','Lista de compras')]),
 ('giro-vitrine',[G('giro'),CL('.g99 .fxH','Vitrine')]),
 ('giro-retorno',[G('giro'),CL('.g99 .fxH','Retorno')]),
 ('giro-abc',[G('giro'),CL('.g99 .fxH','Curva')]),
 ('giro-no-estoque',[G('giro'),CL('.kpi','ESTOQUE|estoque')]),
 ('giro-parado',[G('giro'),CL('.kpi','PARADO|Parado')]),
 ('precos',[G('prec')]),
 ('precos-corrigir',[G('prec'),CL('button,[data-act]','preços para corrigir')]),
 ('precos-contas',[G('prec'),CL('button,[data-act]','Contas, taxas')]),
 ('caixa-acoes',[V('caixa'),CL('[data-act=cxmenu]')]),
 ('caixa-retirar',[V('caixa'),CL('[data-act=cxmenu]'),CL('button,[data-act]','^Retirar')]),
 ('caixa-novo-objetivo',[V('caixa'),CL('.obNovo')]),
 ('caixa-conferir',[V('caixa'),CL('[data-act=cxmenu]'),CL('button,[data-act]','^Conferir')]),
 ('caixa-reservado',[V('caixa'),CL('[data-act=cxReservas]')]),
 ('caixa-movimentos',[V('caixa'),CL('[data-act=famAbre]')]),
 ('cambio-dolar',[V('fx'),"()=>%s.ACT.fjAbre&&%s.ACT.fjAbre('usd')"%(L,L)]),
 ('cambio-repo',[V('fx'),"()=>%s.ACT.fjAbre('repo')"%L]),
 ('cambio-troca',[V('fx'),"()=>%s.ACT.fjAbre('troca')"%L]),
 ('cambio-trocas',[V('fx'),"()=>%s.ACT.fjAbre('trocas')"%L]),
 ('cambio-site',[V('fx'),"()=>%s.ACT.fjAbre('site')"%L]),
 ('cambio-prot',[V('fx'),"()=>%s.ACT.fjAbre('prot')"%L]),
 ('despesas-nova',[V('desp'),CL('[data-act=despNova]')]),
 ('despesas-conta',[V('desp'),CL('#v-desp .ecTog')]),
 ('despesas-imprevistos',[V('desp'),CL('[data-act=dfold],.fxH','Imprevistos')]),
 ('pendencias',[V('notif')]),
 ('guardiao',[V('notif'),CL('[data-act=guardAbre]')]),
 ('marketing',[G('mkt')]),
 ('marketing-post',[G('mkt'),CL('#v-mkt button','^Post$')]),
 ('marketing-listas',[G('mkt'),CL('#v-mkt summary,#v-mkt .mkSec','Listas')]),
 ('clientes-novo',[V('clientes'),CL('[data-act=clinovo]')]),
 ('atacado-lojistas',[G('ata'),"()=>%s.ACT.ataAba('loj')"%L]),
 ('atacado-lotes',[G('ata'),"()=>%s.ACT.ataAba('lot')"%L]),
 ('atacado-tabela',[G('ata'),"()=>%s.ACT.ataAba('tab')"%L]),
 ('inventario-fornecedores',[V('estoque'),CL('#v-estoque button','Fornecedores')]),
 ('inventario-ficha',[V('estoque'),CL('#v-estoque .pcard[data-ref]')]),
 ('inventario-ficha-historico',[V('estoque'),CL('#v-estoque .pcard[data-ref]'),CL('button','^Histórico$')]),
 ('inventario-ficha-preco',[V('estoque'),CL('#v-estoque .pcard[data-ref]'),CL('button','^Preço$')]),
 ('inventario-editar',[V('estoque'),CL('#v-estoque .pcard[data-ref]'),CL('button','^Editar|Editar produto')]),
 ('inventario-novo',[V('estoque'),CL('#v-estoque button','^\\+$|Adicionar')]),
 ('catalogo-carrinho',["()=>{const S=%s.S;S.cart=S.items.filter(i=>i.qty>0&&!i.bulk).slice(0,2).map(i=>({it:i,qty:1,tab:S.tabAtiva,preco:null}));%s.setView('vendas')}"%(L,L),"()=>%s.ACT.cartopen()"%L]),
 ('catalogo-pagamento',["()=>{const S=%s.S;S.cart=S.items.filter(i=>i.qty>0&&!i.bulk).slice(0,1).map(i=>({it:i,qty:1,tab:S.tabAtiva,preco:null}));%s.setView('vendas')}"%(L,L),"()=>%s.ACT.cartopen()"%L,CL('button','Ir para o pagamento')]),
 ('catalogo-peca',[V('vendas'),CL('#vRows .pcard[data-ref]')]),
]
only=os.environ.get('SO')
res={}
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300);url=pg.url
  for nome,passos in C:
    if only and nome not in only.split(','): continue
    pg.goto("about:blank");pg.goto(url);pg.wait_for_function('window.__LF');w(700)
    ok=[]
    for p in passos:
      try: ok.append(pg.evaluate(p))
      except Exception as e: ok.append('ERR')
      w(1100)
      if ok[-1] is False: w(1200); ok[-1]=pg.evaluate(p); w(1100)
    pg.screenshot(path='/tmp/s384/%s.png'%nome);res[nome]=ok;print(nome,ok,flush=True)
  b.close()
