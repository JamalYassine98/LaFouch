# S436 parte 1 do Ícone redondo: recorte de cada cara de hoje (app + aprovados) e a mesma com a cara única proposta.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
REP=[('inicio','12','A · Sino (21 telas)'),('hist-lista','Filtros','B · Data e Filtros (4) + Compartilhar'),('caixa-acoes','Ações do caixa','D · Ações do caixa'),('giro-no-estoque','Filtros e ordem','E · Filtros e ordem (Giro)')]
ACHA=r"""(a)=>{const b=[...document.querySelectorAll('button,a,[role=button],[data-act]')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.top<innerHeight}).find(x=>{const t=(x.innerText||'').trim()||x.getAttribute('aria-label')||'';return t===a||t.startsWith(a)||(x.getAttribute('aria-label')||'')===a});if(!b)return null;b.setAttribute('data-s436','1');const r=b.getBoundingClientRect();return [r.x+scrollX,r.y+scrollY,r.width,r.height]}"""
# cara única proposta = a regra da família: círculo 44 px, contorno fino (cor da linha), sem fundo, ícone 20 px, mesma cor de ícone
PROP=r"""()=>{const b=document.querySelector('[data-s436]');const st='width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;padding:0!important;border-radius:50%!important;border:1px solid var(--line2,rgb(42,52,65))!important;background:transparent!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-shadow:none!important';
b.style.cssText+=';'+st;b.querySelectorAll('svg').forEach(s=>{s.style.cssText+=';width:20px!important;height:20px!important'});const r=b.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"""
out=[]
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    for i,(tela,a,nome) in enumerate(REP):
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True)
      for p in dict(C).get(tela,[]):
        try: pg.evaluate(p)
        except Exception: pass
        w(600)
      r=pg.evaluate(ACHA,a);w(300)
      if not r: out.append((n,nome,'não achou'));b.close();continue
      cx,cy=r[0]+r[2]/2,r[1]+r[3]/2;clip={'x':max(0,cx-60),'y':max(0,cy-40),'width':120,'height':80}
      pg.screenshot(path='c_%s_%d_hoje.png'%(n,i),clip=clip)
      r2=pg.evaluate(PROP);w(200);r2=pg.evaluate(ACHA,a);w(200);cx,cy=r2[0]+r2[2]/2,r2[1]+r2[3]/2;clip={'x':max(0,cx-60),'y':max(0,cy-40),'width':120,'height':80};pg.screenshot(path='c_%s_%d_prop.png'%(n,i),clip=clip)
      out.append((n,nome,r,r2));b.close()
print(json.dumps(out,ensure_ascii=False))
