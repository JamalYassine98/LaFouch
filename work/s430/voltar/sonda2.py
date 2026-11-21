import sys, os, json
sys.argv=['x',os.environ.get('PORTA','8702'),'/tmp/esc/out']
sys.path.insert(0,'/tmp/esc');sys.path.insert(0,'/home/claude/lafouch/work/testes')
import pv as P
from playwright.sync_api import sync_playwright
W=int(os.environ.get('W','390'))
def conta(pg): pg.click("#contabtn"); pg.wait_for_timeout(1000)
def bag(pg): pg.click('#bagbtn'); pg.wait_for_timeout(900)
def mnu(pg): pg.click('#mnb'); pg.wait_for_timeout(700)
def bus(pg): pg.click('#sbtn'); pg.wait_for_timeout(700)
def zoom(pg): P.a_prod(pg); pg.locator('#layer .big').first.click(); pg.wait_for_timeout(700)
def cad(pg): P.a_prod(pg); pg.locator('#layer [data-addm]:visible').first.click(); pg.wait_for_timeout(900)
def fav(pg): P.a_cat()(pg); pg.locator('#grid [data-fav]:visible').first.click(); pg.wait_for_timeout(300); pg.evaluate("window.__fshAbre&&window.__fshAbre()"); pg.wait_for_timeout(700)
def seq(*f):
    def g(pg):
        for x in f: x(pg)
    return g
def mapa(pg):
    pg.evaluate("(()=>{const a=[...document.querySelectorAll('a.mp')].find(e=>e.offsetParent);if(a){a.scrollIntoView({block:'center'});a.click()}else{const b=document.createElement('a');b.className='mp';b.href='#';document.body.appendChild(b);b.click();b.remove()}})()"); pg.wait_for_timeout(900)
AB={'mapa':mapa,'peca>mapa':seq(P.a_prod,mapa),'menu':mnu,'busca':bus,'carrinho':bag,'conta':conta,'peca':P.a_prod,'filtros':P.a_filtro,'consulta':P.a_cons,'zoom':zoom,'adicionado':cad,'categoria':lambda pg:P.a_cat()(pg),
 'conta>carrinho':seq(conta,bag),'peca>carrinho':seq(P.a_prod,bag),'peca>menu':seq(P.a_prod,mnu),'peca>busca':seq(P.a_prod,bus),'categoria>carrinho':seq(lambda pg:P.a_cat()(pg),bag),'conta>menu':seq(conta,mnu),'carrinho>conta':seq(bag,conta),'/p/SL2250.html':seq(),'/?conta=1':seq(),'/catalogo.html':seq()}
so=os.environ.get('SO')
if so: AB={k:v for k,v in AB.items() if k in so.split(',')}
EST="(()=>{const e="+P.ESTADO+";const ly=document.querySelector('#layer');e.cad=!!document.getElementById('cad')||!!document.getElementById('mapw');e.zoom=!!document.querySelector('#layer .big.zm');e.q=ly&&ly.firstElementChild?(ly.firstElementChild.className+'|'+((ly.querySelector('h1,h2,h3')||{}).textContent||'').slice(0,24)):'';e.hl=history.length;e.st=JSON.stringify(history.state);return e})()"
def chave(e): return json.dumps([e['abertos'],e['menu'],e['busca'],e['cad'],e['zoom'],e['q'],e['path']],ensure_ascii=False)
with sync_playwright() as p:
  for nome,abre in AB.items():
    R={}
    for modo in ('esc','voltar'):
      b,c,pg,er=P.novo(p,W=W,touch=W<700)
      try:
        P.carrega(pg, nome[1:] if nome[0]=='/' else '')
        try: abre(pg)
        except P.SemPecas as x: R[modo]='sem peças'; b.close(); continue
        m=pg.evaluate(EST)
        if modo=='esc': pg.keyboard.press('Escape')
        else: pg.evaluate('history.back()')
        pg.wait_for_timeout(1200); d=pg.evaluate(EST) if pg.url.startswith('http') else {'abertos':'FORA DO SITE','menu':0,'busca':0,'cad':0,'zoom':0,'q':'','path':''}; R[modo]=chave(d); R['aberto']=chave(m); R['e_'+modo]=er[:1]
      except Exception as x: R[modo]='EXC '+str(x)[:120]
      b.close()
    ig=R.get('esc')==R.get('voltar')
    print(f"{nome:20} {'IGUAL ' if ig else 'DIFERENTE'}\n   aberto: {R.get('aberto')}\n   Esc:    {R.get('esc')}"+('' if ig else f"\n   voltar: {R.get('voltar')}"),R.get('e_esc') or '',flush=True)
