# S371 (16/11/2026, pedido do dono): arrastar UMA tela de dentro do grupo (folha da flecha) direto para a barra.
# App real, dados de teste; Hoje + 3 quadros da proposta (segure · arraste · solte); claro e escuro; olho Hoje × fim.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s371/';OUT=comum.OUT;T='/tmp/s371/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
PREP="""()=>{const L=window.__LF,S=L.S;S.grupos=[{id:'g:1',nome:'Peças',itens:['estoque','lotes','cont','est']}];S.barra=['vendas','g:1','caixa','ajustes'];
 S.inicioT=(S.inicioT||[]).filter(x=>!['estoque','lotes','cont','est','vendas','caixa','ajustes'].includes(x));L.setView('estoque');L.render();return S.barra}"""
VER="""()=>{const c=document.querySelector('#v-estoque .grpChv,#v-estoque [data-grpv]');if(c){(c.closest('[data-grpv]')||c).click();return 'chv'}window.__LF.ACT.grpVer();return 'act'}"""
LINHA="""()=>[...document.querySelectorAll('#dFolha [data-act=grpVerEsc]')].find(e=>e.getAttribute('data-id')==='lotes')"""
SEGURA="""()=>{const e=("""+LINHA+""")();e.style.cssText='transform:scale(1.025);background:var(--card2,rgba(127,127,127,.12));border-radius:14px;box-shadow:0 14px 36px rgba(0,0,0,.40);position:relative;z-index:2;transition:none';
 const c=document.createElement('div');c.id='qchip';c.className='on';c.setAttribute('role','status');c.textContent='Arraste até a barra';document.body.appendChild(c);return !!e}"""
FINAL="""()=>{const L=window.__LF,S=L.S;S.grupos[0].itens=['estoque','cont','est'];S.barra=['vendas','g:1','caixa','lotes'];S.inicioT=(S.inicioT||[]).concat(['ajustes']);L.render();
 const b=[...document.querySelectorAll('#mainnav .mn')].find(x=>/Fornecedores/.test(x.innerText));return b?b.outerHTML:''}"""
VOLTA="""()=>{const L=window.__LF,S=L.S;S.grupos[0].itens=['estoque','lotes','cont','est'];S.barra=['vendas','g:1','caixa','ajustes'];S.inicioT=S.inicioT.filter(x=>x!=='ajustes');L.render();return 1}"""
ARRASTA="""h=>{window.__LF.lfaFecha('dFolha');document.body.classList.add('arrastaBarra');const nav=document.getElementById('mainnav');nav.classList.add('qd');
 const aj=[...nav.querySelectorAll('.mn')].find(x=>/Ajustes/.test(x.innerText));aj.classList.add('troca');aj.style.outline='2px solid var(--rosa,#c2588f)';aj.style.outlineOffset='-2px';aj.style.borderRadius='12px';const r=aj.getBoundingClientRect();
 const t=document.createElement('div');t.innerHTML=h;const g=t.firstElementChild;g.removeAttribute('data-act');g.removeAttribute('id');
 g.style.cssText='position:fixed;z-index:9999;left:'+Math.min(r.left-14,innerWidth-r.width-36)+'px;top:'+(r.top-34)+'px;width:'+(r.width+28)+'px;height:'+r.height+'px;transform:scale(1.08);background:var(--card,#1a1d24);border-radius:16px;box-shadow:0 14px 34px rgba(0,0,0,.35);pointer-events:none';
 document.body.appendChild(g);const c=document.createElement('div');c.id='qchip';c.className='on';c.setAttribute('role','status');c.textContent='Solte para trocar por este';document.body.appendChild(c);return 1}"""
TOAST="""()=>{const e=document.createElement('div');e.id='lfDesf';e.setAttribute('role','status');e.innerHTML='<span>Fornecedores foi para a barra · Ajustes voltou ao Início</span><button type="button">Desfazer</button>';document.body.appendChild(e);void e.offsetWidth;e.classList.add('on');return 1}"""
def quadros(nome,titulo,sub,ims,rots):
    ims=[Image.open(x).convert('RGB') for x in ims];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+len(ims)*(w_+g),330+h_+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(w_+g);d.text((x,266),r,font=F(32,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,320));d.rectangle([x-1,319,x+w_,320+h_],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for q in range(4):
            b,pg,w=ap.abre(pw,'inicio',esc);print('  barra',pg.evaluate(PREP));w(1400)
            if q==0: oo.append(olho(pg))
            if q<2: print('  ver',pg.evaluate(VER));w(1000)
            if q==1: pg.evaluate(SEGURA);w(300)
            if q==2: h=pg.evaluate(FINAL);w(500);pg.evaluate(VOLTA);w(700);pg.evaluate(ARRASTA,h);w(400)
            if q==3: pg.evaluate(FINAL);w(800);oo.append(olho(pg));pg.evaluate(TOAST);w(500)
            p=T+'q%d_%d.png'%(q,esc);pg.screenshot(path=p);fs.append(p);b.close()
        print('51',tema,'achados novos:',novos(oo[0],oo[1]))
        quadros('51-app-arrastar-tela-do-grupo-para-barra-%s.jpg'%tema,'App · arrastar uma tela do grupo para a barra · tema '+tema,
          ['Hoje: na folha da flecha, segurar uma tela não faz nada; para levar só ela à barra é preciso "Gerenciar grupo" › Tirar e depois arrastar do Início.',
           'Proposta: segure a tela na folha (ela levanta), a folha desce e a tela vira um botão que você leva até a barra. A barra já está cheia (5/5),',
           'então solte sobre um botão para trocar: o que sai volta ao Início. Com espaço livre na barra, ela entra no lugar onde soltar. O grupo continua',
           'com as outras telas (com 1 só, ele se desfaz). Aviso com Desfazer.'],fs,['HOJE','1 · SEGURE','2 · ARRASTE','3 · SOLTE'])
