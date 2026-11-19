# S430 cobertura: passa pelas telas da cópia limpa e marca estilo/função nunca usados
import json,sys
from playwright.sync_api import sync_playwright
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','nac':'py','doc':'1234567'})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
def init(log): return "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"+(("localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s)"%(json.dumps(CONTA),json.dumps(AUTH))) if log else '')+"}catch(e){}"
U='http://localhost:8040/'
ROT=[('',[]),('?r=armazones',[]),('?r=sol',[]),('?r=lectura',[]),('?r=ofertas',[]),('?r=formato',[]),('?r=atacado',[]),('?r=como-comprar',[]),('?r=duvidas',[]),
 ('?r=armazones',["document.querySelector('#grid .card .open').click()"]),
 ('?r=armazones',["document.querySelector('#grid .card .open').click()","document.querySelector('#layer .bb')&&document.querySelector('#layer .bb').click()"]),
 ('',["document.querySelector('#mnb').click()"]),('?r=armazones',["document.querySelector('.lfgf')&&document.querySelector('.lfgf').click()"]),
 ('?busca=quadrado',[]),('?carrinho=1',[]),('?r=descubra-o-grau',[]),
 ('',["document.querySelector('#contabtn').click()"]),('',["document.querySelector('#contabtn').click()","(document.querySelectorAll('#layer .mct>button')[1]||{click(){}}).click()"]),
 ('',["document.querySelector('#contabtn').click()","(document.querySelectorAll('#layer .mct>button')[2]||{click(){}}).click()"]),('',["document.querySelector('#contabtn').click()","(document.querySelectorAll('#layer .mct>button')[3]||{click(){}}).click()"])]

COLETA="""()=>{const out=[];const strip=s=>s.replace(/::?(hover|active|focus|focus-visible|focus-within|visited|before|after|placeholder|selection|first-letter|first-line|-webkit-[a-z-]+|-moz-[a-z-]+|marker|backdrop|file-selector-button)(\\([^)]*\\))?/g,'').replace(/:(not|is|where|has)\\(\\s*\\)/g,'');
 const walk=(rules,sh,path)=>{for(let i=0;i<rules.length;i++){const r=rules[i];if(r.cssRules&&!r.selectorText){walk(r.cssRules,sh,path+'/'+i);continue}
  if(!r.selectorText)continue;const parts=r.selectorText.split(/,(?![^(]*\\))/);for(const sel of parts){let q=strip(sel).trim();if(!q||q.endsWith('>')||q.endsWith('+')||q.endsWith('~'))q=q.replace(/[>+~]\\s*$/,'');let m=false;try{m=!!document.querySelector(q||'*')}catch(e){m=null}out.push([sh,path+'/'+i,sel.trim(),m])}}};
 [...document.styleSheets].forEach((s,k)=>{let rs;try{rs=s.cssRules}catch(e){return}walk(rs,(s.ownerNode&&s.ownerNode.id)||('#'+k),'')});return out}"""
EVS=['natal','halloween','bf','anonovo-d','maes','pais']
with sync_playwright() as p:
    b=p.chromium.launch();css={};js={}
    def roda(W,H,url,acts,log):
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<1000,has_touch=W<1000);c.add_init_script(init(log))
        pg=c.new_page();s=c.new_cdp_session(pg)
        s.send('Profiler.enable');s.send('Profiler.startPreciseCoverage',{'callCount':False,'detailed':False})
        sheets={}
        s.on('CSS.styleSheetAdded',lambda e:sheets.__setitem__(e['header']['styleSheetId'],e['header']))
        pg.goto(U+url,wait_until='load');pg.wait_for_timeout(2500)
        pg.evaluate("()=>{var m=document.getElementById('manut');m&&m.remove()}")
        for a in acts:
            try:pg.evaluate("()=>{"+a+"}")
            except Exception as e:pass
            pg.wait_for_timeout(1500)
            for sh,pa,sel,m in pg.evaluate(COLETA):
                k=(sh,sel);css[k]=css.get(k,False) or bool(m)
        pg.mouse.wheel(0,3000);pg.wait_for_timeout(800)
        for sh,pa,sel,m in pg.evaluate(COLETA):
            k=(sh,sel);css[k]=css.get(k,False) or bool(m)
        for r in []:
            h=sheets.get(r['styleSheetId'],{});k=(h.get('sourceURL',''),h.get('startLine',0),h.get('startColumn',0),r['startOffset'],r['endOffset'])
            css[k]=css.get(k,False) or r['used']
        for sc in s.send('Profiler.takePreciseCoverage')['result']:
            if 'lf-site.js' not in sc['url']:continue
            for f in sc['functions']:
                for rg in f['ranges'][:1]:
                    k=(f['functionName'],rg['startOffset'],rg['endOffset']);js[k]=js.get(k,False) or rg['count']>0
        c.close()
    for W,H in [(386,858),(1440,900)]:
        for url,acts in ROT:
            for log in ([False,True] if 'contabtn' in ''.join(acts) or url=='' else [False]):
                roda(W,H,url,acts,log)
        for ev in EVS: roda(W,H,'?evp='+ev,[],False)
    json.dump({'css':[[k[0],k[1],v] for k,v in css.items()],'js':[list(k)+[v] for k,v in js.items()]},open('cob.json','w'))
    print('css regras',len(css),'nunca usadas',sum(1 for v in css.values() if not v))
    print('js funções',len(js),'nunca rodaram',sum(1 for v in js.values() if not v))
