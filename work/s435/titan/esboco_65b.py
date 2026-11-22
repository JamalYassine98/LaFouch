# Esboço 65 (S435, 22/11 13:10) — ATACADO: o Titan trabalha só nas MARGENS das tabelas; no Atacado o dono só ESCOLHE a tabela
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

VERM='var(--bad,#e5484d)';OKC='var(--ok,#4fbf7f)'
# 65b (22/11 13:46): o Titan AJUSTA as margens — nenhuma tabela pode ficar sem lucro. Exemplo do dono: acetato custo US$ 5 (varejo US$ 20).
# Conta: preço = custo × (1 + margem) · − IVA (÷ 11) · − custo · − colchão 13% = sobra (antes das contas do atacado).
# Margens HOJE (src/96-tabelas-preco.js) × SUGESTÃO INICIAL do Titan (até ter vendas de atacado e as listas das distribuidoras).
# v2 (dono 13:48): as margens JÁ VÊM CALCULADAS pelo Titan para ter LUCRO (não 'sugere'). Lucro alvo por tabela (% do preço), maior
# nas tabelas pequenas (pagam o serviço) e menor nas grandes: margem = 1,13 ÷ (10/11 − lucro) − 1. As contas do mês ficam com o varejo
# (o atacado é venda a mais) — premissa a confirmar com o dono.
LIN=[('Óptica','71%','US$ 2,14 (25%)'),('Vendedor','59%','US$ 1,59 (20%)'),('Atacado 1K','49%','US$ 1,12 (15%)'),
     ('Atacado 2K','45%','US$ 0,94 (13%)'),('Atacado 5K','41%','US$ 0,78 (11%)'),('Atacado 10K','40%','US$ 0,70 (10%)')]
def titan2(pw,janela):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("(L_)=>{"+H+JS4+r"""const RED='"""+VERM+r"""',OK='"""+OKC+r"""';
   const row=(t,m,luc)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)">'+SV(I.tab)+'<span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">lucro <span style="color:'+OK+'">'+luc+'</span> por peça</small></span><b style="font-size:16px">'+m+'</b></div>';
   return '<div class="e49">'+TOP('Preços','Atacado','margens calculadas pelo Titan · sempre com lucro',0)+
    '<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);margin-top:16px"><span style="flex:1"><b style="display:block;font-size:16px;font-weight:500">Calculadas em 22/11</b><small style="font-size:13px;color:var(--mute)">próxima revisão 01/12 ou num lote novo</small></span></div>'+
    T('Tabelas · margem e lucro por peça')+L_.map(x=>row(x[0],x[1],x[2])).join('')+
    '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">Exemplo: armação de acetato que custa US$ 5. Lucro = preço − IVA − custo − colchão. As contas do mês ficam com o varejo: o atacado é venda a mais.</div></div>'}""",LIN)
  pagina(pg,html);w(500)
  if janela:
    pg.evaluate(r"""()=>{const Lr=(r,v,c,sub)=>'<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+(sub?'<small style="display:block;font-size:13px;color:var(--mute)">'+sub+'</small>':'')+'</span><span style="color:'+(c||'var(--fg)')+'">'+v+'</span></div>';
      const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
      d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)"><div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+
       '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Atacado 10K</h2><div style="color:var(--mute);font-size:14px;margin:4px 0 16px">o Titan calcula · você só escolhe o lojista</div>'+
       Lr('Compra mínima','US$ 10.000')+
       Lr('Margem','40%','var(--fg)','calculada pelo Titan · lucro de 10%')+
       '<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">Acetato de US$ 5</div>'+
       Lr('Preço para o lojista','US$ 6,98')+Lr('− IVA','US$ 0,63','var(--mute)')+Lr('− Custo e colchão','US$ 5,65','var(--mute)')+Lr('Lucro','US$ 0,70','var(--ok,#4fbf7f)')+
       '<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;font-size:16px;margin-top:8px"><span>Ver os preços como o lojista vê</span><i style="font-style:normal;color:var(--mute);font-size:18px">›</i></div></div>';document.body.appendChild(d)}""");w(400)
  else: pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Titan atacado '+('janela' if janela else 'lista'));f='/tmp/t65b_%d.png'%janela;pg.screenshot(path=f,full_page=not janela);x=Image.open(f).copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_65b_margens_atacado.jpg',[('PROPOSTA · Preços › Atacado','margens já calculadas pelo Titan, sempre com lucro',titan2(pw,False)),
    ('PROPOSTA · tocar numa tabela','a conta do Titan com o exemplo do acetato',titan2(pw,True))])
 for n,f in REL: print(n,len(f),f[:4])
