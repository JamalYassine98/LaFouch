# S380 · esboço 114 (dono 17/11 22:34): data em formato americano (mm/dd/yyyy) está errada → sempre dd/mm/aaaa.
# O campo de data do navegador segue a língua do aparelho; o app passa a mostrar a data ele mesmo (dd/mm/aaaa) e o calendário continua abrindo ao tocar.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s380/';T='/tmp/s380/';os.makedirs(T,exist_ok=True)
OF="()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{document.querySelector('#v-estoque .pcard[data-ref]').click();setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>/% Oferta/.test(x.innerText)&&x.getBoundingClientRect().height);b&&b.click();setTimeout(()=>{const d=[...document.querySelectorAll('input[type=date]')].filter(x=>x.getBoundingClientRect().height)[0];d&&d.scrollIntoView({block:'center'})},600)},900)},600)}"
DASH="()=>{const L=window.__LF,S=L.S;S.per='pers';S.perDe='2026-11-01';S.perAte='2026-11-17';S.dTab='hoje';L.setView('dash');setTimeout(()=>{const b=[...document.querySelectorAll('#v-dash button')].find(x=>/Hoje|Este mês|Período/i.test(x.innerText)&&x.getBoundingClientRect().height);},300)}"
FIX=r"""(vals)=>{const ins=[...document.querySelectorAll('input[type=date]')].filter(x=>x.getBoundingClientRect().height);ins.forEach((d,i)=>{const v=vals[i]!==undefined?vals[i]:d.value;d.style.webkitTextFillColor='transparent';const q=d.getBoundingClientRect();
 const t=document.createElement('span');t.textContent=v?v.split('-').reverse().join('/'):'dd/mm/aaaa';t.style.cssText='position:fixed;left:'+(q.left+14)+'px;top:'+(q.top+q.height/2)+'px;transform:translateY(-50%);pointer-events:none;z-index:9999;font:'+getComputedStyle(d).font+';color:'+(v?'var(--fg)':'var(--mute)');document.body.appendChild(t)});return ins.length}"""
CASOS=[('a','oferta-data','Ficha da peça › % Oferta · "Termina em"',OF,[''],'Hoje: o campo mostra "mm/dd/yyyy" (formato americano: mês antes do dia).','Proposta: o app mostra a data sempre no nosso jeito, "dd/mm/aaaa" (ex.: 20/11/2026); tocar abre o mesmo calendário.'),
       ('b','periodo-data','Dashboard · período escolhido (De / Até)',"()=>{const L=window.__LF,S=L.S;S.per='custom';S.perDe='2026-11-01';S.perAte='2026-11-17';S.dTab='hoje';L.setView('dash')}",None,'Hoje: as datas De/Até seguem o formato do navegador (no simulador, americano: 11/01/2026).','Proposta: sempre dd/mm/aaaa (01/11/2026 · 17/11/2026). Vale também para "Ir para o dia" no Histórico.')]
with sync_playwright() as pw:
  for k,nome,tit,js,vals,h,p in CASOS:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate(js);w(2600)
        n=pg.evaluate("()=>{const d=[...document.querySelectorAll('input[type=date]')].filter(x=>x.getBoundingClientRect().height);d[0]&&d[0].scrollIntoView({block:'center'});return d.length}")
        w(300)
        if prop: pg.evaluate(FIX,vals or []);w(300)
        oo.append(olho(pg));fp=T+'d%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'campos',n,'novos:',novos(oo[0],oo[1]))
      prancha('114%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
