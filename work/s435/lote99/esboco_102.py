# v2 (dono 12:26): (a) o cartão do cupom é o MESMO do site (.pxc): degradê escuro, agora no tom da cor oficial (aprovados.py); (b) na
# Temática TODA data é linha › (abre a tela dela com o liga-desliga dentro) — antes o Natal tinha › e as outras um interruptor.
# Esboço 102 (S435, 23/11 12:30) — NATAL com padrão de luxo (dono 12:21: 'não tem um design mais bonito? não parece nos padrões de luxo, cheque a
# família de botões e design'). Conferido com as famílias aprovadas: a data é um LUGAR (tela com '‹ Temática', regra 16), não uma janela cheia;
# no topo 'O que o cliente recebe' mostra o PRESENTE como o cliente vê (o cartão do Cupom de Natal + o kit); depois os ajustes em linhas finas
# (86) com o interruptor da família (46: liga na tela do assunto, sem 'Salvar'); quantidade de kits com o mesmo − N + do Carrinho (.c54Q);
# custo em uma linha. Sai: o '+' solto na linha, o 'Salvar', a janela comprida. Cor: só a oficial #943d6f (101). Números = ilustração.
src=open('/home/claude/lafouch/work/s435/oferta96/esboco_97.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0]
exec(src)
O='/home/claude/lafouch/work/s435/lote99/'
S3B=S3+r"""I3.pres='<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M12 8v13M3 12h18M12 8c-1.5-3-5-4-5-1.5S10 8 12 8zM12 8c1.5-3 5-4 5-1.5S14 8 12 8z"/>';"""
NAT=r"""TOP('Temática','Natal','01/12 a 25/12 · liga sozinho',0)+T('O que o cliente recebe',1)+
 '<div class="cupCard" style="margin:8px 0 0"><small>LA FOUCH</small><b>10% · Cupom de Natal</b><i>na conta · até 25/12</i></div>'+
 '<div style="margin-top:8px">'+LN('pres','Kit de presente','estojo, flanela e líquido · na sacola e na caixa','','')+'</div>'+
 T('A data')+SW('Natal ligado','liga sozinho em 01/12 · desliga em 25/12',1)+SW('Cupom de Natal','na conta de todo cliente cadastrado',1)+SW('Kit de presente','em cada compra da data',1)+
 '<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Kits em estoque</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">o app tira 1 por venda</small></span><span class="c54Q"><button type="button">−</button><b>40</b><button type="button">+</button></span></div>'+
 LN('','Custo estimado','30 cupons usados + 40 kits','G$ 756.000','')"""
TEMA3=TEMA.replace("SW('Natal','liga sozinho em 01/12 · até 25/12',1)","LN('','Natal','liga sozinho em 01/12 · cupom e kit','','›')").replace("SW('Ano Novo','26/12 a 01/01',1)","LN('','Ano Novo','liga sozinho em 26/12','','›')").replace("SW('Dia das Mães · Paraguai','1 a 15 de maio',1)","LN('','Dia das Mães · Paraguai','liga sozinho em 01/05 · cupom e kit','','›')").replace("LN('','Black Friday CDE','19 a 22 de novembro · desliga sozinho hoje às 23:59','','')","LN('','Black Friday CDE','até hoje 23:59 · desliga sozinho','','›')")
def tela102(pw,esc,corpo,n):
  b,pg,w=base(pw,esc);html=pg.evaluate("()=>{"+H+JS+S3B+"return '<div class=\"e49\">'+"+corpo+"+'</div>'}");pagina(pg,html);w(500)
  A2.aplica(pg);w(300);return fim(pg,b,n)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_102_natal_luxo_v2_%s.jpg'%n,[('PROPOSTA · Marketing › Temática',n+' · "Natal ›" abre a data',tela102(pw,esc,TEMA3,'Temática')),('PROPOSTA · Natal',n+' · o presente como o cliente vê + os ajustes',tela102(pw,esc,NAT,'Natal'))])
for n,f in REL: print(n,f)
