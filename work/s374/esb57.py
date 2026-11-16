# S374 · esboço 57 (R8 aprovado em 15/11): avisos só nas Notificações — nas telas fica o número, não o aviso repetido.
# 57a Início (o cartão "343 peças … sem detalhe" já está no Guardião) · 57b Inventário (cartão "15 preços para corrigir" vira número na linha da contagem)
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s374/'
import os;os.makedirs(T,exist_ok=True)
from playwright.sync_api import sync_playwright
INI="""()=>{const c=[...document.querySelectorAll('#v-inicio .card')].find(e=>/sem detalhe/.test(e.innerText));if(c)c.remove();return !!c}"""
INV="""()=>{const f=document.querySelector('#v-estoque .invFix');if(!f)return 'sem';const n=(f.querySelector('.ifTx b')||{}).textContent||'';const num=(n.match(/\\d+/)||[''])[0];f.remove();
 const w=document.createTreeWalker(document.getElementById('v-estoque'),NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){if(/\\d+ peças/.test(t.textContent)&&t.parentElement.offsetParent)break}
 const el=t.parentElement;const a=document.createElement('span');a.style.cssText='color:var(--warn);font-weight:600;white-space:nowrap';a.textContent=' · ! '+num+' preços ›';el.appendChild(a);return el.outerHTML.slice(0,200)}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,tela,js,tit,sub in (('57a-app-inicio-sem-aviso-repetido','inicio',INI,'App · Início sem o aviso repetido',['Hoje: o cartão "343 peças da compra de 31/12 sem detalhe" aparece no Início e também dentro do Guardião (Pendências).','Proposta: fica só no Guardião, que já conta as coisas para olhar. Os outros cartões não mudam.']),
                                    ('57b-app-inventario-numero-dos-precos','estoque',INV,'App · Inventário com o número, sem o cartão de aviso',['Hoje: o cartão "15 preços para corrigir · Corrigir ›" repete o que está em Pendências e em Preços.','Proposta: na linha da contagem fica só o número ("! 15 preços ›"), que leva a Preços. A lista aparece mais acima.'])):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,tela,esc);w(1800)
                if prop: oo.append(olho(pg));print('  ',pg.evaluate(js));w(500)
                p=T+'%s_%d_%d.png'%(nome[:3],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
            print(nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
            prancha('%s-%s.jpg'%(nome,tema),tit+' · tema '+tema,sub,*fs)
