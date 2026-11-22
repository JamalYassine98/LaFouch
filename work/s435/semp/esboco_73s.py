# Esboço 73s (S435, 22/11 19:55) — os 5 setores que faltam do Marketing do Semp (aprovado 70): CRIAR · RESULTADOS · TEMÁTICA · CARTÕES · MARCA.
# Pedido do dono 22/11 19:29 'vamos terminar tudo menos o estúdio' + APP (17:00) precisa das telas para não inventar.
# Base: app real de hoje (Marketing: Criar com um toque, Listas por perfil, Resultados; painel do site: Temática = calendário do comércio,
# admin.html temDraw; Cartões = src/97-cupons.js cupDesenha; Marca = src/97-ajustes-marca.js janela) + aprovados: 70 (setores, '‹ Marketing',
# sem descrição inútil, ícones cinza), 70b (setor sem informação = lfVazioHtml), regras 15/16 (+ na linha do título; ler ⌄ · lugar › · tarefa = janela),
# 46 (liga-desliga na tela do assunto), regra 17 (um conjunto de ícones: saem os emojis dos Cartões).
# Dados REAIS de teste: nenhum cliente com telefone (listas vazias); nenhum post medido (Resultados vazio); 22/11/2026: Black Friday CDE (19–22/11)
# no ar, Natal liga 01/12, Ano Novo 26/12, Halloween desligado; cupons: números vêm da nuvem (no simulador não há) → linhas sem número.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
O='/home/claude/lafouch/work/s435/semp/'
def confere(pg,n):
  a,_=compara.M.percorre(pg,None);REL.append((n,[(k[0],a[k].get('d','')) for k in a]))
