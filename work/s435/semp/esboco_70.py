# Esboço 70 (S435, 22/11 14:50) — SEMP parte 1: Marketing = escritório do Semp, REFEITO sobre a base nova (dono 22/11 14:33–14:41:
# os esboços do Semp são de 20/11, design antigo; refazer antes do 'como fazer'). Base: app real (Marketing de hoje, dados de teste) +
# aprovados: 1c (O Semp sugere para hoje · foco + Setores; ideia 20/11 12:41), foco no título (15:54), 54 (mesmo desenho do escritório:
# subtítulo 'O escritório do …'), 37b + 21/11 17:54 (ícones e rótulos CINZA), 53 (Destaque da semana = 1º setor, medalha),
# Titan (ex-Guardião), 51 (compra por vaga, na família Compras), 67 (Histórico único: a conversa Semp ↔ Titan vira linha do dia).
# Dados REAIS do app de teste: foco 'Novos clientes BR' (o objetivo marcado hoje), Kazwini de acetato masculino 27 vendidas em 30 dias
# (Status de hoje), plano 0 de 6 (Seg · Post · 20h), Lote Kazwini parado (o mesmo do 54), Natal em 33 dias (Datas que vêm aí).
# v2: o foco vai para o subtítulo (o rótulo quebrava em 2 linhas, L4) e o rótulo fica igual ao do 54: 'O Semp sugere hoje · 3'.
# v3 (dono 14:48 'a navegação tem marketing → marketing'): o GRUPO Marketing do Início (Marketing · Temática · Cartões · Analisador) deixa
# de existir: Início › Marketing abre o escritório direto ('‹ Início', como o 54); Temática e Cartões viram setores; Analisador já foi para
# Resultados (58c). Mesmo jeito do 52a (grupo Giro e preços saiu, Preços virou linha do Início).
# v4 (dono 15:25): 'Lote Kazwini' é uma COMPRA fechada no Inventário (343 peças ainda sem registrar), não uma peça → não pode ser
# oferta, destaque nem 'parado'. Sai 'Divulgar a oferta' (no app de teste não há peça parada de verdade).
# 'Comprar a tendência' do 1c NÃO entra: o Mercado do Semp ainda não existe, não há tendência real (proibido produto de exemplo).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/semp/'
P1C=open('/home/claude/lafouch/work/semp/p1c.py').read()
exec(P1C[P1C.index('F=lambda'):P1C.index('JS=r"""')]);exec(P1C[P1C.index('def tira(pg,nome):'):P1C.index('with sync_playwright')])
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
IC=dict(
 mega='<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
 etq='<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
 ev='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 med='<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
 cal='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 tend='<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 cria='<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 res='<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 tem='<path d="M12 3a9 9 0 1 0 9 9c0-1.5-1.2-2-2.5-2H16a2 2 0 0 1-2-2V6.5C14 4.6 13.4 3 12 3z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/>',
 cart='<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
 marca='<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>')
JS=r"""(I)=>{const v=document.getElementById('v-mkt');
const L='display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)';
const SV=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
const linha=(ic,t,s)=>'<div style="'+L+'">'+SV(ic)+'<div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="color:var(--mute);font-size:18px">›</span></div>';
const tit=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mute);margin:32px 0 8px">'+t+'</div>';
const nv=v.querySelector('.nvVs');if(nv)nv.lastChild.textContent='Início';
const topo=v.querySelector('.top');
[...v.children].forEach(e=>{if(e!==topo&&!e.contains(topo)&&!topo.contains(e)&&!e.classList.contains('nvVs'))e.remove()});

const box=document.createElement('div');box.innerHTML=
tit('O Semp sugere hoje · 2')+
linha(I.mega,'Postar às 20h','Leitura Kazwini de acetato · 27 vendas no mês')+
linha(I.ev,'Natal em 33 dias','presente: embalagem e combo · preparar o post')+
tit('Setores')+
linha(I.med,'Destaque da semana','4 peças · no site, nos posts e na loja')+
linha(I.cal,'Agenda','0 de 6 feitos · próximo: Seg · Post · 20h')+
linha(I.tend,'Mercado','tendências e distribuidoras de CDE')+
linha(I.cria,'Criar','post · story · status · carrossel · vídeo · listas')+
linha(I.res,'Resultados','o que deu certo · o Semp aprende com isso')+
linha(I.tem,'Temática','o site e o app vestidos para o evento')+
linha(I.cart,'Cartões','cartão do cliente e cupons')+
linha(I.marca,'Marca','kit da marca · logo, cores e textos');
const wrap=topo.parentNode===v?v:topo.parentNode;wrap.appendChild(box);}"""
def mkt(pw,prop,esc=True):
  b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);w(1500)
  if prop: pg.evaluate(JS,IC);w(400)
  confere(pg,'Marketing '+('proposta' if prop else 'hoje')+(' escuro' if esc else ' claro'));x=tira(pg,'mk%d%d'%(prop,esc));b.close()
  return x if (prop or x.height<=1900) else x.crop((0,0,780,1900))
if __name__=='__main__':
 with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_70_marketing_semp_%s.jpg'%n,esc,[('HOJE · Marketing','objetivo em botões · criar · plano · datas',mkt(pw,0,esc)),('PROPOSTA · Marketing = escritório do Semp','‹ Início · o grupo Marketing vira o próprio escritório',mkt(pw,1,esc))])
 for n,f in REL: print(n,len(f),f[:4])
