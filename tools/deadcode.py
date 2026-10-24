#!/usr/bin/env python3
"""Lista funções declaradas em src/*.js que ninguém mais usa (nem src, nem testes, nem HTML).
Uso: python3 tools/deadcode.py   (rodar da raiz do repositório)"""
import re, glob
src = {f: open(f).read() for f in sorted(glob.glob('src/*.js'))}
tudo = '\n'.join(src.values()) + open('tests/run.py').read() + open('www/index.html').read()
achou = 0
for f, t in src.items():
    for m in re.finditer(r'^\s*function (\w+)\(', t, re.M):
        if len(re.findall(r'\b' + m.group(1) + r'\b', tudo)) <= 1:
            print(f, m.group(1)); achou += 1
print('Nenhuma função morta.' if not achou else '%d função(ões) sem uso.' % achou)
