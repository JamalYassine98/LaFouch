import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw); pg.evaluate(open(os.path.join(AQ,'proposta.js')).read()); pg.wait_for_timeout(800)
    print(pg.evaluate("""(()=>{let o=[];let e=document.getElementById('home');while(e){o.push((e.tagName+'#'+e.id+'.'+e.className).slice(0,50)+' w='+Math.round(e.getBoundingClientRect().width)+' '+getComputedStyle(e).display);e=e.parentElement}
    o.push('---');[...document.getElementById('home').children].forEach(c=>o.push((c.className||c.id||c.tagName).toString().slice(0,30)+' w='+Math.round(c.getBoundingClientRect().width)));return o.join('\\n')})()"""))
    b.close()
