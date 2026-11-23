# 96c: a janela Oferta do 94 com 'Na loja e no site' (a oferta vale nos dois lugares).
_s=open('/home/claude/lafouch/work/s435/preco56/esboco_94_95.py').read().rsplit("\nif __name__",1)[0]
_s=_s.replace("<span>No site</span><span>G$ 27.000</span>","<span>Na loja e no site</span><span>G$ 27.000</span>");exec(_s)
O='/home/claude/lafouch/work/s435/oferta96/'
_ab=ap.abre
with sync_playwright() as pw:
  for ESC in (True,False):
    tm='escuro' if ESC else 'claro'
    ap.abre=lambda pw,v,e,d,base=False,_E=ESC:_ab(pw,v,_E,d,base=base)
    quadro('esboco_96c_janela_oferta_%s.jpg'%tm,[('PROPOSTA · janela Oferta','"Na loja e no site" (era "No site")',tela2(pw,'janela94'))])
