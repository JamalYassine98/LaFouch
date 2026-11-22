from hoje import *
import mede as M
with sync_playwright() as pw:
  for nome,(w,h) in {'b':(844,390),'c':(1024,768)}.items():
    b,pg=abre(pw,w,h,True,'Peça')
    fotos=[]
    def parada(pg,k,y,r):
      fotos.append((k,y))
    a,onde=M.percorre(pg,parada)
    for k,v in a.items():
      print(nome,k,v.get('d'),onde.get(k))
    b.close()
