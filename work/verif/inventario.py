# Monta a MEMÓRIA DAS TELAS a partir de inv/<modo>/*.json  ->  docs/INVENTARIO-<MODO>.md + inv/<modo>/familias.json
# Rodar depois da passada (ou depois de atualizar só as telas mexidas).  Uso: python3 inventario.py atual|aprov
import json,glob,os,re,sys,collections
M=sys.argv[1];D='/home/claude/lafouch/work/verif/inv/%s/'%M
T={os.path.basename(f)[:-5]:json.load(open(f)) for f in sorted(glob.glob(D+'*.json')) if not f.endswith('familias.json')}
def funcao(b):
  ef=' '.join(b.get('efeito',[]))
  if 'pede confirmação' in ef: return 'perigo (pede confirmação)'
  if 'abre janela' in ef: return 'abre janela'
  if 'leva →' in ef: return 'leva a outra tela'
  if 'alterna' in ef: return 'liga/desliga ou escolhe'
  if 'muda a tela' in ef: return 'abre/mexe no lugar'
  if 'aviso' in ef: return 'faz e avisa'
  return 'sem efeito visível'
def familia(b,look):
  t=b['txt']
  if b['tag']=='BUTTON' and b['id'] in ('inicio','vendas','ajustes','g:pecas','g:din') : return 'barra de baixo'
  if t.startswith('+') or re.match(r'^(Adicionar|Novo|Nova)\b',t): return 'adicionar'
  if re.match(r'^(Salvar|Confirmar|Conferir|Registrar|Finalizar|Criar|Enviar|Cobrar|Gerar|Aplicar|Continuar)\b',t): return 'principal (salvar/confirmar)'
  if re.search(r'(Excluir|Apagar|Remover|Lixeira|Desfazer|Cancelar venda)',t,re.I): return 'perigo/desfazer'
  if t in ('Fechar','×','✕','Voltar','‹') or t.startswith('‹'): return 'fechar/voltar'
  if t.endswith('›'): return 'link › (sai daqui)'
  if t.endswith('⌄'): return 'link ⌄ (abre no lugar)'
  if look and look.get('cara','').startswith('ícone'): return 'ícone'
  if (look and look.get('cara')=='barra grande') or (len(t)>25 and re.search(r'\d',t)): return 'linha de lista'
  if look and look.get('cara')=='pílula': return 'opção/pílula'
  return 'texto/linha tocável'
F=collections.defaultdict(list);bugs=[];alin={};campos=collections.defaultdict(list);rola=[]
for n,d in T.items():
  E=d.get('escuro',{});looks={x['t']:x for x in E.get('botoes',[])}
  for b in d.get('toques',[]):
    if 'igual_a' in b: continue
    lk=looks.get(b['txt']);fam=familia(b,lk)
    F[fam].append({'tela':n,'act':b.get('act',''),'txt':b['txt'],'faz':funcao(b),'efeito':b.get('efeito'),'cara':(lk or {}).get('cara'),'cor':(lk or {}).get('cor'),'fs':(lk or {}).get('fs'),'h':(lk or {}).get('h')})
    for g in b.get('bug',[]): bugs.append((n,b['txt'],g,b.get('efeito'),b.get('de_novo')))
  for k in ('escuro','claro'):
    a=d.get(k,{}).get('alin',[])
    if a: alin[(n,k)]=a
  for c in E.get('campos',[]): campos[c['cara']].append((n,c['lab'] or c['ph']))
  if E.get('rola_vazio',0)>0 and E.get('rola_vazio',0)<40: rola.append((n,E['rola_vazio']))
REG=collections.defaultdict(list)
for fam,L in F.items():
  for x in L:
    t,faz,cara=x['txt'],x['faz'],x['cara'] or ''
    if t.endswith('›') and faz in ('abre/mexe no lugar','sem efeito visível','liga/desliga ou escolhe'): REG['"›" tem que sair (outra tela ou janela) — este abre no lugar'].append(x)
    if t.endswith('⌄') and faz in ('abre janela','leva a outra tela') and float((x['fs'] or '0px')[:-2])>=24: REG['título "⌄" abre janela de troca (perguntar ao dono se é exceção)'].append(x)
    elif t.endswith('⌄') and faz in ('abre janela','leva a outra tela'): REG['"⌄" tem que abrir no lugar — este sai'].append(x)
    if fam=='linha de lista' and faz in ('leva a outra tela','abre janela') and '›' not in t: REG['linha que sai sem "›"'].append(x)
    if cara=='ícone quadrado': REG['ícone quadrado (aprovado: redondo, 137a)'].append(x)
    if fam=='fechar/voltar' and t in ('Fechar','×','✕'): REG['"Fechar"/"×" em janela (P6: fecha arrastando)'].append(x)
    if fam=='adicionar' and cara not in ('ícone redondo','texto'): REG['adicionar fora do padrão (P1 "+" redondo / grupo "+" em texto)'].append(x)
    if faz=='sem efeito visível' and fam not in ('barra de baixo',) and t not in ('−','+','-'):
      if M=='aprov' and not x.get('act'): REG['botão só desenhado no esboço (ganha função ao implementar)'].append(x)
      else: REG['toque sem efeito visível (conferir à mão)'].append(x)
