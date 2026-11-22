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

# Esboço 66 (S435, 22/11 14:15) — escritório do TITAN, setor FERRAMENTAS (aprovado 21/11 18:03: Calculadora, E se…?).
# HOJE (src/97z2-contador.js:92–175): Calculadora com FAIXA (Econômico/Intermediário/Luxo com margem fixa), atacado pela fórmula antiga
# (com contas), site com folga extra e botão 'Usar estes preços' que só copia texto; E se…? com 'Vender tudo parado' (degraus fixos, que saíram).
# PROPOSTA = o mesmo motor do Titan aprovado: varejo copia o jeito do dono (acetato US$ 5 → G$ 130.000, exemplo dele), loja e site com a
# mesma cotação, atacado pelas tabelas do 65b, mínimo da loja; E se…? com a mola. Números reais do app de teste onde existem
# (mínimo G$ 85.000; dólar a 7.000: repor +8%, 10 peças abaixo do mínimo, lucro do mês −G$ 201.294).
IC2.update(calc='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2"/>',
  ese='<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01"/>')
JS6='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]
def base(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+JS6+r"""return '<div class="e49">'+TOP('Preços','Ferramentas','contas rápidas do Titan',0)+T('Ferramentas',1)+
    R('calc','Calculadora de preço','antes de comprar: quanto cobrar','','›')+R('ese','E se…?','dólar, fornecedor, cupom, contas ou meta','','›')+
    '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">Só conta: nada muda até você aceitar.</div></div>'}""")
  pagina(pg,html);w(500);return b,pg,w
SHEET=r"""(h)=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
 d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)"><div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+h+'</div>';document.body.appendChild(d)}"""
LR=r"""const Lr=(r,v,c,sub)=>'<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+(sub?'<small style="display:block;font-size:13px;color:var(--mute)">'+sub+'</small>':'')+'</span><span style="color:'+(c||'var(--fg)')+';white-space:nowrap">'+v+'</span></div>';
 const In=(r,v)=>'<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+'</span><span style="border:1px solid var(--line2);border-radius:12px;padding:8px 14px;font-weight:600">'+v+'</span></div>';
 const Lb=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">'+t+'</div>';"""
def calc(pw):
  b,pg,w=base(pw)
  h=pg.evaluate("()=>{"+LR+r"""return '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Calculadora de preço</h2><div style="color:var(--mute);font-size:14px;margin:4px 0 8px">antes de comprar · o Titan calcula</div>'+
   In('Custo da peça','US$ 5,00')+Lr('Tipo','Armação ›')+In('Peças','24')+
   Lb('O Titan calcula')+Lr('Loja e site','G$ 130.000','var(--fg)','como você costuma cobrar')+Lr('Mínimo da loja','G$ 85.000','var(--mute)')+
   Lr('Atacado','US$ 6,37 a 7,81','var(--fg)','10K a Óptica · as 6 tabelas ⌄')+Lr('Lucro por peça','G$ 59.800','var(--ok,#4fbf7f)')+Lr('Lucro das 24','G$ 1.435.200','var(--ok,#4fbf7f)')}""")
  pg.evaluate(SHEET,h);w(400);confere(pg,'Calculadora');x=shot(pg,'c66');b.close();return x
def ese(pw):
  b,pg,w=base(pw)
  h=pg.evaluate("()=>{"+LR+r"""const C=(t,on)=>'<span style="display:inline-block;padding:10px 16px;border-radius:22px;border:1px solid '+(on?'var(--accent,#c06)':'var(--line2)')+';color:'+(on?'var(--accent-fg,#f6b)':'var(--mute)')+';font-size:15px;margin:0 8px 8px 0">'+t+'</span>';
   return '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">E se…?</h2><div style="color:var(--mute);font-size:14px;margin:4px 0 16px">só conta: nada muda até você aceitar</div>'+
   '<div>'+C('Dólar da casa',1)+C('Fornecedor sobe')+C('Cupom')+C('Contas sobem')+C('Meta do mês')+'</div>'+In('Venda da casa a','G$ 7.000')+
   '<div style="font-size:16px;line-height:1.5;margin:16px 0 0">O custo de repor sobe <b>8%</b>. Primeiro a folga de desconto acaba. Se ficar assim <b>7 dias</b>, <b>10 preços</b> sobem um degrau, e o Titan avisa no sino.</div>'+
   '<div style="font-size:16px;line-height:1.5;margin:12px 0 0;color:var(--mute)">Até lá, o lucro do mês cai até <span style="color:var(--bad,#e5484d)">G$ 201.294</span>. O atacado não muda: ele é em dólar.</div>'}""")
  pg.evaluate(SHEET,h);w(400);confere(pg,'E se');x=shot(pg,'e66');b.close();return x
def setor(pw):
  b,pg,w=base(pw);pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn svg{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,'Ferramentas');x=shot(pg,'f66');b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_66_ferramentas_titan.jpg',[('HOJE · Calculadora','faixa com margem fixa · atacado antigo · copia texto',Image.open(O+'h66_calc.png').crop((0,0,780,1688))),
    ('HOJE · E se…?','"Vender tudo parado" (degraus que saíram)',Image.open(O+'h66_ese.png').crop((0,0,780,1688))),
    ('PROPOSTA · Preços › Ferramentas','duas ferramentas, o mesmo motor do Titan',setor(pw)),
    ('PROPOSTA · Calculadora','antes de comprar: loja, site e atacado',calc(pw)),
    ('PROPOSTA · E se…?','com a mola: folga primeiro, preço só depois',ese(pw))])
 for n,f in REL: print(n,len(f),f[:4])
