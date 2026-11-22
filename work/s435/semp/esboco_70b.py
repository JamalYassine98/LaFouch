# Esboço 70b (S435, 22/11 14:55) — Marketing › MERCADO sem informação (dono 14:50: o setor aparece sempre; dentro, sem informação,
# mostra o vazio igual a Clientes ou Lotes sem nada). Vazio = lfVazioHtml(ico,t,txt) real do app (src/98-anim-novas.js:72), regra 15.
# Dados reais do app de teste: nenhuma tendência (o Semp não existe ainda) e nenhuma distribuidora cadastrada (S.dist vazio).
# Com informação (depois), a tela é a do esboço-ideia 20/11 15:35 refeito na base nova: Tendências · Distribuidoras.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
O='/home/claude/lafouch/work/s435/semp/'
def mercado(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  html=pg.evaluate("()=>{"+H+JS+r"""const ic='<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>';
   return '<div class="e49">'+TOP('Marketing','Mercado','',0)+'<div style="margin-top:48px">'+lfVazioHtml(ic,'O Semp ainda não achou nada','As tendências e as novidades das distribuidoras de CDE aparecem aqui quando o Semp aprender com as buscas do site, as suas vendas e os catálogos que você compartilhar.')+'</div></div>'}""")
  pagina(pg,html);w(600);confere(pg,'Mercado '+('escuro' if esc else 'claro'));x=shot(pg,'m70b%d'%esc);b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_70b_mercado_vazio.jpg',[('PROPOSTA · Marketing › Mercado','sem informação: o vazio de sempre · escuro',mercado(pw,True)),('PROPOSTA · Marketing › Mercado','claro',mercado(pw,False))])
 for n,f in REL: print(n,len(f),f[:4])
