# Esboço 94 + 95 (S435, 23/11 09:00) — PRECIFICAÇÃO 56, partes 2 e 3, sobre o 64 aprovado (ficha + janela Oferta do Titan) + aprovados.py.
# 94 · DE/POR HONESTO (dono 21/11 23:51): o "de" só aparece se aquele preço foi praticado ≥ 30 dias E vendeu a ele; o Titan não deixa
#      criar "de" maior. ILUSTRAÇÃO: peça com preço novo G$ 30.000 há 5 dias, sem venda → a oferta G$ 27.000 sai SEM "de".
# 95 · PREÇO DE MERCADO (dono 21/11 23:47: o Semp coleta, o Titan usa; mercado principal = Ciudad del Este): uma linha dentro de
#      "De onde vem o preço ⌄" — "Mercado em CDE · G$ 22.000 a 30.000 · 9 parecidas" (ILUSTRAÇÃO: o Semp ainda não coleta).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import aprovados as A
_s=open('/home/claude/lafouch/work/s435/titan/esboco_64.py').read();exec(_s.split("if __name__=='__main__':")[0])
def confere(pg,n):
  a,_=compara.M.percorre(pg,None);REL.append((n,[(k[0],a[k].get('d','')) for k in a]))
O2='/home/claude/lafouch/work/s435/preco56/'
_ficha=ficha
def ficha(pg,w,emOf):
  _ficha(pg,w,emOf=='honesto')
  if emOf=='antes94':
    pg.evaluate(r"""()=>{const c=document.getElementById('precoCard');c.innerHTML=c.innerHTML.replace('G$ 25.000','G$ 30.000').replace('abaixo do mínimo','preço novo há 5 dias').replace(/color:var\(--bad,#e5484d\)/g,'color:var(--mute)');const d=[...document.querySelectorAll('summary .dbV')].find(x=>x.textContent.trim()=='G$ 25.000');if(d)d.textContent='G$ 30.000'}""")
  if emOf=='honesto':
    pg.evaluate(r"""()=>{const c=document.getElementById('precoCard');c.innerHTML=c.innerHTML.replace('G$ 25.000','G$ 30.000').replace('abaixo do mínimo','preço novo há 5 dias').replace(/color:var\(--bad,#e5484d\)/g,'color:var(--mute)').replace('de G$ 25.000 · até 30/11','até 30/11 · sem "de"').replace('G$ 23.000','G$ 27.000');const d=[...document.querySelectorAll('summary .dbV')].find(x=>x.textContent.trim()=='G$ 25.000');if(d)d.textContent='G$ 30.000'}""")
JAN94=r"""()=>{const j=document.getElementById('e64');if(!j)return;let h=j.innerHTML;
 h=h.replace(/Preço normal<\/span><span style="color:var\(--fg\)">G\$ 25.000/,'Preço normal</span><span style="color:var(--fg)">G$ 30.000').replace('G$ 23.000','G$ 27.000').replace('>8%<','>10%<');
 h=h.replace(/<div style="margin:16px 0 0;font-size:14px;line-height:1.45;color:var\(--bad,#e5484d\)">[^<]*<\/div>/,'<div style="display:flex;align-items:center;gap:12px;min-height:60px;border-bottom:1px solid var(--line2)"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:var(--ptw)"></i><span style="flex:1;min-width:0;font-size:15px">Sem "de": G$ 30.000 ainda não vendeu</span></div>');
 h=h.replace(/<div style="margin:6px 0 0;font-size:14px;color:var\(--mute\)">Folga[^<]*<\/div>/,'<div style="display:flex;align-items:center;justify-content:space-between;min-height:52px;border-bottom:1px solid var(--line2);font-size:16px"><span>No site</span><span>G$ 27.000</span></div>');
 j.innerHTML=h}"""
MERC=r"""()=>{const s=[...document.querySelectorAll('summary')].find(e=>/^De onde vem o preço/.test(e.textContent.trim()));
 if(!s)return 'nao achei';const d=s.closest('details');if(d)d.open=true;
 const L=(t,f,v)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute);white-space:nowrap">'+f+'</small></span><b style="font-size:16px;font-weight:500;font-variant-numeric:tabular-nums">'+v+'</b></div>';
 const box=document.createElement('div');box.id='e95';box.innerHTML=L('Mercado em CDE','9 parecidas','G$ 22.000 a 30.000')+L('Você','no meio do mercado','G$ 25.000');
 (d?d.querySelector('summary').nextElementSibling||d:s).before?0:0;if(d){d.querySelector('summary').after(box)}else{s.after(box)}
 window.scrollTo(0,s.getBoundingClientRect().top+scrollY-200);return d?'details':'sem details'}"""
def tela2(pw,qual):
  b,pg,w=abre(pw);ficha(pg,w,'honesto' if qual=='depois94' else ('antes94' if qual=='janela94' else False))
  pg.evaluate(r"""()=>{const a=[...document.querySelectorAll('button,a')].find(x=>/^Fotografar no Estúdio/.test(x.textContent.trim()));if(a&&!document.getElementById('e64t')){const n=a.cloneNode(true);n.id='e64t';n.removeAttribute('data-act');n.textContent='Ver no escritório do Titan ›';a.after(n)}}""");w(200)
  A.aplica(pg);w(300)
  pg.evaluate("()=>(()=>{const e=document.getElementById('precoCard');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-160)})()");w(300)
  if qual=='janela94':
    _t=open('/home/claude/lafouch/work/s435/titan/esboco_64.py').read();js=_t[_t.index('pg.evaluate(r"""()=>{const L=(r,v,c)')+12:];js=js[:js.index('""");w(400)')+3]
    pg.evaluate(eval(js));pg.evaluate(JAN94);w(400)
  if qual=='merc95':print(pg.evaluate(MERC));w(500)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}' if qual!='janela94' else '#x{}')
  confere(pg,qual)
  pg.evaluate("q=>{const e=document.getElementById(q=='merc95'?'e95':'precoCard');if(e)window.scrollTo(0,e.getBoundingClientRect().top+scrollY-(q=='merc95'?380:160))}",qual);w(600)
  f='/tmp/e9x_%s.png'%qual;pg.screenshot(path=f);x=Image.open(f);x.load();x=x.copy();b.close();return x
if __name__=='__main__':
 O=O2
 _ab=ap.abre
 with sync_playwright() as pw:
  for ESC in (True,False):
   tm='escuro' if ESC else 'claro'
   ap.abre=lambda pw,v,e,d,base=False,_E=ESC:_ab(pw,v,_E,d,base=base)
   quadro('esboco_94_de_por_honesto_%s.jpg'%tm,[('PROPOSTA · janela Oferta','ilustração: preço novo há 5 dias, sem venda',tela2(pw,'janela94')),('PROPOSTA · depois de salvar','a ficha e o site mostram só G$ 27.000',tela2(pw,'depois94'))])
   quadro('esboco_95_preco_de_mercado_%s.jpg'%tm,[('PROPOSTA · De onde vem o preço ⌄','ilustração: o Semp ainda não coleta',tela2(pw,'merc95'))])
 for n,f in REL: print(n,len(f),f[:4])
