# S356 · esboço 47: O DASHBOARD FINAL numa imagem só — a mesma tela "Dashboard ⌄" com o trilho em DIA (esquerda) e em MÊS (direita).
# Junta o que já foi aprovado (35, 42b, 45d). App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
OUT='/home/claude/lafouch/work/s356/';T='/tmp/s355/'
G=open('/home/claude/lafouch/work/s353/grupo.py').read();exec(G.split("def base")[0].split("from playwright.sync_api import sync_playwright\n")[1])
S35=open('/home/claude/lafouch/work/s349/e6_dashboard.py').read();CSS35=S35.split('CSS="""')[1].split('"""')[0];MUDA35=S35.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\')
DIA="""()=>{const v=document.getElementById('v-dia');const c=v.querySelector('.famC3');if(c)c.remove();const hd=v.querySelector('.dHd');hd.after(window.__trk.esD);window.__trk.esD.style.margin='10px 0 16px';return 1}"""
MES="""()=>{const v=document.getElementById('v-dash');const hd=v.querySelector('.dHd');hd.querySelector('.dHdT').firstChild.textContent='Dashboard ';hd.after(window.__trk.esD);window.__trk.esD.style.margin='10px 0 4px';
 const ls=document.querySelector('.esLs');const b=ls.firstElementChild.cloneNode(true);b.querySelector('b').textContent='Resultado do mês';const s=b.querySelector('small');if(s)s.textContent='Lucro real, o que mais e o que menos rendeu';ls.insertBefore(b,ls.firstElementChild);
 const su=v.querySelector('.dHdS');if(su)su.textContent=su.textContent.split(' · ')[0];return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'dash',esc);w(1200);D=pg.evaluate(PEGA.replace('const l=','const l=') if False else "()=>({tit:document.querySelector('#v-dash .dHd').outerHTML})");b.close()
        b,pg,w=ap.abre(pw,'dia',esc);w(1500);pg.evaluate(TRK,[['Dia','Mês'],0,'esD']);pg.evaluate(TIT,['#v-dia','Dashboard',D['tit']]);pg.evaluate(DIA);w(300);pg.evaluate(TRKP,'esD');w(400);a=T+'fd_%d.png'%esc;pg.screenshot(path=a);o1=olho(pg);b.close()
        b,pg,w=ap.abre(pw,'dash',esc);w(4200);o0=olho(pg);pg.add_style_tag(content=CSS35);pg.evaluate(TRK,[['Dia','Mês'],1,'esD']);pg.evaluate("()=>("+MUDA35+")()");pg.evaluate(MES);w(300);pg.evaluate(TRKP,'esD');w(500)
        m=T+'fm_%d.png'%esc;pg.screenshot(path=m);o2=olho(pg);pg.evaluate("()=>{const l=document.querySelector('.esLs');l.scrollIntoView({block:'end',behavior:'instant'});scrollBy(0,90)}");w(500);m2=T+'fm2_%d.png'%esc;pg.screenshot(path=m2);o2|=olho(pg);b.close()
        print('47',tema,'achados novos (mês):',novos(o0|o1,o2))
        ims=[Image.open(x).convert('RGB') for x in (a,m,m2)];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+3*(w_+g),300+h_+g),'#f1eef0');d=ImageDraw.Draw(S)
        d.text((g,34),'App · o Dashboard final (uma tela só) · tema '+tema,font=F(40,True),fill='#1d1418')
        d.text((g,96),'O título com flecha abre as outras telas do grupo (Reservas, Giro, Preços). O trilho troca entre o dia e o mês.',font=F(25),fill='#55484f')
        d.text((g,132),'Não existe mais a tela "Resumo": ela é o Mês deste Dashboard.',font=F(25),fill='#55484f')
        for i,(im,r) in enumerate(zip(ims,('DIA','MÊS','MÊS, rolando para baixo'))):
            x=g+i*(w_+g);d.text((x,236),r,font=F(34,True),fill='#8d3a69');S.paste(im,(x,290));d.rectangle([x-1,289,x+w_,290+h_],outline='#cfc6cb')
        S.save(OUT+'47-app-dashboard-final-%s.jpg'%tema,quality=88);print('  47-app-dashboard-final-%s.jpg'%tema,S.size)
