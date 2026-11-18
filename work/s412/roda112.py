exec(open('e112.py').read())
import itertools
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
casos=[]
for tela in ['carrinho','conta','peca']:
  for W,H in [(390,844),(768,1024),(1440,900),(2560,1440)]: casos.append(dict(tela=tela,W=W,H=H))
for t in ['halloween','bf','maes','pais','anonovo']: casos.append(dict(tela='carrinho',W=390,H=844,tema=t))
for z in ['0','1','2']: casos.append(dict(tela='carrinho',W=390,H=844,zoom=z))
casos.append(dict(tela='conta',W=390,H=844,logado=True));casos.append(dict(tela='conta',W=1440,H=900,logado=True))
casos.append(dict(tela='carrinho',W=320,H=640))
for tela in ['carrinho','peca']:
  for W,H in [(390,844),(768,1024),(1024,1366),(1440,900)]: casos.append(dict(tela=tela,W=W,H=H,tema='nenhum'))
res=[]
try:
  with sync_playwright() as pw:
    for k in casos:
      lin={}
      for prop in (False,True):
        m,o1,o2,er=caso(pw,k['tela'],k['W'],k['H'],tema=k.get('tema','natal'),prop=prop,zoom=k.get('zoom'),logado=k.get('logado',False))
        lin['prop' if prop else 'hoje']=(m,sorted({x['r'] for x in o1+o2}),er,sorted({e for x in o1+o2 if x['r']=='tampado' for e in x['ex']}))
      h,p=lin['hoje'],lin['prop'];novas=[r for r in p[1] if r not in h[1]]
      g1=h[0].get('gap');g2=p[0].get('gap');print(k,'| vão',g1,'->',g2, '| cobre hoje',h[0]['cobre'],'->',p[0]['cobre'],'| rolar',h[0].get('depois_rolar'),'->',p[0].get('depois_rolar'),'| 1º item',h[0]['primeiro'],'->',p[0]['primeiro'],'| olho novo',novas,'| erros',p[2][:1],'| tampado novo',[e for e in p[3] if e not in h[3]])
finally: srv.terminate()
