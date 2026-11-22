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
LIN=[('Óptica','70%','70%','US$ 2,08',0),('Vendedor','55%','55%','US$ 1,40',0),('Atacado 1K','40%','45%','US$ 0,94',0),
     ('Atacado 2K','32%','40%','US$ 0,71',0),('Atacado 5K','25%','35%','US$ 0,49',1),('Atacado 10K','18%','30%','US$ 0,26',2)]
def titan2(pw,janela):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("(L_)=>{"+H+JS4+r"""const RED='"""+VERM+r"""',OK='"""+OKC+r"""';
   const row=(t,hoje,sug,sob,st)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)">'+SV(I.tab)+'<span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+(st==2?'<span style="color:'+RED+'">hoje '+hoje+': prejuízo</span> · ':st==1?'<span style="color:var(--warn,#e0b44c)">hoje '+hoje+': empata</span> · ':(hoje!==sug?'hoje '+hoje+' · ':''))+'sobra '+sob+'</small></span><b style="font-size:16px">'+sug+'</b></div>';
   return '<div class="e49">'+TOP('Preços','Atacado','o Titan ajusta as margens',0)+
    '<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2);margin-top:16px"><span style="flex:1"><b style="display:block;font-size:16px;font-weight:500">O Titan sugere 4 margens novas</b><small style="font-size:13px;color:var(--mute)">nenhuma tabela sem lucro</small></span><i style="font-style:normal;color:var(--mute);font-size:18px">›</i></div>'+
    T('Tabelas · margem e sobra por peça')+L_.map(x=>row(x[0],x[1],x[2],x[3],x[4])).join('')+
    '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">Exemplo: armação de acetato que custa US$ 5. Sobra = preço − IVA − custo − colchão, antes das contas. O Titan aprende com as vendas de atacado e com as listas das distribuidoras.</div></div>'}""",LIN)
  pagina(pg,html);w(500)
  if janela:
    pg.evaluate(r"""()=>{const Lr=(r,v,c,sub)=>'<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+(sub?'<small style="display:block;font-size:13px;color:var(--mute)">'+sub+'</small>':'')+'</span><span style="color:'+(c||'var(--fg)')+'">'+v+'</span></div>';
      const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
      d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)"><div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+
       '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Atacado 10K</h2><div style="color:var(--mute);font-size:14px;margin:4px 0 16px">a partir de US$ 10.000</div>'+
       Lr('Margem hoje','18% · prejuízo','var(--bad,#e5484d)')+
       '<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>Margem nova<small style="display:block;font-size:13px;color:var(--mute)">sugestão do Titan</small></span><span style="border:1px solid var(--line2);border-radius:12px;padding:8px 14px;font-weight:600">30%</span></div>'+
       '<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">Acetato de US$ 5</div>'+
       Lr('Preço para o lojista','US$ 6,50')+Lr('− IVA','US$ 0,59','var(--mute)')+Lr('− Custo e colchão','US$ 5,65','var(--mute)')+Lr('Sobra','US$ 0,26','var(--ok,#4fbf7f)')+
       '<button type="button" style="width:100%;margin-top:24px;min-height:52px;border-radius:16px;border:1px solid var(--accent,#c06);background:none;color:var(--accent-fg,#f6b);font:600 17px system-ui">Salvar</button></div>';document.body.appendChild(d)}""");w(400)
  else: pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Titan atacado '+('janela' if janela else 'lista'));f='/tmp/t65b_%d.png'%janela;pg.screenshot(path=f,full_page=not janela);x=Image.open(f).copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_65b_margens_atacado.jpg',[('PROPOSTA · Preços › Atacado','o Titan ajusta as margens: nenhuma tabela sem lucro',titan2(pw,False)),
    ('PROPOSTA · tocar numa tabela','margem nova sugerida · a conta com o exemplo do acetato',titan2(pw,True))])
 for n,f in REL: print(n,len(f),f[:4])
