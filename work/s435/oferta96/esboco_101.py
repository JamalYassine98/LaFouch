# Esboço 101 (S435, 23/11 11:35) — PROVA DE QUE ENTENDI (dono 11:25): o design aprovado fica IGUAL; a ÚNICA mudança é a cor da marca pela cor
# oficial do logo (#943d6f; no escuro, letra/link na mesma cor clareada #bf8ba9 para ler). Mesma tela aprovada (98 v4, janela Desconto),
# ANTES (vinho antigo #8d3a69/#a2447c/#8a2f66 + degradê do cartão) × DEPOIS (cor oficial), escuro e claro. Botão principal continua só contorno.
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_98.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0])
_C,_L=A2.CORES,A2.CORLIT
def t101(pw,esc,novo):
  A2.CORES,A2.CORLIT=(_C,_L) if novo else ('#x{}','()=>0')
  try:return tela98(pw,esc,'jan')
  finally:A2.CORES,A2.CORLIT=_C,_L
with sync_playwright() as pw:
  q=[]
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    q+=[('ANTES · '+n,'o design aprovado, vinho antigo',t101(pw,esc,0)),('DEPOIS · '+n,'o mesmo design, cor oficial #943d6f',t101(pw,esc,1))]
  quadro(O+'esboco_101_so_a_cor_oficial.jpg',q,True)
