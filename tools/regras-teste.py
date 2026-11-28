#!/usr/bin/env python3
"""Monta as regras do projeto de TESTE (lafouch-teste) a partir das regras REAIS (dono 28/11/2026, Fase 3).

Um lugar só: quem edita, edita o firestore.rules (o da loja). Daqui saem:
  firestore.teste.rules = firestore.rules, com o UID do dono do projeto de teste, + SÓ o bloco dos relatórios;
  storage.teste.rules   = tudo fechado, menos a foto da tela do relatório (só criar).
Nunca editar os .teste.rules à mão: o teste functions/teste-regras-teste.js falha se eles não forem o que este script monta.

Uso:  python3 tools/regras-teste.py           (grava os dois arquivos)
      python3 tools/regras-teste.py --conferir (só confere; sai com erro se estiverem diferentes)
"""
import os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UID_REAL = 'jJzNDoMHtuRNOAF1GhJfNYDMlE63'   # functions/index.js DONO_UID (projeto lafouch-2f6bd)
UID_TESTE = 'uvYpqxPJZjTsSE9SACouW0nZH4d2'  # functions/index.js DONO_UID (projeto lafouch-teste)

CABECA = ("// GERADO por tools/regras-teste.py a partir do firestore.rules — NÃO EDITAR À MÃO.\n"
          "// Projeto lafouch-teste: as MESMAS regras da loja, com o dono do teste, + só a área de relatórios.\n")

# Relatório de erro do app "LaFouch Teste": o app (login anônimo) só CRIA; ninguém lê, muda ou apaga pelo celular.
# As sessões leem com a conta só-leitura (tools/relatorios). No máximo 20 por aparelho por hora: o nome do documento é
# <uid>_<hora>_<n>, com a hora de agora e n de 0 a 19, e criar um nome que já existe é negado.
RELATORIOS = """    // TESTE (28/11/2026): relatório de erro do app "LaFouch Teste" — só criar; leitura só pelas sessões (conta só-leitura)
    match /relatorios/{id} {
      allow create: if request.auth != null
        && request.auth.token.firebase.sign_in_provider == 'anonymous'
        && id.matches('^' + request.auth.uid + '_' + string(math.floor(request.time.toMillis() / 3600000)) + '_(1?[0-9])$')
        && request.resource.data.keys().hasOnly(['canal', 'v', 'tela', 'acao', 'erro', 'pilha', 'aparelho', 'ts', 'foto'])
        && request.resource.data.keys().hasAll(['canal', 'v', 'tela', 'erro', 'ts'])
        && request.resource.data.canal == 'teste'
        && request.resource.data.v is string && request.resource.data.v.size() <= 20
        && request.resource.data.tela is string && request.resource.data.tela.size() <= 60
        && request.resource.data.get('acao', '') is string && request.resource.data.get('acao', '').size() <= 80
        && request.resource.data.erro is string && request.resource.data.erro.size() <= 500
        && request.resource.data.get('pilha', '') is string && request.resource.data.get('pilha', '').size() <= 4000
        && request.resource.data.get('aparelho', '') is string && request.resource.data.get('aparelho', '').size() <= 120
        && request.resource.data.ts == request.time
        && request.resource.data.get('foto', false) is bool;
    }
"""

STORAGE = """rules_version = '2';
// GERADO por tools/regras-teste.py — NÃO EDITAR À MÃO. Projeto lafouch-teste: tudo fechado, menos a foto da tela do
// relatório (o app de teste só CRIA; ninguém lê pelo celular; até 400 KB, só JPEG; mesmo nome do relatório).
service firebase.storage {
  match /b/{bucket}/o {
    match /relatorios/{uid}/{arq} {
      allow create: if request.auth != null
        && request.auth.uid == uid
        && request.auth.token.firebase.sign_in_provider == 'anonymous'
        && arq.matches('^' + uid + '_[0-9]{6,7}_(1?[0-9])[.]jpg$')
        && request.resource.size < 400 * 1024
        && request.resource.contentType == 'image/jpeg';
    }
  }
}
"""


def monta():
    real = open(os.path.join(RAIZ, 'firestore.rules'), encoding='utf-8').read()
    if real.count(UID_REAL) != 1:
        raise SystemExit('firestore.rules: o UID do dono real precisa aparecer exatamente 1 vez (achei %d)' % real.count(UID_REAL))
    corpo = real.replace(UID_REAL, UID_TESTE)
    linhas = corpo.rstrip().split('\n')
    # o arquivo real termina com "  }" (fecha documents) e "}" (fecha o service): o bloco entra antes desses dois fechos
    if linhas[-1].strip() != '}' or linhas[-2].strip() != '}':
        raise SystemExit('firestore.rules: fim inesperado (esperava "  }" e "}")')
    corte = '\n'.join(linhas[:-2]) + '\n'
    return CABECA + corte + RELATORIOS + '  }\n}\n', STORAGE


def main():
    fs_teste, st_teste = monta()
    alvos = {'firestore.teste.rules': fs_teste, 'storage.teste.rules': st_teste}
    if '--conferir' in sys.argv:
        ruins = [n for n, t in alvos.items() if not os.path.exists(os.path.join(RAIZ, n)) or open(os.path.join(RAIZ, n), encoding='utf-8').read() != t]
        if ruins:
            raise SystemExit('regras de teste desatualizadas: ' + ', '.join(ruins) + ' — rode python3 tools/regras-teste.py')
        print('regras de teste: iguais às reais + relatórios')
        return
    for n, t in alvos.items():
        open(os.path.join(RAIZ, n), 'w', encoding='utf-8').write(t)
    print('gravado: ' + ', '.join(alvos))


if __name__ == '__main__':
    main()
