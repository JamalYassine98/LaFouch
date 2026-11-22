# Esboço 46 (S435, 21/11 11:12) — liga/desliga de uma parte da loja fica na tela do assunto: um botão de estado que abre a janela
# com o interruptor (sem confirmação: a janela já é o 2º passo). Site no ar (Site › Resumo), Preço automático (Preços),
# PIX automático (Pedidos online). Ajustes fica com o aparelho e as contas.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
O='/home/claude/lafouch/work/s435/switch/'
H=r"""const PILL=(on,t)=>'<button type="button" class="pill46" style="display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:none;color:var(--fg);font:inherit;font-size:14px;font-weight:600;white-space:nowrap"><i style="width:9px;height:9px;border-radius:50%;'+(on?'background:var(--ok)':'border:1.5px solid var(--mute);box-sizing:border-box')+'"></i>'+t+'<span style="color:var(--mute);font-weight:400">›</span></button>';
const SW=(t,s,on)=>'<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="color:var(--mute);font-size:13px">'+s+'</small></span><span class="sw" style="pointer-events:none;flex:none"><input type="checkbox" '+(on?'checked':'')+' tabindex="-1"><i></i></span></div>';
const LIN=(r,v,ch)=>'<div style="display:flex;align-items:center;gap:12px;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">'+r+'</span><b style="font-size:15px;font-weight:600;font-variant-numeric:tabular-nums">'+v+'</b>'+(ch?'<i style="font-style:normal;color:var(--mute);font-size:20px;width:14px;text-align:center">'+ch+'</i>':'')+'</div>';
const JAN=(tit,inner)=>{const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn';j.style.transform='none';j.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>'+tit+'</b></div><div class="ljCorpo">'+inner+'</div>';document.body.appendChild(bk);document.body.appendChild(j)};
const PONTA=(t)=>{const h=[...document.querySelectorAll('.view:not([hidden]) .top h1, .view:not([hidden]) h1.dHdT')].filter(e=>e.getBoundingClientRect().height)[0];const top=h.closest('.top')||h.parentElement;top.style.setProperty('display','flex','important');top.style.setProperty('align-items','center','important');top.style.setProperty('justify-content','space-between','important');top.style.setProperty('flex-direction','row','important');top.style.setProperty('flex-wrap','nowrap','important');const d=document.createElement('div');d.innerHTML=t;top.appendChild(d.firstChild)};"""
def tira(pw,v,js=None,arg=None,pre=None,prep=None):
  b,pg,w=ap.abre(pw,v,True,'celular',base=True);w(800)
  if prep: pg.evaluate(prep);w(1200)
  if prep==PREC: pg.evaluate(JS,IC);w(400)
  pg.add_style_tag(content='#nvBar{display:none!important}')
  if js: pg.evaluate(r"""(a)=>{"""+H+js+"}",arg);w(500)
  f='/tmp/s46.png';pg.screenshot(path=f);b.close();x=Image.open(f);x.load();return x.copy()
SITE_P=r"""const fl=()=>{document.querySelectorAll('.cx97,.cx97 > *,.stG .stN,.st96,.pv97').forEach(e=>{['background','border','box-shadow','border-radius'].forEach(k=>e.style.setProperty(k,k=='border'?'0':'none','important'))});const c=document.querySelector('.cx97');if(c){c.style.setProperty('padding','0','important')}document.querySelectorAll('.pv97').forEach(e=>{e.style.setProperty('padding-left','0','important');e.style.setProperty('padding-right','0','important');e.style.setProperty('border-bottom','1px solid var(--line2)','important')});const g=document.querySelector('.stG');if(g){g.style.setProperty('gap','0','important');g.style.setProperty('border-top','1px solid var(--line2)','important')}document.querySelectorAll('.stG .stN').forEach((e,i)=>{e.style.setProperty('border-bottom','1px solid var(--line2)','important');if(i%2==0)e.style.setProperty('border-right','1px solid var(--line2)','important');e.style.setProperty('padding','16px 12px','important')})};fl();const c=document.querySelector('.cx97 .st96');if(c)c.remove();PONTA(PILL(1,'No ar'));"""
SITE_J=SITE_P+r"""JAN('Site',SW('Site no ar','os clientes veem o catálogo agora',1)+'<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 0">Desligado, quem abre o site vê "Voltamos logo" e não consegue fazer pedido. Os pedidos que já existem continuam.</div>')"""
PREC=r"""const S=__LF.S;S.dTab='prec';__LF.setView('dash')"""
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

PREC_P=r"""PONTA(PILL(0,'Automático'));"""
PREC_J=PREC_P+r"""const pl=(__LF.paPlano?__LF.paPlano():[]);const sob=pl.filter(m=>m.para>m.de).length,bai=pl.length-sob;
 JAN('Preço automático',SW('Preço automático','desligado · você define os preços à mão',0)+'<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 4px">Ao ligar, com os seus dados de hoje, o app faria:</div>'+LIN('Sobem',sob+(sob==1?' peça':' peças'))+LIN('Baixam (ofertas)',bai+(bai==1?' peça':' peças'))+LIN('Revisa','toda segunda')+'<div style="color:var(--mute);font-size:13px;margin:16px 0 0">Contas, taxas e meta ficam em Preços › Regras.</div>')"""
