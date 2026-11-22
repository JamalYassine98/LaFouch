# Esboço 62 (S435, 22/11 06:45) — escritório do TITAN (ex-Guardião, nome do dono 22/11 06:28), setor REGRAS.
# Aprovado 21/11 18:03: Regras = contas, taxas, meta, cotação da loja. Essência (22/11 00:21): o Titan copia o jeito do dono e aprende;
# nada de tabela ou questionário. Base: app real + aprovados (54 escritório, 46b, 46d Ajustes sem Preços, 37b cinza, Parte A §8: sem
# 'dias de loja' nem 'peças por mês' digitados; meta de lucro fica, é o objetivo pessoal 'como um jogo').
# Dados REAIS do app de teste: contas G$ 4.200.000 (7 contas) · débito 2% · crédito 4% · colchão 13,0% · cotação da loja G$ 6.800
# travada desde 22/11 (dólar de hoje G$ 6.487) · peças por mês 186 · meta G$ 2.854.280 (automática).
# COTAÇÃO (dono 22/11 06:41): a base é a VENDA da casa de câmbio (o mercado não importa); uma folga só, ~2%, arredondada de 100
# em 100 para cima — ex. do dono: venda 6.550 → cobra 6.700. Sem a 2ª folga do site. Números do quadro = exemplo do dono.
# IVA (dono 22/11 06:37): INCLUÍDO no preço e sempre em guaranis — venda de G$ 110.000 tem G$ 10.000 de IVA (preço ÷ 11).
# NOVO: IVA 10% (o dono pediu o IVA nas contas, 21/11) — hoje o app não considera imposto.
exec(open('/home/claude/lafouch/work/s435/painelsite/esboco_58fgh.py').read().split("def mensagens(pw")[0].replace("BAL={","BAL0={"))
O='/home/claude/lafouch/work/s435/titan/'
IC2=dict(contas='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  taxa='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  iva='<path d="M6 3h9l4 4v14H6z"/><path d="M9 13l6-4M9.5 9h.01M14.5 13h.01"/>',
  res='<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/>',
  cot='<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5M12 6v2M12 16v2"/>',
  rit='<path d="M3 17l5-5 4 4 8-8"/><path d="M15 8h5v5"/>',
  pre='<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  meta='<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>')
import json
JS=r"""const I=""" + json.dumps(IC2) + r""";const R=(ic,t,s,v,ch)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);padding:8px 0">'+SV(I[ic])+'<span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span><span style="color:var(--mute);font-size:14px;white-space:nowrap">'+v+'</span>'+(ch?'<i style="font-style:normal;color:var(--mute);font-size:18px;width:16px;text-align:center">'+ch+'</i>':'<i style="width:16px"></i>')+'</div>';
const T=(t,first)=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:'+(first?'24px':'32px')+' 0 4px">'+t+'</div>';"""
def regras(pw,escuro=True):
  b,pg,w=ap.abre(pw,'inicio',escuro,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+JS+r"""return '<div class="e49">'+TOP('Preços','Regras','o que cada preço precisa cobrir',0)+
    T('Cada venda cobre',1)+
    R('contas','Contas do mês','7 contas · em Dinheiro','G$ 4.200.000','›')+
    R('taxa','Taxas da maquininha','débito 2% · crédito 4%','','')+
    R('iva','IVA','incluído no preço · em guaranis','10%','⌄')+
    R('res','Colchão','reserva da mercadoria · amortece','13%','⌄')+
    T('Dólar da loja')+
    R('cot','Cotação nos preços','travada · venda da casa G$ 6.550','G$ 6.700','⌄')+
    T('O Titan aprende com você')+
    R('rit','Vendas por mês','pelas vendas reais, sem digitar','186','⌄')+
    R('pre','Seu jeito de cobrar','aprende com cada correção','aprendendo','⌄')+
    T('Seu objetivo')+
    R('meta','Meta de lucro do mês','não muda os preços','G$ 2.854.280','')+'</div>'}""")
  pagina(pg,html);w(600)
  pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn svg{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,'Regras '+('escuro' if escuro else 'claro'));pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}');pg.screenshot(path='/tmp/reg.png',full_page=True);x=Image.open('/tmp/reg.png').copy();b.close();return x
def cambio(pw):
  b,pg,w=ap.abre(pw,'fx',True,'celular',base=True);w(1200)
  pg.add_style_tag(content='#v-fx button.pr418[data-id=site],#v-fx button.pr418[data-id=prot]{display:none!important}');w(300)
  confere(pg,'Câmbio proposta');pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}');pg.screenshot(path='/tmp/fxp.png',full_page=True);x=Image.open('/tmp/fxp.png').copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  a=Image.open(O+'h_ajustes_precos.png');hc=Image.open(O+'h_cambio.png')
  quadro('esboco_62_regras_titan.jpg',[('HOJE · Ajustes › Preços','contas, taxas e meta dentro de Ajustes',a.crop((0,560,780,560+2300))),
    ('HOJE · Câmbio','cotação dos preços e colchão no Câmbio',hc),
    ('PROPOSTA · Preços › Regras','tudo o que o preço cobre num lugar só, do Titan',regras(pw)),
    ('PROPOSTA · Câmbio','só o dólar e as trocas',cambio(pw))])
  quadro('esboco_62_regras_titan_claro.jpg',[('PROPOSTA · Regras (claro)','mesma tela no tema claro',regras(pw,False))])
 for n,f in REL: print(n,len(f),f[:4])
