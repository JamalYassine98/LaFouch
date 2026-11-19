# Famílias de botões (proposta S435, 19/11/2026) — lê SÓ o inventário (work/verif/inv/<modo>) e põe cada botão numa família.
# Uso: python3 familias2.py atual|aprov  → docs/FAMILIAS-BOTOES[-APROVADOS].md + inv/<modo>/familias2.json
import json,glob,os,re,sys,collections
M=sys.argv[1] if len(sys.argv)>1 else 'atual'
D='/home/claude/lafouch/work/verif/inv/%s/'%M
FAM=[ # (id, nome, regra aprovada que vale para a família)
 ('nav','Barra de baixo','5 abas; Início fixo'),
 ('volta','Voltar ‹','versalete "‹ ANTERIOR" acima do título (navegação B)'),
 ('sai','Link › (sai daqui)','texto + "›"; leva a outra tela ou abre a janela de baixo'),
 ('linha','Linha de lista que abre','linha fina, texto à esquerda, valor e "›" à direita'),
 ('dobra','Dobra ⌄ (abre no lugar)','linha com "⌄" na margem direita; abre empurrando o resto'),
 ('mais','Adicionar "+" redondo','"+" redondo ao lado do título (P1)'),
 ('maistx','"+" em texto','"+ Nova…" branco, sem sublinhado; à esquerda entre campos, centrado sozinho'),
 ('prin','Principal','um por janela/tela: contorno rosa, largura toda, 52 px'),
 ('sec','Secundário','contorno fino, mesma altura do principal'),
 ('perigo','Perigo','vermelho; pede confirmação (janela com "Voltar") ou faz e dá "Desfazer"'),
 ('desfaz','Desfazer','texto rosa no aviso de baixo / ao lado do item'),
 ('icone','Ícone redondo','círculo 44 px, contorno fino, ícone do conjunto único'),
 ('escolha','Escolha (abas / dois lados)','barra deslizante C; 2–3 opções = escolha de dois lados (P4)'),
 ('opcao','Opção de janela','linha da janela de baixo que escolhe (✓ na escolhida)'),
 ('passo','Passo − / +','par − / + redondo, mesmo tamanho'),
 ('chave','Liga / desliga','chave ou marcação; muda na hora'),
 ('valor','Número tocável','número que troca a moeda ou abre o filtro'),
 ('cartao','Cartão de peça','foto + nome + preço; abre a peça'),
 ('mostra','Mostrar mais','carrega mais itens no lugar'),
 ('titulo','Título (não é botão)','título não abre nada (navegação B) — não deveria ser tocável'),
 ('fechar','Fechar / ×','PROIBIDO em janela (P6): fecha arrastando/tocando fora'),
 ('?','Sem família (olhar)','')]
NOME={f[0]:f[1] for f in FAM}
A={ # ação do botão → família
 'nvVolta':'volta','cartvolta':'volta',
'cxmenu':'icone','hcal':'icone','hfopen':'icone','fichaAbre':'icone',
 'hopen':'linha','opendia':'linha','despAb':'linha','enAbre':'linha','abreRef':'linha','fjAbre':'linha','nvIr':'linha','x66':'linha','lcIrGiro':'linha','ataEnvLoj':'linha','ataVerTab':'linha','tabedit':'linha','guardAbre':'linha',
 'dfold':'dobra','d48Abre':'dobra','hSem':'dobra',
 'hfil':'escolha','fnTab':'escolha','ataAba':'escolha','dtab':'escolha','fluxod':'escolha','fjPer':'escolha','clinac':'escolha','fxModo':'escolha','totm':'escolha','trMoe':'escolha','rtMoe':'escolha',
 'dPerEsc':'opcao','cxabre':'opcao',
 'lcMenos':'passo','lcMais':'passo','cartmn':'passo','cartpl':'passo',
 'paTog':'chave','mcLiga':'chave','guardMudo':'chave','exppay':'chave',
 'd48Moeda':'valor','hmais':'mostra',
 'rtdes':'desfaz','trdesfaz':'desfaz',
 'impdel':'perigo','exprm':'perigo','cartrm':'perigo','cartclear':'perigo','notifLimpa':'perigo','hlimpar':'perigo',
 'ccfechar':'fechar','clifecha':'fechar',
 'despNova':'maistx','ataNovo':'maistx','ataLoteNovo':'maistx','cartclose':'maistx','expadd':'mais',
 'rtgo':'prin','ccgo':'prin','expsave':'prin','clisave':'prin','vitLug':'prin','obAdd':'prin','impadd':'prin','trocar':'prin','cartconf':'prin','lcPedir':'prin',
 'lcEnvia':'sec','pcUsaTodos':'sec','sitefxagora':'sec','cntCalc':'sec','cntEse':'sec','d48Troca':'sec','pcUsa':'sec','pcInforma':'sec','trflip':'sec','clinovo':'mais','temaVer':'sec',
}
TIT={'Dashboard','Giro','Reservas','Histórico','Caixa','Despesas','Câmbio','Preços','Inventário','Marketing','Clientes','Atacado','Site'}
NAVID={'inicio','vendas','ajustes','g:pecas','g:din','estoque','caixa'}
def fam(b):
  t=b['txt'].strip();a=b.get('act','')
  if a=='view': return 'icone' if len(t)<=3 else ('linha' if len(t)>22 else 'sai')
  if a in A: return A[a]
  if 'alterna' in ' '.join(b.get('efeito') or []) and b.get('tela_')=='ajustes': return 'dobra'
  if t in ('Lojista fixo não vence','Visitante vence em 3 dias'): return 'escolha'
  if t=='Registrar troca': return 'prin'
  if b.get('tag')=='BUTTON' and b.get('id') in NAVID and t in ('Início','Vender','Peças','Dinheiro','Caixa','Ajustes','Catálogo','Inventário'): return 'nav'
  ef=' '.join(b.get('efeito') or [])
  if t.startswith('‹') or t=='Voltar': return 'volta'
  if t in TIT and (b.get('fs','') or '0px')[:-2] and float(b['fs'][:-2])>=22: return 'titulo'
  if t in TIT and b.get('cara')=='texto' and ef in ('nada visível',''): return 'titulo'
  if t in ('Buscar com a câmera','Filtros e ordem','Compartilhar esta peça','Editar') or (b.get('cara','').startswith('ícone') and len(t)<3): return 'icone'
  if re.match(r'^(Óculos|Armação) ',t): return 'cartao'
  if t.startswith('Vender ·'): return 'prin'
  if re.match(r'^[A-ZÇÃÕÉÊ ()]+ ›? ?\d',t): return 'valor'
  if t in ('% Oferta','No site','Feito'): return 'chave'
  if t in ('Postar agora','Me lembra às 20h'): return 'sec'
  if a in ('tabsheet','pgrAjusta'): return 'sai'
  if t=='': return 'icone'
  if t in ('Ler haste','Foto','Chegou mercadoria','Preencher à mão'): return 'opcao'
  if t.startswith('Ver ') and re.search(r'\(\d+\)$',t): return 'sai'
  if 'alterna' in ef: return 'escolha' if len(t)<=24 else 'dobra'
  if t in ('×','✕','Fechar'): return 'fechar'
  if t in ('−','+','-'): return 'passo'
  if t.startswith('+ '): return 'maistx'
  if t=='Adicionar' or b.get('cara','').startswith('ícone') and '+' in t: return 'mais'
  if re.search(r'(Desfazer)$',t): return 'desfaz'
  if re.match(r'^(Excluir|Apagar|Remover|Esvaziar|Limpar|Tirar|Cancelar)\b',t): return 'perigo'
  if re.match(r'^(Salvar|Confirmar|Conferir|Registrar|Guardar|Retirar|Enviar|Cobrar|Criar|Finalizar|Ir para o pagamento)\b',t): return 'prin'
  if t.endswith('⌄'): return 'dobra'
  if t.endswith('›') and len(t)<40: return 'sai'
  if a=='inicio': return 'sai'
  if a=='' and len(t)>25 and re.search(r'\d',t): return 'linha'
  if a=='' and len(t)>18: return 'linha'
  if a=='' and len(t)<=26: return 'escolha'
  return '?'
