# Esboço 52 parte 2 (S435, 21/11 15:50): Retorno do estoque, Curva ABC e os números de Preços vão para Resultados › Dashboard (mês), em Detalhes.
# Base: app real + aprovados (52 parte 1: estado do estoque no Inventário; 149s; 99/100). Conferência: coleta do comparador único.
exec(open('/home/claude/lafouch/work/s435/giroprecos/esboco_52.py').read().split("def inicio(pw,prop):")[0])
from PIL import Image
P2=r"""(abre)=>{const l=document.querySelector('.esLs');
 // regra 16: o que abre no lugar leva ⌄ (hoje as linhas de Detalhes mostram › e abrem ali mesmo)
 l.querySelectorAll('.esLn > i').forEach(i=>i.textContent='⌄');
 const LIN=(r,s,v,c)=>'<div class="sl" style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;display:flex;flex-direction:column;gap:2px;font-size:16px">'+r+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span><b style="font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;color:'+(c||'var(--fg)')+'">'+v+'</b></div>';
 const LN=(id,t,s,on)=>'<button type="button" class="esLn lk100 inl'+(on?' on':'')+'" aria-expanded="'+(on?'true':'false')+'"><span class="g"><b>'+t+'</b><small>'+s+'</small></span><i aria-hidden="true">'+(on?'⌃':'⌄')+'</i></button>';
 const des=LN('des','Desempenho do mês','margem, lucro por peça, contas e retorno',abre=='des')+'<div class="esCorpo"'+(abre=='des'?'':' hidden')+' style="padding:0 0 16px">'+LIN('Margem média','sobre o preço de venda','61%')+LIN('Lucro por peça','média do mês','G$ 24.971')+LIN('Contas do mês cobertas','faltam 41 peças','76%','var(--warn,#e0b44c)')+LIN('Retorno do estoque','30 dias · cada US$ 1 rendeu US$ 1,09','109%')+'</div>';
 const abc=LN('abc','Curva ABC','quais produtos dão 80% do lucro (90 dias)',abre=='abc')+'<div class="esCorpo"'+(abre=='abc'?'':' hidden')+' style="padding:0 0 16px">'+LIN('A · dão 80% do lucro','','8 produtos')+LIN('B · próximos 15%','','5 produtos')+LIN('C · últimos 5%','','2 produtos')+LIN('Sem venda em 90 dias','têm estoque','1 produto','var(--warn,#e0b44c)')+'<div style="color:var(--mute);font-size:13px;line-height:1.45;margin:12px 0 0">Campeões: Óculos solar Ray-Ban de metal masculino (US$ 228), Óculos solar Kazwini de tr90 feminino (US$ 212), Óculos solar #13 (US$ 182).</div></div>';
 const r=l.querySelector('.esRes');r.insertAdjacentHTML('afterend',des+abc);
 const t=[...l.querySelectorAll('.esLn')].find(x=>x.textContent.includes(abre=='abc'?'Curva ABC':'Desempenho'));let sc=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.getBoundingClientRect().height>300&&e.scrollHeight>sc.scrollHeight-1)sc=e}const y=(t||l).getBoundingClientRect().top+sc.scrollTop-200;sc.scrollTop=y;scrollTo(0,y)}"""
def dashh(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.evaluate("()=>{__LF.S.per='mes';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500);confere(pg,'Dashboard mês hoje');b.close()
def dash(pw,abre):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.evaluate("()=>{__LF.S.per='mes';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
  pg.add_style_tag(content='#nvBar{display:none!important}')
  pg.evaluate(P2,abre);w(600);confere(pg,'Dashboard mês proposta '+abre);x=shot(pg,'d'+abre);b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
def recorta(arq,i=0):
  im=Image.open(arq);return im.crop((i*800,0,i*800+780,1688))
with sync_playwright() as pw:
  dashh(pw)
  quadro('esboco_52e_resultados.jpg',[('HOJE · Giro','Retorno do estoque e Curva ABC',recorta(O+'h_giro_abc.jpg',1)),('HOJE · Preços','margem, lucro por peça, contas',recorta('/home/claude/lafouch/work/s435/selo/h_precos.jpg',0)),('PROPOSTA · Dashboard do mês','Detalhes › "Desempenho do mês" ⌄',dash(pw,'des')),('PROPOSTA · Dashboard do mês','Detalhes › "Curva ABC" ⌄',dash(pw,'abc'))])
for n,f in REL: print(n,len(f),f[:4])
