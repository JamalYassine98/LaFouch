# Design guardado — site e app (12/11/2026)
Use isto + o kit (work/kit/kit.py) em vez de simular do zero. Fotos de referência das telas reais: work/kit/telas/*.png (refazer com o kit quando o visual mudar).

## Kit de esboço realista
- `python3 work/kit/kit.py site <tela> saida.png [inject.js|inject.html] [--y 600] [--es]`
  telas: home, produto (peça de teste KIT3C com 3 cores), carrinho, entrega, delivery (conta de teste logada com endereço salvo), pagamento, conta, atacado.
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
