# S353 · esboço 42: DASHBOARD COMO GRUPO (aprovado em texto 15/11 17:38). 42a Início com um só botão "Dashboard"; 42b Dashboard com Dia | Mês e o
# título com flecha; 42c a lista da flecha (Dashboard, Reservas, Giro, Preços, Gerenciar grupo). App real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s353/';T='/tmp/s353/'
from playwright.sync_api import sync_playwright
S351=open('/home/claude/lafouch/work/s351/esb.py').read();PEGA=S351.split('PEGA="""')[1].split('"""')[0].replace('\\\\','\\');POE=S351.split('POE="""')[1].split('"""')[0].replace('\\\\','\\');TIT=S351.split('TIT="""')[1].split('"""')[0].replace('\\\\','\\')
S350=open('/home/claude/lafouch/work/s350/esb.py').read();TRK=S350.split('TRK="""')[1].split('"""')[0];TRKP=S350.split('TRKP="""')[1].split('"""')[0]
def base(pg,w):
    o=olho(pg);pg.evaluate('()=>scrollBy(0,140)');w(300);o|=olho(pg);pg.evaluate('()=>scrollTo(0,0)');w(300);return o
LINHAS=[['Dashboard','O dia e o mês da loja'],['Reservas','O que está livre para você'],['Giro','O que vende e o que está parado'],['Preços','Margem e preço por tipo'],['Gerenciar grupo','Nome e telas de "Dashboard"']]
DIA="""()=>{const v=document.getElementById('v-dia');const c=v.querySelector('.famC3');if(c)c.remove();const hd=v.querySelector('.dHd');hd.after(window.__trk.esD);window.__trk.esD.style.margin='10px 0 16px';return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'dash',esc);w(1200);pg.evaluate("()=>document.querySelector('#v-dash .dHdT').click()");w(1000);D=pg.evaluate(PEGA);oF=olho(pg);b.close()
        # 42a Início
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1500)
            if prop:
                oo.append(base(pg,w));print('   tirados:',pg.evaluate("()=>{let n=0;[...document.querySelectorAll('#v-inicio [data-id]')].forEach(e=>{if(['din','giro','prec'].includes(e.getAttribute('data-id'))&&e.offsetParent){e.remove();n++}});const d=[...document.querySelectorAll('#v-inicio [data-id=hoje]')].pop();if(d){const s=[...d.querySelectorAll('*')].filter(x=>x.children.length===0&&/Resumo/.test(x.textContent)).pop();if(s)s.textContent='Dia, mês, reservas, giro'}return n}"));w(500)
            p=T+'ga_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('42a',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('42a-app-inicio-um-botao-dashboard-%s.jpg'%tema,'App · Início · tema '+tema,['Hoje: Dashboard, Reservas, Giro e Preços são 4 atalhos soltos (e as mesmas telas também abrem pela flecha do Resumo).','Proposta: um botão só, "Dashboard" (um grupo que já vem pronto). Reservas, Giro e Preços ficam dentro dele.'],*fs)
        # 42b Dashboard dia + trilho + flecha ; 42c lista aberta
        for letra,abre in (('b',False),('c',True)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'dia',esc);w(1500)
                if prop:
                    oo.append(base(pg,w)|oF);pg.evaluate(TRK,[['Dia','Mês'],0,'esD']);pg.evaluate(TIT,['#v-dia','Dashboard',D['tit']]);pg.evaluate(DIA);w(300);pg.evaluate(TRKP,'esD');w(300)
                    if abre: print('   folha:',pg.evaluate(POE,[D,LINHAS,0]));w(700)
                elif abre:
                    pg.evaluate("()=>{window.__LF.S.dTab='hoje';window.__LF.setView('dash')}");w(1500);pg.evaluate("()=>document.querySelector('#v-dash .dHdT').click()");w(1000)
                p=T+'g%s_%d_%d.png'%(letra,esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
            print('42'+letra,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
            if not abre: prancha('42b-app-dashboard-grupo-%s.jpg'%tema,'App · Dashboard · tema '+tema,['Hoje: a tela do dia não tem flecha e termina com uma cópia dos números do mês.','Proposta: título com flecha (as telas do grupo) e, dentro da tela, o trilho Dia | Mês. A cópia dos números sai.'],*fs)
            else: prancha('42c-app-dashboard-flecha-aberta-%s.jpg'%tema,'App · tocar no título do Dashboard · tema '+tema,['Hoje (no Resumo): Resumo, Reservas, Giro, Preços e Online.','Proposta: as telas do grupo — Dashboard, Reservas, Giro e Preços — e "Gerenciar grupo" (tirar ou pôr telas). Online sai.'],*fs)
