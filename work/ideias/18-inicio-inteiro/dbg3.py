import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw)
    print(pg.evaluate("[...document.querySelectorAll('#home .hg')].map(g=>[...g.children].map(c=>c.dataset.open).join(',')).join(' | ')"))
    print(pg.evaluate("[...document.querySelectorAll('#home .hcat img, #home .hata img')].map(i=>i.src.split('/').pop()).join(' ')"))
    b.close()
