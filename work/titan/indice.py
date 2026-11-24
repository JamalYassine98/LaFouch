# TITAN · ÍNDICE do gabarito: cada tela → o ÚLTIMO esboço aprovado (imagem). Fonte: lista viva (docs/FALTA-APROVAR-15-11.md).
# Transversais (valem em todas as telas): 80/80b barras · 81 botões · 82 campos · 83 sem texto explicativo (e dono 24/11: frase de baixo do título sai)
# · 84 ícones · 85 avisos · 86 títulos e linhas · 87 pílulas · 89a bolinha amarela · 101 cor oficial · 104 sem cartão · 107 sem internet.
S='/home/claude/lafouch/work/s435/'
def setor(k): return "()=>{__LF.inicioGo('prec');setTimeout(()=>{const b=document.querySelector('[data-act=tiAbre][data-id=%s]');b&&b.click()},500)}"%k
TELAS=[
 # (tela, view, passos, esboço aprovado, imagem, implementado?)
 ('Preços','inicio',["()=>__LF.inicioGo('prec')"],'54 + 46b (⏻)',S+'switch/esboco_46b_precos.jpg',True),
 ('Regras','inicio',[setor('regras')],'62',S+'titan/esboco_62_regras_titan.jpg',True),
 ('Ofertas','inicio',[setor('ofertas')],'63',S+'titan/esboco_63_ofertas_titan.jpg',True),
 ('Atacado (setor)','inicio',[setor('atacado')],'65b (margens)',S+'titan/esboco_65b_margens_atacado.jpg',True),
 ('Ferramentas','inicio',[setor('ferr')],'66',S+'titan/esboco_66_ferramentas_titan.jpg',True),
 ('Histórico do dia','inicio',[setor('hist')],'67',S+'titan/esboco_67_historico_do_dia.jpg',True),
 ('Pedidos online','inicio',["()=>__LF.inicioGo('ped')"],'46c (+74r)',S+'switch/esboco_46c_pedidos.jpg',True),
 ('Ajustes','ajustes',[],'86 v2 (Ajustes)',S+'varredura/titulos/esboco_86_titulos_linhas_escuro.jpg',True),
 ('Peças','estoque',[],'48a',S+'compras/esboco_48a_pecas.jpg',True),
 ('Inventário','estoque',[],'52b + 52d',S+'giroprecos/esboco_52b_inventario.jpg',True),
 ('Compras','inicio',["()=>__LF.inicioGo('comp')"],'51 + 51b',S+'compras/esboco_51_compras_por_vaga.jpg',True),
 ('Fornecedores','inicio',["()=>__LF.inicioGo('forn')"],'89b',S+'pendentes/esboco_89b_fornecedores_escuro.jpg',True),
 ('Dashboard','inicio',["()=>{__LF.setView('dash')}"],'52e',S+'giroprecos/esboco_52e_resultados.jpg',True),
 ('Caixa','inicio',["()=>__LF.inicioGo('caixa')"],'86 v2 + 104',S+'semcartao/esboco_104_caixa_sem_cartao.jpg',True),
 ('Catálogo','vendas',[],'104',S+'semcartao/esboco_104_vendas_sem_cartao.jpg',True),
 ('Início','inicio',[],'52a (+149n)',S+'giroprecos/esboco_52a_inicio.jpg',True),
 ('Adicionar','estoque',["()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}"],'88',S+'duasportas/esboco_88_duas_portas_escuro.jpg',True),
]
