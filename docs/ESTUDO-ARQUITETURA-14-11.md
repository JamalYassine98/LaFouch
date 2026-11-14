# Estudo dos pontos 1 a 7 — 14/11/2026 (madrugada)

Pedido do dono (04:11): estudar os pontos 1 a 6 e elaborar o 7. Decisões de design ficam comigo, na regra de luxo, mantendo todas as funções. Nada aqui foi implementado.

## 1 · Grupos de botões como uma interface só

**O que existe hoje (medido no simulador e lido em `src/95-barra-grupos.js`):** segurar um botão da barra sobre outro cria o grupo; nome sugerido e editável; ícone próprio para cada par (253 pares com nome); as telas viram pílulas no topo; "⋯" abre a janela Grupo (renomear, tirar tela, adicionar botão, desfazer); selo de pedidos novos; o grupo lembra a última tela aberta. Grupos de 3 ou mais telas não têm nome sugerido. O ícone do grupo mede 24 px e os outros 22 px.

**Desenho novo (todas as funções continuam):**
1. **Capa do grupo.** Tocar no grupo abre uma capa com o nome do grupo em título serifado e um bloco por tela, cada bloco com o essencial daquela tela (um número, até três linhas, a ação principal) e "Ver tudo". É a tela que faz o grupo parecer uma coisa só.
2. **Resumo de cada tela.** O teste automático (S266) mostrou que cortar o topo da tela não serve: aparecem filtros e caixas sem sentido. Cada tela ganha um resumo desenhado (tabela abaixo). Qualquer combinação passa a montar bem.
3. **Dentro de uma tela do grupo.** As pílulas saem. No lugar, o nome do grupo pequeno em cima e as telas como palavras em linha, com fio fino sob a ativa (o mesmo componente que o Inventário já usa em Produtos · Fornecedores · Reposição). O "⋯" vira ícone discreto à direita.
4. **Famílias desenhadas à mão:** Dinheiro (Caixa, Despesas, Câmbio), Resultados (Dia, Histórico, Números) e Site (Pedidos online, Mensagens, Site). Seguem as folhas S265.
5. **Nome para 3 ou mais telas:** se as telas formam uma família, o nome da família; senão o nome do par principal; sempre editável.
6. **Janela Grupo:** mesma função, no padrão das janelas novas (título serifado, linhas com fio, botões em fio cinza, "Desfazer o grupo" só texto).
7. **Ícone:** 22 px, nomes na mesma linha dos outros.
8. **Movimento (padrão de luxo aprovado):** criar grupo = os dois ícones se aproximam e viram um (0,46 s) e o nome surge (0,2 s); abrir = capa entra em 0,2 s; trocar de tela = o fio desliza (0,32 s) e o conteúdo cruza (0,2 s); "Ver tudo" = o bloco cresce a partir do próprio lugar e volta em 65% do tempo; toque afunda 0,08 s.
9. **Computador e tablet:** capa em colunas, uma por tela (tablet: duas colunas).

**Resumo de cada tela (o que aparece na capa):**

| Tela | Número principal | Linhas | Ação |
|---|---|---|---|
| Catálogo | peças à venda | 3 mais vendidas | Vender |
| Inventário | em estoque · referências | preços para corrigir · a repor | + Adicionar |
| Caixa | total no caixa | Guarani · Dólar · Real | Ações do caixa |
| Despesas | total do mês | 3 próximas contas | Ver conta |
| Câmbio | dólar do dia | real · reposição | Registrar troca |
| Histórico | vendido no mês | 3 últimos dias | Fechar o dia |
| Dia | vendido hoje | lucro livre · contas do dia | Ver vendas |
| Números (Resumo) | lucro livre do mês | vendido · separado | — |
| Reservas | livre para você | reposição · contas · reserva | — |
| Giro | a repor | mais vendidas · paradas | Ver reposição |
| Preços | margem média | faixas · preços perigosos | Corrigir |
| Pedidos online | pedidos novos | 3 mais recentes | Agir agora |
| Mensagens | não lidas | 3 mais recentes | Responder |
| Site | visitas hoje | destaque · temática | Abrir a loja |
| Clientes | cadastrados | 3 mais recentes | + Novo cliente |
| Atacado | orçamentos abertos | 3 mais recentes | Novo orçamento |
| Fornecedores | compras em aberto | última compra | Chegou mercadoria |
| Contagem | contado de quanto | diferença | Continuar |
| Estúdio | peças na fila | sem foto · sem giro | Começar |
| Marketing | posts da semana | próximo post | Criar |
| Analisador | visitas da semana | peça mais vista | — |
| Temática | próxima data | dias que faltam | Ver sugestão |
| Pendências | precisa de você agora | 3 primeiras | Ver |
| Ajustes | — | não entra em capa | — |

Limite honesto: Giro, Preços, Mensagens, Analisador, Temática, Atacado, Marketing e Contagem eu ainda não abri no simulador nesta sessão; as linhas deles vêm do nome e do atalho do Início e precisam ser conferidas na tela antes de implementar.

## 2 · Nomes (auditoria do app inteiro)

