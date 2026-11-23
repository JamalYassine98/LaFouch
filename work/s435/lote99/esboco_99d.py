# 99d v2 (dono 11:52–12:17): nas datas de presente (Mães, Pais, Natal) valem OS DOIS juntos — Cupom do evento (atrai: entra na conta de
# todo cadastrado e de quem se cadastrar) + Kit dentro do embrulho de sempre: SACOLA na loja física, CAIXA no delivery. Um custo estimado só.
# Frames: janela da data · Carrinho (lembrete 'na sacola') · Pedido do site (separar: 'Kit de Natal na caixa').
# v1 (23/11 11:05): um presente por data em dois lados — superado pela v2.
src=open('/home/claude/lafouch/work/s435/oferta96/esboco_97.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0].replace("vs['height']+140","vs['height']+200")
i=src.index('NATALJ=r"""');j=src.index('"""',i+11)+3
src=src[:i]+'NATALJ=r"""(()=>{return \'\'})()"""'+src[j:]
exec(src)
O='/home/claude/lafouch/work/s435/lote99/'
def JAN(kit=None):
  L=lambda t,s,v,plus=False:'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span>'+(v and '<b style="font-size:16px;font-weight:500;font-variant-numeric:tabular-nums">'+v+'</b>' or '')+(plus and '<span style="flex:0 0 32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:18px">+</span>' or '')+'</div>'
  SW=lambda t,s:'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span><label class="sw"><input type="checkbox" checked><i></i></label></div>'
  return ('<div style="font-size:14px;color:var(--mute);margin:-4px 0 8px">01/12 a 25/12</div><div class="lbl" style="margin-top:16px">Presentes da data</div>'+
    SW('Cupom de Natal · 10%','na conta de todo cliente cadastrado')+SW('Kit de presente','na sacola da loja e na caixa do delivery')+L('Kits em estoque','estojo, flanela e líquido','40',True)+
    L('Custo estimado','30 cupons usados + 40 kits','G$ 756.000')+'<button type="button" class="go" style="width:100%;margin-top:24px">Salvar</button>')
def jan(pw,esc,kit):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3+"return '<div class=\"e49\">'+"+TEMA2+"+'</div>'}");pagina(pg,html);w(500)
  vs=pg.viewport_size;pg.set_viewport_size({'width':vs['width'],'height':vs['height']+200});w(300)
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Natal';(j.querySelector('.ljCorpo')||j).innerHTML=h}",JAN(kit));w(400)
  A2.aplica(pg);w(400);confere(pg,'janela');pg.screenshot(path='/tmp/s99d.png');b.close();im=Image.open('/tmp/s99d.png');im.load();return im.copy()
J={}
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_98.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0].replace("estojo, flanela e líquido</small>","estojo, flanela e líquido · sobram 39 kits</small>"),J)
PED=r"""()=>{const v=document.getElementById('v-ped');const vz=v.querySelector('.lfVazio');
 const L=(t,s)=>'<button type="button" class="nvL" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:0;color:var(--fg);font:inherit;text-align:left"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute)">'+s+'</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></button>';
 const d=document.createElement('section');d.className='nvLista';d.innerHTML=L('Pedido 1044 · Ana Benítez','separar · delivery')+'<div style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent-fg)"></i><span style="flex:1;min-width:0;font-size:15px">Kit de Natal na caixa<small style="display:block;font-size:13px;color:var(--mute)">estojo, flanela e líquido · sobram 38 kits</small></span></div>';
 vz?vz.replaceWith(d):v.appendChild(d);const c=v.querySelector('.crumb');if(c)c.innerHTML='1 para agir agora'}"""
def ped(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(600);pg.evaluate("()=>window.__LF.inicioGo('ped')");w(1500)
  A2.aplica(pg);pg.evaluate(PED);w(400);pg.add_style_tag(content='#mainnav{display:none!important}');confere(pg,'ped')
  pg.screenshot(path='/tmp/s99p.png');b.close();im=Image.open('/tmp/s99p.png');im.load();return im.copy()
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_99d_presentes_da_data_v2_%s.jpg'%n,[('PROPOSTA · janela Natal',n+' · cupom + kit, um custo só',jan(pw,esc,0)),('PROPOSTA · Carrinho (loja)',n+' · o kit vai na sacola',J['tela98'](pw,esc,'natal')),('PROPOSTA · Pedido do site',n+' · o kit vai na caixa do delivery',ped(pw,esc))])
for n,f in REL: print(n,f)
