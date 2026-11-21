# Esboço 53 (S435, 21/11 17:50) — Destaque da semana do Semp em Marketing (aprovado 17:40: UMA lista de 3–6 peças; o Semp escolhe,
# o dono confirma; a mesma lista vira o destaque do site, a base dos posts/vídeos/cartões/temática e o conselho de venda).
# BASE: Marketing APROVADO do Semp (parte 1c, work/semp/p1c.py: "O Semp sugere para hoje · foco" + Setores) + 149s/149i, 37 ícones cinza.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import ap,compara
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/destaque/'
P1C=open('/home/claude/lafouch/work/semp/p1c.py').read()
exec(P1C[P1C.index('F=lambda'):P1C.index('JS=r"""')])
JS1C=P1C[P1C.index('JS=r"""')+7:P1C.index('"""',P1C.index('JS=r"""')+7)].replace("const R=getComputedStyle(secs[0]).color;","const R='var(--mute)';")  # 37b aprovado (20/11 23:42, v609): ícones de linha em cinza
exec(P1C[P1C.index('def tira(pg,nome):'):P1C.index('with sync_playwright')])
ICONS=dict(mega=MEGA,etq=ETQ,sac=SAC,tend=TEND,loja=LOJA,cal=CAL,cria=CRIA,res=RES,marca=MARCA)
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
def imgs(pg):
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(900)
  m=pg.evaluate("()=>{const o={};document.querySelectorAll('.pcard').forEach(c=>{const i=c.querySelector('img');const b=c.querySelector('b,.nm,h3');if(i&&b)o[b.textContent.trim()]=i.src});return o}")
  pg.evaluate("()=>__LF.inicioGo('mkt')");pg.wait_for_timeout(1200);return m
