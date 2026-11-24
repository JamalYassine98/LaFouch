# TITAN · conferência do app antes de publicar (ESBOCO, 24/11/2026). Parte 1: comparador peça por peça (real × aprovado).
# uso: python3 work/titan/titan.py [Tela,Tela…]
import sys,json,os
from playwright.sync_api import sync_playwright
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compara,roteiro
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'relatorio');os.makedirs(OUT,exist_ok=True)
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
T={}
with sync_playwright() as pw:
  for nome,v,p in roteiro.TELAS:
    if so and nome not in so:continue
    D=compara.tela(pw,nome,v,p,True,OUT)
    T[nome]=[{'tipo':t,'peca':k,'dif':m} for t,k,g,r,m in D]
    print('%-11s falta %2d · sobra %2d · muda %2d'%(nome,sum(1 for x in D if x[0]=='falta'),sum(1 for x in D if x[0]=='sobra'),sum(1 for x in D if x[0]=='muda')))
json.dump(T,open(os.path.join(OUT,'diferencas.json'),'w'),ensure_ascii=False,indent=1)
