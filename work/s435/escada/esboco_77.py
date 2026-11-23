# Esboço 77 (S435, 22/11 21:40) — ESCADA DE PREÇOS (aprovada 21/11 23:59) + preço sugerido no Completar peça (aprovado 22/11 00:21; linha do 45).
# Dono 21:34: nada inventado — a escada NASCE VAZIA e se forma com os preços que ele confirma ao cadastrar os modelos novos.
# Janela 'Preço de venda' (tarefa; abre pela linha 'Preço de venda · sugerido ›' do Completar, esboço 45), em 3 momentos:
#  A vazia: o Titan sugere pelo cálculo e pelo jeito do dono (US$ × 26.000, valor fácil); mínimo do Titan; 'Seu preço' em linha fina.
#  B aprendendo: os preços que ele já confirmou no tipo viram as referências ('1 de 3').
#  C formada: 3 degraus em escolha de lados (regra 15), o mais perto do preço justo vem marcado; abaixo do mínimo não aparece (sobe ao de cima).
# Números: custo REAL do app de teste (Solar US$ 4,50); mínimo = (custo × 1,13 + contas G$ 22.580) × 1,1 com cotação 6.700 = G$ 65.000;
# jeito = US$ 4,50 × 26.000 = 117.000 → valor fácil 120.000. Em B e C os degraus são ILUSTRAÇÃO do que os cadastros dele vão formar.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
O='/home/claude/lafouch/work/s435/escada/'
def confere(pg,n):
  a,_=compara.M.percorre(pg,None);REL.append((n,[(k[0],a[k].get('d','')) for k in a]))
R=r"""const R=(a,v,c,s)=>'<div style="display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><span style="display:block;color:var(--mute);font-size:15px">'+a+'</span>'+(s?'<small style="display:block;font-size:13px;color:var(--mute);opacity:.8">'+s+'</small>':'')+'</span><span style="font-size:15px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap'+(c?';color:'+c:'')+'">'+v+'</span></div>';
 const T=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">'+t+'</div>';
 const SAL='<button type="button" class="go" style="margin-top:24px;width:100%">Salvar</button>';"""
EST={
'A':r"""R('Escada de Solares','vazia','','os preços que você confirmar viram degraus')+R('Sugerido','G$ 120.000','var(--fg)','US$ 4,50 × o seu jeito de cobrar')+R('Mínimo do Titan','G$ 65.000')+R('Outro valor','toque para digitar','var(--mute)')+SAL""",
'B':r"""R('Escada de Solares','1 de 3','','aprendendo · G$ 120.000 em 4 modelos')+R('Sugerido','G$ 120.000','var(--fg)','o degrau que você já usa')+R('Mínimo do Titan','G$ 65.000')+R('Outro valor','toque para digitar','var(--mute)')+SAL""",
'C':r"""'<div style="color:var(--mute);font-size:15px;padding:8px 0">Escada de Solares</div><div class="adSeg" role="tablist" style="margin:0 0 4px"><button type="button" role="tab">G$ 90.000</button><button type="button" role="tab" class="on">G$ 120.000</button><button type="button" role="tab">G$ 170.000</button></div>'+
  '<div style="font-size:13px;color:var(--mute);padding:4px 0 8px">o mais perto do preço justo · G$ 117.000</div>'+
  R('Mínimo do Titan','G$ 65.000')+R('Outro valor','toque para digitar','var(--mute)')+SAL"""}
def tela(pw,esc,k):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=True);w(700)
  html=pg.evaluate("()=>{"+R+"return "+EST[k]+"}")
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("""h=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljHd b').textContent='Preço de venda';const c=j.querySelector('.ljCorpo')||j;c.innerHTML=h;window.__ladosCabe&&window.__ladosCabe(document)}""",html);w(700)
  pg.add_style_tag(content='#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,k+(' escuro' if esc else ' claro'));pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0})}");w(300)
  pg.screenshot(path='/tmp/e.png');b.close();im=Image.open('/tmp/e.png');im.load();return im.copy()
if __name__=='__main__':
 with sync_playwright() as pw:
  for esc in (True,False):
   n='escuro' if esc else 'claro'
   quadro('esboco_77_escada_de_precos_%s.jpg'%n,[('A · escada vazia',n+' · 1º modelo novo: o Titan sugere',tela(pw,esc,'A')),('B · aprendendo',n+' · seus preços viram referência',tela(pw,esc,'B')),('C · escada formada',n+' · ilustração: 3 degraus dos seus cadastros',tela(pw,esc,'C'))])
 for n,f in REL: print(n,f)