T={os.path.basename(f)[:-5]:json.load(open(f)) for f in sorted(glob.glob(D+'*.json')) if not os.path.basename(f).startswith('familias')}
F=collections.defaultdict(list)
for n,d in T.items():
  looks={x['t']:x for x in d.get('escuro',{}).get('botoes',[])}
  for b in d.get('toques',[]):
    if 'igual_a' in b or b['txt'].strip()=='‹': continue  # '‹' sozinho = título pequeno escondido (#nvBar), não é botão visível
    lk=looks.get(b['txt'],{})
    b=dict(b,tela_=n,cara=lk.get('cara',''),fs=lk.get('fs',''),h=lk.get('h',0),cor=lk.get('cor',''))
    F[fam(b)].append({'tela':n,'txt':b['txt'][:40],'act':b.get('act',''),'cara':b['cara'],'fs':b['fs'],'h':b['h'],'faz':' / '.join(b.get('efeito') or [])[:40]})
json.dump(F,open(D+'familias2.json','w'),ensure_ascii=False,indent=0)
o=['# Famílias de botões — %s'%('APP ATUAL' if M=='atual' else 'APROVADOS'),'','Gerado de work/verif/inv/%s por work/verif/familias2.py (lê só o inventário). %d botões em %d telas.'%(M,sum(len(v) for v in F.values()),len(T)),'',
   '| Família | Botões | Telas | Caras diferentes hoje | Regra da família |','|---|---|---|---|---|']
for fid,nm,rg in FAM:
  L=F.get(fid,[])
  if not L: continue
  caras=collections.Counter((x['cara'],x['fs']) for x in L)
  o.append('| %s | %d | %d | %d | %s |'%(nm,len(L),len({x['tela'] for x in L}),len(caras),rg))
for fid,nm,rg in FAM:
  L=F.get(fid,[])
  if not L: continue
  caras=collections.Counter((x['cara'],x['fs']) for x in L)
  o+=['','## %s — %d'%(nm,len(L)),'','Caras hoje: '+' · '.join('%s %s (%d)'%(c or '?',f,n) for (c,f),n in caras.most_common()),'']
  for x in sorted(L,key=lambda x:(x['cara'],x['tela'])): o.append('- %s · "%s" · %s %s · %s'%(x['tela'],x['txt'],x['cara'],x['fs'],x['faz']))
open('/home/claude/lafouch/docs/FAMILIAS-BOTOES%s.md'%('' if M=='atual' else '-APROVADOS'),'w').write('\n'.join(o)+'\n')
print({NOME[k]:len(v) for k,v in sorted(F.items(),key=lambda x:-len(x[1]))})
print('sem família:',[(x['tela'],x['txt'],x['act']) for x in F.get('?',[])][:60])
