# S351: (40) Dashboard com a FLECHA no título (o Dia entra no mesmo menu "Ver" do Resumo; substitui o esboço 38) e (41) GRUPOS com a mesma flecha
# no lugar das abas do topo. A folha "Ver" é a REAL do app (copiada da tela Resumo); só mudam as linhas. Celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s351/';T='/tmp/s351/'
from playwright.sync_api import sync_playwright
PEGA="""()=>{const l=[...document.querySelectorAll('body *')].find(e=>e.children.length===0&&/^VER$/i.test((e.textContent||'').trim())&&e.offsetParent);let f=l;while(f&&getComputedStyle(f).position!=='fixed')f=f.parentElement;if(!f)return null;
 const linhas=[...f.querySelectorAll('button,[role=button],[data-act]')].filter(e=>/Giro/.test(e.innerText));const lin=linhas[0];const sel=[...f.querySelectorAll('button,[data-act]')].find(e=>/^Resumo/.test(e.innerText.trim()));
 const bk=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return s.position==='fixed'&&r.width>=innerWidth&&r.height>=innerHeight&&e!==f&&!e.contains(f)&&(+s.zIndex||0)>40}).pop();
 return {folha:f.outerHTML,fundo:bk?bk.outerHTML:'',lin:lin?lin.outerHTML:'',sel:sel?sel.outerHTML:'',tit:document.querySelector('#v-dash .dHd').outerHTML}}"""
POE="""a=>{const [d,linhas,ativo]=a;const tmp=document.createElement('div');tmp.innerHTML=d.fundo+d.folha;const els=[...tmp.children];const f=els[els.length-1];
 const bs=[...f.querySelectorAll('button,[data-act]')].filter(e=>e.innerText.trim().length>3);const pai=bs[0].parentElement;const mS=bs.find(e=>/^Resumo/.test(e.innerText.trim())),mL=bs.find(e=>/Giro/.test(e.innerText));
 const troca=(el,t,s)=>{const c=el.cloneNode(true);const ts=[...c.querySelectorAll('*')].filter(x=>x.children.length===0&&x.textContent.trim().length>2);if(ts[0])ts[0].textContent=t;if(ts[1])ts[1].textContent=s;return c};
 bs.forEach(b=>b.remove());linhas.forEach((l,i)=>pai.appendChild(troca(i===ativo?mS:mL,l[0],l[1])));els.forEach(e=>document.body.appendChild(e));return f.getBoundingClientRect().height|0}"""
TIT="""a=>{const [sel,nome,html]=a;const v=document.querySelector(sel);const top=v.querySelector('.top');const t=document.createElement('div');t.innerHTML=html;const hd=t.firstElementChild;const bt=hd.querySelector('.dHdT');bt.firstChild.textContent=nome+' ';const per=hd.querySelector('.dHdP');if(per)per.remove();
 const acao=top.querySelector('button,.tabs');if(acao){hd.appendChild(acao)}top.replaceWith(hd);return 1}"""
GRUPO="()=>{const L=window.__LF;L.S._gn={a:'estoque',b:'vendas'};const i=document.createElement('input');i.id='grpNome';i.value='Loja e estoque';i.hidden=true;document.body.appendChild(i);L.ACT.grpCria();i.remove();return (L.S.grupos||[]).length}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'dash',esc);w(1200);pg.evaluate("()=>document.querySelector('#v-dash .dHdT').click()");w(1000);D=pg.evaluate(PEGA);oF=olho(pg);b.close()
        print('  folha real:',len(D['folha']),'fundo:',len(D['fundo']))
        # 40 Dashboard
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'dia',esc);w(1500);o=olho(pg);pg.evaluate('()=>scrollTo(0,120)');w(400);o|=olho(pg);pg.evaluate('()=>scrollTo(0,0)');w(300)
            if prop:
                oo.append(o|oF);pg.evaluate("()=>{const c=document.querySelector('#v-dia .famC3');if(c)c.remove()}");pg.evaluate(TIT,['#v-dia','Dia',D['tit']])
                print('   ',pg.evaluate(POE,[D,[['Dia','Vendas, lucro e contas de um dia'],['Resumo do mês','Quanto vendeu e quanto separar'],['Reservas','Caixa, contas e reserva'],['Giro','O que vende e o que está parado'],['Preços','Margem e preço por tipo'],['Online','Como o site está indo']],0]));w(700)
            p=T+'d_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('40',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('40-app-dashboard-com-flecha-%s.jpg'%tema,'App · Dashboard (substitui o esboço 38) · tema '+tema,['Hoje: o dia fica numa tela ("Dashboard") e o mês em outra ("Resumo ▾"); só a do mês tem a flecha que leva a Reservas, Giro, Preços e Online.','Proposta: o Dia entra no mesmo menu da flecha. Uma tela só, a mesma navegação; sai a cópia dos números do mês do fim da tela do dia.'],*fs)
        # 41 Grupo
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);print('    grupos:',pg.evaluate(GRUPO));w(1000);pg.evaluate("()=>window.__LF.setView('vendas')");w(1300)
            if prop:
                o=olho(pg);pg.evaluate('()=>scrollTo(0,160)');w(400);o|=olho(pg);pg.evaluate('()=>scrollTo(0,0)');w(300);oo.append(o|oF);pg.evaluate("()=>{const g=document.getElementById('grpTabs');if(g){g.hidden=true;g.style.display='none'}}");pg.evaluate(TIT,['#v-vendas','Catálogo',D['tit']])
                print('   ',pg.evaluate(POE,[D,[['Catálogo','Escolha a peça e venda'],['Inventário','Cadastro, estoque e preço de cada peça'],['Gerenciar grupo','Nome e telas de "Loja e estoque"']],0]));w(700)
            p=T+'g_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('41',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('41-app-grupo-com-flecha-%s.jpg'%tema,'App · grupo "Loja e estoque" · tema '+tema,['Hoje: as telas do grupo aparecem como abas no topo (Inventário | Catálogo) e o grupo se gerencia pelos "⋯".','Proposta: a mesma flecha do Resumo — o título da tela abre a lista das telas do grupo (e "Gerenciar grupo"); as abas saem.'],*fs)