PED_P=r"""PONTA(PILL(0,'Automático'));"""
PED_J=PED_P+r"""JAN('Pagamento automático',SW('Confirmar o PIX sozinho','pelo Nubank · só no app do Android',0)+SW('Imprimir pedidos pagos sozinho','conecte uma impressora em Ajustes',0)+'<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 0">Ligado, o pedido pago por PIX vai para "Separar" sem você tocar em nada.</div>')"""
JS3=r"""()=>{const g=document.getElementById('ajGrp');const L=k=>g.querySelector('.ajS[data-k="'+k+'"]');
 // Preços fecha (abre no toque, como as outras)
 const pr=L('preco');[...pr.children].forEach(c=>{if(!c.classList.contains('ajR'))c.style.display='none'});
 const R=getComputedStyle(document.querySelector('.mkSec,.lbl,h2')||document.body).color;
 const sv=p=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
 const nova=(k,t,res,ic,seta)=>{const n=L('imp').cloneNode(true);n.dataset.k=k;n.querySelector('b').textContent=t;n.querySelector('.ajRes').textContent=res;n.querySelector('.ajIc').innerHTML=sv(ic);[...n.children].forEach(c=>{if(!c.classList.contains('ajR'))c.remove()});n.querySelector('.ajCh').style.visibility='hidden';return n};
 const marca=nova('marca','Marca','LaFouch · PT e ES','<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"></path>',false);
 const ig=nova('ig','Instagram','Não conectado','<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"></path><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"></path>',false);
 // Pedidos do site: ícone próprio (sacola), o globo fica só no Site
 L('ped').querySelector('.ajIc').innerHTML=sv('<path d="M5 8h14l-1 12H6z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>');
 const tit=t=>{const d=document.createElement('div');d.textContent=t;d.style.cssText='font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:32px 0 8px';return d};
 const ordem=[['Loja',[marca,L('site'),L('ped'),L('preco'),L('pauto')]],['Contas ligadas',[ig,L('bk')]],['Este aparelho',[L('imp'),L('tema'),L('seg'),L('av'),L('upd')]]];
 g.innerHTML='';ordem.forEach(([t,ls],i)=>{const h=tit(t);if(i===0)h.style.marginTop='16px';g.appendChild(h);ls.forEach(x=>g.appendChild(x))});
 const sub=document.querySelector('#v-ajustes .top .crumb, #v-ajustes .top div');}"""
def quadro(arq,q):
  g=36;w,h=q[0][2].size;S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+h],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  if 0: quadro('esboco_46a_site.jpg',[('HOJE · Site › Resumo','"Estado do site" abre o painel do site',tira(pw,'site')),('PROPOSTA · Resumo','botão "● No ar" ao lado do título',tira(pw,'site',SITE_P)),('PROPOSTA · tocar no botão','janela com o interruptor · sem confirmação',tira(pw,'site',SITE_J))])
  quadro('esboco_46b_precos.jpg',[('APROVADO · Preços (54)','escritório do Guardião',tira(pw,'inicio',prep=PREC)),('PROPOSTA · Preços','botão "○ Automático" ao lado do título',tira(pw,'inicio',PREC_P,prep=PREC)),('PROPOSTA · tocar no botão','interruptor + o que mudaria',tira(pw,'inicio',PREC_J,prep=PREC))])
  quadro('esboco_46c_pedidos.jpg',[('HOJE · Pedidos online','o PIX automático mora em Ajustes',tira(pw,'ped')),('PROPOSTA · Pedidos online','botão "○ Automático" ao lado do título',tira(pw,'ped',PED_P)),('PROPOSTA · tocar no botão','os dois interruptores do pagamento',tira(pw,'ped',PED_J))])

  def aj(prop):
    b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=True);w(800);pg.evaluate(JS3);w(400)
    if prop: pg.evaluate("()=>{const f=()=>{document.querySelectorAll('#ajPreco,.ajS[data-k=preco],.ajS[data-k=pauto]').forEach(e=>e.style.setProperty('display','none','important'))};f();setInterval(f,100)}");w(600)
    pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}')
    f='/tmp/s46aj.png';pg.screenshot(path=f,full_page=True);b.close();x=Image.open(f);x.load();x=x.crop((0,0,780,min(x.height,2300)));return x.copy()
  q=[('APROVADO 20/11 · Ajustes','LOJA com Preços e Pagamento automático',aj(False)),('PROPOSTA · Ajustes','saem Preços e Pagamento automático (foram para as telas deles)',aj(True))]
  g=36;w=780;h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+2*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s2,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,22),t,font=F(32),fill=(235,235,240));d.text((x,66),s2,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+w,112+im.height],outline=(90,90,100))
  S.save(O+'esboco_46d_ajustes.jpg',quality=88);print('ok d')
