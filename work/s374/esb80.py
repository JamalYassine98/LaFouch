# S374 · esboço 80 (dono 16/11 19:26): Clientes = só o cadastro de clientes; Atacado continua separado no Início (são 2 nichos;
# Atacado trata mais coisas que o cliente). Cartões vão para a família Marketing (concordou). Substitui o 78 e o 79.
# Tela Clientes: "+" redondo de 44 px ao lado do título (no lugar da cápsula "+ Novo cliente") · saem "Atacado ›" e "Cartões ›" ·
# lista e ficha = 77 (a ficha mantém a linha "Conta atacadista ›" do cliente). Início continua com os 6 botões de hoje.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
src=open('/home/claude/lafouch/work/s374/esb77.py').read()
exec(src.split('def abre(')[0].split("comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'")[1])
src8=open('/home/claude/lafouch/work/s374/esb78.py').read()
exec('CSS78'+src8.split('CSS78',1)[1].split('JS_A=')[0])
TOPO=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');t.querySelector('.pgAc').remove();t.querySelector('.lkRow').remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(900)
            if prop: pg.add_style_tag(content=CSS78);pg.evaluate(JS_LISTA);pg.evaluate(TOPO,[PLUS]);w(400)
            oo.append(olho(pg));p=T+'k80_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('80a-app-clientes-so-cadastro-%s.jpg'%tema,'App · Clientes só cadastro (Atacado separado) · tema %s'%tema,
          ['Hoje: "+ Novo cliente" em cápsula e "Atacado ›" "Cartões ›" soltos embaixo do título.',
           'Proposta: "+" redondo (44 px) ao lado do título · saem "Atacado ›" (continua como botão próprio no Início) e "Cartões ›" (vai para Marketing) · lista e ficha = 77.'],*fs)
