# S356 · esboço 48: DASHBOARD FINAL v2 (decisões do dono 15/11 18:35 e 18:39) — sem o trilho Dia | Mês e sem o calendário; o período se escolhe no
# seletor do topo (o que já existe). Três quadros: período Hoje · período Este mês · o seletor aberto. App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
OUT='/home/claude/lafouch/work/s356/';T='/tmp/s355/'
S35=open('/home/claude/lafouch/work/s349/e6_dashboard.py').read();CSS35=S35.split('CSS="""')[1].split('"""')[0];MUDA35=S35.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\')
HOJE="""html=>{const v=document.getElementById('v-dia');const top=v.querySelector('.top');const t=document.createElement('div');t.innerHTML=html;const hd=t.firstElementChild;hd.querySelector('.dHdT').firstChild.textContent='Dashboard ';const per=hd.querySelector('.dHdP');per.firstChild.textContent='Hoje ';top.replaceWith(hd);
 const dt=[...v.querySelectorAll('button')].find(e=>/^\\d\\d\\/\\d\\d\\/\\d{4}/.test(e.innerText.trim()));let data='';if(dt){const c=dt.closest('section,.card')||dt.parentElement.parentElement;c.remove()}
 const h=[...v.querySelectorAll('h1,h2,h3,div')].find(e=>e.children.length===0&&/ de \\w+ de \\d{4}$/.test((e.textContent||'').trim()));if(h){data=h.textContent.trim().replace(/ de \\d{4}$/,'');h.remove()}
 const su=document.createElement('div');su.className='dHdS';su.textContent=data;hd.after(su);
 const c3=v.querySelector('.famC3');if(c3)c3.remove();const c2=v.querySelector('.famC2');if(c2){[...c2.children].forEach(x=>{if(!/Ver todos os dias/.test(x.innerText))x.remove()});const b=c2.querySelector('button');if(b)b.textContent='Dias anteriores no Histórico ›'}return data}"""
MES="""()=>{const v=document.getElementById('v-dash');const hd=v.querySelector('.dHd');hd.querySelector('.dHdT').firstChild.textContent='Dashboard ';
 const ls=document.querySelector('.esLs');if(ls&&!ls.dataset.r){ls.dataset.r=1;const b=ls.firstElementChild.cloneNode(true);b.querySelector('b').textContent='Resultado do mês';const s=b.querySelector('small');if(s)s.textContent='Lucro real, o que mais e o que menos rendeu';ls.insertBefore(b,ls.firstElementChild)}
 const su=v.querySelector('.dHdS');if(su)su.textContent=su.textContent.split(' · ')[0];return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'dash',esc);w(1200);tit=pg.evaluate("()=>document.querySelector('#v-dash .dHd').outerHTML");b.close()
        b,pg,w=ap.abre(pw,'dia',esc);w(1500);o0=olho(pg);pg.evaluate('()=>scrollBy(0,200)');w(300);o0|=olho(pg);pg.evaluate('()=>scrollTo(0,0)');print('   data:',pg.evaluate(HOJE,tit));w(500);a=T+'h2_%d.png'%esc;pg.screenshot(path=a);o1=olho(pg);b.close()
        b,pg,w=ap.abre(pw,'dash',esc);w(4200);o0|=olho(pg);pg.add_style_tag(content=CSS35);pg.evaluate("()=>("+MUDA35+")()");pg.evaluate(MES);w(500);m=T+'m2_%d.png'%esc;pg.screenshot(path=m);o1|=olho(pg)
        pg.evaluate("()=>document.querySelector('#v-dash .dHdP').click()");w(1100);print('   título depois de abrir o seletor:',pg.evaluate("()=>document.querySelector('#v-dash .dHdT').innerText"))
        pg.evaluate("()=>{const t=document.querySelector('#v-dash .dHdT');if(t&&!/Dashboard/.test(t.innerText))t.firstChild.textContent='Dashboard '}");w(300);s_=T+'s2_%d.png'%esc;pg.screenshot(path=s_);b.close()
        print('48',tema,'achados novos:',novos(o0,o1))
        ims=[Image.open(x).convert('RGB') for x in (a,m,s_)];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+3*(w_+g),300+h_+g),'#f1eef0');d=ImageDraw.Draw(S)
        d.text((g,34),'App · Dashboard final, sem trilho e sem calendário · tema '+tema,font=F(40,True),fill='#1d1418')
        d.text((g,96),'Uma tela só. O período se escolhe no seletor do topo (o mesmo que já existe). O título com flecha abre Reservas, Giro, Preços e Histórico.',font=F(25),fill='#55484f')
        d.text((g,132),'Em "Hoje" aparecem os blocos do dia (contas, gastos, câmbio, vendas, fechamento). Dia que não é hoje: Histórico.',font=F(25),fill='#55484f')
        for i,(im,r) in enumerate(zip(ims,('PERÍODO: HOJE','PERÍODO: ESTE MÊS','O SELETOR ABERTO'))):
            x=g+i*(w_+g);d.text((x,236),r,font=F(34,True),fill='#8d3a69');S.paste(im,(x,290));d.rectangle([x-1,289,x+w_,290+h_],outline='#cfc6cb')
        S.save(OUT+'48-app-dashboard-final-sem-trilho-%s.jpg'%tema,quality=88);print('  48 …',tema,S.size)
