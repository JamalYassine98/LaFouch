# TITAN · conferência do app antes de publicar (ESBOCO, 24/11/2026).
# Parte 1: comparador peça por peça (real × aprovado). Parte 2: medidor de família (familia.py) + a prova dele (prova_medidor.py).
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

# parte 2 · medidor de família no app real
import medir,familia,subprocess
with sync_playwright() as pw:
  import kit
  b=kit.sim.navegador(pw);C={n:medir.coleta(b,v,p) for n,v,p in medir.TELAS if not so or n in so}
F=familia.regras(C);json.dump(F,open(os.path.join(OUT,'familia.json'),'w'),ensure_ascii=False,indent=1)
print('medidor de família: %d achados em %d telas'%(sum(len(v) for v in F.values()),len(F)))
if not so:subprocess.run([sys.executable,os.path.join(os.path.dirname(os.path.abspath(__file__)),'prova_medidor.py'),os.path.join(OUT,'familia.json')])
