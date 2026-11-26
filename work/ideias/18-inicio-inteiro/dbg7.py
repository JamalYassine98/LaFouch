import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw)
    pg.goto(f'http://localhost:{kit.PS}/formato.html?kit=1'); pg.wait_for_timeout(3000)
    print(pg.evaluate("""(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Oval');let row=el;for(let i=0;i<2;i++)row=row.parentElement;const x=row.cloneNode(true);x.querySelectorAll('img').forEach(i=>{i.setAttribute('data-src',i.src);i.removeAttribute('src')});const im=row.querySelector('img');return x.outerHTML.slice(0,900)+'\\nFILTER:'+(im?getComputedStyle(im).filter+' '+getComputedStyle(im).mixBlendMode:'no img')})()"""))
    b.close()
