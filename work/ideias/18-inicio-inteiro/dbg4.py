import sys,os; sys.argv=['x']; exec(open('roda.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg=abre(pw); pg.evaluate(open(os.path.join(AQ,'proposta.js')).read()); pg.wait_for_timeout(800)
    print(pg.evaluate("""[...document.querySelectorAll('#home .hg, #home .lfx-pg')].map(g=>[...g.querySelectorAll('.hc')].map(c=>{const r=c.querySelector('.hp').getBoundingClientRect(), i=c.querySelector('.hci').getBoundingClientRect(), cd=c.querySelector('.lfx-cod');return c.dataset.open+' hp'+Math.round(r.top+scrollY)+' hci'+Math.round(i.height)+'x'+Math.round(i.width)+' cod'+(cd?Math.round(cd.getBoundingClientRect().top+scrollY):'-')}).join(' | ')).join('\\n')"""))
    b.close()
