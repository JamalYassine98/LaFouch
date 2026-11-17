# S374 · esboço 102 (dono 17/11 14:23): exceção no Inventário — "Lista de compras ›" à ESQUERDA (alinhada com as abas Produtos/Fornecedores)
# e a linha sai da aba Produtos e vai para a aba FORNECEDORES (é lá que se decide o que comprar de quem), no topo da aba.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
FORN="()=>{const b=[...document.querySelectorAll('#v-estoque button')].find(x=>/^Fornecedores/.test(x.textContent.trim()));if(b)b.click()}"
MOVE=r"""()=>{const l=document.getElementById('lcIrInv');if(!l)return 0;const c=l.cloneNode(true);l.remove();c.style.marginTop='6px';
 const ab=document.querySelector('#v-estoque .lfAbas,#v-estoque [role=tablist],#eTab,#v-estoque .nav');const alvo=ab?ab.parentElement:null;window.__lc102=c;return 1}"""
POE=r"""()=>{const c=window.__lc102;if(!c)return 0;const o=document.getElementById('lcIrInv');if(o)o.remove();const ab=[...document.querySelectorAll('#v-estoque button')].find(x=>/^Fornecedores/.test(x.textContent.trim()));let t=ab;while(t&&t.parentElement&&!t.parentElement.matches('#v-estoque'))t=t.parentElement;
 const v=document.getElementById('v-estoque');const last=[...v.children].filter(x=>x.offsetParent&&!x.matches('#lcIrInv')).pop();last.after(c);c.style.cssText='display:block;margin:10px auto 0;text-align:center';return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,aba in (('c','fornecedores'),):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.setView('estoque')");w(1300)
                if prop: pg.evaluate(MOVE)
                if aba=='fornecedores': pg.evaluate(FORN);w(900)
                if prop and aba=='fornecedores': pg.evaluate(POE)
                pg.evaluate("()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})")
                w(300);oo.append(olho(pg));p=T+'i102_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('102%s-app-inventario-%s-%s.jpg'%(k,aba,tema),'App · Inventário · aba %s · tema %s'%(aba.capitalize(),tema),
              ['Hoje: "Lista de compras · 17 acabando ›" fica na aba Produtos.',
               'Proposta: a linha sai de Produtos e vai para o FIM da aba Fornecedores, centralizada (regra do link sozinho) — é navegação, fica depois do conteúdo.'],*fs)
