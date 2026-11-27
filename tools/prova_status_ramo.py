#!/usr/bin/env python3
"""Trava (regra 12e) do conserto de 26/11: o status rodado num ramo NUNCA publica o commit do ramo no main.
Monta um repositório de brinquedo (main + ramo com um commit), roda 'status.py fila' no ramo e confere o main."""
import os, subprocess, tempfile, shutil, sys
T = tempfile.mkdtemp(); g = lambda *a, c=None: subprocess.run(['git'] + list(a), cwd=c or T, capture_output=True, text=True)
g('init', '-q', '--bare', 'o.git'); g('clone', '-q', 'o.git', 'w'); W = os.path.join(T, 'w')
g('checkout', '-qb', 'main', c=W)
for d in ('docs/status/sessoes', 'docs/status/fila', 'docs/status/recados', 'tools'): os.makedirs(os.path.join(W, d))
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'status.py'), os.path.join(W, 'tools'))
for f in ('docs/MEMORIA-PROJETO.md', 'docs/FALTA-APROVAR-15-11.md'): open(os.path.join(W, f), 'w').write('x\n')
g('add', '-A', c=W); g('-c', 'user.email=a@b', '-c', 'user.name=p', 'commit', '-qm', 'base', c=W); g('push', '-q', 'origin', 'main', c=W)
g('checkout', '-qb', 'ramo', c=W); open(os.path.join(W, 'codigo.txt'), 'w').write('novo\n')
g('add', 'codigo.txt', c=W); g('-c', 'user.email=a@b', '-c', 'user.name=p', 'commit', '-qm', 'commit do ramo', c=W)
r = subprocess.run([sys.executable, os.path.join(W, 'tools', 'status.py'), 'fila', 'ESBOCO', '99-teste', 'estado'], env=dict(os.environ, LF_RAIZ=W), capture_output=True, text=True)
main = g('ls-tree', '-r', '--name-only', 'main', c=os.path.join(T, 'o.git')).stdout.split()
ok = 'codigo.txt' not in main and 'docs/status/fila/99-teste.md' in main and g('log', '-1', '--format=%s', 'ramo', c=W).stdout.strip() == 'commit do ramo'
print('ok — status no ramo não publica o ramo' if ok else 'FALHOU: ' + r.stdout + r.stderr + ' main=' + ' '.join(main)); sys.exit(0 if ok else 1)