for k,v in campos.items():
  if k!='linha':
    for n,l in v: REG['campo em %s (P3: linha fina)'%k].append({'tela':n,'txt':l,'cara':k,'fs':'','faz':''})
fora=collections.defaultdict(list)
for fam,L in F.items():
  sig=lambda x:(x['cara'],x['fs'],x['faz'])
  c=collections.Counter(sig(x) for x in L)
  if not c: continue
  maior=c.most_common(1)[0][0]
  for x in L:
    if sig(x)!=maior: fora[fam].append(x)
json.dump({'regras':REG,'familias':F,'fora':fora,'bugs':bugs,'campos':campos},open(D+'familias.json','w'),ensure_ascii=False,indent=0)
nome={'atual':'APP ATUAL (o que está no ar)','aprov':'APROVADOS (app + última versão aprovada de cada tela)'}[M]
o=['# INVENTÁRIO — %s'%nome,'','Memória das telas (regra do dono 18/11 22:59). Gerado por work/verif/passada.py + inventario.py. Atualizar só a tela que mudou: `MODO=%s SO=<tela> python3 passada.py && python3 inventario.py %s`.'%(M,M),'',
   'Telas: %d · botões tocados (3x cada): %d · fotos: work/verif/inv/%s/img'%(len(T),sum(len(v) for v in F.values()),M),'']
o+=['## Famílias de botões','','| Família | Qtd | Cara mais comum | Fogem do padrão |','|---|---|---|---|']
for fam,L in sorted(F.items(),key=lambda x:-len(x[1])):
  c=collections.Counter((x['cara'],x['fs'],x['faz']) for x in L).most_common(1)[0][0]
  o.append('| %s | %d | %s · %s · %s | %d |'%(fam,len(L),c[0],c[1],c[2],len(fora.get(fam,[]))))
o+=['','## Regras quebradas (por regra)','']
for r,L in sorted(REG.items(),key=lambda x:-len(x[1])):
  o.append('**%s** — %d'%(r,len(L)))
  for x in L: o.append('- %s · "%s" · %s · %s'%(x['tela'],x['txt'][:35],x['cara'],x['faz']))
  o.append('')
o+=['','## O que foge da família (tela · botão · cara · faz)','']
for fam,L in fora.items():
  o.append('**%s**'%fam)
  for x in L: o.append('- %s · "%s" · %s %s · %s'%(x['tela'],x['txt'][:35],x['cara'],x['fs'],x['faz']))
  o.append('')
o+=['## Campos de escrever','']+['- **%s**: %d — %s'%(k,len(v),', '.join(sorted(set(t for t,_ in v)))[:400]) for k,v in campos.items()]
o+=['','## Possíveis bugs ao tocar várias vezes','']+['- %s · "%s" · %s · 1º %s · de novo %s'%(n,t[:30],g,e,dn) for n,t,g,e,dn in bugs]
o+=['','## Alinhamento (alin2) por tela','']+['- %s (%s): %d — %s'%(n,k,len(a),'; '.join(sorted(set(x['r'] for x in a)))[:200]) for (n,k),a in sorted(alin.items())]
o+=['','## Rola sem ter o que rolar','']+['- %s: %d px'%x for x in rola]
open('/home/claude/lafouch/docs/INVENTARIO-%s.md'%('ATUAL' if M=='atual' else 'APROVADOS'),'w').write('\n'.join(o)+'\n')
print({k:len(v) for k,v in REG.items()});print(len(T),'telas',{k:len(v) for k,v in F.items()},'fora',sum(len(v) for v in fora.values()),'bugs',len(bugs))