H=r"""const SV=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
const LBL=(t,d)=>'<div class="mkSec" style="display:flex;justify-content:space-between;margin:32px 0 8px"><span>'+t+'</span>'+(d?'<span style="color:var(--mute)">'+d+'</span>':'')+'</div>';
const PECA=(img,t,s,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:80px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:14px;font-weight:500;white-space:nowrap">'+t+'</b><small style="font-size:13px;color:'+(c||'var(--mute)')+';white-space:nowrap">'+s+'</small></span><span style="color:var(--mute);font-size:18px">›</span></div>';
const LINHA=(ic,t,s)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)">'+(ic?SV(ic):'')+'<div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="color:var(--mute);font-size:18px">›</span></div>';
const LIN=(r,v,c)=>'<div style="display:flex;align-items:center;gap:12px;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">'+r+'</span><span style="color:'+(c||'var(--mute)')+';font-size:15px;text-align:right">'+v+'</span></div>';
const TOPO=(vs,t,s)=>{const v=document.getElementById('v-mkt');const nv=v.querySelector('.nvVs');if(nv)nv.lastChild.textContent=vs;const h=v.querySelector('.top h1, .top .grpT, h1');if(h)h.textContent=t;let sub=v.querySelector('.e53s');if(!sub){sub=document.createElement('div');sub.className='e53s';sub.style.cssText='color:var(--mute);font-size:14px;margin-top:4px';(v.querySelector('.top')||h).appendChild(sub)}sub.textContent=s};
const OK='var(--ok,#4fbf7f)',AV='var(--warn,#e0b44c)',AC='var(--accent-fg)';"""
STAR='<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>'
def marketing(pw,qual):
  b,pg,w=ap.abre(pw,'mkt',True,'celular',base=True);w(600);I=imgs(pg)
  N=['Óculos solar #13','Óculos solar Kazwini de tr90 feminino','Óculos de leitura #15','Óculos solar Ray-Ban de metal masculino']
  im=[I.get(n) or list(I.values())[k%len(I)] for k,n in enumerate(N)]
  pg.evaluate(JS1C,ICONS);w(300)
  pg.add_style_tag(content='#v-mkt .mkSec{color:var(--mute)!important}')  # regra 17: rosa = ação; rótulo de seção não é ação → cinza, como .lbl no resto do app
  if qual=='mkt':
    pg.evaluate("(a)=>{"+H+r"""const [im,STAR]=a;const v=document.getElementById('v-mkt');const s=[...v.querySelectorAll('.mkSec')].find(x=>/^Setores/i.test(x.textContent.trim()));
      s.insertAdjacentHTML('afterend','<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)">'+SV(STAR)+'<div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">Destaque da semana</b><small style="font-size:13px;color:var(--mute);display:block">4 peças · no site, nos posts e na loja</small></div><span style="color:var(--mute);font-size:18px">›</span></div>')}""",[im,STAR])
  else:
    pg.evaluate("(a)=>{"+H+r"""const [im,qual]=a;const v=document.getElementById('v-mkt');[...v.querySelectorAll('.mkSec')][0].parentElement.innerHTML='';
      TOPO('Marketing','Destaque da semana','o Semp escolhe · você confirma');
      const top=v.querySelector('.top');const box=document.createElement('div');
      const troca=qual=='troca'?'<div style="margin:24px 0 0;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);padding:16px 0"><b style="display:block;font-size:16px;font-weight:500">O Semp propõe 1 troca</b><small style="display:block;font-size:13px;color:var(--mute);margin:4px 0 12px">Óculos solar #13 acabou · entra Solar Kazwini de tr90 feminino, a mais visitada no site</small><button type="button" style="display:block;width:100%;min-height:48px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Confirmar a troca</button></div>':'<div style="color:var(--mute);font-size:13px;margin:16px 0 0">Confirmado em 17/11 · vale até domingo</div>';
      box.innerHTML=troca+LBL('As peças · 4')+PECA(im[0],'Óculos solar #13',qual=='troca'?'acabou · sai na troca':'a que mais vende · 31 em 30 dias',qual=='troca'?AV:OK)+PECA(im[1],'Óculos solar Kazwini de tr90 feminino','tendência · a mais visitada no site',AC)+PECA(im[2],'Óculos de leitura #15','parada há 60+ dias · até 15% de desconto',AV)+PECA(im[3],'Óculos solar Ray-Ban de metal masculino','novidade · chegou em 18/11')+
       LBL('Onde aparece')+LINHA('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>','Site','destaque em slide com as 4 peças')+LINHA('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>','Agenda','4 de 6 posts da semana usam estas peças')+LINHA('<path d="M4 10h16v10H4z"/><path d="M3 10l2-6h14l2 6"/>','Na loja','o que oferecer a quem entra');
      (top.parentNode===v?v:top.parentNode).appendChild(box)}""",[im,qual])
    if qual=='vender':
      pg.evaluate("(im)=>{"+H+r"""const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn';j.style.transform='none';
        j.innerHTML='<div class="ljPuxa"></div><div class="ljHd" style="display:block"><b>Óculos de leitura #15</b><div style="color:var(--mute);font-size:14px;font-weight:400;margin-top:2px">no destaque desta semana</div></div><div class="ljCorpo">'+
        '<div style="display:flex;justify-content:center;margin:0 0 8px"><span style="width:160px;height:96px;border-radius:12px;overflow:hidden;background:#fff"><img src="'+im[2]+'" style="width:100%;height:100%;object-fit:contain"></span></div>'+
        LIN('Por que','parada há 60+ dias',AV)+LIN('Como vender','leve, para ler no celular e no livro')+LIN('Desconto possível','até 15% · Guardião ok',OK)+LIN('Preço com o desconto','G$ 21.250')+
        '<div style="display:flex;align-items:center;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px;color:var(--accent-fg);font-weight:600">Trocar esta peça</span><span style="color:var(--mute);font-size:18px">›</span></div></div>';
        document.body.appendChild(bk);document.body.appendChild(j)}""",im)
  w(500);confere(pg,'53 '+qual)
  if qual=='vender':
    pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.screenshot(path='/tmp/v53.png');x=Image.open('/tmp/v53.png');x=x.copy()
  else: x=tira(pg,qual)
  b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_53_destaque.jpg',True,[('1 · Marketing (base: Semp 1c aprovado)','+ "Destaque da semana ›" no começo dos Setores',marketing(pw,'mkt')),('2 · Destaque da semana','as peças · o motivo · onde aparece',marketing(pw,'lista')),('3 · tocar numa peça','como vender · desconto conferido',marketing(pw,'vender')),('4 · quando uma peça acaba','o Semp propõe a troca · você confirma',marketing(pw,'troca'))])
 for n,f in REL: print(n,len(f),f[:4])
