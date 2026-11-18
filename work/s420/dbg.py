import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
exec(open('esb134.py').read().split("with sync_playwright() as pw:")[0])
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in FICHA: pg.evaluate(p);w(1100)
  pg.add_style_tag(content=CA);pg.evaluate(JA);w(500);pg.evaluate("()=>scrollTo(0,99999)");w(500)
  o=olho(pg)
  print([x for x in (o if isinstance(o,list) else o.get('achados',o)) if 'texto sobre' in str(x)][:4])
  b.close()
