# Esboço 97 (S435, 23/11 09:45) — REGRAS DO CUPOM PRÓXIMA COMPRA (aprovadas 09:36) e DATAS FESTIVAS com gesto (aprovado 09:37).
# 97a · Marketing › Cartões › Cupom próxima compra (tela, 'lugar ›'): quem ganha (compra ≥ G$ 150.000 ou peça Luxo), um por vez, começa em
#       7 dias e vale 30, o Titan decide 5% ou 10%, a mensagem de presente; números do mês (ilustração).
# 97b · Marketing › Temática › Natal (janela): na data, toda compra ganha o cupom da volta · presente na compra (estojo, flanela, líquido) ·
#       Cupom de Natal na conta de todo cliente · o que não muda (um por vez, sem somar com oferta, nunca abaixo do mínimo).
# Base: 73s aprovado (Cartões e Temática) + aprovados.py. Números = ilustração (a nuvem não manda cupons ao simulador).
exec(open('/home/claude/lafouch/work/s435/semp/esboco_73s.py').read().rsplit("\nif __name__",1)[0])
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import aprovados as A2
O='/home/claude/lafouch/work/s435/oferta96/'
CART3=CART.replace("LN('tick','Próxima compra','10% · vem com a compra paga','','')","LN('tick','Próxima compra','a partir de G$ 150.000 · um por vez','','›')").replace("LN('','Códigos ativos','os cartões que valem agora','','›')","LN('','Cartões ativos','por cliente · sem código','','›')")
PX=r"""TOP('Cartões','Próxima compra','',0)+T('Quem ganha',1)+LN('','Compra a partir de','ou com uma peça do degrau Luxo','G$ 150.000','')+LN('','Um por vez','enquanto não usar, não ganha outro','','')+
 T('Quando vale')+LN('','Começa depois','não dá para usar na mesma compra','7 dias','')+LN('','Vale por','depois de começar','30 dias','')+
 T('Quanto')+LN('','O Titan decide','pela margem do mês','5% ou 10%','')+
 T('A mensagem')+LN('','Na conta do cliente','A La Fouch reservou 10% para a sua próxima visita','','⌄')"""
TEMA2=TEMA.replace("SW('Natal','liga sozinho em 01/12 · até 25/12',1)","LN('','Natal','liga sozinho em 01/12 · presentes da data','','›')")
NATALJ=r"""(()=>{const SWJ=(t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span><label class="sw"><input type="checkbox"'+(on?' checked':'')+'><i></i></label></div>';
 const LJ=(t,s)=>'<div style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><i style="flex:none;width:8px;height:8px;border-radius:50%;background:var(--mute)"></i><span style="flex:1;min-width:0;font-size:15px">'+t+'<small style="display:block;font-size:13px;color:var(--mute)">'+s+'</small></span></div>';
 return '<div style="font-size:14px;color:var(--mute);margin:-4px 0 8px">01/12 a 25/12</div>'+
 '<div class="lbl" style="margin-top:16px">Presentes da data</div>'+SWJ('Toda compra ganha o cupom da volta','sem o mínimo de G$ 150.000',1)+SWJ('Presente na compra','estojo, flanela e líquido',1)+SWJ('Cupom de Natal na conta de todos','10% · o Titan confere a margem',1)+
 LJ('Continua um cupom por vez','sem somar com oferta · nunca abaixo do mínimo')+
 '<button type="button" class="go" style="width:100%;margin-top:24px">Salvar</button>'})()"""
def tela97(pw,esc,corpo,n,jan=False):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3+"return '<div class=\"e49\">'+"+corpo+"+'</div>'}");pagina(pg,html);w(500)
  if jan:
    vs=pg.viewport_size;pg.set_viewport_size({'width':vs['width'],'height':vs['height']+140});w(300)
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Natal';(j.querySelector('.ljCorpo')||j).innerHTML=h}",pg.evaluate("()=>"+NATALJ));w(500)
  A2.aplica(pg);w(300)
  if jan:
    pg.add_style_tag(content='#x{}');confere(pg,n);pg.screenshot(path='/tmp/s97.png');b.close();im=Image.open('/tmp/s97.png');im.load();return im.copy()
  return fim(pg,b,n)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_97a_cupom_proxima_compra_%s.jpg'%n,[('PROPOSTA · Marketing › Cartões',n+' · "Cupom próxima compra ›" com a regra',tela97(pw,esc,CART3,'Cartões')),('PROPOSTA · Próxima compra',n+' · as regras aprovadas 09:36 · números de ilustração',tela97(pw,esc,PX,'PX'))])
    quadro('esboco_97b_natal_presentes_%s.jpg'%n,[('PROPOSTA · Marketing › Temática',n+' · "Natal ›" abre os presentes da data',tela97(pw,esc,TEMA2,'Temática')),('PROPOSTA · janela Natal',n+' · gesto, não desconto maior',tela97(pw,esc,TEMA2,'Natal',True))])
for n,f in REL: print(n,f)
