#!/usr/bin/env python3
"""Sessões: traz os relatórios de erro e a lista de envios do projeto de TESTE (28/11/2026, Fase 3).

  python3 tools/relatorios.py [dias]     → roda o workflow ler-teste.yml, espera e baixa em work/relatorios/<data-hora>/
Nada fica no repositório (work/relatorios/ está no .gitignore). Só lê o projeto lafouch-teste.
"""
import json, os, subprocess, sys, time

REPO = 'JamalYassine98/LaFouch'
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def gh(*a):
    return subprocess.run(['gh', *a], check=True, capture_output=True, text=True).stdout


def ultima_rodada():
    r = json.loads(gh('run', 'list', '-R', REPO, '-w', 'ler-teste.yml', '-L', '1', '--json', 'databaseId,createdAt') or '[]')
    return r[0] if r else None


def principal(dias):
    antes = ultima_rodada()
    gh('workflow', 'run', 'ler-teste.yml', '-R', REPO, '-f', 'dias=%s' % dias)
    for _ in range(60):
        time.sleep(5)
        r = ultima_rodada()
        if r and (not antes or r['databaseId'] != antes['databaseId']): break
    else:
        raise SystemExit('a rodada não apareceu')
    rid = str(r['databaseId'])
    subprocess.run(['gh', 'run', 'watch', rid, '-R', REPO, '--exit-status'], check=True, capture_output=True)
    pasta = os.path.join(RAIZ, 'work', 'relatorios', time.strftime('%Y%m%d-%H%M'))
    gh('run', 'download', rid, '-R', REPO, '-n', 'leitura-teste', '-D', pasta)
    print(open(os.path.join(pasta, 'RESUMO.md'), encoding='utf-8').read())
    print('guardado em', os.path.relpath(pasta, RAIZ))


if __name__ == '__main__':
    principal(sys.argv[1] if len(sys.argv) > 1 else '2')
