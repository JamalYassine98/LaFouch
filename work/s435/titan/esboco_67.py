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
# v4 (22/11 14:30, dono 'Aprovado' + conferência de luxo): a tela do dia é a REAL (título Dashboard, bloco Hoje, Fechamento na ordem real);
# só 'Vendas do dia' vira 'Tudo do dia' e ganha as linhas de preço NO MESMO MOLDE das vendas (sl418L: título · '22/11 às HH:MM' · valor · ⌄).
# O ⌄ de preço só mostra (sl418R); desfazer fica onde a coisa mora: 'Mudar na ficha ›' / 'Ver as tabelas ›'. 'era G$ 25.000' (regra 17).
SH=r"""const RW=(id,t,s,v,v2)=>'<button type="button" class="sl418L" data-act="hopen" data-id="'+id+'" aria-expanded="false"><span class="t"><b>'+t+'</b><small>'+s+'</small></span><span class="v"><b>'+v+'</b>'+(v2?'<small>'+v2+'</small>':'')+'</span><i class="ch" aria-hidden="true">⌄</i></button>';
 const DT=(L,lk)=>'<div class="sl418D">'+L.map(r=>'<div class="sl418R"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('')+'<div class="sl418E" style="text-align:center"><button type="button" style="background:none;border:0;color:var(--fg);font:600 16px system-ui;min-height:44px">'+lk+' ›</button></div></div>';
 const OF=RW('P-of','SP57765 · oferta','Preço · você · 22/11 às 14:05','G$ 23.000','era G$ 25.000');
 const MG=RW('P-mg','Atacado · margens','Preço · Titan · 22/11 às 13:55','10K 27%','era 18%');
 const OFd=DT([['Quem','você, na ficha da peça'],['Válida até','30/11'],['Preço normal','G$ 25.000'],['Oferta','G$ 23.000 (−8%)']],'Mudar na ficha');
 const MGd=DT([['Por quê','nenhuma tabela sem lucro'],['Óptica','70% → 56%'],['Vendedor','55% → 45%'],['Atacado 1K','40% → 36%'],['Atacado 5K','25% → 29%'],['Atacado 10K','18% → 27%']],'Ver as tabelas');"""
def dia(pw):
  b,pg,w=ap.abre(pw,'hist',True,'celular',base=True);w(1500)
  r=[x for x in pg.query_selector_all('#v-hist button, #v-hist [data-act]') if '›' in (x.inner_text() or '')];r[0].click();w(1500)
  return b,pg,w
def hist(pw,qual):
  b,pg,w=dia(pw)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  V5=pg.evaluate("()=>document.querySelector('button.sl418L[data-id=\"V-1995\"]').outerHTML")
  if qual=='dia':
    pg.evaluate("()=>{"+SH+r"""const v=document.getElementById('v-dia');const l=[...v.querySelectorAll('.lbl')].find(x=>/vendas do dia/i.test(x.textContent));l.textContent='Tudo do dia';
      const c=v.querySelector('.sl418');c.insertAdjacentHTML('beforebegin','<div class="sl418">'+OF+'</div><div class="sl418">'+MG+'</div>')}""")
  else:
    b.close();b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
    pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
    if qual=='titan':
      html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('Preços','Histórico','Domingo, 22 de novembro · preços do dia',0)+T('Hoje · 22/11',1)+
        '<div class="sl418">'+OF+'</div><div class="sl418">'+MG.replace('false','true')+MGd+'</div><div class="famC2" style="text-align:center;margin:32px 0"><button type="button" style="background:none;border:0;color:var(--accent,#f0a6c8);font:600 16px system-ui;min-height:44px">Ver o dia inteiro ›</button></div></div>'}""")
    else:
      html=pg.evaluate("(v5)=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('SP57765','Histórico','Óculos de leitura de acetato · só desta peça',0)+T('Hoje · 22/11',1)+
        '<div class="sl418">'+OF.replace('false','true')+OFd+'</div><div class="sl418">'+v5+'</div><div class="famC2" style="text-align:center;margin:32px 0"><button type="button" style="background:none;border:0;color:var(--accent,#f0a6c8);font:600 16px system-ui;min-height:44px">Dias anteriores ›</button></div></div>'}""",V5)
    pagina(pg,html)
  w(500)
  confere(pg,'Histórico '+qual);x=pg.screenshot(path='/tmp/h67%s.png'%qual,full_page=(qual=='dia'));b.close()
  from PIL import Image as I;im=I.open('/tmp/h67%s.png'%qual);im.load();return im.copy()
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_67_historico_do_dia.jpg',[('PROPOSTA · Resultados › Histórico','o dia inteiro · tudo com a hora',hist(pw,'dia')),
    ('PROPOSTA · Preços › Histórico','o mesmo histórico, só os preços · a porta é o filtro',hist(pw,'titan')),
    ('PROPOSTA · Ficha › Histórico','o mesmo histórico, só da peça',hist(pw,'peca'))])
 for n,f in REL: print(n,len(f),f[:4])
