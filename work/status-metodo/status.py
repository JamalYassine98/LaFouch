#!/usr/bin/env python3
"""ESBOÇO (S435, 19/11) — status entre sessões sem conflito. NÃO está em uso ainda.
Estrutura (dentro de docs/status/):
  sessoes/<SESSAO>.md        só a própria sessão escreve (linha "agora" + arquivos marcados + últimas)
  fila/<NN>-<assunto>.md     um item da Fila por arquivo (estado na 1ª linha)
  recados/para-<SESSAO>/<data>-<de>.md   recado; quem LÊ apaga (ou marca lido)
  ../STATUS.md               MONTADO por este comando (ninguém edita à mão)
Comandos:
  status.py ler   <SESSAO>                       mostra quem está em quê, a fila e os SEUS recados
  status.py comeco <SESSAO> "assunto" arq1 arq2  marca o que vai mexer (avisa se outra sessão marcou)
  status.py fim   <SESSAO> "resumo"              tira a marca, anota em 'últimas', monta o STATUS.md
  status.py recado <DE> <PARA> "texto"           deixa recado
  status.py lido  <SESSAO>                       apaga os recados lidos
Cada comando: git fetch + rebase antes; commit + push depois (tenta de novo se der conflito).
O 'fim' é BARRADO se houver recado para a sessão que ela não leu, ou se um arquivo dela estiver marcado por outra."""
import sys,os,glob,time,json,subprocess
RAIZ=os.environ.get('LF_RAIZ','/home/claude/lafouch');D=os.path.join(RAIZ,'docs','status');GIT=os.environ.get('LF_GIT','1')=='1'
def git(*a):
  if GIT: return subprocess.run(['git','-C',RAIZ]+list(a),capture_output=True,text=True)
def puxa():
  if not GIT: return
  git('fetch','-q','--depth=20','origin','main');r=git('rebase','-q','origin/main')
  if r and r.returncode: git('rebase','--abort');git('fetch','-q','--depth=200','origin','main');git('rebase','-q','origin/main')
def envia(msg):
  monta()
  if not GIT: return
  git('add','docs/status','docs/STATUS.md');git('commit','-qm',msg)
  for _ in range(4):
    if git('push','-q','origin','HEAD:main').returncode==0: return
    puxa();monta();git('add','docs/STATUS.md');git('commit','-qm','status: montado de novo')
def le(p):
  try: return open(p,encoding='utf-8').read()
  except: return ''
def sess(n):
  p=os.path.join(D,'sessoes',n+'.json')
  try: return json.load(open(p))
  except: return {'nome':n,'agora':'','arquivos':[],'ultimas':[]}
def grava(n,o):
  os.makedirs(os.path.join(D,'sessoes'),exist_ok=True);json.dump(o,open(os.path.join(D,'sessoes',n+'.json'),'w'),ensure_ascii=False,indent=1)
def todas(): return [os.path.basename(p)[:-5] for p in sorted(glob.glob(os.path.join(D,'sessoes','*.json')))]
def recados(n): return sorted(glob.glob(os.path.join(D,'recados','para-'+n,'*.md')))
def marcados(menos):
  m={}
  for s in todas():
    if s==menos: continue
    for a in sess(s)['arquivos']: m[a]=s
  return m
def monta():
  L=['# STATUS — MONTADO AUTOMATICAMENTE por tools/status.py (não editar à mão)','','## Em andamento','','| Sessão | Agora | Arquivos marcados |','|---|---|---|']
  for s in todas():
    o=sess(s)
    if o['agora']: L.append('| %s | %s | %s |'%(s,o['agora'],', '.join(o['arquivos']) or '—'))
  L+=['','## Fila','']
  for p in sorted(glob.glob(os.path.join(D,'fila','*.md'))): L.append('- **%s** — %s'%(os.path.basename(p)[:-3],le(p).split('\n')[0]))
  L+=['','## Recados esperando','']
  for p in sorted(glob.glob(os.path.join(D,'recados','para-*','*.md'))): L.append('- para **%s**: %s'%(p.split('para-')[1].split('/')[0],le(p).split('\n')[0][:160]))
  ult=[]
  for s in todas(): ult+=[(u['t'],s,u['r']) for u in sess(s)['ultimas']]
  L+=['','## Últimas mudanças (todas as sessões, mais nova em cima)','']+['- %s — %s: %s'%(time.strftime('%d/%m %H:%M',time.localtime(t)),s,r) for t,s,r in sorted(ult,reverse=True)[:25]]
  open(os.path.join(RAIZ,'docs','STATUS.md'),'w',encoding='utf-8').write('\n'.join(L)+'\n')
def main(a):
  c=a[0];puxa()
  if c=='ler':
    n=a[1];print('== Em andamento ==')
    for s in todas():
      o=sess(s)
      if o['agora']: print(' %-22s %s  [%s]'%(s,o['agora'],', '.join(o['arquivos'])))
    print('== Fila ==')
    for p in sorted(glob.glob(os.path.join(D,'fila','*.md'))): print(' ',os.path.basename(p)[:-3],'—',le(p).split('\n')[0][:100])
    r=recados(n);print('== Recados para %s: %d =='%(n,len(r)))
    for p in r: print(' *',le(p).strip()[:300])
    o=sess(n);o['leu']=time.time();grava(n,o);return 0
  if c=='comeco':
    n,ass,arqs=a[1],a[2],a[3:];m=marcados(n);bate=[x for x in arqs if x in m]
    if bate: print('PARE: já marcado por outra sessão:',', '.join('%s (%s)'%(x,m[x]) for x in bate));return 2
    o=sess(n);o['agora']=ass;o['arquivos']=arqs;grava(n,o);envia('status: %s começa %s'%(n,ass));print('ok, marcado');return 0
  if c=='fim':
    n,res=a[1],a[2];o=sess(n);r=recados(n)
    if r and o.get('leu',0)<max(os.path.getmtime(p) for p in r): print('BARRADO: há %d recado(s) para %s que ainda não foram lidos. Rode: status.py ler %s'%(len(r),n,n));return 3
    o['ultimas']=([{'t':time.time(),'r':res}]+o['ultimas'])[:10];o['agora']='';o['arquivos']=[];grava(n,o);envia('status: %s terminou — %s'%(n,res));print('ok, anotado');return 0
  if c=='recado':
    de,para,t=a[1],a[2],a[3];d=os.path.join(D,'recados','para-'+para);os.makedirs(d,exist_ok=True)
    open(os.path.join(d,time.strftime('%Y%m%d-%H%M%S')+'-'+de+'.md'),'w').write(t+'\n\n— de '+de+'\n');envia('status: recado de %s para %s'%(de,para));print('ok, recado deixado');return 0
  if c=='lido':
    for p in recados(a[1]): os.remove(p)
    envia('status: %s leu os recados'%a[1]);print('ok');return 0
if __name__=='__main__': sys.exit(main(sys.argv[1:]) or 0)
