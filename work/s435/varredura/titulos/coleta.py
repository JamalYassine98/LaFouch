# Varredura · parte 5 · TÍTULOS E LINHAS — mede, no app de HOJE, (a) títulos de tela (h1), (b) rótulos de seção (MAIÚSCULAS),
# (c) títulos de janela, (d) altura e letra das LINHAS de lista (linha = elemento com borda de baixo fina e um texto principal).
import sys,json,collections;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
COL=r"""v=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>30&&r.height>8&&e.offsetParent};const st=e=>{const c=getComputedStyle(e);return [c.fontFamily.split(',')[0].replace(/"/g,''),c.fontSize,c.fontWeight,c.letterSpacing,c.textTransform]};
 const out={h1:[],lbl:[],jan:[],lin:[]};
 document.querySelectorAll('.view:not([hidden]) h1').forEach(e=>{if(vis(e))out.h1.push([v,e.textContent.trim().slice(0,24)].concat(st(e)))});
 document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{if(!vis(e)||e.children.length>2)return;const c=getComputedStyle(e);if(c.textTransform=='uppercase'&&e.textContent.trim().length>2&&e.textContent.trim().length<40)out.lbl.push([v,e.textContent.trim().slice(0,24)].concat(st(e)).concat([e.className]))});
 document.querySelectorAll('.ljHd b,.lfa-sh b').forEach(e=>{if(vis(e))out.jan.push([v,e.textContent.trim().slice(0,24)].concat(st(e)))});
 document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{if(!vis(e))return;const c=getComputedStyle(e),r=e.getBoundingClientRect();if(parseFloat(c.borderBottomWidth)>=1&&parseFloat(c.borderTopWidth)==0&&r.width>300&&r.height>=40&&r.height<=110&&e.children.length>=1){const b=e.querySelector('b,strong')||e;out.lin.push([v,Math.round(r.height),getComputedStyle(b).fontSize,getComputedStyle(b).fontWeight,e.className.toString().slice(0,30),e.textContent.trim().replace(/\s+/g,' ').slice(0,30)])}});
 return out}"""
R={'h1':[],'lbl':[],'jan':[],'lin':[]}
with sync_playwright() as pw:
  for v in ['inicio','estoque','caixa','clientes','ped','hist','ajustes','fx','desp','dash','dia','mkt','vendas','cup']:
    try:
      b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(1000)
      r=pg.evaluate(COL,v)
      for k in R: R[k]+=r[k]
      b.close()
    except Exception as e: print(v,'ERR',str(e)[:60])
json.dump(R,open('titulos.json','w'),ensure_ascii=False)
for k in ['h1','lbl','jan']:
  C=collections.Counter(tuple(x[2:7]) for x in R[k]);print('==',k,len(R[k]),'·',len(C),'desenhos')
  for d,n in C.most_common(): print('  ',n,d,[x[0]+':'+x[1] for x in R[k] if tuple(x[2:7])==d][:4])
C=collections.Counter((x[1]) for x in R['lin']);print('== linhas',len(R['lin']),'alturas:',sorted(C.items()))
C2=collections.Counter((x[2],x[3]) for x in R['lin']);print('   letra do texto principal:',C2.most_common(8))
