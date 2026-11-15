# S324: confere as telas mexidas no app real (simulador), nos temas escuro e claro: contraste do texto dos controles, altura de toque, linha das abas, e fotos para olhar.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
T='/tmp/s324/';os.makedirs(T,exist_ok=True)
CONTR="""(q)=>{const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])};
  const fundo=e=>{for(let x=e;x;x=x.parentElement){const b=getComputedStyle(x).backgroundColor,m=b.match(/[\\d.]+/g);if(m&&(m.length<4||+m[3]>.5))return b}return getComputedStyle(document.body).backgroundColor};
  return [...document.querySelectorAll(q)].filter(e=>e.offsetParent&&(e.innerText||'').trim()).map(e=>{const a=lum(getComputedStyle(e).color),b=lum(fundo(e)),r=e.getBoundingClientRect();return [(e.innerText||'').trim().split('\\n')[0].slice(0,20),+((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(1),Math.round(r.height)]})}"""
def confere(pg,nome,q):
    r=pg.evaluate(CONTR,q);ruim=[x for x in r if x[1]<4.5];baixo=[x for x in r if x[2]<40 and x[0] not in ('outro app',)]
    print(' ',nome,len(r),'controles · contraste<4,5:',ruim or 'nenhum','· toque<40:',baixo or 'nenhum')
def linha(pg,id_):
    return pg.evaluate("i=>{const c=document.getElementById(i);if(!c)return 'SEM '+i;const l=c.querySelector('.lfLinha'),o=c.querySelector('.on');if(!l)return 'sem linha';const a=l.getBoundingClientRect(),b=o.getBoundingClientRect();return 'linha sob \"'+o.innerText.trim().split('\\n')[0]+'\": '+(Math.abs(a.left-b.left)<2&&Math.abs(a.width-b.width)<2)}",id_)
with sync_playwright() as pw:
    for esc in (True,False):
        tema='escuro' if esc else 'claro';print('== tema',tema)
        b,pg,w=base.abre(pw,'inicio',esc)
        pg.evaluate("()=>{const S=window.__LF.S||null}");print('  início tem Recentes:',pg.evaluate("()=>!!document.querySelector('.fnRec')"));pg.screenshot(path=T+'inicio_%s.png'%tema)
        pg.evaluate("window.__LF.setView('ped')");w(900);confere(pg,'pedidos','#pdTabs button');print('  ',linha(pg,'pdTabs'))
        pg.evaluate("()=>{const x=document.querySelector('#pdTabs [data-id=ent]');x.click()}");w(900);print('   depois de tocar em Feitos:',linha(pg,'pdTabs'));pg.screenshot(path=T+'ped_%s.png'%tema)
        pg.evaluate("window.__LF.setView('clientes')");w(900);confere(pg,'clientes','#v-clientes .top button');pg.screenshot(path=T+'cli_%s.png'%tema)
        pg.click('#v-clientes [data-act=ataLotes]');w(900);print('   "Lotes ›" abre:',pg.evaluate("()=>{const j=[...document.querySelectorAll('[class*=Jn]')].filter(e=>e.offsetParent);return j.length?j[0].innerText.trim().replace(/\\n+/g,' | ').slice(0,50):'NADA'}"))
        b.close();b,pg,w=base.abre(pw,'inicio',esc)
        pg.evaluate("window.__LF.setView('caixa')");w(900);pg.screenshot(path=T+'din_%s.png'%tema)
        pg.evaluate("window.__LF.setView('dash')");w(900);confere(pg,'dashboard','#v-dash .dHdT,#v-dash .dHdP');pg.screenshot(path=T+'dash_%s.png'%tema)
        pg.evaluate("window.__LF.setView('estoque')");w(900)
        pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-estoque .pcard')];(c[1]||c[0]).click()}");w(1200);pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-estoque .pcard')].filter(x=>x.offsetParent);c[0].click()}");w(1500)
        pg.evaluate("()=>{const t=document.getElementById('fnAbas');t&&t.scrollIntoView({block:'center'})}");w(400);confere(pg,'ficha','#fnAbas button');print('  ',linha(pg,'fnAbas'))
        pg.click('#fnAbas [data-id=his]');w(900);print('   depois de tocar em Histórico:',linha(pg,'fnAbas'),'| painel:',pg.evaluate("()=>{const p=document.querySelector('.fnPane,.fnPn');return p?p.innerText.trim().slice(0,30):'?'}"));pg.screenshot(path=T+'ficha_%s.png'%tema)
        pg.evaluate("window.__LF.setView('vendas')");w(900);pg.click('#cjSh');w(600);pg.evaluate("()=>{[...document.querySelectorAll('#v-vendas .pcard')].slice(1,2).forEach(x=>x.click())}");w(500);pg.evaluate("()=>{const g=document.querySelector('.ebGo');g&&g.click()}");w(1300)
        confere(pg,'compartilhar','.ebJn button,.ebJn .s185G b,.ebJn .s185G small');print('  ',linha(pg,'s185Tabs'))
        pg.click('#s185Tabs [data-p=loj]');w(700);print('   depois de tocar em Lojista:',linha(pg,'s185Tabs'),'| opções:',pg.evaluate("()=>[...document.querySelectorAll('.s185G b')].map(b=>b.innerText)"));pg.screenshot(path=T+'comp_%s.png'%tema)
        b.close()
