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

# Esboço 67 (S435, 22/11 14:15) — escritório do TITAN, setor HISTÓRICO (aprovado 21/11 18:03: o que mudou de preço, quando e por quê).
# HOJE: o 'Voltar no tempo' (src/97z-voltar-tempo.js) guarda custo, nome e preço escrito à mão SÓ NESTE APARELHO (não sincroniza) e o preço
# automático guarda as suas mudanças em S.pAuto.mudas; não há uma tela de histórico de preço. No app de teste não há nenhuma mudança.
# As 2 linhas do quadro são AÇÕES SIMULADAS dos esboços aprovados (a oferta do 64 e as margens do 65b), não dados inventados.
SHEET=r"""(h)=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
 d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)"><div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+h+'</div>';document.body.appendChild(d)}"""
LR=r"""const Lr=(r,v,c,sub)=>'<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+(sub?'<small style="display:block;font-size:13px;color:var(--mute)">'+sub+'</small>':'')+'</span><span style="color:'+(c||'var(--fg)')+';white-space:nowrap">'+v+'</span></div>';
 const In=(r,v)=>'<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+'</span><span style="font-weight:600">'+v+'</span></div>';
 const Lb=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">'+t+'</div>';"""

SH=r"""const SEG=(L,on)=>'<div class="sg77" style="margin:16px 0 8px">'+L.map((t,i)=>'<button type="button" class="'+(i==on?'on':'')+'">'+t+'</button>').join('')+'</div>';
 const H=(t,s,v,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><span style="font-size:15px;white-space:nowrap;color:'+(c||'var(--fg)')+'">'+v+'</span></div>';"""
def hist(pw,qual):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  if qual=='peca':
    html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('Inventário','Histórico','SP57765 · Óculos de leitura de acetato',0)+
      T('Hoje · 22/11',1)+H('Oferta até 30/11','você · na ficha da peça','G$ 25.000 → 23.000')+
      '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">Só desta peça. O histórico inteiro fica em Preços › Histórico.</div></div>'}""")
  else:
    html=pg.evaluate("()=>{"+H+JS6+SH+r"""return '<div class="e49">'+TOP('Preços','Histórico','o que mudou de preço, quando e por quê',0)+
      SEG(['Tudo','Titan','Você'],0)+
      T('Hoje · 22/11')+H('SP57765 · leitura','oferta até 30/11 · você','G$ 25.000 → 23.000')+H('Atacado · margens','5 tabelas mudaram · Titan','10K 18% → 27%')+
      '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">Tocar numa mudança mostra o porquê e, quando dá, Desfazer.</div></div>'}""")
  pagina(pg,html);w(500)
  if qual=='janela':
    h=pg.evaluate("()=>{"+LR+r"""return '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Atacado · margens</h2><div style="color:var(--mute);font-size:14px;margin:4px 0 8px">22/11 13:55 · Titan</div>'+
      Lr('Por quê','nenhuma tabela sem lucro')+'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">5 tabelas mudaram</div>'+Lr('Óptica','70% → 56%')+Lr('Vendedor','55% → 45%')+Lr('Atacado 1K','40% → 36%')+Lr('Atacado 5K','25% → 29%')+Lr('Atacado 10K','18% → 27%')+
      '<button type="button" style="display:block;margin:24px auto 0;background:none;border:0;color:var(--fg);font:600 17px system-ui;min-height:44px">Desfazer</button><small style="display:block;text-align:center;color:var(--mute);font-size:14px">volta as margens de antes; o Titan avisa se alguma dá prejuízo</small>'}""")
    pg.evaluate(SHEET,h);w(400)
  else: pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn svg{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,'Histórico '+qual);x=shot(pg,'h67'+qual);b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_67_historico_titan.jpg',[('PROPOSTA · Preços › Histórico','tudo o que mudou de preço · Tudo · Titan · Você',hist(pw,'lista')),
    ('PROPOSTA · tocar numa mudança','o porquê e Desfazer',hist(pw,'janela')),
    ('PROPOSTA · vindo da ficha','"Ver no escritório do Titan ›": só desta peça',hist(pw,'peca'))])
 for n,f in REL: print(n,len(f),f[:4])
