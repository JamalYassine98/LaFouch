# S374 · esboço 61 (dono 16/11 11:15): segurar um GRUPO na barra não abre mais "Gerenciar grupo"; arrastar o grupo
# até o Início leva o grupo inteiro para lá (não desfaz). Hoje + 3 quadros (segure · arraste · solte); claro e escuro; olho.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s374/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
SEGURA="""()=>{const b=document.querySelector('#mainnav .mn[data-id="g:pecas"]');b.style.cssText='transform:scale(1.08) translateY(-4px);background:var(--panel2);border-radius:14px;box-shadow:0 10px 24px rgba(0,0,0,.35)';
 const c=document.createElement('div');c.id='qchip';c.className='on';c.setAttribute('role','status');c.textContent='Arraste até o Início para levar o grupo';document.body.appendChild(c);return 1}"""
ARRASTA="""()=>{const b=document.querySelector('#mainnav .mn[data-id="g:pecas"]');const r=b.getBoundingClientRect();const g=b.cloneNode(true);g.classList.add('qghost');g.removeAttribute('data-act');
 b.classList.add('qorig');document.body.classList.add('arrastaBarra');document.getElementById('mainnav').classList.add('qd');const gr=document.querySelector('#v-inicio .tl[data-id=ata]');const ph=document.createElement('div');ph.className='tl qphT';gr.parentNode.appendChild(ph);
 scrollBy(0,160);const q=ph.getBoundingClientRect();g.style.cssText='left:'+(q.left+q.width/2-r.width/2-6)+'px;top:'+(q.top+q.height/2-r.height/2-38)+'px;width:'+r.width+'px;height:'+r.height+'px;background:var(--panel);border-radius:16px';document.body.appendChild(g);
 const c=document.createElement('div');c.id='qchip';c.className='on';c.setAttribute('role','status');c.textContent='Solte para levar o grupo ao Início';document.body.appendChild(c);return 1}"""
SOLTA="""()=>{const L=window.__LF,S=L.S;S.barra=S.barra.filter(x=>x!=='g:pecas');S.inicioT=S.inicioT.concat(['g:pecas']);L.render();document.getElementById('v-inicio').style.paddingBottom='140px';document.querySelector('#v-inicio .tl[data-id="g:pecas"]').scrollIntoView({block:'center',behavior:'instant'});
 const e=document.createElement('div');e.id='lfDesf';e.setAttribute('role','status');e.innerHTML='<span>Peças foi para o Início</span><button type="button">Desfazer</button>';document.body.appendChild(e);void e.offsetWidth;e.classList.add('on');return S.barra}"""
def quadros(nome,titulo,sub,ims,rots):
    ims=[Image.open(x).convert('RGB') for x in ims];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+len(ims)*(w_+g),330+h_+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(w_+g);d.text((x,266),r,font=F(32,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,320));d.rectangle([x-1,319,x+w_,320+h_],outline='#cfc6cb')
    S.save(comum.OUT+nome,quality=88);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for q in range(4):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1600)
            if q==0: oo.append(olho(pg));pg.evaluate("()=>window.__LF.ACT.grpGerir('g:pecas')");w(900)
            if q==1: pg.evaluate(SEGURA);w(300)
            if q==2: pg.evaluate(ARRASTA);w(400)
            if q==3: print('  ',pg.evaluate(SOLTA));w(700);oo.append(olho(pg))
            p=T+'g61_%d_%d.png'%(q,esc);pg.screenshot(path=p);fs.append(p);b.close()
        print('61',tema,'achados novos:',novos(oo[0],oo[1]))
        quadros('61-app-grupo-da-barra-para-o-inicio-%s.jpg'%tema,'App · levar um grupo da barra para o Início · tema '+tema,
          ['Hoje: segurar o grupo na barra abre "Gerenciar grupo" (mudar ou desfazer); arrastar o grupo para fora da barra desfaz o grupo.',
           'Proposta: segurar não abre nada — o botão levanta. Arraste até o Início: um espaço tracejado mostra onde ele entra; soltando, o grupo',
           'inteiro vai para o Início (não desfaz) e a barra fica com um lugar livre. Aviso com Desfazer. Mudar ou desfazer o grupo: flecha do título',
           '› "Gerenciar grupo", como hoje.'],fs,['HOJE','1 · SEGURE','2 · ARRASTE','3 · SOLTE'])
