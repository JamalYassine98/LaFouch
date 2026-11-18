exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw: caso(pw,'conta',390,844,prop=True,logado=True,rola=False)
finally: srv.terminate()
