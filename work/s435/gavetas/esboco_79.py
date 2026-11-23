# Esboço 79 (S435, 22/11 22:45) — POR ONDE O DINHEIRO PASSA: as gavetas e o "Pode tirar" (conversa 22:34–22:38 com o dono).
# Dono: imprevistos são da loja E pessoais (imposto novo, manutenção, compressor do carro G$ 3.300.000) numa caixinha só, marcada loja/pessoal;
# o 'salário' (G$ 1.500.000: comida, combustível, estacionamento) é conta fixa de estar na loja → 'Dia a dia do dono'; o ganho dele é o
# 'Pode tirar'. Proposta (aceita 'acho que sim', pediu esboço): meta da caixinha = 1 mês de contas; enche com metade do que sobra.
# v2 (dono 22:50): 'Loja/Pessoal' desalinhado e ele não gosta da barra deslizante → duas linhas com a bolinha de escolha (a mesma
# da janela 'Ligar a um pedido', .pxL/.pxR), alinhadas às outras linhas.
# v3 (dono 22:54–22:55): por que dividir em dois? → UM botão 'Retirar' com 'Para quê': Para mim (sai do Pode tirar) · Imprevisto da
# loja · Imprevisto pessoal (saem primeiro da caixinha); o Titan mostra de onde sai antes de salvar. A caixinha na tela é só para
# acompanhar (sem ›, sem botão).
# v4 (dono 22:58): a barra É bonita — o erro foi o MEU: usei .adSeg (outra peça) espremida numa linha. Volta a barra do app (.trk, a
# mesma do Pagamento: título pequeno em cima e a barra na largura toda): Para mim · Loja · Pessoal.
# Sai a conta fixa 'Provisão de imprevistos' (G$ 200.000) — a caixinha a substitui.
# Base: app real — Caixa › 'Retirada do dono' (src/57-financas.js retiradaHtml, src/95-caixa.js:277) e resultadoMes(nov/2026) REAL:
# vendas 6.569.000 · custo das peças 1.888.004 · taxas 36.270 · contas da loja 1.320.000 · salário 1.500.000 · imprevisto 60.000
# (Conserto da vitrine) · retiradas avulsas 420.000. Colchão 13% (62). Contas do mês G$ 4.200.000 (62) = meta da caixinha.
# Conta: sobra = 6.569.000 − 1.888.000 − 2.856.000 − 245.000 = 1.580.000 → caixinha 790.000 · pode tirar 790.000 − 420.000 já tirado = 370.000.
# A caixinha começa do zero neste mês (é nova): 790.000 − 60.000 do conserto = 730.000.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
def confere(pg,n):
  a,_=compara.M.percorre(pg,None);REL.append((n,[(k[0],a[k].get('d','')) for k in a]))
