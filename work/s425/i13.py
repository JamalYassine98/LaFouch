import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
Q=[('caixa-movimentos',r'^$|Ações do caixa|^13$'),('reservas-30dias',r'^(30|60|90) dias$'),('precos-corrigir',r'^Usar G|^Informar$'),('marketing-post',r'Me lembra'),('giro-vitrine',r'^Salvar$'),('caixa-conferir',r'^Fechar$|^Conferir$'),('caixa-novo-objetivo',r'Guardar objetivo'),('atacado-lotes',r'Criar lote'),('catalogo-carrinho',r'Adicionar outra peça'),('catalogo-pagamento',r'Receber parte'),('dash-semana',r'^G\$ 893')]
J=r"""(rx)=>[...document.querySelectorAll('button,[role=button]')].filter(e=>e.getBoundingClientRect().height&&new RegExp(rx).test((e.innerText||e.getAttribute('aria-label')||'').trim())).slice(0,3).map(e=>e.tagName+'.'+e.className+' act='+(e.dataset.act||'')+' pai='+e.parentElement.className+' :: '+e.outerHTML.slice(0,160))"""
with sync_playwright() as pw:
  for n,rx in Q:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in D[n]:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    print('##',n);[print('  ',x) for x in pg.evaluate(J,rx)];b.close()