IC3=dict(post='<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="M20 15l-5-5L5 20"/>',
 story='<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 status='<circle cx="12" cy="12" r="9" stroke-dasharray="4 3"/>',
 carr='<rect x="6" y="5" width="12" height="14" rx="2"/><path d="M3 7v10M21 7v10"/>',
 video='<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
 rot='<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h5"/>',
 lista='<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 env='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 tick='<path d="M4 9a2 2 0 0 0 0 6v3h16v-3a2 2 0 0 1 0-6V6H4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
 ami='<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5"/>',
 fiel='<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
 vip='<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 ev='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 res='<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
S3=r"""const I3="""+json.dumps(IC3)+r""";
 const SV3=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
 const LN=(ic,t,s,v,ch)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)">'+(ic?SV3(I3[ic]):'')+'<span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small>':'')+'</span>'+(v?'<span style="font-size:15px;color:var(--mute);white-space:nowrap;font-variant-numeric:tabular-nums">'+v+'</span>':'')+(ch?'<span style="color:var(--mute);font-size:18px;width:16px;text-align:center">'+ch+'</span>':'')+'</div>';
 const SW=(t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span><label class="sw"><input type="checkbox"'+(on?' checked':'')+'><i></i></label></div>';"""
def base(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  return b,pg,w
def fim(pg,b,n):
  pg.add_style_tag(content='#mainnav{display:none!important}')
  confere(pg,n);pg.screenshot(path='/tmp/s73.png',full_page=True);b.close()
  im=Image.open('/tmp/s73.png');im.load();im=im.copy()
  return im.crop((0,0,im.width,min(im.height,1690)))
def tela(pw,esc,corpo,n):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3+"return '<div class=\"e49\">'+"+corpo+"+'</div>'}");pagina(pg,html);w(600);return fim(pg,b,n)
CRIAR=r"""TOP('Marketing','Criar','',0)+T('Formato',1)+LN('post','Post','uma peça · foto e legenda')+LN('carr','Carrossel','até 10 fotos · as cores ou várias peças')+LN('story','Story','vertical · 15 s')+LN('status','Status','WhatsApp · some em 24 h')+LN('video','Vídeo','15 s com o giro da peça')+LN('rot','Roteiro','o texto para você gravar')+
 '<div style="margin-top:32px">'+LN('lista','Listas de transmissão','nenhum cliente com telefone ainda','','⌄')+'</div>'"""
RESULT=r"""TOP('Marketing','Resultados','',0)+'<div style="margin-top:48px">'+lfVazioHtml(I3.res,'Nenhum post medido ainda','Poste pelo app: dois dias depois o Semp mede as vendas e os pedidos do site das peças de cada post e aprende o que funciona.')+'</div>'"""
TEMA=r"""TOP('Marketing','Temática','',0)+T('No ar',1)+LN('','Black Friday CDE','19 a 22 de novembro · desliga sozinho hoje às 23:59','','')+LN('','Ver prévia do site','como o cliente vê agora','','›')+
 T('Próximas')+SW('Natal','liga sozinho em 01/12 · até 25/12',1)+SW('Ano Novo','26/12 a 01/01',1)+SW('Dia das Mães · Paraguai','1 a 15 de maio',1)+
 '<div style="margin-top:32px">'+LN('','Calendário completo','próximos 12 meses','','›')+'</div>'"""
CART=r"""TOP('Marketing','Cartões','',1)+T('Cartões',1)+LN('env','Boas-vindas','5% ao se inscrever · 30 dias','','')+LN('tick','Próxima compra','10% · vem com a compra paga','','')+LN('ami','Indique uma amiga','10% para ela e 10% para quem indicou','','')+LN('fiel','Cliente fiel','10% a cada 3 compras pagas','','')+LN('vip','Cliente VIP','você escolhe quem','','')+
 T('Este mês')+LN('','Descontos de cupons','o que os cupons deram','','')+LN('','O que o app fez sozinho','travas, pausas e avisos','','⌄')+LN('','Proteções','sempre ligadas','','⌄')+LN('','Códigos ativos','os cartões que valem agora','','›')"""
def marca(pw,esc):
  b,pg,w=base(pw,esc)
  html=pg.evaluate("()=>{"+H+JS+S3+r"""return '<div class="e49">'+TOP('Início','Marketing','',0)+T('Setores',1)+LN('','…','Destaque · Agenda · Mercado · Criar · Resultados · Temática · Cartões','','›')+LN('','Marca','La Fouch · PT e ES','','')+'</div>'}""")
  pagina(pg,html);w(500);pg.add_style_tag(content='.mkKit label{display:flex!important;flex-direction:row!important;grid-template-columns:none!important;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2);margin:0!important}.mkKit label>span{flex:none;text-align:left!important;width:auto!important;margin:0!important;font-size:15px;color:var(--mute)}.mkKit .in{flex:1;min-width:0;border:0!important;border-radius:0!important;background:transparent!important;text-align:right;padding:0!important;height:auto!important;font-size:15px;box-shadow:none!important}.mkKit [data-kit=tags]{font-size:12px!important}.mkKit select.in{text-align-last:right}');pg.evaluate("()=>window.__LF.ACT.ajMarca()");w(1200);pg.evaluate("()=>{const i=document.querySelector('.mkKit [data-kit=tags]');const t=i.value.trim().split(/\\s+/);const s=document.createElement('span');s.textContent=t[0]+' e mais '+(t.length-1);s.style.cssText='flex:1 1 auto!important;color:var(--fg)!important;text-align:right!important;font-size:15px!important';i.replaceWith(s)}");return fim(pg,b,'Marca')
if __name__=='__main__':
 import sys
 with sync_playwright() as pw:
  for esc in (True,False):
   n='escuro' if esc else 'claro'
   q=[('PROPOSTA · Marketing › Criar',n,tela(pw,esc,CRIAR,'Criar')),('PROPOSTA · Marketing › Resultados',n+' · sem posts medidos',tela(pw,esc,RESULT,'Resultados')),
      ('PROPOSTA · Marketing › Temática',n+' · 22/11',tela(pw,esc,TEMA,'Temática')),('PROPOSTA · Marketing › Cartões',n+' · + = cupom do evento',tela(pw,esc,CART,'Cartões')),
      ('PROPOSTA · Marketing › Marca',n+' · a janela de hoje · campos em linhas finas (regra 15)',marca(pw,esc))]
   quadro('esboco_73s_setores_semp_%s.jpg'%n,q)
 for n,f in REL: print(n,len(f),f[:4])
