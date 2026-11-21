import sys,json
from playwright.sync_api import sync_playwright
REF,NOVO=sys.argv[1],sys.argv[2]
JS="""(()=>{const pick=()=>{for(const s of ['#dlgb','#cad','#mapw','#cpov','#layer .scrim:not(.pg)','#sov.on','#drw.on','#fsh.on','#fvs.on','#gw','#layer .scrim.pg','.sec.pop']){const e=document.querySelector(s);if(e&&e.getBoundingClientRect().height>20)return [s,e]}return ['main',document.querySelector('main')]};
 const [nome,R]=pick();const out=[];const seen={};[R,...R.querySelectorAll('*')].forEach(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);if(!r.width||!r.height||c.visibility==='hidden'||r.bottom<0||r.top>innerHeight)return;
  if(e.closest('.card,.hc,.hcat,[data-open]')&&e!==R)return; /* cartões de peça mudaram de propósito (selos v2) */
  let k=e.tagName+'|'+(e.children.length?'':e.textContent.trim().slice(0,22))+'|'+(e.id||'');seen[k]=(seen[k]||0)+1;k+='#'+seen[k];
  out.push([k,Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),c.backgroundColor,c.color,c.fontSize,c.borderRadius,c.position,c.display].join('§'))});return {raiz:nome,L:out}})()"""
def menu_(pg): pg.click('#mnb');pg.wait_for_timeout(800)
def vai(h): return lambda pg:(menu_(pg),pg.evaluate("h=>{const e=document.querySelector('#drw a[href=\"'+h+'\"]');e&&e.click()}",h),pg.wait_for_timeout(1600))
def cat(pg): pg.evaluate("(()=>{const a=[...document.querySelectorAll('a[data-mf^=\"tipo:\"]')].find(e=>e.offsetParent);a&&a.click()})()");pg.wait_for_timeout(1600)
def peca(pg): cat(pg);pg.evaluate("(()=>{const e=[...document.querySelectorAll('#grid [data-open]')].find(e=>e.offsetParent);e&&e.click()})()");pg.wait_for_timeout(1800)
def add(pg): peca(pg);pg.evaluate("(()=>{const e=document.querySelector('#layer [data-addm]');e&&e.click()})()");pg.wait_for_timeout(1200)
def seq(*f):
    def g(pg):
        for x in f: x(pg)
    return g
clk=lambda sel,t=1300:(lambda pg:(pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.offsetParent)||document.querySelector(s);e&&e.click()}",sel),pg.wait_for_timeout(t)))
ES={'separado para você':('?s=SL2250.GR3340.AC1050&n=Maria',lambda pg:pg.wait_for_timeout(2500)),'portal do atacado':('?c=TESTE123',lambda pg:pg.wait_for_timeout(2500)),'foto ampliada':('',seq(peca,lambda pg:(pg.evaluate("(()=>{const b=document.querySelector('#layer .big');if(!b)return;const r=b.getBoundingClientRect();for(const t of ['pointerdown','pointerup','click','dblclick'])b.dispatchEvent(new MouseEvent(t,{bubbles:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2}))})()"),pg.wait_for_timeout(900))))}
res={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    for W in (390,1440):
        for nome,(qs,fn) in ES.items():
            D=[]
            for porta in (REF,NOVO):
                c=b.new_context(bypass_csp=True,viewport={'width':W,'height':844},is_mobile=W<700,has_touch=W<700,permissions=['camera'],reduced_motion='reduce')
                c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}")
                c.route('**cloudfunctions.net/**',lambda r,q=None:r.fulfill(status=200,content_type='application/json',body='{"ok":false,"motivo":"entrar"}'));pg=c.new_page()
                try:
                    pg.goto('http://localhost:%s/'%porta+qs);pg.wait_for_timeout(3200);fn(pg);D.append(pg.evaluate(JS))
                    pg.screenshot(path='/tmp/esc/cf/%s_%d_%s.png'%(nome.replace(' ','_'),W,porta))
                except Exception as e: D.append({'raiz':'EXC '+str(e)[:60],'L':[]})
                c.close()
            a,n=D
            A={x.split('§')[0]:x for x in a['L']};N={x.split('§')[0]:x for x in n['L']}
            dif=[(A[k],N[k]) for k in A if k in N and A[k]!=N[k]];so_a=[k for k in A if k not in N];so_n=[k for k in N if k not in A]
            res['%s %d'%(nome,W)]={'raiz':[a['raiz'],n['raiz']],'n':[len(A),len(N)],'dif':dif[:12],'ndif':len(dif),'sumiu':so_a[:8],'nsumiu':len(so_a),'novo':so_n[:8],'nnovo':len(so_n)}
            print('%-22s %4d  raiz %-28s elementos %3d/%3d  mudou %3d  sumiu %3d  novo %3d'%(nome,W,a['raiz']+' / '+n['raiz'],len(A),len(N),len(dif),len(so_a),len(so_n)),flush=True)
    b.close()
json.dump(res,open('/tmp/esc/cf/res3.json','w'),ensure_ascii=False,indent=0)