RR=r"""const L=(t,s,v,c,ch)=>'<div style="display:flex;align-items:center;gap:16px;min-height:60px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small>':'')+'</span><span style="font-size:15px;white-space:nowrap;font-variant-numeric:tabular-nums'+(c?';color:'+c:'')+'">'+v+'</span>'+(ch?'<span style="color:var(--mute);font-size:18px;width:16px;text-align:center">'+ch+'</span>':'')+'</div>';"""
PAG=['']
def tela(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+JS+RR+r"""return '<div class="e49">'+TOP('Dinheiro','Pode tirar','',0)+
   '<div style="text-align:center;margin:24px 0 8px"><div style="font-family:var(--serif,Georgia,serif);font-size:44px;line-height:52px;font-variant-numeric:tabular-nums">G$ 370.000</div><div style="color:var(--mute);font-size:14px">livre em novembro · você já tirou G$ 420.000</div></div>'+
   '<button type="button" class="go" style="width:100%;margin:16px 0 0">Retirar</button>'+
   T('Por onde passou · novembro')+L('Vendas','','G$ 6.569.000')+L('Reposição','o custo das peças que saíram · não se mexe','− 1.888.000')+L('Contas do mês','loja, dia a dia do dono e taxas','− 2.856.000','','›')+L('Colchão','reserva da mercadoria · 13%','− 245.000')+
   L('Caixinha de imprevistos','metade do que sobra, até encher','− 790.000')+L('Pode tirar','a outra metade · é seu','G$ 790.000','var(--ok)')+
   T('Caixinha de imprevistos')+L('G$ 730.000 de 4.200.000','cheia em uns 5 meses · meta = 1 mês de contas','','','')+L('Conserto da vitrine','loja · 17/11 · saiu da caixinha','− 60.000')+'</div>'}""")
  PAG[0]=html;pagina(pg,html);w(500);pg.add_style_tag(content='#mainnav{display:none!important}')
  confere(pg,'Pode tirar');pg.screenshot(path='/tmp/g.png',full_page=True);b.close();im=Image.open('/tmp/g.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,2200)))
def janela(pw,esc,k):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#mainnav{display:none!important}')
  pagina(pg,PAG[0]);w(500)
  html=pg.evaluate("k=>{"+RR+r"""const F=(a,v,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;color:var(--mute);font-size:15px">'+a+'</span><span style="font-size:15px;white-space:nowrap;font-variant-numeric:tabular-nums'+(c?';color:'+c:'')+'">'+v+'</span></div>';
   const O=(t,s,on)=>'<button type="button" class="pxL" role="radio" aria-checked="'+on+'" style="min-height:60px"><i class="pxR" aria-hidden="true"></i><span style="flex:1;min-width:0"><span style="display:block;font-size:15px">'+t+'</span><small style="display:block;font-size:13px;color:var(--mute)">'+s+'</small></span></button>';
   const T2=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:16px 0 0">'+t+'</div>';
   const P=k=='mim';
   return F('O que foi',P?'Mercado':'Compressor do carro')+F('Valor',P?'G$ 200.000':'G$ 3.300.000')+'<div class="lbl" style="margin-top:16px">Para quê</div><div class="trk" role="group" aria-label="Para quê"><span class="trkTh"></span><button class="trkB'+(P?' on':'')+'" type="button">Para mim</button><button class="trkB" type="button">Loja</button><button class="trkB'+(P?'':' on')+'" type="button">Pessoal</button></div>'+
    '<div style="font-size:13px;color:var(--mute);padding:8px 0 0">'+(P?'mercado, escola, o que for seu':'imprevisto · sai primeiro da caixinha')+'</div>'+T2('O Titan tira daqui · preços não mudam')+
    (P?L('Do Pode tirar','sobram G$ 170.000 em novembro','G$ 200.000'):L('Da caixinha · fica vazia','','G$ 730.000')+L('Do Pode tirar','G$ 370.000 agora e o resto em uns 3 meses','G$ 2.570.000','var(--warn,#e0b44c)'))+
    '<button type="button" class="go" style="width:100%;margin-top:16px">Salvar</button>'}""",k)
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("""h=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljHd b').textContent='Retirar';const c=j.querySelector('.ljCorpo')||j;c.innerHTML=h;const t=c.querySelector('.trk'),o=t.querySelector('.trkB.on'),th=t.querySelector('.trkTh');th.style.cssText='width:'+o.offsetWidth+'px!important;transform:translateX('+(o.offsetLeft-3)+'px)!important;left:3px!important'}""",html);w(700)
  confere(pg,'Janela '+k);pg.evaluate("k=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});if(k!='mim'){const j=[...document.querySelectorAll('.ljJn')].pop();[j,...j.querySelectorAll('*')].forEach(e=>{if(e.scrollHeight>e.clientHeight+4)e.scrollTop=9999})}}",k);w(400)
  pg.screenshot(path='/tmp/g2.png');b.close();return Image.open('/tmp/g2.png').convert('RGB')
if __name__=='__main__':
 O='/home/claude/lafouch/work/s435/gavetas/'
 with sync_playwright() as pw:
  for esc in (True,False):
   n='escuro' if esc else 'claro'
   quadro('esboco_79_pode_tirar_%s.jpg'%n,[('PROPOSTA · Dinheiro › Pode tirar',n+' · novembro com os números reais',tela(pw,esc)),('PROPOSTA · Retirar › Para mim',n+' · mercado G$ 200.000',janela(pw,esc,'mim')),('PROPOSTA · Retirar › Imprevisto pessoal',n+' · o compressor, se fosse hoje (rolada até o Salvar)',janela(pw,esc,'imp'))])
 for n,f in REL: print(n,f)
