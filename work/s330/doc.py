# S330: gera docs/PROBLEMAS-ANIMACAO-SITE-E-APP-15-11.md a partir das medições (work/s322/problemas.json e work/s330/site_problemas.json)
import json,collections,re
R='/home/claude/lafouch/'
app=json.load(open(R+'work/s322/problemas.json'));site=json.load(open(R+'work/s330/site_problemas.json'))
def agrupa(lst):
    g=collections.OrderedDict()
    for x in lst:
        v=x[2] if len(x)>2 else ''
        k=(str(x[1]), json.dumps(v,ensure_ascii=False))
        g.setdefault(k,[])
        if x[0] not in g[k]: g[k].append(x[0])
    return g
SOL_APP={
 'fora da curva de luxo':'Uma curva só em tudo: entrada `cubic-bezier(.16,1,.3,1)`, saída `cubic-bezier(.4,0,.2,1)`. Trocar a curva antiga dentro de `lfEntra`, `cas` e das transições de botão (variáveis `--lux-in`/`--lux-out`; nada escrito à mão em cada regra).',
 'duas ou mais animações no mesmo elemento ao mesmo tempo':'Cascata dos atalhos (`cas`): anima UMA vez, só na primeira entrada no Início; ao voltar não repete. `lfDesenha`: uma animação por traço. (Parte desta contagem é de botões irmãos e não é defeito.)',
 'mexe em tamanho/posição (trava em celular fraco)':'Linha/pílula das abas e o voo da ficha andam com `transform` (translate + scale), nunca com left/width/top/height. Abas = lote A já aprovado; falta o voo `lfVoa`/`lfFundo`.',
 'longa (mais de 0,7 s)':'`lfDesenha` (desenho dos ícones de tela vazia) de 1,0 s para 0,6 s, uma vez por tela.',
 'quica (passa do ponto e volta)':'Tirar o quique: `.lfPill` (1.25), janela de compartilhar (1.25) e barra de seleção (1.3) vão para a curva de luxo.',
}
SOL_SITE={
 'fora da curva de luxo':'Trocar `cubic-bezier(.2,.8,.2,1)` das fotos, da sombra do topo e da gaveta do menu (`aside.dpn`, `div.dsc`) pela curva de luxo. `linear` do destaque (`hdkb`, `hdpg`) FICA: movimento contínuo pede linear. `ease-out` do anel do WhatsApp vira a curva de saída.',
 'longa (mais de 0,7 s)':'`hdkb` (zoom lento da foto do destaque, 6,2 s) e `hdpg` (barra de tempo, 6 s) são de propósito: ficam. `ring` do WhatsApp (3 s, sem fim): pulsar 2 vezes ao abrir a página e parar.',
 'ainda rodando 1,7 s depois':'São os mesmos laços (`hdkb`, `hdpg`, `ring`). Pausar os do destaque quando ele sai da tela ou há janela por cima (hoje seguem rodando atrás da conta/sacola).',
 'mexe em tamanho/posição':'Botão do WhatsApp anda com `transform` em vez de `right`; a linha das abas da conta (`i.mcPl`) com `translateX + scaleX` em vez de `width`.',
 'quica':'`cadp` (confirmação ao tocar Comprar) na curva de luxo, sem o 1.15.',
 'CÓPIAS do painel ao mesmo tempo (fantasma)':'Ver item 1.',
}
o=['# Problemas de animação — SITE e APP (15/11/2026, S330)\n',
'Medido por programa nas telas reais (simulador). NADA foi implementado: tudo aqui espera a palavra **implementar**.\n',
'Curva de luxo aprovada: entrada `cubic-bezier(.16,1,.3,1)`, saída `cubic-bezier(.4,0,.2,1)`, sem quique.\n',
'## 1. SITE — bug da Minha conta / sacola (cópias do painel)\n',
'- **Reproduzido**: com a conta OU a sacola já aberta, ir pelo menu → "Minha conta": até **4 cópias** do painel por ~0,5 s (23 quadros com 2 ou mais cópias). É a tela da foto do dono.\n- **Causa** (`js/lf-site.js`): ao fechar uma janela de página o site guarda uma cópia dela em `#lfGhost` e anima a saída (300 ms). O menu chama fechar e abrir ao mesmo tempo, e cada chamada de fechar cria mais uma cópia, todas por cima do painel novo.\n- **Solução**: (a) quando uma janela SUBSTITUI outra não há cópia de saída: a nova entra e a velha some na hora; (b) no máximo UMA cópia viva (`layer()` apaga qualquer `#lfGhost` antes de abrir); (c) fechar chamado duas vezes não cria segunda cópia.\n- **Não reproduzido no simulador**: primeira abertura pelo botão do topo, botão com a janela aberta, troca de aba, conta ↔ sacola pelos botões, peça → conta/sacola. Se o dono vê falha nesses caminhos, precisa de gravação da tela.\n',
'## 2. Por que o designer não achou — e o que muda\n',
'- O porteiro abre cada janela a partir da tela LIMPA e mede só o elemento que entra. Nunca testou sair de uma janela aberta para outra, nem contou cópias.\n- **Regra nova proposta (portão)**: detector de cópias `work/s330/fantasma.py` — todo par origem → destino, por todo caminho de entrada (botão do topo, menu, link), quadro a quadro; reprova com 2 ou mais cópias do mesmo painel ou cópia que sobra. Defeito plantado: o bug de hoje tem de reprovar.\n- O mesmo detector precisa existir no app (janelas e folhas).\n']
def bloco(tit,d,sol):
    o.append('## %s\n'%tit)
    for cat,lst in d.items():
        g=agrupa(lst);o.append('### %s — %d ocorrências, %d casos diferentes\n'%(cat,len(lst),len(g)))
        for (el,v),onde in g.items():
            o.append('- `%s` %s — em: %s'%(el,v.strip('"'),'; '.join(onde[:4])+(' (+%d)'%(len(onde)-4) if len(onde)>4 else '')))
        o.append('\n**Solução:** '+sol.get(cat,'—')+'\n')
