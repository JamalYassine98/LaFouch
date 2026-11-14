# Designer explorador — desenho para aprovar (14/11/2026)

Vale para o **site** e para o **app**, com o mesmo motor. Nada foi construído. Substitui a ideia de "uma regra nova a cada falha" e absorve as melhorias já aprovadas para o porteiro e o designer (matriz completa, detector de movimento, lista de alarmes falsos, esboço aprovado como gabarito).

## 1 · O que muda

| | Hoje | Proposta |
|---|---|---|
| O que ele olha | telas que eu escolho, paradas | tudo o que ele consegue abrir sozinho, antes e depois de cada gesto |
| O que ele sabe | 12 falhas conhecidas | 12 leis de como uma tela boa se comporta + o costume do próprio produto |
| Quando pensa | nunca (é uma lista) | a IA revisa só os casos que ele marcar |
| O que entrega | "0 pioras" | o que quebrou, o que é suspeito, e **o que ele não conseguiu ver** |

## 2 · As quatro peças

### 2.1 · Explorador
- Começa em cada tela e toca em todo controle visível; o que abrir vira um estado novo, e ele repete ali dentro (até 3 níveis).
- Em cada estado tenta os gestos de qualquer pessoa: tocar, tocar duas vezes rápido, arrastar para cima e para baixo, arrastar de lado, voltar, fechar, tocar fora, mudar o tamanho da tela e o tamanho da letra.
- Guarda um mapa do que achou (tela → controle → o que abriu). Controle novo ou sumido de uma versão para a outra aparece no relatório.
- **Nunca** toca em pagar, apagar, enviar, sair ou importar (lista de proibidos), roda só na cópia e sem internet.

**Site — o que percorre:** Início, catálogo, peça, busca, menu, filtros, sacola, compra até a tela antes de pagar, Minha conta com conta de teste, Mochi, guia, atacado. Aparelhos: celular 320/360/390, tablet 768/820, computador 1366/1920/2560. As 3 letras, as temáticas e os idiomas entram em rodízio (tudo parado sempre; exploração completa numa combinação por vez).

**App — o que percorre:** as 14 telas, toda janela, ficha, cadastro (Adicionar, leitor com câmera falsa, carregando), tela de bloqueio, modo cliente. Claro e escuro; celular, tablet, computador até 2560.

### 2.2 · As 12 leis (conferidas depois de cada gesto)

| Nº | Lei | O que teria pego hoje |
|---|---|---|
| 1 | **Ida e volta:** abrir e fechar deixa a tela como estava (imagem, rolagem, foco) | rolagem presa depois de fechar; resto de janela na tela |
| 2 | **Fundo inerte:** com uma camada aberta, o que está atrás não rola nem recebe toque | PIN, menu do Caixa, janela do dólar |
| 3 | **Só rola o que tem mais conteúdo:** o que cabe não rola; nada rola de lado | PIN; Início largo demais com letra grande |
| 4 | **O que parece tocável responde** em até 0,1 s; o que não é tocável não parece | "Conferir" só texto; botão sem retorno |
| 5 | **Nada se mexe sozinho sem fim**, fora "carregando" | linha rosa do leitor; atalhos balançando |
| 6 | **Abrir e fechar são simétricos** (mesmo caminho, fechar mais curto) | sacola e busca que abrem animadas e fecham secas, e o contrário |
| 7 | **Nada tampado, cortado ou fora da tela** — parado, rolado ou com janela aberta | WhatsApp por cima de botão; Últimas por cima de texto |
| 8 | **Texto sempre legível:** contraste, tamanho, sem "…", sem texto sobre texto | contraste das temáticas; letras de 10 px |
| 9 | **Mesma função, mesmo jeito:** botões, janelas e tempos iguais para a mesma coisa | 11 jeitos de abrir janela; 9 carregadores |
| 10 | **A tela se adapta sem perder nada:** mesma ordem e mesmos controles em todo aparelho, letra, claro/escuro e temática | telas pela metade no computador |
| 11 | **Sempre há saída:** toda janela tem fechar à vista e o voltar funciona | janelas que só fecham por um caminho |
| 12 | **Nada quebrado por baixo:** sem erro de código, imagem quebrada ou pedido que falha | — |

Cada lei é medida, não opinada: foto antes e depois, posição da rolagem, o que se mexeu, quanto durou.

### 2.3 · Estranho no ninho
- Para cada tipo de coisa (botão principal, janela, campo, cartão, aviso, carregador) ele mede: tamanho, cantos, letra, cor, espaço em volta, tempo de abrir e fechar, se trava o fundo, onde fica o fechar.
- O que a maioria faz vira o costume da casa. Quem foge é suspeito, sem ninguém ter escrito regra.
- Exemplos de hoje que apareceriam sozinhos: 5 de 20 janelas não travam o fundo; um canto do leitor com 104 px e os outros três com 30; um botão vinho cheio entre botões de fio.
- O costume aprovado por você (esboços aprovados) entra como gabarito: o que foi aprovado nunca é marcado.

### 2.4 · Revisão por IA
- O explorador não julga gosto. Para cada suspeito ele monta: a tela, o recorte ampliado e, se houver movimento, os quadros.
- Eu olho esses casos com a régua de luxo aprovada (origem, simetria, direção, profundidade, calma) e respondo: falha, aceitável ou alarme falso — com o motivo escrito.
- Alarme falso entra numa lista e não volta a aparecer. Falha confirmada vira trava permanente.
- Limite por rodada: os 20 suspeitos mais fortes. O resto fica listado sem revisão.
- Quando: em todo esboço e antes de toda publicação.

## 3 · O relatório (uma página)

1. **Bloqueia a publicação:** lei quebrada que não existia na versão anterior.
2. **Suspeitos novos:** com imagem e o motivo.
3. **Mudou sem ninguém pedir:** controle que apareceu, sumiu ou trocou de lugar.
4. **Não vi:** quantos controles ele abriu de quantos achou, e a lista do que não alcançou. É o item que hoje não existe e que explica por que o PIN passou.
5. Tempo gasto.

## 4 · Duas velocidades

- **Rápida (cerca de 10 min):** leis nas telas tocadas pela mudança. Roda em toda publicação.
- **Completa (cerca de 1 h):** exploração inteira, todos os aparelhos. Roda antes de mudança grande e uma vez por semana.

## 5 · O que ele NÃO vai pegar

- Fluidez de verdade e sensação do toque: só no celular real.
- Se algo é bonito: ele mede coerência e comportamento; gosto continua sendo seu e meu, nos esboços.
- O que depende de dados reais, câmera real, som, pagamento.
- Opcional (função nova, decisão sua): no app, segurar o logo por 2 s para "Relatar esta tela" — guarda a foto e o estado na memória do projeto, para o seu print virar caso de teste sem você precisar explicar.

## 6 · Como construir (4 passos, cada um já útil sozinho)

1. Explorador + leis 1, 2, 3 e 12 (inclui as 4 regras de rolagem já aprovadas) + o item "não vi".
2. Leis 4 a 8 e 11 (reaproveita as 12 regras de hoje).
3. Estranho no ninho + leis 9 e 10.
4. Revisão por IA e as duas velocidades ligadas ao porteiro do site e aos testes do app.

O Guardião do app continua separado: ele roda no seu aparelho com dados reais e vigia o negócio.
