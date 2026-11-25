# ARGUS · os botões que o Argus NUNCA toca (apagam, vendem, salvam, publicam, mandam…). Um lugar só: simulador, explorador e Android.
import re
NOME = re.compile(r'\b(apagar|excluir|remover|vender|salvar|publicar|enviar|confirmar|pagar|sair|desfazer|limpar|zerar|baixar|importar|restaurar|cancelar|lixeira)\b', re.I)  # verbo inteiro no nome do botão
ACAO = re.compile(r'^(del|apag|exclu|remov|vend|salv|pub|envi|pag|sair|limp|zer|restaur|cancel|import)', re.I)  # começo da ação (data-act)
def perigoso(t): return bool(NOME.search(t.get('nome', '')) or ACAO.search(t.get('act', '')))
