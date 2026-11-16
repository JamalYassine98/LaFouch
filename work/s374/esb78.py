# S374 · esboço 78 (dono 16/11 18:58: 77 quase todo aprovado; "não gostei dos botões novo cliente, atacado e cartões na aba clientes").
# Duas opções para o topo de Clientes (o resto = 77):
#  A) "+" redondo de 44 px ao lado do título (contorno neutro, como o ícone do Caixa) · Atacado e Cartões viram as 2 primeiras linhas
#     de um cartão ("Atacado · contas e convites ›", "Cartões · fidelidade ›") · depois "CLIENTES · 4" e a lista.
#  B) "+" redondo igual · abas em linha (padrão do app, a linha que desliza): Clientes | Atacado | Cartões.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
src=open('/home/claude/lafouch/work/s374/esb77.py').read()
exec(src.split('def abre(')[0].split("comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'")[1])
CSS78=CSS+"""
#v-clientes>.top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.pl78{flex:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:none;color:var(--fg);display:grid;place-items:center;margin-top:6px}
.pl78 svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
.ic78{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--sub)}
.ic78 svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
#v-clientes #cliQ{margin-top:4px}
"""
PLUS='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
STORE='<svg viewBox="0 0 24 24"><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5c0 1.5 1.3 2.5 2.7 2.5S9.3 11 9.3 9.5c0 1.5 1.3 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.6 2.5S20 11 20 9.5M10 20v-5h4v5"/></svg>'
CARD='<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/></svg>'
JS_A=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');t.querySelector('.pgAc').remove();t.querySelector('.lkRow').remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);
 const g=document.createElement('div');g.className='gp77';g.style.marginBottom='4px';g.innerHTML='<button class="rw77"><span class="ic78">'+ic[1]+'</span><span class="tx"><b>Atacado</b><small>contas e convites</small></span><span class="ch">›</span></button><button class="rw77"><span class="ic78">'+ic[2]+'</span><span class="tx"><b>Cartões</b><small>cartões fidelidade</small></span><span class="ch">›</span></button>';
 const q=document.getElementById('cliQ');q.before(g);const lb=document.createElement('div');lb.className='lb77';lb.textContent='Clientes · '+window.__LF.S.clientes.length;q.after(lb);return 1}"""
JS_B=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');t.querySelector('.pgAc').remove();t.querySelector('.lkRow').remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);
 const a=document.createElement('div');a.className='pdSeg lfAbas';a.setAttribute('role','group');a.innerHTML='<button type="button" class="on" aria-pressed="true">Clientes</button><button type="button">Atacado</button><button type="button">Cartões</button>';
 t.after(a);return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for op,js in (('A',JS_A),('B',JS_B)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(800)
                if prop: pg.add_style_tag(content=CSS78);pg.evaluate(JS_LISTA);pg.evaluate(js,[PLUS,STORE,CARD]);w(400)
                oo.append(olho(pg));p=T+'k78_%s_%d_%d.png'%(op,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(op,tema,'novos:',novos(oo[0],oo[1]))
            prancha('78%s-app-clientes-topo-opcao-%s-%s.jpg'%(op.lower(),op,tema),'App · Clientes · topo · opção %s · tema %s'%(op,tema),
              ['Hoje: "+ Novo cliente" em cápsula ao lado do título e "Atacado ›" "Cartões ›" soltos embaixo.',
               ('Opção A: "+" redondo (44 px) ao lado do título · Atacado e Cartões viram as 2 primeiras linhas de um cartão, com ícone e frase · depois "CLIENTES · 4" e a lista (resto = 77).' if op=='A' else 'Opção B: "+" redondo (44 px) ao lado do título · abas em linha, padrão do app: Clientes | Atacado | Cartões (resto = 77).')],*fs)
