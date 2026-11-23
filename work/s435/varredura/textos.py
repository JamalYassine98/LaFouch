# Varredura de luxo · parte 2 · TEXTOS EXPLICATIVOS. Coleta, nas telas do app de HOJE, os textos que EXPLICAM (frase corrida, não dado):
# .hint, .crumb/subtítulos e parágrafos com 6+ palavras sem número de dado. Agrupa por tela.
import sys,json,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
COL=r"""v=>{const out=[];const vis=e=>{const r=e.getBoundingClientRect();return r.width>40&&r.height>8&&getComputedStyle(e).visibility!='hidden'&&e.offsetParent};
 document.querySelectorAll('.view:not([hidden]) *, .ljJn *, .cxAcao.on *').forEach(e=>{if(!vis(e))return;const own=[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent).join('').trim();
  const t=e.innerText&&e.children.length<=3?e.innerText.trim():own;if(!t||t.split(/\s+/).length<6)return;if(e.closest('button,a,label,select,option,input'))return;
  const c=getComputedStyle(e);if(parseFloat(c.fontSize)>17)return;if(e.parentElement&&out.some(o=>o.el===e.parentElement))return;
  out.push({el:e,t:t.replace(/\s+/g,' ').slice(0,160),cls:e.className&&e.className.baseVal===undefined?e.className:'',fs:c.fontSize,v})});
 return out.map(o=>({t:o.t,cls:o.cls,fs:o.fs,v:o.v}))}"""
CENAS=['inicio','estoque','caixa','clientes','ped','hist','ajustes','fx','desp','dash','dia','mkt','cup','onl']
R=[]
with sync_playwright() as pw:
  for v in CENAS:
    try:
      b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(1000)
      if v=='ajustes':
        for k in ['bk','site','imp','seg','av','upd','pa','ped','pauto']:
          try: pg.locator('.ajS[data-k="%s"] .ajR'%k).click(timeout=1500);w(300)
          except Exception: pass
      R+=pg.evaluate(COL,v);b.close()
    except Exception as e: print(v,'ERR',str(e)[:70])
# tira repetidos e o que é dado (tem G$/US$/R$ ou % ou dígitos demais)
S=[];vist=set()
for x in R:
  t=x['t']
  if (x['v'],t) in vist: continue
  vist.add((x['v'],t))
  dado=len(re.findall(r'\d',t))>6 or re.search(r'G\$|US\$|R\$',t)
  x['dado']=bool(dado);S.append(x)
json.dump(S,open('textos.json','w'),ensure_ascii=False,indent=0)
exp=[x for x in S if not x['dado']]
print(len(S),'blocos ·',len(exp),'explicativos')
from collections import Counter
print(Counter(x['v'] for x in exp))
for x in exp[:200]: print(x['v'],'|',x['fs'],'|',x['t'][:120])
