import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,json
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(600)
  r=pg.evaluate("""()=>{const L=window.__LF;const d=new Date();const r=L.resultadoMes(d.getFullYear(),d.getMonth());const S=L.S;
    return {r:r,exps:(S.exps||S.exp||[]).map?((S.expList||S.contas||[])).length:0,expKeys:Object.keys(S).filter(k=>/exp|conta|imprev|retir/i.test(k)),cpay:(S.cpay||[]).length,imprev:S.imprev,ret:S.retiradas}}""")
  print(json.dumps(r,ensure_ascii=False)[:3000]);b.close()
