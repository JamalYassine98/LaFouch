exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    for prop in (False,True):
      m,o1,o2,er=caso(pw,'peca',768,1024,prop=prop,shot=T+'p768_%d.png'%prop,rola=False)
      print(prop,[x for x in o1 if x['r']=='tampado'])
finally: srv.terminate()
