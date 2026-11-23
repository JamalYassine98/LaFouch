# 99d (S435, 23/11 11:05) — JANELA DA DATA ENXUTA (dono 10:56: 'muito bagunçado, ofertas e presentes demais; tem custos'): UM presente por
# data, escolhido em dois lados (regra 15): 'Cupom na conta' (10% na conta de todo cliente cadastrado, até o fim da data) OU 'Kit na compra'
# (estojo, flanela e líquido; 'Kits em estoque · 40 · +'). Sai 'Toda compra ganha o cupom da volta'. Uma linha de CUSTO ESTIMADO do Titan para
# você decidir. Substitui 97b e a janela do 99c (regra 7). Base: 73s Temática + aprovados.py (a barra vira o trilho 140C). Números = ilustração.
src=open('/home/claude/lafouch/work/s435/oferta96/esboco_97.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0].replace("vs['height']+140","vs['height']+60")
i=src.index('NATALJ=r"""');j=src.index('"""',i+11)+3
src=src[:i]+'NATALJ=r"""(()=>{return \'\'})()"""'+src[j:]
exec(src)
O='/home/claude/lafouch/work/s435/lote99/'
def JAN(kit):
  L=lambda t,s,v,plus=False:'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span>'+(v and '<b style="font-size:16px;font-weight:500;font-variant-numeric:tabular-nums">'+v+'</b>' or '')+(plus and '<span style="flex:0 0 32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:18px">+</span>' or '')+'</div>'
  seg='<div class="adSeg" style="margin-top:8px"><button type="button" class="'+('' if kit else 'on')+'">Cupom na conta</button><button type="button" class="'+('on' if kit else '')+'">Kit na compra</button></div>'
  corpo=(L('Kits em estoque','estojo, flanela e líquido','40',True)+L('Custo estimado','40 kits · US$ 1,50 cada','G$ 396.000')) if kit else (L('10% na conta de todos','até 25/12 · um cupom por vez','')+L('Custo estimado','se 30 clientes usarem','G$ 360.000'))
  return '<div style="font-size:14px;color:var(--mute);margin:-4px 0 8px">01/12 a 25/12</div><div class="lbl" style="margin-top:16px">Presente da data</div>'+seg+corpo+'<button type="button" class="go" style="width:100%;margin-top:24px">Salvar</button>'
def jan(pw,esc,kit):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3+"return '<div class=\"e49\">'+"+TEMA2+"+'</div>'}");pagina(pg,html);w(500)
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Natal';(j.querySelector('.ljCorpo')||j).innerHTML=h}",JAN(kit));w(400)
  A2.aplica(pg);w(400);confere(pg,'kit' if kit else 'cupom');pg.screenshot(path='/tmp/s99d.png');b.close();im=Image.open('/tmp/s99d.png');im.load();return im.copy()
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_99d_presente_da_data_%s.jpg'%n,[('PROPOSTA · janela Natal',n+' · um presente: Cupom na conta',jan(pw,esc,0)),('PROPOSTA · janela Natal',n+' · ou: Kit na compra',jan(pw,esc,1))])
for n,f in REL: print(n,f)
