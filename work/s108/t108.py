import sys,json,time;sys.path.insert(0,'/home/claude/lafouch/work/testes')
from base import *
from t5 import espera,clica,ate_teste
P=sys.argv[1] if len(sys.argv)>1 else '8773';O='/home/claude/lafouch/work/s108/feito/'
BOCA="(()=>{const b=document.querySelector('#gw .bO');return b?+getComputedStyle(b).opacity:0})()"
TOCA="(()=>{const a=__LFGZ&&window.__lfVzA;return 0})()"
def boca_sem_som(pg,ms):
  # amostra: boca aberta enquanto nenhum áudio toca
  n=0;m=0
  for i in range(ms//60):
    r=pg.evaluate("(()=>{const b=document.querySelector('#gw .bO');const op=b?+getComputedStyle(b).opacity:0;const tocando=[...window.__aud||[]].some(a=>!a.paused&&!a.ended&&a.currentTime>0);return [op,tocando]})()")
    if r[0]>0.5:
      m+=1
      if not r[1]:n+=1
    pg.wait_for_timeout(60)
  return n,m
SPY="(()=>{const A=window.Audio;window.__aud=[];window.Audio=function(u){const a=new A(u);window.__aud.push(a);return a};window.Audio.prototype=A.prototype})()"
with sync_playwright() as p:
  R={}
  # 1) rede lenta para a voz: anel aparece, boca nunca mexe sem som
  b,pg,errs=abre(p,perm=False,ls={'t_perm':'granted'});pg.add_init_script(SPY)
  def lento(route):
    time.sleep(1.2);route.continue_()
  pg.route('**/media/voz/**/*.mp3',lento)
  pg.goto(f'http://localhost:{P}/');pg.wait_for_timeout(1500);pg.evaluate("caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x))))")
  pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(400)
  anel=0
  for i in range(30):
    if pg.evaluate("!!document.querySelector('#gzvp.on')"):anel+=1
    pg.wait_for_timeout(100)
  pg.screenshot(path=O+'1_anel.png')
  n,m=boca_sem_som(pg,6000);R['rede_lenta']={'anel_visto_amostras':anel,'boca_aberta_sem_som':n,'boca_aberta_total':m}
  R['guardados']=pg.evaluate("caches.open('lf-voz-pt').then(c=>c.keys()).then(k=>k.length)")
  b.close()
  # 2) segunda visita: tudo do celular (sem baixar), e segundo plano pausa
  b,pg,errs=abre(p,perm=False,ls={'t_perm':'granted'});pg.add_init_script(SPY)
  pg.goto(f'http://localhost:{P}/');pg.wait_for_timeout(1200)
  # pré-carrega como se tivesse navegado no Wi-Fi: força a fila inteira
  pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(9000)
  R['guardados_depois_consulta']=pg.evaluate("caches.open('lf-voz-pt').then(c=>c.keys()).then(k=>k.length)")
  pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(1500)
  hide="Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))"
  show="Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'visible'});Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))"
  antes=pg.evaluate("[...window.__aud].filter(a=>!a.paused&&!a.ended).length")
  pg.evaluate(hide);pg.wait_for_timeout(1500)
  R['segundo_plano']={'tocando_antes':antes,'tocando_escondido':pg.evaluate("[...window.__aud].filter(a=>!a.paused&&!a.ended).length"),'boca':pg.evaluate(BOCA),'fase':pg.evaluate("__LFGZ.Z.fase")}
  pg.wait_for_timeout(2500);f0=pg.evaluate("__LFGZ.Z.fase")
  pg.evaluate(show);pg.wait_for_timeout(1200)
  R['voltou']={'tocando':pg.evaluate("[...window.__aud].filter(a=>!a.paused&&!a.ended).length"),'fase_escondido':f0,'fase':pg.evaluate("__LFGZ.Z.fase")}
  R['erros']=[e for e in errs if 'TUNNEL' not in e and 'XNNPACK' not in e and 'localStorage' not in e][:4]
  b.close()
  print(json.dumps(R,ensure_ascii=False,indent=1),flush=True)
  # 3) lupa larga em 3 celulares
  for W,H in ((390,844),(320,568),(360,740)):
    b,pg,errs=abre(p,perm=False,W=W,H=H,ls={'t_perm':'granted'})
    pg.goto(f'http://localhost:{P}/');pg.wait_for_timeout(1200);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(1500);pg.click('#gw [data-gz=comeca]')
    ate_teste(pg);pg.wait_for_timeout(800);pg.screenshot(path=O+f'3_{W}_sem.png')
    clica(pg,'nao');espera(pg,"__LFGZ.Z.g>0&&!__LFGZ.Z.troca",30000);pg.wait_for_timeout(1500);pg.screenshot(path=O+f'3_{W}_lente.png')
    info=pg.evaluate("""(()=>{const Z=__LFGZ.Z,L=__LFGZ.L,l=document.querySelector('#gzl'+Z.at),sp=l&&l.querySelector('span'),f=document.querySelector('#gzfita'),j=document.querySelector('#gzjan'),bal=document.querySelector('#gzbal'),tg=document.querySelector('#gztag'),m=Z.m.el;
      const r=s=>s.getBoundingClientRect();return {g:Z.g,at:Z.at,lupa:Z.lupa,frase:sp.textContent,cabe:r(sp).right<=r(j).right-4&&r(sp).left>=r(j).left,quebra:sp.getClientRects().length>1,folga_balao_etiqueta:Math.round(r(tg).top-r(bal).bottom),mochi_x:Math.round(r(m).left-r(document.querySelector('#gzstg')).left),frase_sob_mochi:r(sp).left<r(m).right-30&&r(sp).bottom>r(m).top&&r(sp).top<r(m).bottom,jan_l:Math.round(r(j).left),jan_w:Math.round(r(j).width)}})()""")
    # sobe a lente até o fim conferindo a frase a cada lente
    piores=[]
    for i in range(14):
      try:espera(pg,"(__LFGZ.Z.fase!=='teste')||(!!document.querySelector('#gw [data-gz=nao]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",40000)
      except Exception:break
      if pg.evaluate("__LFGZ.Z.fase")!='teste':break
      x=pg.evaluate("(()=>{const Z=__LFGZ.Z,l=document.querySelector('#gzl'+Z.at),sp=l.querySelector('span'),j=document.querySelector('#gzjan');const a=sp.getBoundingClientRect(),b=j.getBoundingClientRect();return [Z.g,sp.textContent.slice(0,30),a.right<=b.right-2&&a.left>=b.left,sp.getClientRects().length]})()")
      if not x[2] or x[3]>1:piores.append(x)
      if i==3:pg.screenshot(path=O+f'3_{W}_forte.png')
      pg.wait_for_timeout(200)
      try:pg.click('#gw [data-gz=nao]',timeout=8000)
      except Exception:info['parou']=pg.evaluate('__LFGZ.Z.fase');break
    info['problemas_nas_lentes']=piores;info['ultima_lente']=pg.evaluate("__LFGZ.Z.g")
    info['erros']=[e for e in errs if 'TUNNEL' not in e and 'XNNPACK' not in e and 'localStorage' not in e][:3]
    R[f'lupa_{W}']=info;b.close();print(W,json.dumps(info,ensure_ascii=False),flush=True)
  print(json.dumps(R,ensure_ascii=False,indent=1))
