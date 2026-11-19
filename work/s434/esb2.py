exec(open('/home/claude/lafouch/work/s434/nvlib.py').read())
CX=C['caixa-acoes'][:1];DS=C['dash-mes']
def ab(pw,st):
  b,pg,w=abre(pw,'x',st);pg.evaluate(J_B);return b,pg,w
with sync_playwright() as pw:
  R={}
  b,pg,w=ab(pw,CX);R['cx0']=foto(pg,'cx0');a0={(r,e.replace(' ⌄','')) for r,e in alin(pg)};b.close()
  b,pg,w=ab(pw,DS);R['ds0']=foto(pg,'ds0');d0={(r,e.replace(' ⌄','')) for r,e in alin(pg)};b.close()
  b,pg,w=ab(pw,CX);pg.evaluate("a=>__nb.indice('Dinheiro','O dinheiro da loja',a)",[['Caixa','O dinheiro da loja, por moeda',SV('caixa')],['Despesas','Contas do mês e quanto cada venda separa',SV('desp')],['Câmbio','Cotação do dia e trocas de moeda',SV('fx')]]);w(400);R['cxI']=foto(pg,'cxI');b.close()
  b,pg,w=ab(pw,CX);pg.evaluate("()=>__nb.vers('Dinheiro')");w(400);R['cx1']=foto(pg,'cx1');print('cx alin novos',{(r,e) for r,e in alin(pg)}-a0)
  pg.evaluate("()=>__nb.rolar('Caixa')");w(500);R['cx2']=foto(pg,'cx2');b.close()
  b,pg,w=ab(pw,DS);pg.evaluate("a=>__nb.indice('Resultados','Como a loja está indo',a)",[['Dashboard','Os números do período',SV('hoje')],['Histórico','Todas as vendas, dia por dia',SV('hist')]]);w(400);R['dsI']=foto(pg,'dsI');b.close()
  b,pg,w=ab(pw,DS);pg.evaluate("()=>{__nb.vers('Resultados');__nv.trocaSimb(/^Este mês/,'›')}");w(400);R['ds1']=foto(pg,'ds1');print('ds alin novos',{(r,e) for r,e in alin(pg)}-d0)
  pg.evaluate("()=>__nb.rolar('Dashboard')");w(500);R['ds2']=foto(pg,'ds2');b.close()
arrasta(R['cx1'],R['cxI'],T+'cx3.png');arrasta(R['ds1'],R['dsI'],T+'ds3.png')
BASE='Base: app real + todos os aprovados.'
quadro('146B-caixa-1.jpg','Navegação B refinada · Dinheiro › Caixa (1/2)',[BASE,'Tocar "Dinheiro" na barra de baixo abre o índice: uma linha por tela, com o ícone que a tela já tem na barra do PC e "›". Dentro da tela: versalete "‹ DINHEIRO" acima do título, sem ⌄.'],[('HOJE',R['cx0']),('ÍNDICE',R['cxI']),('CAIXA',R['cx1'])])
quadro('146B-caixa-2.jpg','Navegação B refinada · Dinheiro › Caixa (2/2)',[BASE,'Ao rolar, o título vai pequeno para o alto, centralizado, com "‹". Arrastar da borda esquerda volta: a tela sai para a direita e o índice aparece por trás; a barra de baixo fica parada.','Movimentos: entra pela direita · volta pela esquerda · janela sobe de baixo — 0,25 s, mesma curva em todo o app.'],[('CAIXA',R['cx1']),('AO ROLAR',R['cx2']),('VOLTAR ARRASTANDO',T+'cx3.png')])
quadro('146B-dashboard-1.jpg','Navegação B refinada · Resultados › Dashboard (1/2)',[BASE,'Índice Resultados (Dashboard, Histórico) com ícones. Dentro: "‹ RESULTADOS" em versalete; o período vira "Este mês ›" (abre a janela de baixo; ⌄ só para abrir no lugar).'],[('HOJE',R['ds0']),('ÍNDICE',R['dsI']),('DASHBOARD',R['ds1'])])
quadro('146B-dashboard-2.jpg','Navegação B refinada · Resultados › Dashboard (2/2)',[BASE,'Mesmos movimentos do Caixa: título pequeno no alto ao rolar e voltar arrastando da borda.'],[('DASHBOARD',R['ds1']),('AO ROLAR',R['ds2']),('VOLTAR ARRASTANDO',T+'ds3.png')])
