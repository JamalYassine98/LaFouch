exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    for tela,W,H in [('carrinho',390,844),('peca',768,1024)]:
      for prop in (False,True):
        m,o1,o2,er=caso(pw,tela,W,H,prop=prop)
        print(tela,W,prop,[ (x['r'],x['n'],x['ex']) for x in o1+o2 if x['r']=='tampado'])
finally: srv.terminate()
