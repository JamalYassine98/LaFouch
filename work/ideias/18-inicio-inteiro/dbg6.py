import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw)
    pg.goto(f'http://localhost:{kit.PS}/formato.html?kit=1'); pg.wait_for_timeout(3000)
    pg.screenshot(path='/tmp/formato1.png')
    imgs=pg.evaluate("[...document.querySelectorAll('img')].filter(i=>i.offsetParent&&/media\\/i\\/\\w+\\.png/.test(i.src)).map(i=>{const s=getComputedStyle(i);return i.src.split('/').pop()+' '+s.filter+' '+s.mixBlendMode+' '+Math.round(i.getBoundingClientRect().width)})")
    print(imgs[:6])
    b.close()
