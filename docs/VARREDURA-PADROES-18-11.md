# Varredura dos padrões de luxo — 18/11/2026 (v1)
Ferramenta: work/verif/roda.py (verif.js + alin2.js + kit/abas_dist.js + olho), 59 telas × claro/escuro, celular, base aprovada (132, 133a/b, 134), letras do Android. IA olhou cada tela 1 vez (claro e escuro). NÃO testado no celular real nem em tablet/PC/3 letras (próxima rodada).

## Alinhamento
- (2) ação ao lado do título fora do centro: Clientes "+" 12 px, Despesas "+ Nova" 12, Inventário 10, Catálogo 8, Atacado 6, Caixa 6.
- (2/9) valor à direita de rótulo com 2 linhas: Caixa (Guarani/Dólar/Real) e Despesas ("Cada peça vendida separa") alinham pela 1ª linha (Δ 10,9 px); no Dashboard o valor fica no meio das 2 linhas.
- (1) Câmbio: valores terminam 7 px antes da margem.
- (1/3) linhas 17–19 px para dentro por estarem dentro de caixas: Giro (4 dobras), Reservas (2), Caixa "Objetivos", Pendências, Catálogo, Despesas "Nova despesa".
- (7) linha de base: Câmbio "Últimas trocas 12 ›" 2,3 px; Catálogo títulos 1,7–2,1 px.
- (9) abas → conteúdo: 16 / 34 / 35 / 41 / 50 / 60 / 63 px (aprovado 32).
- (11) 63 botões com menos de 44 px (ex.: "Histórico ⌄" 32 px; valores do Dashboard 40 px).
## Design (caixas sobrando)
- Giro (dobras), Reservas (dobras), Caixa "Objetivos da loja", Despesas "Aluguel da loja" e "Nova despesa", Pendências (cada item), Catálogo (carrinho, pagamento, peça — linha do grau ainda rosa em caixa), Marketing (objetivos e "criar com um toque").
## Botões
- P1 adicionar: "+" redondo só em Inventário/Clientes; pílulas em Despesas "+ Nova", Caixa "+ Novo objetivo", Atacado "+ Novo acesso"; links "+ Criar lote", "+ Adicionar outra peça", "+ Receber parte em outra moeda".
- Botões de ícone com 3 caras: quadrado (sino, Caixa, Catálogo, Histórico), quadrado rosa (Caixa ativo), redondo (Inventário/Clientes).
- Pendências: cada item com pílula "Ver conta/Ver margem/Conferir".
## Janelas
- P2 criar dentro da página: Nova despesa, Novo cliente (Novo objetivo, Conferir, Registrar troca já são janela).
- P6 "Fechar" escrito: Conferir o caixa; Editar produto "Fechar sem salvar" (134d aprovado) — CONFLITO com P6, perguntar ao dono.
- P3 campos em caixa: Novo objetivo, Retirada, Registrar troca, Conferir, Novo acesso, Vitrine, Pagamento.
- P4: Retirada (G$/US$/R$) e Registrar troca (De/Para) em 3 pílulas soltas, não escolha de dois lados; Novo acesso "Lojista fixo/Visitante" em cartões.
## Animações
- 12 combinações de tempo/curva (0,08 s a 0,35 s; ease, ease-out e 4 curvas diferentes).
## Palavras / números
- W: "Guardar objetivo" × "Salvar" nas outras telas; ERRO de texto "Black Friday em 1 dias" (Preços).
- N: G$ sempre igual; US$ e R$ ora com centavos ora sem (ex.: "US$ 420" e "US$ 419,70" na mesma área).
## Letras e ícones
- T: 21 tamanhos de letra (10 a 40 px); letra de título (serifada) aparece dentro de blocos: Preços (61%, G$ 26.034), Giro ("Curva ABC (90 dias)", "Dinheiro no estoque"), Reservas ("Fluxo de caixa projetado"), Catálogo ("Carrinho", "Pagamento", total).
## Estados
- P5 tela vazia: só Clientes tem ícone e centro; Atacado mistura centro + esquerda; Câmbio, ficha (Histórico) à esquerda sem ícone.
## Teste com defeito (meu)
- Passos "hist-dia" (abre o Dashboard) e "giro-no-estoque" (abre o Inventário) estão errados em tools/teste-android/telas.py.

## Inventário de FUNÇÃO dos botões (18/11 15:50) — work/verif/botoes.py
1.179 toques em 63 telas (cada botão tocado numa página nova; Câmbio com a cotação da casa simulada). Efeitos: leva a outra tela 422 · abre janela 186 · muda no lugar 396 · alterna 18 · nada visível 157 (a maioria: dados de teste vazios ou o 132 da base, que é só visual).
### Conferência do 135 (função de cada botão mexido)
- "+ Nova" (Despesas) → abre o formulário de nova despesa = acrescenta ✓ ("+")
- "+ Novo objetivo" (Caixa) → abre a janela Novo objetivo = acrescenta ✓
- "+ Novo acesso" (Atacado) → abre a janela Novo acesso = acrescenta ✓
- G$/US$/R$ (Retirada) e De/Para (Troca) → alternam a moeda ✓ (escolha de dois lados)
- "Venda ⇅" (Câmbio) → alterna as cotações venda/compra ✓ (escolha de dois lados)
- Pendências "Ver conta/Ver margem/Conferir/Ver preços" → levam a outra tela ✓ ("›")
- "Ver o que falta repor ›" (Caixa) → leva ao Dashboard ✓
### Achados novos
- "›" que NÃO leva a outra tela (abre no lugar; pela regra dos links deveria ser "⌄"): Inventário › Fornecedores "Ver peças (57) ›", Histórico "Carregar mais 30 dias ›", Giro "como calcula ›" e "ver os 14 ›", Caixa "Ver todos os movimentos ›", ficha "Fotografar no Estúdio ›" (a conferir).
- "›" que abre JANELA (não troca de tela): Câmbio (Reposição, Últimas trocas, Preços no site, Como o app te protege) e Pendências "Ver todas as conferências do Guardião ›" — perguntar se janela conta como "outra tela".
- Valores do Dashboard são botões escondidos: tocar troca a moeda G$ → R$ → US$ (ACT.d48Moeda) sem nada dizendo isso (W "botão diz o que faz").
- Carrinho "+ Adicionar outra peça" volta ao catálogo para escolher (acrescenta ✓); "+ Receber parte em outra moeda" abre um campo no lugar (acrescenta ✓); "− 1 +" é quantidade (função própria, fora do P1).
