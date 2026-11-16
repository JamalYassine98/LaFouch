# S368 · esboço 52: PREÇOS com menos poluição (pedido do dono, 16/11 01:02). Em "Para decidir esta semana" as linhas "Atacado X com margem N%"
# (uma por peça e por tabela) viram UMA linha por tabela. App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s368/'
from playwright.sync_api import sync_playwright
MUDA="""()=>{const D=document.querySelector('#v-dash .cntD');const L=[...D.querySelectorAll('.cntL')];const g={},pa={};
 L.forEach(l=>{const b=l.querySelector('b').innerText.trim(),s=l.querySelector('small').innerText.trim();
  const m=/^Atacado (\\S+) com margem (-?\\d+)%/.exec(b);
  if(m){const tab=s.split(' · ')[0];if(!g[tab]){g[tab]={n:0,min:999,l:l}}else l.remove();g[tab].n++;g[tab].min=Math.min(g[tab].min,+m[2]);return}
  const k=/^(Subir|Oferta|Volta ao preço) /.exec(b);if(k){const t=k[1];if(!pa[t]){pa[t]={n:0,l:l,mot:s.split(' · ')[0]}}else l.remove();pa[t].n++}});
 Object.keys(g).forEach(t=>{const x=g[t];x.l.querySelector('b').textContent='Tabela '+t+': '+x.n+(x.n===1?' peça':' peças')+' com margem baixa';x.l.querySelector('small').textContent='abaixo de 10% · a menor está em '+x.min+'%';const v=x.l.querySelector('.cntV');if(v){v.textContent='ajustar tabela';v.style.minHeight='44px';v.style.minWidth='44px'}});
 Object.keys(pa).forEach(t=>{const x=pa[t];if(x.n<2)return;const nome={Subir:'Subir '+x.n+' preços',Oferta:'Pôr '+x.n+' peças em oferta','Volta ao preço':x.n+' peças voltam ao preço'}[t];x.l.querySelector('b').textContent=nome;x.l.querySelector('small').textContent=x.mot;const em=x.l.querySelector('em');if(em)em.textContent='';});
 const n=D.querySelectorAll('.cntL').length;const lb=D.querySelector('.lbl');lb.textContent=lb.textContent.replace(/· \\d+/,'· '+n);return [L.length,n,Object.keys(g),Object.keys(pa)]}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[];al=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);pg.evaluate("()=>{const L=window.__LF;L.S.dTab='prec';L.setView('dash')}");w(1800)
            if prop: print('   ',pg.evaluate(MUDA));w(400)
            al.append(pg.evaluate("()=>document.scrollingElement.scrollHeight"))
            pg.evaluate("()=>{const d=document.querySelector('#v-dash .cntD');d.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-90)}");w(300)
            p=T+'prc_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);o=olho(pg);pg.evaluate('()=>scrollBy(0,500)');w(300);o|=olho(pg);oo.append(o);b.close()
        print('preços',tema,'achados novos:',novos(oo[0],oo[1]),'alturas',al)
        prancha('52-app-precos-menos-poluido-%s.jpg'%tema,'App · Preços · "Para decidir esta semana" · tema '+tema,
          ['Hoje: uma linha para cada peça — cada preço a subir e cada peça de cada tabela de atacado (página de %d px).'%al[0],'Proposta: uma linha por ASSUNTO — "Subir N preços" (abre um por um ou aceita tudo, como hoje) e uma linha por tabela de atacado, com quantas peças e a menor margem (%d px).'%al[1]],*fs)
