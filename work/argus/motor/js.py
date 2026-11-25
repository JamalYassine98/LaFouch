# ARGUS · os códigos que rodam DENTRO da página (simulador e Android emulado) moram em arquivos .js, num lugar só:
# motor/js/ (vale para app e site) e setor_app/js/ (só do app). Python e o emulador leem os mesmos arquivos.
# As linhas de comentário do começo (// …) ficam no arquivo para quem lê, e saem na hora de rodar.
import os
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def js(nome, setor=None):
    f = os.path.join(A, ('setor_' + setor) if setor else 'motor', 'js', nome + '.js')
    L = open(f, encoding='utf-8').read().split('\n')
    while L and L[0].lstrip().startswith('//'): L.pop(0)
    return '\n'.join(L).strip()
