# S374 · esboço 98c (dono 17/11 12:27, print do Giro): "é do mesmo esquema de abrir mas tem design diferente".
# Corrige o 98: Listas por perfil, Resultados e Kit da marca abrem no lugar → usam o MESMO bloco do app (cartão próprio, título + frase,
# "⌄" que vira "⌃", animação Apple), igual "Lista de compras" e "Vitrine da semana" do Giro. "›" fica só para o que leva a outra tela.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s98=open('/home/claude/lafouch/work/s374/esb98.py').read()
CSS=s98.split('CSS="""')[1].split('"""')[0];JS=s98.split('JS=r"""')[1].split('"""')[0];JS2=s98.split('JS2=r"""')[1].split('"""')[0]
FOLD=r"""()=>{const g=document.querySelector('.mk98 .mkDtG');const L=[['Listas por perfil','contatos separados por tipo de cliente'],['Resultados','vendas e pedidos 2 dias depois de cada post'],['Kit da marca','nome, frase, hashtags e cores']];
 const w=document.createElement('div');w.style.marginTop='22px';w.innerHTML=L.map(x=>'<section class="card fxF"><button type="button" class="fxH" aria-expanded="false"><span style="min-width:0"><b style="font-size:15px">'+x[0]+'</b><span class="hint" style="display:block;margin:2px 0 0">'+x[1]+'</span></span><i class="fxC" aria-hidden="true">⌄</i></button></section>').join('');g.replaceWith(w);return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(700);pg.evaluate("()=>window.__LF.inicioGo('mkt')");w(1400)
            c=pg.evaluate(JS);w(900);pg.add_style_tag(content=CSS);pg.evaluate(JS2,c);w(200)
            if prop: pg.evaluate(FOLD);w(200)
            pg.evaluate("()=>{const e=document.querySelector('.mk98 .mkDtG')||document.querySelector('.mk98 .fxF');scrollTo({top:e.getBoundingClientRect().top+scrollY-520,behavior:'instant'})}");w(400)
            oo.append(olho(pg));p=T+'m98c_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('98c-app-marketing-blocos-%s.jpg'%tema,'App · Marketing · fim · blocos que abrem no lugar · tema %s'%tema,
          ['Esquerda = 98: Listas por perfil, Resultados e Kit da marca em linhas com "›" — parece que levam a outra tela, e são diferentes da "Lista de compras" do Giro.',
           'Proposta: o MESMO bloco do app — cartão próprio, título + frase curta e "⌄" (vira "⌃" ao abrir, com a animação Apple), igual "Lista de compras" e "Vitrine da semana". "›" só para o que leva a outra tela.'],*fs)
