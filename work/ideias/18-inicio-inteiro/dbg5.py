import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw)
    for inj in [None, os.path.join(AQ,'proposta.js')]:
        if inj: pg.evaluate(open(inj).read()); pg.wait_for_timeout(800)
        print(pg.evaluate("""(()=>{const W=document.documentElement.clientWidth;const o=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>W+1&&r.width>0&&getComputedStyle(e).position!=='fixed'){let p=e.parentElement,clip=false;while(p){const s=getComputedStyle(p);if(/hidden|auto|scroll|clip/.test(s.overflowX)){clip=true;break}p=p.parentElement}if(!clip)o.push((e.tagName+'.'+(e.className&&e.className.baseVal===undefined?e.className:'')+'#'+e.id).slice(0,40)+' r='+Math.round(r.right))}});return 'W='+W+' sw='+document.documentElement.scrollWidth+' | '+o.slice(0,12).join(' , ')})()"""))
    b.close()
