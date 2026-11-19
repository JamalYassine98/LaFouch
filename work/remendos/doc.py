import json,collections,re,os
exec(open('varre.py').read().split("decl=collections")[0])
R=json.load(open('inv.json'))
decl=collections.defaultdict(list)
for f in fs:
  for i,l in enumerate(open(os.path.join(SRC,f),encoding='utf-8').read().split('\n'),1):
    m=re.match(r'^\s{2}function ([A-Za-z_$][\w$]*)\s*\(',l)
    if m: decl[m.group(1)].append((f,i))
cad=collections.defaultdict(list)
for n,f,i in R['reat_dec']: cad[n].append((f,i))
out=['# Inventário dos remendos do APP (S435 · 19/11/2026 20:55)','','Pedido do dono (20:53, "Sim"): listar o que é remendo em cima de remendo, família por família, com o que substituir e o que apagar. Só leitura — nada foi mexido. Gerado por `work/remendos/varre.py` + `doc.py` (rodar de novo para atualizar).','',
'## Números de hoje','','| O quê | Quantos |','|---|---|',
'| Funções **declaradas** e depois **reescritas** em outro arquivo (a última ganha) | %d reescritas em %d funções |'%(len(R['reat_dec']),len(cad)),
'| Ações `ACT.x` escritas em 2+ lugares | %d ações |'%len(R['dupact']),
'| "Embrulhos" `var _x = x;` (guarda a velha para chamar dentro da nova) | %d |'%len(R['wraps']),
'| Arquivos `98z…`/`99…` (correções de arquivos anteriores) | %d |'%len(R['arqs98']),
'| Tocos (função vazia deixada no lugar) | %d |'%len(R['stub']),
'| Estilo: `!important` | %d em %d linhas |'%(R['css']['imp'],R['css']['lin']),
'| Estilo: seletores escritos 3+ vezes | %d |'%R['css']['dupsel'],'',
'## Como limpar (regra 12 a–e) — vale para cada linha abaixo','',
'1. Juntar as versões da função/ação numa só, **no arquivo da família**, com o comportamento que vale HOJE (a última da cadeia + o que ela chama das anteriores).','2. Apagar as versões antigas e os `var _x` no mesmo commit.','3. Provar que a tela ficou igual: inventário 1 (antes) = inventário 1 (depois) nas telas da família (work/verif/passada.py) + `python3 tests/run.py`.','4. Trava no porteiro (abaixo) para não voltar.','',
'## Por família (ordem sugerida: a que tem mais remendo primeiro)','']
FAMR=collections.defaultdict(list)
for n,v in cad.items():
  d=decl.get(n,[('?',0)])[0];FAMR[fam(d[0])].append(('função',n,d,v))
for n,v in R['dupact'].items():
  FAMR[fam(v[0][0])].append(('ação',n,tuple(v[0]),[tuple(x) for x in v[1:]]))
for F,L in sorted(FAMR.items(),key=lambda x:-len(x[1])):
  out.append('### %s — %d'%(F,len(L)));out.append('');out.append('| Tipo | Nome | Original | Reescrita em (a última vale) |');out.append('|---|---|---|---|')
  for t,n,d,v in sorted(L,key=lambda x:x[1]):
    out.append('| %s | `%s` | %s:%s | %s |'%(t,n,d[0],d[1],' → '.join('%s:%s'%(a,b) for a,b in v)))
  out.append('')
out+=['## Arquivos só de correção (98z / 99)','',', '.join('`%s`'%f for f in R['arqs98']),'','Cada um deve sumir quando a sua família for limpa: o conteúdo certo vai para o arquivo da família e o resto sai.','',
'## Tocos','']+['- `%s:%s` — %s'%(f,i,t.replace('|','/')) for f,i,t in R['stub']]+['',
'## Estilo (www/style.css) — seletores escritos mais vezes','','| Seletor | Vezes |','|---|---|']+['| `%s` | %d |'%(s.replace('|','/')[:80],n) for s,n in R['css']['top']]+['',
'## Trava proposta no porteiro (para TODAS as sessões)','','Um teste novo no `tests/run.py` que **reprova a publicação** se, em relação ao commit anterior:','- aparecer um `var _x = x;` novo ou uma função declarada sendo reescrita em outro arquivo;','- uma ação `ACT.x` passar a existir em mais de um lugar;','- o número de `!important` ou de seletores repetidos subir.','Enquanto a limpeza não termina, o teste guarda os números de hoje como teto e só deixa **descer**.','',
'## Site','','O site tem o mesmo problema; a SITE · implementa já está limpando os estilos na cópia limpa (ramo `limpo`, S430 "medidor de cascata"). Este inventário é só do APP.','']
open('/home/claude/lafouch/docs/INVENTARIO-REMENDOS.md','w').write('\n'.join(out));print(len(out))
