#!/usr/bin/env python3
"""Trava do tools/status.py (conserto 20/11): roda em repositórios de teste em /tmp, nunca no projeto.
1 duas sessões acrescentam na lista viva ao mesmo tempo → junta os dois lados e envia
2 arquivo mexido e não guardado na sessão → envia mesmo assim e o arquivo continua mexido
3 conflito de verdade → PAROU (código 2), sem rebase pela metade e sem commit perdido
4 cópia rasa (depth 1) atrás de muitos commits → acha o ponto comum e envia
5 lista viva ou memória regravada (encolheu) → PAROU antes de enviar"""
import os,subprocess,tempfile,shutil,sys
ST=os.path.join(os.path.dirname(os.path.abspath(__file__)),'status.py')
GA=open(os.path.join(os.path.dirname(ST),'..','.gitattributes')).read()
def sh(c,cwd): return subprocess.run(c,cwd=cwd,shell=True,capture_output=True,text=True)
def st(raiz,*a): return subprocess.run([sys.executable,ST]+list(a),capture_output=True,text=True,env=dict(os.environ,LF_RAIZ=raiz,LF_GIT='1'))
def clone(o,d,extra=''):
  sh('git clone -q %s file://%s %s'%(extra,o,d),'/');sh('git config user.email t@t; git config user.name t',d);return d
falhas=[]
def ok(c,m):
  print(('ok   ' if c else 'FALHA ')+m)
  if not c: falhas.append(m)
T=tempfile.mkdtemp();O=T+'/o.git';sh('git init -q --bare -b main '+O,'/')
A=T+'/a';os.makedirs(A+'/docs/status/sessoes');sh('git init -q -b main',A);sh('git config user.email t@t; git config user.name t',A)
open(A+'/.gitattributes','w').write(GA);open(A+'/docs/FALTA-APROVAR-15-11.md','w').write('# lista\n');open(A+'/x.txt','w').write('base\n');open(A+'/docs/status/cabecalho.md','w').write('c\n')
sh('git add -A; git commit -qm base; git remote add origin file://'+O+'; git push -q origin main',A)
B=clone(O,T+'/b')
# 1
open(A+'/docs/FALTA-APROVAR-15-11.md','a').write('- da A\n');sh('git commit -qam A',A)
open(B+'/docs/FALTA-APROVAR-15-11.md','a').write('- da B\n');sh('git commit -qam B',B)
r1=st(A,'recado','APP','ESBOCO','um');r2=st(B,'recado','APP','ESBOCO','dois')
sh('git fetch -q origin',A);t=sh('git show origin/main:docs/FALTA-APROVAR-15-11.md',A).stdout
ok(r1.returncode==0 and r2.returncode==0 and '- da A' in t and '- da B' in t and '<<<<' not in t,'1 lista viva junta os dois lados')
# 2
open(B+'/x.txt','a').write('solto\n');open(A+'/docs/FALTA-APROVAR-15-11.md','a').write('- A2\n');sh('git commit -qam A2; git push -q origin main',A)
r=st(B,'recado','APP','ESBOCO','tres');ok(r.returncode==0 and 'solto' in open(B+'/x.txt').read() and sh('git status --porcelain x.txt',B).stdout.strip().startswith('M'),'2 arquivo solto não impede o envio e continua mexido')
# 3
sh('git checkout -q x.txt',B);st(B,'ler','APP')
sh('git pull -q --rebase origin main',A);open(A+'/x.txt','w').write('A mudou\n');sh('git commit -qam xa; git push -q origin main',A)
open(B+'/x.txt','w').write('B mudou\n');sh('git commit -qam xb',B);meu=sh('git rev-parse HEAD',B).stdout.strip()
r=st(B,'recado','APP','ESBOCO','quatro')
meio=os.path.exists(B+'/.git/rebase-merge') or os.path.exists(B+'/.git/rebase-apply')
ok(r.returncode==2 and 'PAROU' in r.stdout and not meio and sh('git merge-base --is-ancestor %s HEAD'%meu,B).returncode==0,'3 conflito de verdade para avisando, sem rebase pela metade, commit guardado')
# 4
C=clone(O,T+'/c','--depth=1')
for i in range(30): open(A+'/docs/FALTA-APROVAR-15-11.md','a').write('- %d\n'%i);sh('git commit -qam n%d'%i,A)
sh('git pull -q --rebase origin main; git push -q origin main',A)
open(C+'/docs/FALTA-APROVAR-15-11.md','a').write('- da C\n');sh('git commit -qam C',C)
r=st(C,'recado','APP','ESBOCO','cinco');sh('git fetch -q origin',A)
ok(r.returncode==0 and '- da C' in sh('git show origin/main:docs/FALTA-APROVAR-15-11.md',A).stdout,'4 cópia rasa acha o ponto comum e envia')
# 5 (20/11): quem regrava a lista viva só com a linha nova (o arquivo encolhe) é PARADO antes de enviar; a lista do main fica inteira
E=clone(O,T+'/e');n0=len(sh('git show origin/main:docs/FALTA-APROVAR-15-11.md',E).stdout)
open(E+'/docs/FALTA-APROVAR-15-11.md','w').write('- só a linha nova\n');sh('git commit -qam E',E)
r=st(E,'recado','APP','ESBOCO','seis');sh('git fetch -q origin',A)
ok(r.returncode==2 and 'ENCOLHEU' in (r.stdout+r.stderr) and len(sh('git show origin/main:docs/FALTA-APROVAR-15-11.md',A).stdout)>=n0,'5 lista viva regravada (encolheu) → PAROU e o main fica inteiro')
shutil.rmtree(T)
print('FALHAS:',len(falhas));sys.exit(1 if falhas else 0)
