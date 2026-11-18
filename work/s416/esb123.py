# S416 · esboço 123 (dono 18/11 06:37 "Vamos na ordem da sua lista" → item 1 Histórico): lista do mês, busca e filtros no padrão de luxo.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s416/';T='/tmp/s416/'
# a) lista do mês: sem a caixa; cada dia uma linha fina (o conteúdo da linha é o do esboço 71, já publicado)
CSS_A="""#v-hist .g99.h101{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important}
#v-hist .g99.h101 .hDia{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}
#v-hist .g99.h101 .hDia:last-child{border-bottom:0!important}
#v-hist #hRes>.lbl{font-size:11.5px!important;letter-spacing:.14em!important;margin:18px 0 4px!important}"""
# b) busca: cada venda uma linha fina com ⌄ (igual às vendas do Dashboard, esboço 116); a 1ª aberta mostra o detalhe e "Estornar venda"
JS_B=r"""()=>{const r=document.getElementById('hRes');const h=r.querySelector('.hint');const n=parseInt(h.innerText);h.outerHTML='<div class="cxLb" style="margin:14px 0 2px">'+n+' resultados</div>';
const cs=[...r.querySelectorAll('.card.col')];cs.forEach((c,i)=>{const b=c.querySelector('b').innerText,s=c.querySelector('.hint').innerText,vb=c.querySelector('div[style*="text-align:right"]'),v=vb.querySelector('b').innerText,v2=(vb.querySelector('.hint')||{}).innerText||'';
 let x='<div class="cxL" style="padding:13px 0;align-items:center;border-bottom:'+(i==0?'0':'1px solid var(--line2)')+'"><span>'+b+'<small>'+s+'</small></span><span style="display:flex;align-items:center;gap:10px"><span style="text-align:right"><b style="font-size:16px;font-weight:600;white-space:nowrap;display:block">'+v+'</b>'+(v2?'<small style="display:block;font-size:12.5px;color:var(--mute)">'+v2+'</small>':'')+'</span><span style="color:var(--mute);font-size:20px;width:12px;line-height:1;display:inline-block;'+(i==0?'transform:rotate(-180deg) translateY(-4px)':'transform:translateY(-4px)')+'">⌄</span></span></div>';
 if(i==0)x+='<div style="padding:0 0 12px;border-bottom:1px solid var(--line2)">'+[['Recebido','G$ 108.500'],['Forma de pagamento','Dinheiro'],['Câmbio no dia','G$ 6.200 por US$'],['Custo pago','US$ 4,20'],['Lucro real','G$ 82.460']].map(y=>'<div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--sub);padding:5px 0"><span>'+y[0]+'</span><span style="color:var(--fg)">'+y[1]+'</span></div>').join('')+'<div style="text-align:center;margin-top:8px"><button type="button" class="dz105">Estornar venda</button></div></div>';
 c.parentElement.outerHTML=x});return 1}"""
# c) filtros: sem a caixa; títulos em versalete fora; os botões de escolha continuam pílulas neutras
CSS_C="""#v-hist #hFil>section.card{background:none!important;border:0!important;box-shadow:none!important;padding:4px 0 8px!important;border-radius:0!important;border-bottom:1px solid var(--line2)!important}
#v-hist #hFil .lbl{font-size:11.5px!important;letter-spacing:.14em!important;margin-top:6px}"""
def abre_a(pg,w): pass
def abre_b(pg,w): pg.fill('#hq','SL');w(1300)
def abre_c(pg,w): pg.click('[data-act=hfopen]');w(900)
CASOS=[('a','lista-do-mes','lista do mês',abre_a,CSS_A,None,
  'Hoje: os dias do mês dentro de uma caixa grande.',
  'Proposta: sem a caixa; cada dia numa linha fina (o que vai na linha não muda: data, valor, "›", vendas e lucro livre). O mês em versalete fora, como no Caixa.'),
 ('b','busca','resultado da busca',abre_b,'',JS_B,
  'Hoje: "613 resultado(s)" e cada venda num cartão com "Ver detalhes ›" e "Estornar".',
  'Proposta: "613 RESULTADOS" em versalete; cada venda numa linha fina com ⌄ (igual às vendas do Dashboard, esboço 116): o toque abre o detalhe ali mesmo e embaixo vem "Estornar venda" em vermelho, que pede confirmação. Na 1ª linha aparece aberta.'),
 ('c','filtros','filtros',abre_c,CSS_C,None,
  'Hoje: os filtros dentro de uma caixa.',
  'Proposta: sem a caixa; os títulos (TIPO DE MOVIMENTO, FORMA DE PAGAMENTO…) em versalete e os botões de escolha como hoje (pílulas neutras); uma linha fina fecha o bloco.')]
with sync_playwright() as pw:
  for k,nome,tit,abre,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abc')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate("()=>window.__LF.setView('hist')");w(1300);abre(pg,w)
        if prop:
          if css: pg.add_style_tag(content=css)
          if js: pg.evaluate(js)
          w(500)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        pg.evaluate("()=>scrollTo(0,500)");w(400);oo.append(olho(pg));b.close()
      print(k,tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
      prancha('123%s-app-historico-%s-%s.jpg'%(k,nome,tema),'App · Histórico · %s · tema %s'%(tit,tema),[h,p],*fs)
