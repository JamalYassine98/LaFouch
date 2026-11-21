#!/usr/bin/env python3
"""Status entre sessões sem conflito (aprovado pelo dono 19/11 23:28; em uso desde 19/11 23:50).
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
  status.py fila  <SESSAO> <NN-assunto> "estado" ["descrição"]   cria/atualiza item da Fila
SESSÕES: APP (APP · implementa, S436) · SITE (SITE · implementa, S429) · NUVEM (NUVEM · implementa) · ESBOCO (Esboço · famílias, S435); 'todas' = recado para todas.
Cada comando: git fetch + rebase antes; commit + push depois (tenta de novo se der conflito).\nSe não der para juntar ou enviar, PARA com 'PAROU:' e sai com código 2 (nunca fica pela metade nem em silêncio).
O 'fim' é BARRADO se houver recado para a sessão que ela não leu, ou se um arquivo dela estiver marcado por outra."""
import sys,os,glob,time,json,subprocess
RAIZ=os.environ.get('LF_RAIZ','/home/claude/lafouch');D=os.path.join(RAIZ,'docs','status');GIT=os.environ.get('LF_GIT','1')=='1'
def git(*a):
  if GIT: return subprocess.run(['git','-C',RAIZ]+list(a),capture_output=True,text=True)
class Para(Exception): pass
def puxa():
  """Um só caminho (conserto 20/11, recado SITE 01:20 + commits da S435 que ficaram só no aparelho):
  busca funda o bastante para achar o ponto comum, rebase guardando o que está solto (autostash);
  se o rebase não fecha, DESFAZ e PARA avisando — nunca commita no meio de um rebase."""
  if not GIT: return
  git('config','merge.ours.driver','true')  # docs/STATUS.md é montado: no conflito fica qualquer lado e é montado de novo
  if os.path.exists(os.path.join(RAIZ,'.git','shallow')): git('fetch','-q','--unshallow','origin','main')
  git('fetch','-q','origin','main')
  encolheu()
  r=git('rebase','-q','--autostash','origin/main')
  if r.returncode:
    git('rebase','--abort')
    raise Para('não consegui juntar com o main (conflito em: %s). Nada foi enviado. Resolva o conflito e rode de novo.'%(git('diff','--name-only','--diff-filter=U').stdout.strip() or (r.stderr or r.stdout).strip()[:200]))
SO_CRESCE=('docs/MEMORIA-PROJETO.md','docs/FALTA-APROVAR-15-11.md')
def encolheu():
  """Trava (20/11, depois de dois commits regravarem a memória e a lista viva só com a linha nova — 1,3 MB sumiram do arquivo):
  esses textos só crescem (CLAUDE.md regra 8). Se a cópia deste aparelho (guardada ou solta) ficou menor que a do main, PARA antes de juntar/enviar."""
  for f in SO_CRESCE:
    o=git('cat-file','-s','origin/main:'+f)
    if o.returncode: continue
    main=int(o.stdout.strip() or 0);h=git('cat-file','-s','HEAD:'+f);aqui=int(h.stdout.strip() or 0) if h.returncode==0 else main
    try: solto=os.path.getsize(os.path.join(RAIZ,f))
    except OSError: solto=aqui
    base=git('merge-base','HEAD','origin/main').stdout.strip();b=git('cat-file','-s',base+':'+f) if base else None
    antes=int(b.stdout.strip() or 0) if b is not None and b.returncode==0 else 0
    if min(aqui,solto)<antes*0.9: raise Para('%s ENCOLHEU neste aparelho (%d → %d bytes). Esse arquivo só cresce: acrescente no fim, nunca regrave. Recupere com: git checkout origin/main -- %s  e acrescente de novo a sua linha.'%(f,antes,min(aqui,solto),f))
def envia(msg):
  monta()
  if not GIT: return
  git('add','docs/status','docs/STATUS.md');git('commit','-qm',msg)
  for _ in range(4):
    if git('push','-q','origin','HEAD:main').returncode==0: return
    puxa();monta();git('add','docs/STATUS.md');git('commit','-qm','status: montado de novo')
  raise Para('o envio falhou 4 vezes: o status ficou SÓ neste aparelho. Rode o comando de novo.')
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
def recados(n): return sorted(glob.glob(os.path.join(D,'recados','para-'+n,'*.md')))+sorted(p for p in glob.glob(os.path.join(D,'recados','para-todas','*.md')) if n not in le(p+'.lido').split())
def marcados(menos):
  m={}
  for s in todas():
    if s==menos: continue
    for a in sess(s)['arquivos']: m[a]=s
  return m
def monta():
  L=['# STATUS — MONTADO AUTOMATICAMENTE por tools/status.py (NÃO editar à mão)','',le(os.path.join(D,'cabecalho.md')).strip(),'','## Em andamento','','| Sessão | Agora | Arquivos marcados |','|---|---|---|']
  for s in todas():
    o=sess(s)
    if o['agora']: L.append('| %s | %s | %s |'%(s,o['agora'],', '.join(o['arquivos']) or '—'))
  L+=['','## Fila','']
  for p in sorted(glob.glob(os.path.join(D,'fila','*.md'))): L.append('- **%s** — %s'%(os.path.basename(p)[:-3],le(p).split('\n')[0]))
  L+=['','## Recados esperando','']
  for p in sorted(glob.glob(os.path.join(D,'recados','para-*','*.md'))): L.append('- para **%s**: %s'%(p.split('para-')[1].split('/')[0],le(p).split('\n')[0][:160]))
  L+=['','Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md','']
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
  if c=='fila':
    # status.py fila <SESSAO> <NN-assunto> "estado" ["descrição"]  — cria ou atualiza um item (1ª linha = estado)
    n,nome,est=a[1],a[2],a[3];os.makedirs(os.path.join(D,'fila'),exist_ok=True);f=os.path.join(D,'fila',nome+'.md');ant=le(f).split('\n',1)
    desc=a[4] if len(a)>4 else (ant[1] if len(ant)>1 else '')
    open(f,'w',encoding='utf-8').write(est+'\n'+desc.strip()+'\n');envia('status: fila %s — %s (%s)'%(nome,est[:60],n));print('ok, fila atualizada');return 0
  if c=='lido':
    for p in recados(a[1]):
      if '/para-todas/' in p: open(p+'.lido','a').write(a[1]+'\n')
      else: os.remove(p)
    envia('status: %s leu os recados'%a[1]);print('ok');return 0
if __name__=='__main__':
  try: sys.exit(main(sys.argv[1:]) or 0)
  except Para as e: print('PAROU:',e);sys.exit(2)
