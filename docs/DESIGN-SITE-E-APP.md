# Design guardado — site e app (12/11/2026)
Use isto + o kit (work/kit/kit.py) em vez de simular do zero. Fotos de referência das telas reais: work/kit/telas/*.png (refazer com o kit quando o visual mudar).

## Kit de esboço realista
- `python3 work/kit/kit.py site <tela> saida.png [inject.js|inject.html] [--y 600] [--es]`
  telas: home, catalogo, produto (peça de teste KIT3C com 3 cores, ou --ref CODIGO), carrinho, entrega, delivery (conta de teste logada com endereço salvo), pagamento, conta, atacado.
  - `.js` = função `(a)=>{...}` rodada na tela real: acrescentar cartões com as classes do site (ver abaixo). Melhor opção: fica idêntico.
  - `.html` = tela nova abaixo do cabeçalho real, com `site-comp.css` (prefixo `#atx`).
- `python3 work/kit/kit.py app <tela> saida.png [inject.html] [--escuro]` — tela real do app (#test, dados de exemplo); `.html` = tela cheia com `app-comp.css` (prefixo `#fx`).
- `python3 work/kit/kit.py prancha saida.jpg "Título" "sub" a.png:"Hoje …":"sub" b.png:"Proposta":"sub"` (título começando com "Hoje" sai em vermelho).
- Tudo offline (só localhost), conta de teste, nada vai para produção. Conferir com UMA prévia.

## Site (lafouch.com) — tema claro
- Cores: fundo `--bg #fbf7fa` · cartão `--pn #fff` · borda `--ln #efe3ea` / `--ln2 #d8c3d0` · texto `--tx #2a1f27` · apagado `--mu #6b5a66` · vinho `--ac #8d3a69` · rosa claro `--hero #f4e8ef` · verde `--ok #14803f` · WhatsApp `--wa #1f8f4e`.
- Fontes: títulos `--display` Fraunces/Georgia (serifada); texto `--body` Inter.
- Botões: comprar = pílula vinho em degradê com ícone de carrinho; checkout (Prosseguir / Forma de pagamento / Finalizar) = VERDE cheio, cantos 16px; login (Confirmar) = preto pílula; secundário = pílula com borda vinho (`.p2`/"Ver modelo"); link vinho com "›".
- Checkout: passos "① Carrinho › ② Entrega › ③ Pagamento"; `.note` (caixa branca, borda, 14px); `.cfo` (cartão opção: ícone 44px em quadrado + título + `small`; `.on` = borda vinho e halo); `.cfl` (rótulo de seção); `.cfc` (cartão de formulário, raio 16); `.cfx` (link "+ Outro endereço"); rodapé fixo branco com "Tem um código?", Total e botão verde.
- Cartões de produto `.card` raio 20, foto em fundo branco; `.chip` pílula 44px; selos sobre a foto (NOVO preto, METAL etc.); "Últimas unidades" dentro da foto (pílula branca com ponto pulsando).
- Moeda: PT mostra R$, ES mostra G$; delivery só Paraguai (usar G$ ali).

## App — tema claro (o escuro existe)
- Cores claras: fundo `--bg #f4f1f4` · borda `--line #d9d0d8` · vinho `--accent #8d3a69` · verde `--ok #14803f` · aviso `--warn #8a5a00` · erro `--bad #a12a2a`; títulos `--display` Georgia; texto Segoe UI/system.
- Topo com logo grande + sino (contador vermelho); título da tela em negrito grande; abas sublinhadas vinho (Produtos · Fornecedores · Reposição); barra inferior: Início · Catálogo · Inventário · Caixa · Ajustes (ativo em vinho).
- Cartões brancos raio ~18, borda fina; listas "rótulo ›" (Ajustes); botões pílula: cheio vinho (principal), borda vinho (secundário), vermelho (cancelar/excluir); números grandes verdes (estoque, dinheiro).
- Esboços do app no kit usam `app-comp.css`: `.cd` cartão, `.kv` linha rótulo/valor, `.rw` linha com ação, `.bt`/`.bt.o` botões, `.ch`/`.ch.on` pílulas, `.gd` aviso com faixa à esquerda, `.ft` rodapé fixo, `.tb` topo com "‹".

## Designer de e-commerce (13/11/2026, pedido do dono)
O designer olha como um profissional de loja online (conversão primeiro) e o kit mede sozinho (`work/kit/ecom.js`, linhas "DESIGNER ECOM"):
- Toque: todo botão ≥ 40×40 px no celular (ideal 44).
- Letra: ≥ 11 px no celular e ≥ 12 px no PC em qualquer texto; preço e nome do produto bem maiores que os detalhes.
- Contraste: texto ≥ 4,5:1 (texto grande ≥ 3:1), no tema claro e em TODAS as temáticas. O SITE NÃO TEM TEMA ESCURO (decisão 02/11, só o app tem).
- Cartão do catálogo = formato + código (SKU); nada de nome do modelo nem cor no cartão (o cliente escolhe a cor na peça). Decisões 11/11 e 13/11.
- Vitrine: na mesma fileira, fotos, nomes e preços na mesma altura.
- Página do produto: o botão Comprar fica no lugar dele, NÃO acompanha a rolagem (decisão do dono).
- PC: categorias (Sol, Leitura, Armações, Ofertas) visíveis no topo, não só no ☰.
- Início: variedade de fotos (a mesma peça não pode aparecer em 4+ blocos).
- Botão flutuante (WhatsApp) nunca em cima de botão, preço ou foto.
- Preço SEMPRE em preto (normal), em todas as telas e temáticas; oferta = antigo riscado + selo −N%.
- Letra: nunca aumentar além do mínimo (aumentar tudo deixa gigante e amador).
- Uma cor = um significado: verde só para OK/confirmado, vermelho só para urgência/erro, vinho para marca e ações.

## Estudo filtros e catálogo de óculos (13/11/2026)
- Baymard: filtro promovido (à vista acima da lista) TEM que aparecer também dentro da caixa de filtros — quem vai direto à caixa procura lá. Repetir gênero/tipo na caixa é CERTO; tirar é erro (corrige a proposta S210b).
- Baymard: sempre mostrar os filtros aplicados (etiquetas removíveis) perto da lista; só um número "(2)" não basta.
- Baymard: barra horizontal funciona com poucos tipos de filtro (até 6–8); mais que isso, caixa/lateral.
- Baymard: atributo que se vê (formato da armação) = filtro com desenho + texto.
- Ótica (Warby Parker): à vista ficam "Formato" e "Largura da armação", ao lado de Filtros e Ordenar, todos numa barra só; gênero fica no menu.
- Gestalt (NN/g): o que parece desorganizado não é ter vários controles, é estarem espalhados e com estilos diferentes. Regra: uma linha só (proximidade) e o mesmo estilo de letra (semelhança).

## Identidade primeiro (13/11/2026, dono)
- O esboço S210 (preto, maiúsculas espaçadas, cartões sem moldura) foi REPROVADO: genérico, sem identidade, filtros carregados.
- Regra: luxo = mais ar e menos ruído DENTRO da identidade LaFouch. Não trocar: vinho #8d3a69 nas ações, títulos serifados com a cor em itálico, cartões brancos arredondados, fundo rosado, Mochi, temáticas.
- Filtros: linha enxuta (gênero + "Filtros ›"); nada de Formato/Ordenar/etiquetas à vista enquanto o catálogo for pequeno.
- Um só tipo de botão: cheio vinho (principal) + link fino sublinhado (secundário).
