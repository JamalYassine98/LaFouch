# v2 (dono 13:19 'só precisa ficar alinhado'): status como linha comum na margem; › dos dois cartões no mesmo eixo (centro, 18 px da
# borda); 'Adicionar item ›' na margem. Esboço 103 (S435, 23/11 13:25) — NATAL SEM INTERRUPTORES + KITS DE VÁRIOS TIPOS (dono 13:14: 'esses switches não estão feios? e se eu quiser
# montar outros tipos de kits?'). (a) A data: o status numa linha ('No ar · 01/12 a 25/12 · liga e desliga sozinho' · pausar); os presentes são
# OS PRÓPRIOS CARTÕES (o cupom como o cliente vê + o kit), tocar edita; '+' redondo ao lado do título = adicionar presente (regra 15).
# (b) Marketing › Kits: cada kit com o que vem dentro, estoque e custo; '+' = Novo kit (janela de baixo com Salvar, regra 15). Na data escolhe-se
# QUAL kit. Kits de Mães e Pais = ILUSTRAÇÃO (o dono monta os dele). Base: 73s + 102 v2 + aprovados.py (cor oficial, cartão = o do site).
exec(open('/home/claude/lafouch/work/s435/lote99/esboco_102.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
KC=r"""const KIT=(t,s,e)=>'<div style="display:flex;align-items:center;gap:16px;padding:15px 17px;border:1px solid var(--line);border-radius:16px;margin-top:16px"><span style="flex:1;min-width:0"><b style="display:block;font:700 18px Georgia,serif">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span><span style="font-size:15px;color:var(--mute);white-space:nowrap">'+e+'</span><span style="color:var(--mute);font-size:18px">›</span></div>';"""
NAT3=r"""TOP('Temática','Natal','01/12 a 25/12',1)+
 '<div style="display:flex;align-items:center;gap:16px;min-height:64px;margin-top:16px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Liga sozinho em 01/12</b><small style="display:block;font-size:13px;color:var(--mute)">e desliga em 25/12</small></span><button type="button" class="lkTx on">pausar</button></div>'+
 T('O que o cliente recebe')+'<div class="cupCard" style="margin:8px 0 0;display:flex!important;align-items:center;gap:16px"><span style="flex:1;min-width:0;display:grid;gap:4px"><small>LA FOUCH</small><b>10% · Cupom de Natal</b><i>na conta de todos · até 25/12</i></span><span style="font-size:18px;opacity:.85">›</span></div>'+
 KIT('Kit de Natal','estojo, flanela e líquido','40')+
 '<div style="margin-top:24px">'+LN('','Custo estimado','30 cupons usados + 40 kits','G$ 756.000','')+'</div>'"""
KITS=r"""TOP('Marketing','Kits','',1)+T('Seus kits · 3',1)+LN('pres','Kit de Natal','estojo, flanela e líquido · US$ 1,50','40','›')+LN('pres','Kit Dia das Mães','estojo floral, flanela e cartão · US$ 1,80','0','›')+LN('pres','Kit Dia dos Pais','estojo de couro e flanela · US$ 2,10','0','›')"""
NOVO=r"""(()=>{const L=(t,v,ch)=>'<div style="display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">'+t+'</span><span style="color:var(--mute);font-size:15px">'+v+'</span>'+(ch?'<span style="color:var(--mute);font-size:18px">'+ch+'</span>':'')+'</div>';
 return '<div class="lbl" style="margin-top:8px">Nome</div><input class="in" value="Kit Dia das Mães" style="width:100%">'+
 '<div class="lbl" style="margin-top:24px">O que vem dentro · 3</div>'+L('Estojo floral','','')+L('Flanela','','')+L('Cartão da data','','')+'<button type="button" class="lkTx on" style="margin-top:12px;padding-left:0;margin-left:0">Adicionar item ›</button>'+
 '<div class="lbl" style="margin-top:24px">Custo e estoque</div>'+L('Custo por kit','US$ 1,80','')+'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">Em estoque</span><span class="c54Q"><button type="button">−</button><b>0</b><button type="button">+</button></span></div>'+
 '<button type="button" class="go" style="width:100%;margin-top:24px">Salvar</button>'})()"""
def t103(pw,esc,corpo,n,jan=None):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3B+KC+"return '<div class=\"e49\">'+"+corpo+"+'</div>'}");pagina(pg,html);w(500)
  if jan:
    vs=pg.viewport_size;pg.set_viewport_size({'width':vs['width'],'height':vs['height']+430});w(300)
    pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
    pg.evaluate("h=>{const j=[...document.querySelectorAll('.ljJn')].pop();const t=j.querySelector('.ljHd b');if(t)t.textContent='Novo kit';(j.querySelector('.ljCorpo')||j).innerHTML=h}",pg.evaluate("()=>"+NOVO));w(400)
    A2.aplica(pg);w(300);confere(pg,n);pg.screenshot(path='/tmp/s103.png');b.close();im=Image.open('/tmp/s103.png');im.load();return im.copy()
  A2.aplica(pg);w(300)
  print(n,pg.evaluate(r"""()=>{const r=[];document.querySelectorAll('.e49 b,.e49 small,.e49 .lbl,.e49 button,.e49 i,.e49 span').forEach(e=>{if(e.children.length)return;const t=e.textContent.trim();if(!t)return;const b=e.getBoundingClientRect();if(b.width)r.push([t.slice(0,18),Math.round(b.left),Math.round(b.right)])});return JSON.stringify(r)}"""))
  return fim(pg,b,n)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_103_natal_e_kits_v2_%s.jpg'%n,[('PROPOSTA · Natal',n+' · sem interruptores · os presentes são os cartões',t103(pw,esc,NAT3,'Natal')),('PROPOSTA · Marketing › Kits',n+' · um kit por data (ilustração)',t103(pw,esc,KITS,'Kits')),('PROPOSTA · Novo kit',n+' · o + abre a janela',t103(pw,esc,KITS,'Novo',1))])
for n,f in REL: print(n,f)
