# S374 · esboço 85 (dono 17/11 07:34 "Inventário") — aba de Peças › Inventário na padronização de luxo.
# Proposta: "+ Adicionar" em cápsula → "+" redondo de 44 px (como em Clientes) · "EM ESTOQUE (FILTRO)" ganha "›" (abre a contagem, como
# "Contas do dia ›"), sem a frase "toque para contar" · "! 15 preços ›" (32 px, com "!") → "15 preços para corrigir ›" em amarelo, 44 px ·
# cartão de lote sem foto ganha o mesmo quadro de foto (ícone de pacote em linha) para a grade não ficar torta.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
#v-estoque .pl78{flex:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:none;color:var(--fg);display:grid;place-items:center;padding:0}
#v-estoque .pl78 svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
#v-estoque #invInfo .ifNum{min-height:44px;padding:0 2px!important;background:none!important;border:0!important;color:var(--warn)!important;font-weight:600}
#v-estoque .pbox.lt85{display:grid;place-items:center;background:var(--panel2)!important;border:1px solid var(--line)}
#v-estoque .pbox.lt85 svg{width:44px;height:44px;stroke:var(--sub);fill:none;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
"""
PLUS='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
BOX='<svg viewBox="0 0 24 24"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/></svg>'
JS=r"""(ic)=>{const v=document.getElementById('v-estoque');const a=document.getElementById('btnAdd');a.className='pl78';a.setAttribute('aria-label','Adicionar');a.innerHTML=ic[0];
 const k=document.getElementById('kCont');k.querySelector('.lbl').textContent='Em estoque (filtro) ›';const h=k.querySelector('.hint');if(h)h.remove();
 const n=v.querySelector('#invInfo .ifNum');if(n)n.textContent=n.textContent.replace(/^!\s*(\d+) preços ›/,'$1 preços para corrigir ›');
 v.querySelectorAll('.pcard').forEach(p=>{if(!p.querySelector('.pbox')){const d=document.createElement('div');d.className='pbox lt85';d.innerHTML=ic[1];p.prepend(d)}});return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,off in (('a-topo',0),('b-grade',1)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('estoque')");w(1300)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS,[PLUS,BOX]);w(300)
                if off: pg.evaluate("()=>{const e=document.getElementById('invInfo');scrollTo({top:e.getBoundingClientRect().top+scrollY-120,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'i85_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
            prancha('85%s-app-inventario-botoes-%s.jpg'%(nome,tema),'App · Peças › Inventário · %s · tema %s'%('topo' if not off else 'grade',tema),
              ['Hoje: "+ Adicionar" em cápsula; "toque para contar" escrito embaixo do número; "! 15 preços ›" com 32 px; o cartão do lote sem foto fica mais baixo e entorta a grade.',
               'Proposta: "+" redondo de 44 px (como em Clientes) · "Em estoque (filtro) ›" (abre a contagem) · "15 preços para corrigir ›" em amarelo, 44 px · lote com o mesmo quadro de foto (ícone de pacote).'],*fs)
