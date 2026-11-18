import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
exec(open('esb134.py').read().split("with sync_playwright() as pw:")[0])
with sync_playwright() as pw:
  for prop in (0,1):
    b,pg,w=ap.abre(pw,'inicio',True);w(400)
    for p in D['inventario-fornecedores']: pg.evaluate(p);w(1100)
    if prop: pg.add_style_tag(content=CB);w(500)
    print(prop,[x for x in olho(pg) if 'rola' in str(x)], pg.evaluate("()=>[document.documentElement.scrollHeight,innerHeight,document.getElementById('v-estoque').getBoundingClientRect().bottom+scrollY]"))
    b.close()
