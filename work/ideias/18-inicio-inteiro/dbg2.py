import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw)
    print(pg.evaluate("""(()=>{const c=document.querySelectorAll('#home .hg .hc')[1];const x=c.cloneNode(true);x.querySelectorAll('img').forEach(i=>i.src='');return x.outerHTML.slice(0,1500)+'\\n\\nCSS: '+[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules]}catch(e){return[]}}).map(r=>r.cssText).filter(t=>/\\.hc[ .{:]|\\.hci|\\.hn|\\.hpr|\\.hsw|\\.ulin/.test(t)).slice(0,25).join('\\n').slice(0,3500)})()"""))
    b.close()
