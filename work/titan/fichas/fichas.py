# GABARITO NOVO · uma ficha por ÚLTIMO esboço aprovado (o anterior ajustado vai para work/obsoletos).
# Peça: t = texto fixo (início do texto, sem números que mudam) · exato = o texto da linha é SÓ isso
# icone = a linha tem ícone à esquerda · valor = regex do valor que fica À DIREITA da mesma linha
# sem_fundo = nem a peça nem a linha ficam dentro de cartão (fundo próprio)
# ausente = textos que o aprovado tirou · presente = textos que têm de existir
def setor(k): return "()=>{__LF.inicioGo('prec');setTimeout(()=>{const b=document.querySelector('[data-act=tiAbre][data-id=%s]');b&&b.click()},500)}"%k
S='/home/claude/lafouch/work/s435/'
FICHAS=[
 dict(n='54+46b',tela='Preços',view='inicio',passos=["()=>__LF.inicioGo('prec')"],img=S+'switch/esboco_46b_precos.jpg',
  pecas=[dict(t='Início',exato=1,topo=1),dict(t='Preços',exato=1),dict(t='DECIDE HOJE'),dict(t='SETORES'),
         dict(t='Regras',exato=1,icone=1),dict(t='Ofertas',exato=1,icone=1)]),
 dict(n='62',tela='Regras',view='inicio',passos=[setor('regras')],img=S+'titan/esboco_62_regras_titan.jpg',
  pecas=[dict(t='CADA VENDA COBRE'),dict(t='Contas do mês',exato=1,icone=1,valor=r'^G\$ [\d.]+$'),
         dict(t='Taxas da maquininha',exato=1,icone=1),dict(t='IVA',exato=1,icone=1,valor=r'^\d+%$'),
         dict(t='Colchão',exato=1,icone=1,valor=r'^[\d,]+%$'),dict(t='DÓLAR DA LOJA'),
         dict(t='Cotação nos preços',exato=1,icone=1,valor=r'^G\$ [\d.]+$'),dict(t='O TITAN APRENDE COM VOCÊ'),
         dict(t='Vendas por mês',exato=1,icone=1),dict(t='Seu jeito de cobrar',exato=1,icone=1),
         dict(t='SEU OBJETIVO'),dict(t='Meta de lucro do mês',exato=1,icone=1,valor=r'^G\$ [\d.]+$')]),
 dict(n='63',tela='Ofertas',view='inicio',passos=[setor('ofertas')],img=S+'titan/esboco_63_ofertas_titan.jpg',
  pecas=[dict(t='Ofertas',exato=1),dict(t='OFERTAS NO AR'),dict(t='Nenhuma oferta no ar'),dict(t='CUPONS'),
         dict(t='Folga de hoje',exato=1,icone=1,valor=r'^até \d+%$'),dict(t='Última peça',exato=1,icone=1),
         dict(t='COMO O TITAN DECIDE'),dict(t='Peça parada',exato=1,icone=1),dict(t='De/por honesto',exato=1,icone=1)]),
 dict(n='65b',tela='Atacado',view='inicio',passos=[setor('atacado')],img=S+'titan/esboco_65b_margens_atacado.jpg',
  pecas=[dict(t='Calculadas em'),dict(t='TABELAS'),dict(t='Óptica',exato=1,icone=1,valor=r'^\d+%$'),
         dict(t='Atacado 10K',exato=1,icone=1,valor=r'^\d+%$'),dict(t='Exemplo: armação de acetato')]),
 dict(n='67',tela='Histórico',view='inicio',passos=[setor('hist')],img=S+'titan/esboco_67_historico_do_dia.jpg',
  # aprovado 22/11 14:35 = SEM abas de filtro (a porta é o filtro); com mudanças: 'HOJE · dd/mm' + linhas + 'Ver o dia inteiro ›'
  pecas=[dict(t='Preços',exato=1,topo=1),dict(t='Histórico',exato=1),dict(t='Ver o dia inteiro',precisa='mudança de preço no dia')],
  ausente=['Tudo','Você']),
 dict(n='46c',tela='Pedidos online',view='inicio',passos=["()=>__LF.inicioGo('ped')"],img=S+'switch/esboco_46c_pedidos.jpg',
  pecas=[dict(t='Agir agora'),dict(t='Em andamento'),dict(t='Feitos'),dict(t='Nenhum pedido ainda',icone='acima')]),
 dict(n='52b',tela='Inventário',view='estoque',passos=[],img=S+'giroprecos/esboco_52b_inventario.jpg',
  pecas=[dict(t='Parados e sobrando',valor=r'^US\$ [\d.,]+$'),dict(t='Contar o estoque'),dict(t='preços para corrigir')],
  ausente=['EM ESTOQUE (FILTRO)']),
 dict(n='89b',tela='Fornecedores',view='inicio',passos=["()=>__LF.inicioGo('lotes')"],img=S+'pendentes/esboco_89b_fornecedores_escuro.jpg',
  pecas=[dict(t='Investido em',valor=r'^US\$ [\d.,]+$'),dict(t='Editar'),dict(t='Faltam detalhar')],
  ausente=['Todas as compras que você registrou']),
 dict(n='104',tela='Caixa',view='inicio',passos=["()=>__LF.inicioGo('caixa')"],img=S+'semcartao/esboco_104_caixa_sem_cartao.jpg',
  pecas=[dict(t='Guarani',valor=r'^G\$ [\d.]+$'),dict(t='Objetivos da loja',sem_fundo=1),dict(t='Movimentos',sem_fundo=1)]),
 dict(n='104+dec24/11',tela='Catálogo',view='vendas',passos=[],img=S+'semcartao/esboco_104_vendas_sem_cartao.jpg',
  pecas=[dict(t='Catálogo',exato=1)],ausente=['Escolha a peça e venda.']),
 dict(n='149n+52a+54',tela='Início',view='inicio',passos=[],img=S+'semnet/esboco_sem_internet_inicio_escuro.jpg',
  pecas=[dict(t='Vendido hoje',sem_fundo=1),dict(t='Resultados',exato=1,icone=1),dict(t='Preços',exato=1,icone=1),
         dict(t='Site',exato=1,icone=1),dict(t='Clientes',exato=1,icone=1),dict(t='Atacado',exato=1,icone=1)],
  ausente=['Giro e preços','coisas para olhar']),
]
