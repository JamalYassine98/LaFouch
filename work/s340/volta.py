# S340: 1ª volta no painel REAL (com o kit do painel): cada área, escuro e claro, celular. Mede contraste e o olho; fotografa.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/kit');import painel
from playwright.sync_api import sync_playwright
T='/home/claude/lafouch/work/s340/'
CONTR="""()=>{const cv=document.createElement('canvas').getContext('2d');const rgb=c=>{cv.fillStyle='#000';cv.fillStyle=c;const h=cv.fillStyle;if(h[0]==='#')return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16),1];const m=h.match(/[\\d.]+/g)||[0,0,0,0];return [+m[0],+m[1],+m[2],m.length>3?+m[3]:1]};
 const lum=m=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])};
 const fundo=e=>{while(e){const m=rgb(getComputedStyle(e).backgroundColor);if(m[3]>.5)return m;e=e.parentElement}return rgb(getComputedStyle(document.body).backgroundColor)};const o=[];
 document.querySelectorAll('#shell *').forEach(e=>{if(!e.offsetParent)return;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight*6)return;const t=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const cs=getComputedStyle(e);if(+cs.opacity<.05)return;const a=lum(rgb(cs.color)),b=lum(fundo(e));const k=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(k<3)o.push([t.slice(0,26),+k.toFixed(2)])});return o}"""
R={}
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w,log=painel.abre(pw,esc)
        est=pg.evaluate("()=>({casca:!document.getElementById('shell').hidden,login:!document.getElementById('login').hidden,lock:!document.getElementById('lock').hidden,totp:!document.getElementById('totp').hidden,texto:document.body.innerText.slice(0,160)})")
        print('escuro' if esc else 'claro',est,'erros',pg.erros[:2])
        for v in painel.TELAS:
            painel.vai(pg,v);pg.screenshot(path=T+'%s_%s.png'%(v,'e' if esc else 'c'),full_page=False)
            c=pg.evaluate(CONTR);alt=pg.evaluate("()=>[document.documentElement.scrollHeight,document.documentElement.scrollWidth,innerWidth]")
            R['%s_%s'%(v,'e' if esc else 'c')]={'ilegiveis':c,'altura':alt[0],'largura':alt[1],'erros':list(pg.erros)}
            print('  ',v,'ilegíveis:',len(c),[x[0] for x in c][:6],'· altura',alt[0],'· passa da largura' if alt[1]>alt[2]+1 else '','· erros',len(pg.erros))
        if esc: print('  pedidos de rede:',sorted(set(l[1] for l in log))[:14])
        b.close()
json.dump(R,open(T+'volta.json','w'),ensure_ascii=False,indent=0)
