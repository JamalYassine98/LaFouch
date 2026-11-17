# S374 · esboço 84 (dono 17/11 05:43): "a proposta original, Ana Lima centralizado, só que na letra da lista atual e sem o AL".
# S374 · esboço 84 (dono 16/11 19:46): "acertou a 1ª foto (81a: lista como hoje + "+" redondo), errou a 2ª; amei seu cartão de clientes
# (a ficha do 77), só não gostei de como fica AL / Ana Lima". Ficha = 77 com o topo trocado: sem as iniciais e sem o nome grande no
# centro — o topo fica como o título de hoje: "Ficha do cliente" à esquerda com a linha "Ana Lima · balcão · cliente fiel" embaixo, × à direita.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
src=open('/home/claude/lafouch/work/s374/esb77.py').read()
exec(src.split('def abre(')[0].split("comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'")[1])
src8=open('/home/claude/lafouch/work/s374/esb78.py').read()
exec('CSS78'+src8.split('CSS78',1)[1].split('JS_A=')[0])
CSS82=CSS78+""".hd82{display:flex;flex-direction:column;gap:3px;padding-right:56px}.hd82 b{font-size:17px;font-weight:600}.hd82 small{color:var(--mute);font-size:13px}
.qa77{margin:18px 0 4px}
.hd84{padding-top:14px}.hd84 h2{font-family:var(--display),Georgia,serif!important;font-weight:400!important;font-size:26px!important;margin:0!important}
.hd83 .lbl{margin:0 0 8px}.hd83 .nm{font-size:21px;font-family:var(--display),Georgia,serif;font-weight:400;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hd83 .nm .pdPill{margin-left:0;font-size:11.5px}"""
TOPO=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');const a=t.querySelector('.pgAc');if(a)a.remove();const r=t.querySelector('.lkRow');if(r)r.remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);return 1}"""
HD=r"""()=>{const h=document.querySelector('#v-clientes .hd77');const a=h.querySelector('.av77');if(a)a.remove();h.classList.add('hd84');return 1}"""
PARTES=[('b-ficha-topo','Ficha · topo'),('c-ficha-fim','Ficha · fim')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,tit in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(800)
                pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.ataConta(S.clientes[0].id)}");w(600);pg.evaluate("()=>{document.querySelectorAll('.ljJn,.ljBk').forEach(e=>e.remove());document.body.classList.remove('folhaAberta');const t=document.getElementById('lfToast');if(t)t.remove()}")
                pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.cliab(S.clientes[0].id)}");w(700)
                if prop: pg.add_style_tag(content=CSS82);pg.evaluate(TOPO,[PLUS]);pg.evaluate(JS_FICHA,[WA,BELL]);pg.evaluate(HD);w(300)
                if nome=='c-ficha-fim': pg.evaluate("()=>scrollTo({top:99999,behavior:'instant'})");w(300)
                oo.append(olho(pg));p=T+'k84_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('84%s-app-clientes-ficha-%s.jpg'%(nome,tema),'App · Clientes · ficha (77) com o nome centralizado na letra da lista · %s · tema %s'%(tit,tema),
              ['Hoje: ficha = formulário de caixas + 4 botões empilhados (2 principais, emoji, cápsula verde).',
               'Proposta: a ficha do 77 (atalhos WhatsApp e Avisar, dados em linhas, "Salvar", "Conta atacadista · Ativa ›", compras, "Remover cliente" no centro) · o topo do 77 (nome centralizado e a frase embaixo), sem o círculo AL e com o nome na letra da lista · WhatsApp e Avisar centralizados.'],*fs)