| Onde | Hoje | Recomendo | Motivo |
|---|---|---|---|
| Grupo Caixa + Despesas + Câmbio | — | **Dinheiro** | nome que você aprovou |
| Aba de Números chamada "Dinheiro" | Dinheiro | **Reservas** | o atalho do Início já a descreve como "Reservas"; o conteúdo é "livre para você" e reservas |
| Grupo Dia + Histórico + Números | Vendas (S265) | **Resultados** | "Vendas" confunde com Vender e com o Catálogo (você já apontou isso em 12/11) |
| Tela de números | Resumo (barra) · Painel (atalho) · Dashboard (texto do Caixa) | **Números** | quatro nomes para a mesma tela; "Resumo" fica só como a 1ª aba |
| Botão da barra | Avisos | **Pendências** | a tela se chama Pendências |
| Segundo botão "Catálogo" | Catálogo | **Enviar catálogo** | hoje há dois botões com o mesmo nome; este abre o envio pelo WhatsApp |
| Painel do site | Loja | **Site** | "Loja" confunde com a loja física |
| Texto do Caixa | "Dashboard, aba Dinheiro" | "Números, aba Reservas" | acompanha as trocas acima |

## 3 · Compartilhar

**O que existe (lido no código, não percorrido na tela):** Compartilhar inteligente (escolha do app: WhatsApp Business, WhatsApp, Instagram, Copiar link, Mais; lembra o último); Enviar bonito com a tela única S185 (para quem → o que mandar: link com foto, cartões, capa de status; lojista: PDF ou planilha); Enviar catálogo (folha, fotos ou texto, com validade); e saídas próprias em Marketing, Estúdio, Lista de compras e convite de atacado.

**Proposta: uma porta só, em três passos.** 1) Para quem · 2) O que mandar · 3) Por onde. A tela S185 já faz 1 e 2; "folha, fotos, texto" do Enviar catálogo viram opções do passo 2; o passo 3 é sempre a escolha de app que já existe. Marketing, Estúdio, Lista de compras e convite mantêm o próprio conteúdo e entram direto no passo 3. Nenhuma função some; somem as janelas repetidas.

## 4 · Computador, notebook e tablet

- Tablet (700–1099 px): duas colunas; barra embaixo como no celular.
- Notebook e monitor (1100 px ou mais): ação da tela ao lado do título; listas em grade; janelas com largura máxima; nada esticado até 2560.
- Catálogo › peça: foto à esquerda, venda à direita. Inventário › peça: lista à esquerda, ficha à direita.
- Dinheiro e Resultados: as seções viram colunas lado a lado.
- Voltar no tempo: lista à esquerda, "antes × agora" à direita.
- Site › peça com giro: foto que gira à esquerda, cor e "Vista inicial" junto da foto (folha S260 de PC).
- Estúdio: câmera ocupa a altura; fila ao lado.
- Claro e escuro em todas as telas do app; o site segue só claro, com as temáticas.

## 5 · Testes feitos agora (medição por programa, sem olhar imagem)

`work/s269/teste.py`: propostas S265 e S267 (Resultados, Dinheiro, Início, Pendências, Catálogo › peça, Inventário › peça) em celular 390, tablet 820, notebook 1366 e monitor 2560, claro e escuro: **0 erros de JavaScript, 0 falhas novas no olho.js, nenhuma página mais larga que a tela.**

Não medido: depois de rolar; tamanhos de letra (não achei no app um ajuste de letra, depende da letra do sistema); giro do site nas temáticas; janelas novas (Voltar no tempo, Grupo). Esses entram como condição na hora de implementar, tela por tela, na tela de verdade.

## 6 · Estúdio na arquitetura nova (giro em vídeo, 30 quadros/s)

- **Captura:** vídeo de uma volta a 30 quadros/s no lugar de um quadro a cada 0,25 s.
- **Fotos saem do vídeo:** frente, 3/4 e perfil são o quadro mais nítido perto de cada ângulo. Não há sessão de fotos separada. A foto do cartão e do catálogo é a de frente.
- **Nota da peça:** julga as três fotos tiradas do vídeo (nitidez, luz, enquadramento) e o giro (volta completa, quadros por grau, sem tremor). Aparece "Aprovada" ou "Refazer: motivo".
- **Padrão da loja:** tamanho e posição ficam guardados como números e são aplicados ao mostrar; não precisa regravar para padronizar.
- **Cores:** um vídeo por cor, alinhado ao molde da primeira.
- **Fila:** mostra o que cada peça tem (fotos, giro) e começa pelas mais vendidas sem giro.
- **Peças antigas:** continuam com as fotos de hoje até serem regravadas; o site só mostra o giro quando ele existe.
- **Sem internet:** o vídeo fica na fila e sobe depois.
- **Espaço:** o app soma o peso guardado no GitHub e avisa perto de 70% de 1 GB.
- **Marketing e Status:** vídeo em pé tirado da mesma gravação.
- **Prato:** aprender o prato vazio uma vez por sessão (3 s).

## 7 · O que depende do dono

1. **Vídeo do prato:** tripé; prato inteiro dentro do quadro; luz da caixa ligada; 3 s do prato vazio girando; depois a peça, uma volta inteira na velocidade mais lenta; 1080p a 30 quadros/s. Com ele eu meço o aprendizado do prato, que hoje é só proposta.
2. **Teste no Xiaomi 13T (depois de implementar):** o giro arrasta liso; quanto demora para ficar pronto; trocar de cor girando; "Vista inicial"; rolar a página com o dedo sobre a foto; o Estúdio grava a 30 quadros/s.
3. **Um iPhone qualquer:** abrir uma peça com giro e arrastar. É o único risco que não consigo medir.
4. **Firebase (não consigo ver daqui):** confirmar o que já foi feito — regra de leitura de `estoque` e das `reservas`, publicação das funções, `reserva: true`, regra para cancelar pedido, `google-services.json` do app Android.
5. **ElevenLabs:** a chave entra só na sessão em que as vozes forem gravadas, depois da Mochi no computador; teto aprovado de 3.300 créditos.
6. **GitHub Pages:** as regras dizem que não é para loja; decidir mais adiante se o site muda de casa.
