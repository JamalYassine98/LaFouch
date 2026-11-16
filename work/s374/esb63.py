# S374 · esboço 63 (dono 16/11 11:46): a família Peças sem Fornecedores, Reposição e Contagem na lista da flecha
# (continuam dentro do Inventário: abas Produtos · Fornecedores · Reposição e "toque para contar"). Claro e escuro; olho.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s374/'
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1500)
            if prop: pg.evaluate("()=>{const g=window.__LF.S.grupos.find(g=>g.id==='g:pecas');g.itens=['estoque','est'];window.__LF.render()}")
            pg.evaluate("()=>document.querySelector('#mainnav .mn[data-id=\"g:pecas\"]').click()");w(1200)
            if prop: oo.append(olho(pg))
            else: oo.append(olho(pg))
            pg.evaluate("()=>window.__LF.ACT.grpVer()");w(700)
            p=T+'p63_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('63',tema,'achados novos:',novos(oo[0]|oo[1],oo[3]))
        prancha('63-app-pecas-sem-fornecedores-reposicao-contagem-%s.jpg'%tema,'App · Peças › flecha sem Fornecedores, Reposição e Contagem · tema '+tema,['Hoje: a lista da flecha repete Fornecedores e Reposição (já são abas do Inventário) e Contagem (já é "toque para contar").','Proposta: a lista fica com Inventário, Estúdio e Gerenciar grupo. As abas e a contagem continuam no Inventário, como hoje.'],*fs)
