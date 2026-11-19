# Esboço dos 3 consertos (B1, B2, B3) — 19/11/2026, sessão de estudo. App REAL com dados de teste + base de aprovados (base_app.py).
# Uso: python3 work/estudo-c/esb_bugs.py   → work/estudo-c/esboco_*.jpg (claro e escuro)
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/estudo-c/';T='/tmp/estc/';os.makedirs(T,exist_ok=True)
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
# pedido de teste (cliente de exemplo, peça de teste) — nada real
PED="""()=>{const L=window.__LF,S=L.S;S.clientes=S.clientes||[];
 if(!S.clientes.some(c=>c.id===9001))S.clientes.push({id:9001,nome:'Cliente Teste',tel:'+595 900 000 000',ts:Date.now()-864e5,orig:'site'});
 S.pedidos=(S.pedidos||[]).filter(p=>p.id!=='kit7');
 S.pedidos.push({id:'kit7',num:7,sid:'kitSID7',orig:'site',cli:'Cliente Teste',cliId:9001,tel:'+595 900 000 000',st:'canc',cancTs:Date.now()-3600e3,ts:Date.now()-2*864e5,ent:'loja',pg:'pagar',itens:[{ref:'AC1050',t:'Armação acetato',q:1,preco:5000}]});
 S.pedSel='kit7';L.setView('ped');}"""
def abre(pw,esc,passos):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True)
  for p in passos:
    try: pg.evaluate(p)
    except Exception as e: print('passo',str(e)[:90])
    w(900)
  return b,pg,w
def foto(pg,nome,y=0):
  pg.evaluate("y=>window.scrollTo(0,y)",y);pg.wait_for_timeout(300)
  f=T+nome+'.png';pg.screenshot(path=f);return f
def quadro(arq,esc,tit,q):
  ims=[Image.open(p).convert('RGB') for _,_,p in q];w,h=ims[0].size
  g=40;W=g+len(ims)*(w+g);S=Image.new('RGB',(W,h+230),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  d.text((g,20),tit,font=F(40,True),fill=fg)
  for i,((t,s,_),im) in enumerate(zip(q,ims)):
    x=g+i*(w+g);d.text((x,100),t,font=F(34),fill=fg);d.text((x,148),s,font=F(24),fill=mu);S.paste(im,(x,200));d.rectangle([x-1,199,x+w,200+h],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
def texto(nome,esc,linhas):  # quadro só de texto, do tamanho de um celular (para o B2, que não tem tela)
  W,H=780,1688;im=Image.new('RGB',(W,H),(17,20,26) if esc else (255,255,255));d=ImageDraw.Draw(im)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165);y=60
  for t,k in linhas:
    if k=='h': d.text((48,y),t,font=F(30,True),fill=fg);y+=60
    elif k=='ok': d.text((48,y),'✓ '+t,font=F(26),fill=(60,170,100));y+=50
    elif k=='er': d.text((48,y),'✗ '+t,font=F(26),fill=(220,80,80));y+=50
    elif k=='sp': y+=30
    else: d.text((48,y),t,font=F(26),fill=mu);y+=46
  f=T+nome+'.png';im.save(f);return f
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    # ---- B1: Pedido › nome da cliente
    b,pg,w=abre(pw,esc,[PED]);f0=foto(pg,'b1_ped_'+n,0)
    pg.evaluate("()=>window.__LF.ACT.pedcli(9001)");w(900);f1=foto(pg,'b1_hoje_'+n);b.close()
    b,pg,w=abre(pw,esc,[PED,"()=>{const S=window.__LF.S;S.cliSel=9001;S._cliDel=0;window.__LF.setView('clientes')}"]);f2=foto(pg,'b1_prop_'+n);b.close()
    quadro('esboco_B1_cliente_do_pedido_%s.jpg'%n,esc,'B1 · Pedido › tocar no nome da cliente',
      [('TOQUE','Pedido 7 › nome da cliente ›',f0),('HOJE','abre uma tela que não existe (vazia)',f1),('PROPOSTA','abre a ficha da cliente em Clientes',f2)])
    # ---- B3: grupo Site › Site
    G="()=>{const S=window.__LF.S;S.nvG='g:site';window.__LF.setView('grp')}"
    b,pg,w=abre(pw,esc,[G]);g0=foto(pg,'b3_grp_'+n)
    pg.click('#v-grp .nvL[data-id="site"]');w(900);g1=foto(pg,'b3_tela_'+n);b.close()
    REN="()=>{document.querySelectorAll('#v-grp .nvL[data-id=\"site\"] .nvTx b').forEach(e=>e.textContent='Resumo');document.querySelectorAll('#v-site h1').forEach(e=>e.textContent='Resumo')}"
    b,pg,w=abre(pw,esc,[G,REN]);g2=foto(pg,'b3_pgrp_'+n)
    pg.click('#v-grp .nvL[data-id="site"]');w(900);pg.evaluate(REN);w(300);g3=foto(pg,'b3_ptela_'+n);b.close()
    quadro('esboco_B3_site_nome_igual_%s.jpg'%n,esc,'B3 · Grupo Site › "Site" (o mesmo nome parece não sair do lugar)',
      [('HOJE · grupo','linha "Site"',g0),('HOJE · tela','‹ SITE / Site',g1),('PROPOSTA · grupo','linha "Resumo" (mesma frase)',g2),('PROPOSTA · tela','‹ SITE / Resumo',g3)])
    # ---- B2: soltar a reserva (por dentro; sem tela nova)
    h=texto('b2_hoje_'+n,esc,[('Cancelar / Entregar / Recusar','h'),('O app manda: "refs" (lista de peças)','t'),('A nuvem procura: "itens"','t'),('sp','sp'),('A lista chega vazia → a nuvem recusa','er'),('O app acha que deu certo e apaga da fila','er'),('A reserva fica parada no site','er'),('Pedido PAGO e entregue: a peça fica','er'),('   segurada no site para sempre','t'),('sp','sp'),('Hoje paradas na nuvem: 7 (vencidas,','t'),('não pagas — não seguram peça)','t')])
    p=texto('b2_prop_'+n,esc,[('Cancelar / Entregar / Recusar','h'),('O app manda a lista em "itens",','ok'),('   o mesmo nome que a nuvem lê','t'),('A reserva sai na hora; a peça volta','ok'),('   ao site (ao entregar, só depois do','t'),('   estoque novo chegar, como hoje)','t'),('Se a nuvem recusar: fica na fila e','ok'),('   tenta de novo (não apaga mais)','t'),('As 7 paradas são limpas uma vez','ok'),('sp','sp'),('Nada muda na tela do app nem do site;','t'),('só o app (src/95-reserva.js). A função','t'),('da nuvem continua igual.','t')])
    quadro('esboco_B2_soltar_reserva_%s.jpg'%n,esc,'B2 · Soltar a reserva (por dentro, sem tela nova)',[('HOJE','o que acontece',h),('PROPOSTA','o que passa a acontecer',p)])
