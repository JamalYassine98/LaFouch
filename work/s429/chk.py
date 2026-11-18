import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
exec(open('esb139.py').read().split('with sync_playwright')[0])
with sync_playwright() as pw:
  for op in 'AB':
    for prop in (0,1):
      b,pg,w=ap.abre(pw,'inicio',True);w(300)
      for x in TELAS[0][2]:
        try: pg.evaluate(x)
        except Exception: pass
        w(1000)
      if prop: pg.add_style_tag(content=OP[op][1]);w(500)
      print(op,prop,[(x['r'],x['ex']) for x in pg.evaluate(A2)]);b.close()
