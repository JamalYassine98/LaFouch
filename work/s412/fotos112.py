exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
L=[('carrinho',390,844,'cel','natal'),('conta',390,844,'cel','natal'),('peca',390,844,'cel','natal'),('carrinho',1440,900,'pc','natal'),('conta',1440,900,'pc','natal'),('peca',2560,1440,'pc','natal'),('peca',768,1024,'tab','nenhum'),('carrinho',768,1024,'tab','natal')]
try:
  with sync_playwright() as pw:
    for tela,W,H,n,tema in L:
        for prop in (False,True):
          caso(pw,tela,W,H,tema=tema,prop=prop,logado=(tela=='conta'),shot=T+'raw_%s_%s_%s.png'%(tela,n,'p' if prop else 'h'),rola=False)
finally: srv.terminate()
