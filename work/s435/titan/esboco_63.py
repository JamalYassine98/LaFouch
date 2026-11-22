# Esboço 63 (S435, 22/11 12:25) — escritório do TITAN, setor OFERTAS (aprovado 21/11 18:03: degraus + automático).
# Base: app real + aprovados: 54 escritório (⏻ Automático ao lado do título do escritório, 46b), 62 Regras (colchão, mola),
# cupons no caixa (21/11 23:34: cartão do cliente, cupom do evento, última peça), desconto na ÚLTIMA peça (23:27), Semp sugere e
# Titan confere (23:58), de/por HONESTO (23:51), o FLUXO decide se a peça está ruim — degrau/dias fixos NÃO (21/11 13:38),
# MOLA (22/11 06:52): a folga do dia vira o limite do desconto.
# HOJE: os degraus FIXOS de oferta para parados (60 dias −5%, 75 −10%, 90 −15%, 120 = piso — src/97-preco-auto.js:10) → saem.
# Dados reais do app de teste: nenhum cupom, nenhuma oferta no ar; Black Friday sem peça pela regra; 15 preços abaixo do mínimo
# (por isso a folga de hoje é 0%).
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
IC2.update(mola='<path d="M4 6c4 0 4 3 8 3s4-3 8-3M4 12c4 0 4 3 8 3s4-3 8-3M4 18c4 0 4 3 8 3s4-3 8-3"/>',
  cup='<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z" transform="translate(0 2)"/><path d="M14 6v12" stroke-dasharray="2 2.5"/>',
  ult='<rect x="3" y="7" width="7" height="10" rx="2"/><rect x="14" y="7" width="7" height="10" rx="2"/><path d="M10 12h4"/>',
  flu='<path d="M3 12h4l3-7 4 14 3-7h4"/>', dp='<path d="M5 12h14M13 6l6 6-6 6"/>')
JS2='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]
def ofertas(pw,escuro=True):
  b,pg,w=ap.abre(pw,'inicio',escuro,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+JS2+r"""return '<div class="e49">'+TOP('Preços','Ofertas','descontos que o Titan confere',1)+
    T('Hoje dá para dar',1)+
    R('mola','Folga de desconto','15 preços abaixo do mínimo','0%','⌄')+
    T('Cupons · 2')+
    R('ult','Última peça','o Titan cria na hora, no caixa','automático','⌄')+
    R('cup','Black Friday','evento · nenhuma peça entra ainda','0 peças','›')+
    T('Ofertas no ar · 0')+
    lfVazioHtml(I.cup,'Nenhuma oferta no ar','Quando uma peça parar de girar, o Semp sugere a oferta, o Titan confere e você aceita pelo sino.').replace('<svg ','<svg data-i142="1" ')+
    T('Como o Titan decide')+
    R('flu','Peça parada','pelo ritmo de vendas, não por dias fixos','','⌄')+
    R('dp','De/por honesto','o "de" é um preço que já vendeu','','⌄')+'</div>'}""")
  pagina(pg,html);w(3000)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Ofertas '+('escuro' if escuro else 'claro'));pg.screenshot(path='/tmp/of.png',full_page=True);x=Image.open('/tmp/of.png').copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  a=Image.open(O+'h63_auto.png');p=Image.open('/home/claude/lafouch/work/s435/selo/h_precos.jpg')
  quadro('esboco_63_ofertas_titan.jpg',[('HOJE · Ajustes › Preço automático','degraus fixos: 60 dias −5% · 75 −10% · 90 −15% · 120 = piso',a.crop((0,400,780,400+2000))),
    ('HOJE · Preços','Black Friday como decisão; ofertas espalhadas',p.crop((0,0,780,1688))),
    ('PROPOSTA · Preços › Ofertas','folga do dia (mola) · cupons · ofertas no ar · como decide',ofertas(pw))])
  quadro('esboco_63_ofertas_titan_claro.jpg',[('PROPOSTA · Ofertas (claro)','mesma tela no tema claro',ofertas(pw,False))])
 for n,f in REL: print(n,len(f),f[:4])
