# TITAN · prova do medidor de família: com o app de 24/11 (v641) ele TEM de achar sozinho os erros reais que o dono e a ESBOCO acharam.
# Se um sumir sem a APP ter corrigido, o medidor está com defeito. Quando a APP corrigir, a linha sai daqui no mesmo passo.
import json,sys
A=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'relatorio/familia.json'))
ESPERADOS=[('Adicionar','janela não é a de baixo'),('Chegou mercadoria','janela com Fechar'),('Despesas','"+" de adicionar não é o redondo'),
 ('Atacado','"+" de adicionar não é o redondo'),('Caixa','"+" em botão largo'),('Início','fileira desalinhada'),('Início','texto quebrou'),
 ('Peça do Catálogo','trilha de caminho'),('Peça do Catálogo','mais de um título grande'),('Regras','frase de baixo do título'),
 ('Clientes','frase de baixo do título'),('Histórico','texto quebrou')]
falta=[(t,r) for t,r in ESPERADOS if not any(x[0].startswith(r) for x in A.get(t,[]))]
print('prova do medidor: %d de %d erros reais achados'%(len(ESPERADOS)-len(falta),len(ESPERADOS)))
for t,r in falta:print('  NÃO ACHOU:',t,'·',r)
sys.exit(1 if falta else 0)
