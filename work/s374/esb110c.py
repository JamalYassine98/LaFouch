# S374 · esboço 110c (dono 17/11 18:49): cancelar precisa de JANELA de confirmação (substitui o "toque de novo" do 110b).
# Janela de baixo de sempre (lfJanela): título, quem/qual pedido, o que acontece, botão vermelho "Cancelar reserva" (perigo só dentro da confirmação) e "Voltar".
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
PED=open('esb110.py').read().split('PED="""')[1].split('"""')[0]
JS=open('esb110.py').read().split('JS=r"""')[1].split('"""')[0]
JAN=r"""(pago)=>{const bk=document.createElement('div'),jn=document.createElement('div');bk.className='ljBk';jn.className='ljJn';jn.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>'+(pago?'Cancelar o pedido?':'Cancelar a reserva?')+'</b></div><div class="ljCorpo"></div>';document.body.append(bk,jn);bk.style.opacity='.5';jn.style.transform='translateY(0)';const J={corpo:jn.querySelector('.ljCorpo')};
 J.corpo.innerHTML='<div style="padding:2px 0 4px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 0;border-bottom:1px solid var(--line2)"><span style="font-size:15px">Maria López<small style="display:block;font-size:12.5px;color:var(--mute);margin-top:2px">Pedido 901 · 1 peça</small></span><b style="font-size:17px">G$ 250.000</b></div>'+
 '<p style="font-size:14.5px;line-height:1.5;color:var(--sub);margin:14px 0 18px">'+(pago?'A peça volta para o site. Ela já pagou: combine com ela a devolução do dinheiro.':'A peça volta para o site e o cartão dela fica livre. Nada foi cobrado; ela vê “Reserva cancelada” em Minha conta, sem e-mail.')+'</p>'+
 '<button type="button" style="width:100%;min-height:52px;border-radius:14px;border:1px solid var(--bad);background:transparent;color:var(--bad);font-size:16px;font-weight:600;font-family:inherit">'+(pago?'Cancelar pedido':'Cancelar reserva')+'</button>'+
 '<button type="button" style="display:block;margin:6px auto 0;min-height:44px;background:none;border:0;color:var(--fg);font-size:15px;font-weight:600;font-family:inherit">Voltar</button></div>';return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(PED);w(900)
            pg.evaluate("()=>document.querySelector('[data-act=pedab][data-id=\"901\"]').click()");w(1100)
            pg.evaluate("()=>{const e=document.querySelector('.view:not([hidden]) .pdCanc');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}");w(300)
            if prop: pg.evaluate(JS,0);pg.evaluate(JAN,False);w(900)
            oo.append(olho(pg));p=T+'p110c_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('110c-app-pedido-janela-cancelar-%s.jpg'%tema,'App · Pedido do site não pago · tocar em "Cancelar reserva" · tema %s'%tema,
          ['Hoje: um toque em "Cancelar pedido" já cancela, sem perguntar.',
           'Proposta: abre a janela de baixo de sempre com quem e qual pedido, o que vai acontecer, "Cancelar reserva" em vermelho e "Voltar". Pedido já pago: "Cancelar o pedido?" e o aviso de combinar a devolução do dinheiro.'],*fs)
