# (base herdada do 65) Esboço 65 (S435, 22/11 13:10) — ATACADO: o Titan trabalha só nas MARGENS das tabelas; no Atacado o dono só ESCOLHE a tabela
# de cada atacadista (dono 22/11 13:01). Base: app real + aprovados (54 escritório; Atacado MANTÉM as abas — 49a reprovado —, agora
# 3: Mensagens · Lojistas · Lotes, porque a aba Tabela vira o setor do Titan; 77d/113 conta atacadista; 37b cinza).
# Dados reais (src/96-tabelas-preco.js): 7 tabelas, todas com 15 peças batendo no chão (o preço normal de teste está abaixo do mínimo).
# HOJE a conta do lojista NÃO deixa escolher a tabela (o app põe sozinho a 1ª 'Atacado'); o lojista do quadro é de TESTE.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
IC2.update(tab='<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>')
JS4='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]
TABS=[('Óptica','70% · sem mínimo'),('Vendedor','55% · sem mínimo'),('Atacado 1K','40% · mín. US$ 1.000'),
      ('Atacado 2K','32% · mín. US$ 2.000'),('Atacado 5K','25% · mín. US$ 5.000'),
      ('Atacado 10K','18% · mín. US$ 10.000'),('Óptica frete grátis','70% · frete embutido')]

# (base herdada do 66) Esboço 66 (S435, 22/11 14:15) — escritório do TITAN, setor FERRAMENTAS (aprovado 21/11 18:03: Calculadora, E se…?).
# HOJE (src/97z2-contador.js:92–175): Calculadora com FAIXA (Econômico/Intermediário/Luxo com margem fixa), atacado pela fórmula antiga
# (com contas), site com folga extra e botão 'Usar estes preços' que só copia texto; E se…? com 'Vender tudo parado' (degraus fixos, que saíram).
# PROPOSTA = o mesmo motor do Titan aprovado: varejo copia o jeito do dono (acetato US$ 5 → G$ 130.000, exemplo dele), loja e site com a
# mesma cotação, atacado pelas tabelas do 65b, mínimo da loja; E se…? com a mola. Números reais do app de teste onde existem
# (mínimo G$ 85.000; dólar a 7.000: repor +8%, 10 peças abaixo do mínimo, lucro do mês −G$ 201.294).
IC2.update(calc='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2"/>',
  ese='<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01"/>')
JS6='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]

# Esboço 67 v2 (S435, 22/11 15:40) — UM SÓ HISTÓRICO DO DIA (dono 22/11: "não seria melhor ter um único histórico do dia? De tudo que aconteceu?" → "Sim").
# Cada acontecimento vira uma linha com a hora (venda, preço, mercadoria, troca de moeda, conta, pedido do site). Três portas, o MESMO histórico:
#  Resultados › Histórico (o dia inteiro, Tudo) · Escritório do Titan › Histórico (abre em Preços) · Ficha › Histórico (só a peça).
# Base: tela real do dia (v-dia: 'Dias anteriores no Histórico ›', Fechamento do dia com os números reais). Vendas = reais do app de teste
# (01:16 V-1995, 01:28 V-1994, 01:34 V-1996). As 2 linhas de preço são AÇÕES SIMULADAS dos aprovados 64 (oferta) e 65b (margens).
# v3 (22/11 14:25, dono: 'essa aba não ta legal' → opção A): SEM abas de filtro; a PORTA é o filtro.
# Substitui o 67 v1 (histórico só de preço, no obsoletos).
SHEET=r"""(h)=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
 d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)"><div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+h+'</div>';document.body.appendChild(d)}"""
