# Esboço 58 (S435, 22/11 01:30) — painel do Site redesenhado (estrutura aprovada 01:23). Parte 2: Resumo.
# Base: app real + aprovados (46 botão ⏻ cinza/verde ao lado do título; 96/97 estado + prévia no topo; 149s sem cartão;
# rótulos e ícones cinza 21/11 17:54; 53 Destaque da semana do Semp). Conferência: coleta do comparador único.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/painelsite/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
S46=open('/home/claude/lafouch/work/s435/switch/esboco_46.py').read()
H=S46[S46.index('H=r"""')+6:S46.index('"""',S46.index('H=r"""')+6)]
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
RES=r"""const v=document.getElementById('v-site');[...v.querySelectorAll('.cx97,.stG')].forEach(e=>e.remove());
 const ROW=(t,s,val,c)=>'<div style="display:flex;align-items:center;gap:12px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span>'+(val!=null?'<b style="font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;color:'+(c||'var(--fg)')+'">'+val+'</b>':'')+'<i style="font-style:normal;color:var(--mute);font-size:20px;width:14px;text-align:center">›</i></div>';
 const L=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:32px 0 4px">'+t+'</div>';
 const d=document.createElement('div');d.innerHTML='<div style="border-top:1px solid var(--line2);margin-top:24px">'+ROW('Prévia do site','como o cliente vê agora')+'</div>'+L('Agora')+ROW('Pedidos','nenhum novo','0')+ROW('Mensagens','nenhuma nova','0')+ROW('Modelos','no ar no site','16')+ROW('Destaque da semana','escolhido pelo Semp','4 peças');
 v.appendChild(d);PONTA(PILL(1,'Site no ar'));"""
JAN_SITE=RES+r"""JAN('Site',SW('Site no ar','os clientes veem o catálogo agora',1)+'<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 0">Desligado, quem abre o site vê "Voltamos logo" e não consegue fazer pedido. Os pedidos que já existem continuam.</div>')"""
def site(pw,js,nome):
  b,pg,w=ap.abre(pw,'site',True,'celular',base=True);w(900);pg.add_style_tag(content='#nvBar{display:none!important}')
  if js: pg.evaluate("()=>{"+H+js+"}");w(500)
  confere(pg,nome);f='/tmp/e58.png';pg.screenshot(path=f);x=Image.open(f).copy();b.close();return x
def quadro(arq,q):
  g=36;w,h=q[0][2].size;S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_58a_resumo.jpg',[('HOJE · Site › Resumo','cartões · números "abra para atualizar"',site(pw,None,'Resumo hoje')),('PROPOSTA · Resumo','botão liga e desliga · Prévia · números em linhas',site(pw,RES,'Resumo proposta')),('PROPOSTA · tocar no botão','janela com o interruptor',site(pw,JAN_SITE,'Resumo janela'))])
for n,f in REL: print(n,len(f),f[:4])
