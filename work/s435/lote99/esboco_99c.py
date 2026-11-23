# 99c (S435, 23/11 10:50) — KIT DE PRESENTE com estoque (dono 10:19 'Sim'): o kit (estojo, flanela, líquido) mora onde é usado — na janela
# da data (97b) uma linha 'Kits em estoque · 40 · +' (o + registra kits que chegaram); cada venda com presente tira 1; no Carrinho o aviso
# diz quantos sobram ('sobram 39 kits'); com 5 ou menos, o aviso fica amarelo (85) e entra no sino. Não vai para o site nem para o Inventário
# de peças (não é peça à venda). Base: 97b + 98 v4 + aprovados.py. Números = ilustração.
import sys
src=open('/home/claude/lafouch/work/s435/oferta96/esboco_97.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0]
src=src.replace("SWJ('Presente na compra','estojo, flanela e líquido',1)+","SWJ('Presente na compra','estojo, flanela e líquido',1)+'<div style=\"display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)\"><span style=\"flex:1;font-size:16px\">Kits em estoque</span><b style=\"font-size:16px;font-weight:500;font-variant-numeric:tabular-nums\">40</b><span style=\"flex:0 0 32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:18px\">+</span></div>'+")
src=src.replace("vs['height']+140","vs['height']+220");exec(src)
J={}
exec(open('/home/claude/lafouch/work/s435/oferta96/esboco_98.py').read().rsplit("\nwith sync_playwright() as pw:",1)[0].replace("estojo, flanela e líquido</small>","estojo, flanela e líquido · sobram 39 kits</small>"),J)
O='/home/claude/lafouch/work/s435/lote99/'
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    a=tela97(pw,esc,TEMA2,'Natal',True);c=J['tela98'](pw,esc,'natal')
    quadro('esboco_99c_kit_de_presente_%s.jpg'%n,[('PROPOSTA · janela Natal',n+' · "Kits em estoque · 40 · +"',a),('PROPOSTA · Carrinho no Natal',n+' · o aviso diz quantos sobram',c)])