SH=r"""const SEG=(L,on)=>'<div class="sg77" style="margin:16px 0 8px">'+L.map((t,i)=>'<button type="button" class="'+(i==on?'on':'')+'">'+t+'</button>').join('')+'</div>';
 const E=(h,t,s,v,v2)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;font-variant-numeric:tabular-nums">'+h+' · '+s+'</small></span><span style="text-align:right;white-space:nowrap;font-size:15px;font-variant-numeric:tabular-nums">'+v+(v2?'<small style="display:block;font-size:13px;color:var(--mute)">'+v2+'</small>':'')+'</span><span style="color:var(--mute);font-size:18px">⌄</span></div>';
 const F=(r,v,b)=>'<div style="display:flex;justify-content:space-between;align-items:center;min-height:48px;border-bottom:1px solid var(--line2);font-size:15px;'+(b?'font-weight:700':'')+'"><span>'+r+'</span><span style="font-variant-numeric:tabular-nums">'+v+'</span></div>';
 const LK=t=>'<div style="text-align:center;margin:32px 0"><button type="button" style="background:none;border:0;color:var(--accent,#f0a6c8);font:600 16px system-ui;min-height:44px">'+t+' ›</button></div>';
 const OF=E('14:05','SP57765 · oferta','Preço · você','G$ 23.000','era 25.000');
 const MG=E('13:55','Atacado · margens','Preço · Titan · 5 tabelas','10K 27%','era 18%');
 const V6=E('01:34','1× SL2201 C1 · Preto','Venda · V-1996','US$ 9,01','≈ G$ 60.000');
 const V4=E('01:28','2× YM7735 C3 · Azul','Venda · V-1994','G$ 85.000');
 const V5=E('01:16','2× SP57765 +1.75 · Preto','Venda · V-1995','R$ 41,70','≈ G$ 50.000');"""
def hist(pw,qual):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  if qual=='dia':
    html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('Histórico','Hoje','Domingo, 22 de novembro · 5 acontecimentos',0)+T('Tudo do dia',1)+
      OF+MG+V6+V4+V5+
      T('Fechamento do dia')+F('Vendido','G$ 195.000')+F('Reposição separada','G$ 59.141')+F('Contas separadas','G$ 57.500')+F('Colchão separado','G$ 7.098')+F('Caixa de melhorias','G$ 5.000')+F('Gastos extras','−G$ 0')+F('Lucro livre','G$ 66.261',1)+
      LK('Dias anteriores')+'</div>'}""")
  elif qual=='titan':
    html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('Escritório do Titan','Histórico','Domingo, 22 de novembro · preços do dia',0)+T('Hoje · 22/11',1)+OF+MG+LK('Ver o dia inteiro')+'</div>'}""")
  else:
    html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('SP57765','Histórico','Óculos de leitura de acetato · só desta peça',0)+
      T('Hoje · 22/11',1)+OF+V5+LK('Dias anteriores')+'</div>'}""")
  pagina(pg,html);w(500)
  # L4: letra do grupo diminui junto (uma função só) até o título mais longo caber
  # a MESMA medida nas 3 portas (L3): a letra que coube no dia inteiro vale para todas
  pg.evaluate("()=>{const B=[...document.querySelectorAll('.e49 b')],S=B.map(b=>b.nextElementSibling).filter(x=>x);let f=16;while(f>12&&[...B,...S].some(e=>e.scrollWidth>e.clientWidth+1)){f-=.5;B.forEach(e=>e.style.fontSize=f+'px');S.forEach(e=>e.style.fontSize=(f-3)+'px')}}")
  pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  ov=pg.evaluate("()=>[...document.querySelectorAll('.sg77 button,.e49 b')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)")
  print(qual,'transborda:',ov)
  confere(pg,'Histórico '+qual);x=shot(pg,'h67'+qual);b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_67_historico_do_dia.jpg',[('PROPOSTA · Resultados › Histórico','o dia inteiro · tudo com a hora',hist(pw,'dia')),
    ('PROPOSTA · Escritório do Titan › Histórico','o mesmo histórico, só os preços · a porta é o filtro',hist(pw,'titan')),
    ('PROPOSTA · Ficha › Histórico','o mesmo histórico, só da peça',hist(pw,'peca'))])
 for n,f in REL: print(n,len(f),f[:4])
