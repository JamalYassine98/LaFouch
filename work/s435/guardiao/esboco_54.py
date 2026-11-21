# Esboço 54 (S435, 21/11 18:10) — Preços = escritório do Guardião (aprovado 18:03). Mesmo desenho do Marketing do Semp (1c aprovado):
# "O Guardião decide hoje · N" + Setores (Regras · Ofertas · Atacado · Ferramentas · Histórico), cada um com tela própria.
# Base: app real (Preços de hoje, dados de teste) + aprovados (1c como modelo, 37b ícones cinza, rótulos cinza 17:54, 52e números no Dashboard, 149s).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/guardiao/'
P1C=open('/home/claude/lafouch/work/semp/p1c.py').read()
exec(P1C[P1C.index('F=lambda'):P1C.index('JS=r"""')]);exec(P1C[P1C.index('def tira(pg,nome):'):P1C.index('with sync_playwright')])
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
IC=dict(
 cor='<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
 of='<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
 ev='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 reg='<path d="M4 6h16M4 12h16M4 18h10"/>',
 at='<path d="M4 10h16v10H4z"/><path d="M3 10l2-6h14l2 6"/>',
 fer='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2"/>',
 his='<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>')
JS=r"""(I)=>{const v=document.getElementById('v-dash');const L='display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)';
const SV=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
const linha=(ic,t,s,c)=>'<div style="'+L+'">'+SV(ic)+'<div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:'+(c||'var(--mute)')+';display:block;white-space:nowrap">'+s+'</small></div><span style="color:var(--mute);font-size:18px">›</span></div>';
const tit=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mute);margin:32px 0 8px">'+t+'</div>';
const nv=v.querySelector('.nvVs');if(nv)nv.lastChild.textContent='Início';const s=v.querySelector('.dHdS');if(s)s.textContent='O escritório do Guardião';
document.getElementById('dtabBody').innerHTML=
 tit('O Guardião decide hoje · 3')+
 linha(I.cor,'15 preços para corrigir','10 com sugestão · 5 sem custo','var(--warn,#e0b44c)')+
 linha(I.of,'Oferta para o Lote Kazwini','parado há 430 dias · até 20% com margem boa')+
 linha(I.ev,'Black Friday CDE','começa hoje · nenhuma peça entra pela regra')+
 tit('Setores')+
 linha(I.reg,'Regras','contas, taxas, meta e cotação da loja')+
 linha(I.of,'Ofertas','automático desligado · degraus para parados')+
 linha(I.at,'Atacado','7 tabelas · 15 peças abaixo de 10% em todas')+
 linha(I.fer,'Ferramentas','calculadora de preço · e se…?')+
 linha(I.his,'Histórico','o que mudou de preço, quando e por quê')}"""
def precos(pw,prop,esc=True):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.evaluate("()=>{__LF.S.dTab='prec';__LF.setView('dash')}");w(1500)
  if prop: pg.evaluate(JS,IC);w(400)
  confere(pg,'Preços '+('proposta' if prop else 'hoje')+(' escuro' if esc else ' claro'));x=tira(pg,'pr%d%d'%(prop,esc));b.close()
  return x if (prop or x.height<=1900) else x.crop((0,0,780,1900))
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_54_precos_guardiao_%s.jpg'%n,esc,[('HOJE · Preços','números · "para decidir" com 7 linhas repetidas · ferramentas',precos(pw,0,esc)),('PROPOSTA · Preços = escritório do Guardião','o que decidir hoje + 5 setores',precos(pw,1,esc))])
for n,f in REL: print(n,len(f),f[:4])
