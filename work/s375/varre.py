# varredura: botões espremidos (texto quebrando em várias linhas num botão estreito), cortados (texto maior que o botão) ou menores que 44 px de toque
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
MED=r"""(tela)=>{const out=[];document.querySelectorAll('button,a.pdB2,a[class*=btn],[role=button]').forEach(b=>{const r=b.getBoundingClientRect();if(!r.width||!r.height)return;if(getComputedStyle(b).visibility==='hidden')return;
 const t=(b.innerText||'').trim().replace(/\s+/g,' ');if(!t)return;const cs=getComputedStyle(b),lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.25;
 const rg=document.createRange();rg.selectNodeContents(b);const lin=[...rg.getClientRects()].reduce((s,x)=>{const y=Math.round(x.top);if(!s.includes(y))s.push(y);return s},[]).length;
 const quebra=t.length<=26&&lin>=3, cort=b.scrollWidth>b.clientWidth+2&&cs.overflow!=='visible', baixo=r.height<32&&!b.closest('.ajR,.sl,.pdRow');
 if(quebra||cort)out.push({tela,t:t.slice(0,40),w:Math.round(r.width),h:Math.round(r.height),lin,cls:b.className.slice(0,40),pq:quebra?'espremido':'cortado'})});return out}"""
PED="""(o)=>{const L=window.__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push(Object.assign({id:o.id,num:o.id,sid:'s'+o.id,cli:'Maria López',tel:'0981',ts:Date.now()-3e6,itens:[{t:it.ref,q:1,p:250000,ref:it.ref}],orig:'site',cod:'AB'+o.id,pag:'pix',total:250000,ent:'loja'},o.p));S.pedF=o.f;L.setView('ped');setTimeout(()=>L.ACT.pedab(o.id),400)}"""
res=[]
with sync_playwright() as pw:
  for esc in (False,True):
    for disp in ('celular','pc'):
      b,pg,w=ap.abre(pw,'inicio',esc,disp);w(500)
      pg.route('**/*googleapis.com/**',lambda r:r.fulfill(status=200,body='{"documents":[]}',content_type='application/json'))
      vs=pg.evaluate("()=>Object.keys(window.__LF.VIEWS||{})") or []
      if not vs: vs=pg.evaluate("()=>[...document.querySelectorAll('.view')].map(v=>v.id.replace('v-',''))")
      for v in vs:
        try: pg.evaluate("v=>window.__LF.setView(v)",v);w(700)
        except Exception: continue
        res+= [dict(x,tema=esc,disp=disp) for x in pg.evaluate(MED,v)]
      for o in (dict(id=911,p=dict(st='novo',pg='pagar'),f='novo'),dict(id=912,p=dict(st='novo',pg='comp',comp=PNG),f='novo'),dict(id=913,p=dict(st='sep',pg='pago'),f='sep'),dict(id=914,p=dict(st='pronto',pg='pago',tok='LF-AB12'),f='pronto'),dict(id=915,p=dict(st='ent',pg='pago'),f='ent'),dict(id=916,p=dict(st='canc',pg='pagar'),f='canc')):
        pg.evaluate(PED,o);w(1000);res+=[dict(x,tema=esc,disp=disp) for x in pg.evaluate(MED,'pedido '+o['p']['st']+'/'+o['p']['pg'])]
      b.close()
seen={}
for r in res:
  k=(r['tela'],r['t'],r['pq']);seen.setdefault(k,[]).append(('escuro' if r['tema'] else 'claro')+'/'+r['disp']+' %dx%d'%(r['w'],r['h']))
for k,v in sorted(seen.items()): print(k[2],'|',k[0],'|',k[1],'|',', '.join(sorted(set(v)))[:90])
