# S374 · esboço 79 (dono 16/11 19:12: "não faz sentido varejo, nessa lista pode ter atacadistas"; "quero esboço").
# Família Clientes = Clientes + Atacado (a lista tem todos, atacadistas também; a tela Atacado = contas, convites, lotes, tabela).
# Início: os botões "Clientes" e "Atacado" viram 1 família "Clientes · clientes e atacado" (ocupa 2 colunas, para não sobrar buraco).
# Tela Clientes: título "Clientes ⌄" (a flecha abre Clientes e Atacado, como as outras famílias) · "+" redondo · saem "Atacado ›" e
# "Cartões ›" · lista e ficha = 77. Cartões (de desconto) vão para a família Marketing como tela própria (flecha: Marketing, Temática, Cartões).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
src=open('/home/claude/lafouch/work/s374/esb77.py').read()
exec(src.split('def abre(')[0].split("comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'")[1])
src8=open('/home/claude/lafouch/work/s374/esb78.py').read()
exec('CSS78'+src8.split('CSS78',1)[1].split('JS_A=')[0])
G="""()=>{const L=window.__LF,S=L.S;S.grupos=S.grupos.filter(g=>g.id!=='g:cli');S.grupos.push({id:'g:cli',nome:'Clientes',ico:'cli',frase:'Clientes e atacado',fam:1,itens:['cli','ata']});S.inicioT=['g:res','g:gp','g:site','g:mkt','g:cli'];}"""
CSS79=CSS78+"""#v-inicio .tl[data-id="g:cli"]{grid-column:span 2}"""
TOPO=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');const a=t.querySelector('.pgAc');if(a)a.remove();const r=t.querySelector('.lkRow');if(r)r.remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);return 1}"""
CUP=r"""()=>{const f=[...document.querySelectorAll('#dFolha .dOp, .lfa-sh .dOp')];if(f.length<2)return 0;const u=f[f.length-2];const c=u.cloneNode(true);c.removeAttribute('data-id');
 const w=document.createTreeWalker(c,NodeFilter.SHOW_TEXT);let k=0,n;const t=['Cartões','Cartões de desconto e cliente fiel'];while(n=w.nextNode()){if(n.textContent.trim()&&k<2){n.textContent=t[k++]}}u.after(c);return f.length}"""
def base(pw,esc,prop):
    b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED.replace("window.__LF.setView('clientes')","0"));w(300)
    if prop: pg.evaluate(G);pg.add_style_tag(content=CSS79)
    return b,pg,w
PARTES=['a-inicio','b-clientes','c-flecha-clientes','d-marketing']
if os.environ.get('SO'): PARTES=[x for x in PARTES if x in os.environ['SO'].split(',')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=base(pw,esc,prop)
                if nome=='a-inicio': pg.evaluate("()=>window.__LF.setView('inicio')");w(900);pg.evaluate("()=>{const e=document.querySelector('#v-inicio .tl');scrollTo({top:e.getBoundingClientRect().top+scrollY-330,behavior:'instant'})}")
                elif nome in ('b-clientes','c-flecha-clientes'):
                    pg.evaluate("()=>window.__LF.inicioGo('%s')"%('g:cli' if prop else 'cli'));w(900)
                    if prop: pg.evaluate(JS_LISTA);pg.evaluate(TOPO,[PLUS])
                    if nome=='c-flecha-clientes' and prop: pg.click('#v-clientes h1');w(900)
                else:
                    pg.evaluate("()=>window.__LF.inicioGo('g:mkt')");w(1200)
                    if prop: print('  cup',pg.evaluate(CUP))
                w(400);oo.append(olho(pg));p=T+'f79_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            tit={'a-inicio':'Início','b-clientes':'tela Clientes','c-flecha-clientes':'flecha de Clientes','d-marketing':'flecha de Marketing'}[nome]
            prancha('79%s-app-familia-clientes-%s.jpg'%(nome,tema),'App · família Clientes (Clientes + Atacado) · %s · tema %s'%(tit,tema),
              ['Hoje: Clientes e Atacado são 2 botões no Início; na tela Clientes, "+ Novo cliente" em cápsula e "Atacado ›" "Cartões ›" soltos; Cartões abre uma janela por cima.',
               'Proposta: 1 família "Clientes · clientes e atacado" (2 colunas no Início) · "Clientes ⌄" abre Clientes e Atacado · "+" redondo · sem os links · Cartões vira tela da família Marketing.'],*fs)
