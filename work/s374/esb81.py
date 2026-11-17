# S374 · esboço 81 (dono 16/11 19:35, sobre o 80/77: "gosto de como é a lista no hoje"; a parte do topo da ficha (iniciais, nome
# grande, frase) "não gostei, queria que fosse como a lista de hoje"; "esboço pra ver se entendeu").
# Entendi assim: a LISTA de clientes fica como hoje (cartões) · a FICHA fica como hoje (título "Ficha do cliente" + ×, os campos em
# caixas, Paraguaio/Estrangeiro, RUC, tabela, observação) · o que muda é só o que estava fora do padrão: no topo da tela o "+"
# redondo no lugar de "+ Novo cliente" e saem "Atacado ›" e "Cartões ›" (80) · na ficha, WhatsApp e Avisar viram 2 atalhos
# redondos logo abaixo do título, "Salvar" fica o único principal, "Conta atacadista" vira a linha "Conta atacadista · Ativa ›"
# e "Remover cliente" continua centralizado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
src=open('/home/claude/lafouch/work/s374/esb77.py').read()
exec(src.split('def abre(')[0].split("comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'")[1])
src8=open('/home/claude/lafouch/work/s374/esb78.py').read()
exec('CSS78'+src8.split('CSS78',1)[1].split('JS_A=')[0])
CSS81=CSS78+""".qa77{justify-content:flex-start;gap:22px;margin:4px 0 6px}"""
TOPO=r"""(ic)=>{const v=document.getElementById('v-clientes');const t=v.querySelector('.top');const a=t.querySelector('.pgAc');if(a)a.remove();const r=t.querySelector('.lkRow');if(r)r.remove();
 const p=document.createElement('button');p.className='pl78';p.setAttribute('aria-label','Novo cliente');p.innerHTML=ic[0];t.appendChild(p);return 1}"""
FICHA=r"""(ic)=>{const sec=document.querySelector('#v-clientes section.card');const hd=sec.firstElementChild;
 const q=document.createElement('div');q.className='qa77';q.innerHTML='<button><i>'+ic[1]+'</i>WhatsApp</button><button><i>'+ic[2]+'</i>Avisar</button>';hd.after(q);
 ['[data-act=cliavisa]','a.chip[href*=wa]'].forEach(s=>{const e=sec.querySelector(s);if(e)e.remove()});
 const at=sec.querySelector('[data-act=ataConta]');if(at){const g=document.createElement('div');g.innerHTML='<div class="lb77" style="margin:8px 0 6px">Atacado</div><div class="gp77"><button class="rw77"><span class="tx"><b>Conta atacadista</b><small>catálogo com preço de atacado</small></span><span class="vl f77">Ativa</span><span class="ch">›</span></button></div>';at.replaceWith(g)}
 return 1}"""
PARTES=[('a-lista','Lista'),('b-ficha-topo','Ficha · topo'),('c-ficha-fim','Ficha · fim')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,tit in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate(SEED);w(800)
                if nome!='a-lista':
                    pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.ataConta(S.clientes[0].id)}");w(600);pg.evaluate("()=>{document.querySelectorAll('.ljJn,.ljBk').forEach(e=>e.remove());document.body.classList.remove('folhaAberta');const t=document.getElementById('lfToast');if(t)t.remove()}")
                    pg.evaluate("()=>{const S=window.__LF.S;window.__LF.ACT.cliab(S.clientes[0].id)}");w(700)
                if prop:
                    pg.add_style_tag(content=CSS81);pg.evaluate(TOPO,[PLUS])
                    if nome!='a-lista': pg.evaluate(FICHA,[PLUS,WA,BELL])
                    w(300)
                if nome=='c-ficha-fim': pg.evaluate("()=>scrollTo({top:99999,behavior:'instant'})");w(300)
                oo.append(olho(pg));p=T+'k81_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('81%s-app-clientes-como-hoje-%s.jpg'%(nome,tema),'App · Clientes · lista e ficha como hoje · %s · tema %s'%(tit,tema),
              ['Hoje: "+ Novo cliente" em cápsula e "Atacado ›" "Cartões ›" soltos; na ficha, 2 botões principais, "🏬 Conta Atacadista" com emoji e WhatsApp em cápsula verde.',
               'Proposta: lista e ficha como hoje · "+" redondo no topo, sem os links · WhatsApp e Avisar = 2 atalhos redondos embaixo do título · "Salvar" único principal · "Conta atacadista · Ativa ›" em linha · "Remover cliente" centralizado.'],*fs)