bloco('3. SITE — todos os problemas (24 passos, 348 animações vistas)',site,SOL_SITE)
bloco('4. APP — todos os problemas (95 animações vistas)',app,SOL_APP)
o.append('### Outros achados do app (leitura do código)\n- Duas regras de `transition` disputam os botões → uma regra só (lote A).\n- 7 animações sem fim fora de carregamento e 4 escritas e nunca usadas → parar as primeiras; apagar as 4 mortas.\n- **Não vistos no simulador** (abrem em branco sem dados): Mensagens, Analisador, Temática, Atacado, Online; fluxo de venda e detalhe do pedido. Faltam medir.\n')
o.append('## 5. Seletores (trilho) — regra do arrastar\n')
o.append('- **Regra do dono (15/11/2026)**: todo seletor em trilho/pílula aceita o dedo ARRASTANDO a pílula (além do toque).\n- **Hoje**: nenhum trilho do app arrasta. `.trk` em 9 arquivos (peça, faixas, vendas Varejo/Atacado, novo modelo, brindes, câmbio, ajustes, catálogo, marketing, graus/cor); `.nav`+`.chip` em 7 arquivos (entre eles Ordem e Faixa dos Filtros, que nem têm pílula deslizante: o fundo PULA); abas `.lfAbas` em 3. Site: abas da conta (`.mct`) e 3 `.seg`, sem arrastar.\n- **Solução**: UM componente de trilho para app e site (pílula com `transform`, toque + arrastar, solta no mais próximo, curva de luxo); todos os seletores acima passam a usá-lo. Esboço: `work/s330/10-trilho-arrastar-quadros.jpg`.\n- **Filtros do inventário**: sem "Ver N peças" e "Cancelar"; filtro vale na hora, contagem ao lado do título, fecha arrastando para baixo ou tocando fora. Esboços: `work/s330/9-filtros-escuro.jpg` e `9-filtros-claro.jpg`.\n')
open(R+'docs/PROBLEMAS-ANIMACAO-SITE-E-APP-15-11.md','w').write('\n'.join(o));print(len('\n'.join(o).splitlines()),'linhas')
