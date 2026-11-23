# Esboço 100 (S435, 23/11 11:30) — BOTÃO PRINCIPAL: só contorno (81 aprovado) × ACETINADO (cetim da família oficial, IDEIAS 10):
# cetim = radial-gradient(130% 220% at 50% 35%, #a15480, #943d6f 52%, #873865), letra branca (contraste 5,1 no centro, 6,6 na marca);
# ao tocar #7f345f. Mesma tela real (Carrinho do 98 v4, aprovado) em escuro e claro; muda só o botão principal ('Ir para o pagamento').
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_98.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
CETIM='.go,.go:not(:disabled){background:radial-gradient(130% 220% at 50% 35%,#a15480,#943d6f 52%,#873865)!important;color:#fff!important;border-color:transparent!important;box-shadow:none!important}'
_t=tela98
def tela100(pw,esc,cetim):
  import types
  orig=A2.aplica
  def ap2(pg):
    orig(pg)
    if cetim:pg.add_style_tag(content=CETIM)
  A2.aplica=ap2
  try:return _t(pw,esc,'usando')
  finally:A2.aplica=orig
with sync_playwright() as pw:
  q=[]
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    q+=[('SÓ CONTORNO · '+n,'o 81 aprovado',tela100(pw,esc,0)),('ACETINADO · '+n,'o cetim da cor oficial',tela100(pw,esc,1))]
  quadro(O+'esboco_100_botao_contorno_x_acetinado.jpg',q,True)
