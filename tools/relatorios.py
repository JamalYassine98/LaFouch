#!/usr/bin/env python3
"""Sessões: traz os relatórios de erro e a lista de envios do projeto de TESTE (28/11/2026, Fase 3).

  python3 tools/relatorios.py [dias]     → roda o workflow ler-teste.yml, espera e baixa em work/relatorios/<data-hora>/
Nada fica no repositório (work/relatorios/ está no .gitignore). Só lê o projeto lafouch-teste.
"""
import io, json, os, subprocess, sys, time, zipfile

REPO = 'JamalYassine98/LaFouch'
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def gh(*a):
    """Só a API REST do GitHub (gh api): funciona nas sessões, que não têm o GraphQL."""
    return subprocess.run(['gh', 'api', *a], check=True, capture_output=True).stdout


def rodadas():
    return json.loads(gh('repos/%s/actions/workflows/ler-teste.yml/runs?per_page=1' % REPO))['workflow_runs']


def principal(dias):
    antes = [r['id'] for r in rodadas()]
    gh('-X', 'POST', 'repos/%s/actions/workflows/ler-teste.yml/dispatches' % REPO, '-f', 'ref=main', '-f', 'inputs[dias]=%s' % dias)
    r = None
    for _ in range(120):
        time.sleep(5)
        lista = rodadas()
        if lista and lista[0]['id'] not in antes:
            r = lista[0]
            if r['status'] == 'completed': break
    if not r or r['status'] != 'completed': raise SystemExit('a rodada não terminou em 10 min')
    if r['conclusion'] != 'success': raise SystemExit('a leitura falhou: ' + r['html_url'])
    art = [x for x in json.loads(gh('repos/%s/actions/runs/%s/artifacts' % (REPO, r['id'])))['artifacts'] if x['name'] == 'leitura-teste'][0]
    pasta = os.path.join(RAIZ, 'work', 'relatorios', time.strftime('%Y%m%d-%H%M'))
    os.makedirs(pasta, exist_ok=True)
    zipfile.ZipFile(io.BytesIO(gh('repos/%s/actions/artifacts/%s/zip' % (REPO, art['id'])))).extractall(pasta)
    print(open(os.path.join(pasta, 'RESUMO.md'), encoding='utf-8').read())
    print('guardado em', os.path.relpath(pasta, RAIZ))


if __name__ == '__main__':
    principal(sys.argv[1] if len(sys.argv) > 1 else '2')
