import sys,json,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
EXTRA=[('cambio',["()=>__LF.setView('fx')"]),('clientes',["()=>__LF.setView('clientes')"]),('clientes-novo',["()=>__LF.setView('clientes')","()=>document.querySelector('[data-act=clinovo]').click()"]),('atacado-novo-acesso',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()"]),('inicio',[]),('vender',["()=>__LF.setView('venda')"]),('ajustes',["()=>__LF.setView('ajustes')"]),('giro-vitrine2',[]),('grp-dinheiro',["()=>{const b=document.querySelector(\"#mainnav .mn[data-id='g:din']\");b&&b.click()}"])]
J=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05};
const jan=[...document.querySelectorAll('.ljJn,.modal-box,[aria-modal=true]')].filter(vis).pop();
return [...document.querySelectorAll('button,[role=button]')].filter(e=>vis(e)&&!e.closest('nav.bnav,#bnav,.bnav')&&(!jan||jan.contains(e))).map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();const bw=parseFloat(c.borderTopWidth);const bg=c.backgroundColor;const t=(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,40);
 const temBg=bg!='rgba(0, 0, 0, 0)';const rad=parseFloat(c.borderTopLeftRadius);let cara='texto';
 if(Math.abs(r.width-r.height)<6&&r.width<60&&(bw>0||temBg)) cara=rad>=r.height/2-1?'ícone redondo':'ícone quadrado';
 else if((bw>0||temBg)&&r.height>=48&&r.width>innerWidth*0.5) cara=(c.borderTopColor.match(/\d+/g)||[]).slice(0,3).join(',')==((getComputedStyle(document.documentElement).getPropertyValue('--accent')||'').trim())?'principal':'barra grande';
 else if((bw>0||temBg)&&rad>=r.height/2-1) cara='pílula';
 else if(bw>0||temBg) cara='caixa';
 return {t,act:e.dataset.act||'',cara,h:Math.round(r.height),w:Math.round(r.width),cor:c.color,borda:c.borderTopColor,bw,fs:c.fontSize}})}"""
R={}
with sync_playwright() as pw:
  for nome,ps in C+EXTRA:
    b,pg,w=ap.abre(pw,'inicio',True);w(300);pg.evaluate(LM)
    for p in ps:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    w(300);R[nome]=pg.evaluate(J);b.close();print(nome,len(R[nome]),flush=True)
json.dump(R,open('/tmp/verif/estilos.json','w'),ensure_ascii=False)
