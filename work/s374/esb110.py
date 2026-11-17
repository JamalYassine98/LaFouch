# S374 · esboço 110 (dono 17/11 18:42): botão de cancelar pedido (a sessão do site passou para cá). Pedido do site ainda NÃO pago.
# Hoje: "Cancelar pedido" cinza 13 px, cancela no PRIMEIRO toque (sem confirmar); "Marcar como pago" espremido num botão de 52 px (3 linhas).
# Proposta: "Marcar como pago" vira o principal da tela (largura toda) ao lado do WhatsApp; "Cancelar reserva" no padrão de perigo (105:
# vermelho 15 px negrito, sem caixa, 44 px) e pede o 2º toque ("Toque de novo para cancelar") — como o "Remover?" desta mesma tela.
# Pedido já pago continua "Cancelar pedido" (mesmo desenho). O que o cancelar já faz hoje não muda: a peça volta para o site, o cartão do cliente fica livre e o site mostra "Reserva cancelada" (sem e-mail).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
PED="""()=>{const L=window.__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:901,num:901,sid:'s901',cli:'Maria López',tel:'0981000901',st:'novo',pg:'pagar',ts:Date.now()-50*60000,itens:[{t:it.ref,q:1,p:250000,ref:it.ref}],orig:'site',cod:'AB901',pag:'pix',total:250000,ent:'loja'});L.setView('ped');}"""
JS=r"""(conf)=>{const v=document.querySelector('.view:not([hidden])');const pb=v.querySelector('.pdB2.txt[data-act=pedpago]');if(pb){pb.classList.remove('pdB2','txt');pb.classList.add('pdB1','pri');pb.style.cssText='border-radius:14px;height:52px;min-height:52px;font-size:16px;font-weight:600';const z=pb.parentElement.querySelector('a.pdB2');if(z)z.style.cssText='height:52px;min-height:52px;border-radius:14px'}
 const c=v.querySelector('.pdCanc');c.textContent=conf?'Toque de novo para cancelar':'Cancelar reserva';c.classList.add('dz105');c.style.cssText='display:block;margin:12px auto 0';return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,conf in (('a','pedido-nao-pago',0),('b','confirmar',1)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(PED);w(900)
                pg.evaluate("()=>document.querySelector('[data-act=pedab][data-id=\"901\"]').click()");w(1100)
                if prop: pg.evaluate(JS,conf);w(200)
                pg.evaluate("()=>{const e=document.querySelector('.view:not([hidden]) .pdCanc');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'p110_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            if k=='a': h=['Hoje: "Cancelar pedido" cinza 13 px cancela no primeiro toque, sem confirmar. "Marcar como pago" espremido (3 linhas).',
                          'Proposta: "Marcar como pago" é o principal da tela (contorno rosa, como todo principal), ao lado do WhatsApp. "Cancelar reserva" em vermelho (padrão de perigo). Pedido já pago: "Cancelar pedido", mesmo desenho.']
            else: h=['Hoje: não há confirmação — um toque sem querer cancela a reserva da cliente.',
                     'Proposta: o 1º toque troca o texto para "Toque de novo para cancelar" (volta sozinho em 4 s), como o "Remover?" desta tela. O 2º toque cancela: a peça volta para o site, o cartão fica livre, o site mostra "Reserva cancelada" (sem e-mail).']
            prancha('110%s-app-pedido-%s-%s.jpg'%(k,nm,tema),'App · Pedido do site não pago · %s · tema %s'%('botões' if k=='a' else '1º toque em Cancelar',tema),h,*fs)
