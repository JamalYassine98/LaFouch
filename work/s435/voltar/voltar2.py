# ESBOCO 24/11: abas de baixo → 1ª linha "›" de cada uma → voltar (seta · navegador · android); e janela de baixo aberta → voltar
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
exec(open('voltar.py').read().split('# caminhos')[0].split('from playwright.sync_api import sync_playwright')[1])
ABA="(t)=>{const b=[...document.querySelectorAll('button,a')].filter(e=>{const r=e.getBoundingClientRect();return r.height&&r.top>innerHeight-120&&e.textContent.trim()===t})[0];if(!b)return 'sem aba';b.click();return 'ok'}"
LIN="()=>{const v=document.querySelector('.view:not([hidden])');const L=[...v.querySelectorAll('button,[data-act]')].filter(e=>e.getBoundingClientRect().height&&/›\\s*$/.test(e.textContent.trim())&&e.getAttribute('data-act')!='nvVolta');return L.map(e=>e.textContent.trim().replace(/\\s+/g,' ').slice(0,40))}"
JAN="()=>{const s=[...document.querySelectorAll('.sheet,.bsheet,[role=dialog]')].filter(e=>{const r=e.getBoundingClientRect();return r.height>50&&getComputedStyle(e).visibility!='hidden'});return s.length}"
R=[]
with sync_playwright() as pw:
  for aba in ('Vender','Peças','Dinheiro','Ajustes'):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate(ABA,aba);w(900)
    L=pg.evaluate(LIN);b.close();print('==',aba,'linhas ›:',L[:8])
    for lin in L[:3]:
      for modo in ('seta','navegador','android'):
        b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate(ABA,aba);w(900)
        o0=pg.evaluate(ONDE);pg.evaluate(CLICA,lin.split(' ')[0]);w(900);o1=pg.evaluate(ONDE);j=pg.evaluate(JAN)
        if modo=='seta':r=pg.evaluate(SETA)
        elif modo=='navegador':pg.evaluate("()=>{setTimeout(()=>history.back(),0)}");r='ok'
        else:r=pg.evaluate("()=>{window.__nvVoltarAndroid();return 'ok'}")
        w(900)
        try:o2=pg.evaluate(ONDE);j2=pg.evaluate(JAN)
        except Exception:o2={'view':'SAIU DO APP','titulo':'','tab':''};j2=0
        ok=(o2.get('view'),o2.get('titulo'),o2.get('tab'))==(o0['view'],o0['titulo'],o0['tab']) or (j and not j2 and (o2['view'],o2['titulo'])==(o1['view'],o1['titulo']))
        print('  ',('OK ' if ok else 'ERRO'),aba,'›',lin[:28],'·',modo,'| abriu:',o1['titulo'] or o1['view'],('(janela)' if j else ''),'seta:',o1['seta'],'| voltou a:',o2.get('titulo') or o2.get('view'),('(janela ainda aberta)' if j2 else ''),'' if r=='ok' else r)
        R.append(dict(aba=aba,linha=lin,modo=modo,ok=ok,abriu=o1,janela=j,voltou=o2,janela_depois=j2));b.close()
json.dump(R,open('voltar2.json','w'),ensure_ascii=False,indent=1)
