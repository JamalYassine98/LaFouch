# IDEIAS 18 — página inicial inteira (dono 26/11 15:25 + 16:23; esboço, esperando o dono)
Arquivos: esboco-18-inicio-inteiro.jpg (Hoje × Proposta, página inteira, celular 390) · proposta.py → proposta.js · roda.py (simulador do kit, página inteira + conferências).
Base: site real (kit) + aprovado em espírito (capa de tela inteira 17b). Estudos: 16-padrao-luxo/ESTUDO.md §7–§11, VOZ-LAFOUCH.md.
Fotos: só DESENHO (recortes do vídeo da Made que o dono mandou, em 17-inicio-modelos/desenho/) — na loja, todas do Semp. Masculino: sem foto.

## Para que serve (ui-review §1)
Dar vontade e levar a cliente à peça que combina com ela · cliente no celular · a coisa: chegar a uma peça (pela foto, pelo tipo ou pelas ferramentas de rosto/grau).

## Ordem
1. Capa de tela inteira (17b).
2. Selos (como hoje, linha fina).
3. Ferramentas (dono 16:23): "Experimente no *rosto*" (provador, upgrade do "qual combina") e "Descubra seu *grau*" — cartões largos com foto, nome sobre o véu. "Comece por aqui" sai; Dúvidas fica no menu e no rodapé.
4. "Escolha o seu *estilo*": Feminino | Masculino (campanha, foto inteira, só o nome) + Solar · Leitura · Armações em pílulas (uma decisão por bloco — o erro crucial das versões 2b–2e eram duas grades de categoria empilhadas).
5. "Acabou de *chegar*": escolha de dois lados Feminino | Masculino (regra 15) + peças deslizando (2 + a ponta).
6. "Visto na *foto*": foto grande e, logo abaixo, FORA dela, a peça que a modelo usa (ESTUDO §10).
7. "Os mais *pedidos*": igual ao 5.
8. "Como fica no *rosto*": vídeos curtos em pé do Semp; código e preço embaixo, fora da imagem.
9. Para lojistas, aviso de novidades e rodapé: como hoje.

## Como fazer (regra 12)
- Fileiras que deslizam: os itens flex da coluna precisam de min-width:0 / max-width:100% (sem isso a página alarga — causa achada no esboço).
- Foto de campanha = um componente só (.lfx-ft: arredondado 18, véu de baixo, nome Fraunces 20) para categorias, ferramentas, visto na foto e vídeos.
- Escolha de dois lados = o componente da regra 15 (toque 44).
- Espaços só 8/16/24/48.

## Revisão (ui-review + design-critique, antes do dono)
- Corrigido: títulos das ferramentas quebravam linha em 2 colunas → cartões largos (L4); texto da peça colado; foto de vídeo com play duplicado; página mais larga que a tela.
- Fica para o dono: 4 fotos de pessoas antes da primeira peça (capa, 2 ferramentas, Feminino) — se pesar, as ferramentas podem virar foto da peça/ícone grande.
- Do site de hoje (não deste esboço): "Ver todos ›" e "Prefiro por e-mail" com toque < 44; botão do WhatsApp por cima de conteúdo.

## v2 (dono 26/11 17:08: "muito melhor, mas falta MUITO") — substitui a ordem acima
Críticas do dono → o que mudou:
- "Descubra seu grau" com mulher jovem não combina (leitura = 45+) → lugar de foto do Semp: pessoa de 45+ lendo.
- Só mulheres → Masculino e vídeos com homem e 45+ (lugares de foto do Semp).
- Armações pequenas demais ("a ideia é vender o produto") → Acabou de chegar com a peça grande (1,25 por tela); Mais pedidos em grade 2 × 2 com peças grandes; Visto na foto com a peça em tamanho de vitrine e "Ver modelo".
- A escolha Feminino | Masculino nas listas não combinava e repetia → sai; o gênero se escolhe UMA vez (cartões "Escolha o seu *estilo*").
- Acabou de chegar parecia repetido → cada lista com formato próprio (carrossel grande × grade 2 × 2).
- Botões repetidos → saem as pílulas e as escolhas de dois lados.
Ordem v2: capa · selos · Experimente no *rosto* / Descubra seu *grau* · Escolha o seu *estilo* (Feminino | Masculino) · Acabou de *chegar* (carrossel grande) ·
Visto na *foto* (foto + a peça grande) · Para cada *uso* (Solar "Proteção UV" · Leitura "Para ler de perto" · Armações "Para a sua receita", vitrine que desliza) ·
Os mais *pedidos* (grade 2 × 2) · Como fica no *rosto* (vídeos: mulher, homem, 45+) · Para lojistas · novidades · rodapé.

## v3 (dono 26/11 17:13)
- Sem "foto do Semp": fotos de desenho de homens e 45+ (Unsplash, em 17-inicio-modelos/desenho/net/) — Masculino, Descubra seu grau (homem 45+ lendo), vídeos.
- **Cartão de peça novo (uma família para a página toda):** sem caixa branca nem borda; a peça num painel rosé claro #f4ebf1 arredondado 18
  (o fundo branco da foto some com mix-blend-mode:multiply); embaixo, solto: marca · material (Inter 12, cinza), código em Fraunces 18, cor, preço Inter 600 15 preto;
  "Última unidade" vira etiqueta branca pequena no canto do painel. Vale para Acabou de chegar, Mais pedidos, Visto na foto, Para cada uso, vídeos (código em Fraunces) e Para lojistas.

## v4 (dono 17:17 + 17:22: "a reclamação está nos cartões dos produtos em si e na organização") — esboco-18-v4-parte1…5.jpg (nítidos, tamanho real)
Estudado com os plugins frontend-design e design-elevation (evitar o "kit de cartões SaaS": caixas iguais, borda, painel em tudo).
- **Cartão de peça v4 (vitrine):** sem caixa, sem painel, sem borda — a peça pousa no fundo rosé da página com uma sombra de apoio suave (como numa vitrine);
  linha 1: código em Fraunces 18 e preço preto na MESMA linha de base (L2); linha 2: o detalhe, cinza; linha 3: cores em anéis de 12 px;
  "Últimas unidades" em texto vinho pequeno embaixo (nada sobre a foto). Imagem presa numa caixa de proporção fixa (3:2 carrossel, 1:1 grade, 16:9 destaque),
  então todos os cartões de uma fileira têm o preço na mesma altura. "Visto na foto" usa o MESMO cartão + "Ver modelo" largo.
- **Organização:** ferramentas viram um painel claro com 2 linhas junto dos selos (servem, não disputam com as fotos); Para cada uso = lista em pé com linhas finas
  (nada cortado na borda); nenhuma peça repete na página; BR44145 fora; Para lojistas com foto de lote de armações (desenho).
- Código: estilos substituídos apagados no mesmo passo (bloco duplicado e o cartão-foto antigo das ferramentas).

## v5 (dono 17:32) — esboco-18-v5-parte1…5.jpg
- **Peças fora do quadro / descentralizadas — causa:** cada foto do catálogo tem margem e posição diferentes. Conserto no jeito natural (regra 12): a foto é
  normalizada UMA vez ao subir (recorta o branco, centraliza, mesma escala: peça em 86% da largura) — no esboço, função peca() em proposta.py; na loja, no Titan/catálogo.
- **Preço competia com a peça seguinte:** código, detalhe e preço empilhados à esquerda; carrossel 1,2 por tela com 24 entre cartões.
- **Linha de detalhe humana:** formato e cor do nome da peça ("Redonda rosa") no lugar de "LaFouch · acetato".
- **Para cada uso = capa de revista** (o dono acertou: alterna campanha × vitrine): mosaico 1 grande (4:5) + 2 (3:4), foto de quem usa aquele tipo, nome e linha curta no véu.
- **Ferramentas:** 2 cartões-foto quadrados (mesmo componente de campanha) "Provador virtual · Pela câmera" e "Teste de grau · Em 1 minuto".
- Itálico só na capa, "Escolha o seu *estilo*" e "Como fica no *rosto*". Véu das fotos um pouco mais forte (nome branco legível em foto clara).
- Código: blocos duplicados e estilos antigos das ferramentas apagados.

## v6 (dono 17:41) — esboco-18-v6-parte1…5.jpg
- Ferramentas com cara de ferramenta (não confundem com a categoria Leitura): **Provador virtual** = tela de celular com o rosto e os cantos de leitura facial;
  **Teste de grau** = cartão de leitura com letras que diminuem (desenhado como imagem). Nome em Fraunces + uma linha embaixo, fora da imagem.
- Para cada uso: só o nome (Solar · Leitura · Armações), sem linha extra.
- AC1055 "muito para a direita" — causa: foto de 3/4, a haste puxa a caixa. A normalização agora centraliza pelo **centro de massa** da peça (não pela caixa).

## v7 (dono 17:47) — esboco-18-v7-parte1…5.jpg
- **Capa sem ocupar a tela / blocos tortos (direita maior):** não era o desenho — era a barra de rolagem do simulador (16 px) entrando na foto.
  No celular ela não ocupa espaço; o roda.py agora corta essa faixa. A página medida: largura = tela (390), sem sobra.
- **Fotos 3/4:** todas as peças serão 3/4, então a centralização pelo centro de massa vale para todas, automática, ao subir a foto (não depende da foto).
- **Ferramentas:** voltam a ser o MESMO cartão-foto da página (harmonia), mas com foto de ação que diz o que é: pessoa de óculos tirando selfie
  (Provador virtual · No seu rosto) e pessoa apontando a tabela de letras (Teste de grau · Em 1 minuto). 3:4, nome Fraunces 18.

## v8 (dono 17:52) — esboco-18-v8-parte1…5.jpg
- Ferramentas = foto de ação + nome + o que faz + **botão com o verbo** (o botão diz "isto é uma ferramenta"; mesma família do "Ver modelo").
- **Provador virtual** · "Pela câmera do celular" · [Experimentar] — foto: pessoa de óculos fazendo selfie.
- **Teste de leitura** · "Grau para ler de perto" · [Fazer o teste] — foto: pessoa 45+ lendo de perto. Sai a tabela de letras de consultório
  (sugeria teste de miopia e poderia enganar a cliente: o teste do site é só para leitura).

## v9 (dono 17:55, inspiração: blocos de vantagens da Made, com o provador entre eles) — esboco-18-v9-parte1…5.jpg
- Selos + ferramentas = UMA grade de serviços 2 × 3, blocos iguais com ícone de traço vinho, nome (Inter 600 14) e uma linha curta que cabe numa linha.
- As 2 ferramentas vêm primeiro, em bloco branco com borda fina e "›" (tocáveis): Provador virtual · Pela câmera; Teste de leitura · Para ler de perto.
- Depois: Delivery · Todo o Paraguai; Retirada · Na loja em CDE; Pagamento seguro · PIX ou Banco Familiar; WhatsApp da loja · Dúvidas na hora.
- Claros, na nossa identidade (a Made usa blocos pretos — não copiado). A fila antiga de selos sai (a grade a substitui).

## v9 RECUSADA (dono 17:58: "muito pior e genérico"; a inspiração era só o jeito de mostrar o provador, não o resto) → v10
- Lição (ESTUDO §13): inspiração vale para o que o dono apontou, nada além; uma grade de 6 blocos iguais é exatamente o "kit genérico".
- v10: os selos voltam como estavam; só as 2 ferramentas mudam: 2 blocos rosé claros, conteúdo centralizado, ícone de traço fino desenhado
  para cada uma (provador = cantos de leitura do rosto + rosto de óculos; leitura = óculos sobre linhas de texto), nome Fraunces 18, uma linha.

## v11 (dono 18:01–18:03) — esboco-18-v11-parte1.jpg (só a parte 1 mudou)
- Análise aprovada: ícones desenhados à mão destoavam; o fundo rosé era a única caixa da página.
- Ferramentas com os **personagens do "Descubra seu formato"** (ilustração que o site já usa): Provador virtual = a personagem com os cantos de leitura
  do rosto (vinho) e a armação experimentada; Teste de leitura = o personagem com óculos de leitura e um cartãozinho de texto.
- **Sem caixa:** dois lados com linha fina em pé no meio; linha fina em cima separa dos selos (um bloco, dois níveis).
- Próximo, se o dono quiser: personagens novos gerados no Google Flow (mesmo estilo), em vez dos óculos desenhados por cima.
- Código: estilos duplicados limpos (235 → 87 linhas de CSS).

## v12 (dono 26/11 21:33: "já faz a versão de PC e Celular") — esboco-18-v12-celular-parte1…5.jpg · esboco-18-v12-pc-parte1…3.jpg · esboco-18-v12-pc-HOJE.jpg
- Ferramentas com os **personagens novos do Flow** (casal quadrado aprovado, armações finas): Provador = a mulher; Teste de leitura = o homem.
  Os óculos desenhados por cima (ocl) saíram, porque o personagem já vem de óculos. Por enquanto são recortes da tela do Flow, em baixa resolução; quando o dono mandar os originais, troca o arquivo e nada mais muda.
- **PC (≥1024), um bloco só no CSS:** coluna central de 1200; Acabou de chegar = fileira de 4 (sem deslizar); Visto na foto = foto e peça lado a lado;
  Para cada uso = 3 colunas; Os mais pedidos = 4 colunas; Como fica no rosto = 4 vídeos lado a lado; Escolha o seu estilo = 2 fotos 4:3; títulos 32.
- roda.py: LF_PC=1440x900 tira a foto no PC (kit.PC).

## v13 (dono 21:41–21:42) — esboco-18-v13-pc/celular-visto-na-foto.jpg · -lojistas.jpg (só esses dois blocos mudaram)
- **Visto na foto = uma composição só:** um painel rosé (#f4ebf1) com a foto encostada na borda e a peça pousada nele; linha "Na foto" acima do código.
  No PC a peça fica na mesma linha dos óculos no rosto: a foto tem o dado --oy (altura dos óculos, como um ponto de foco; aqui .48) e uma conta só põe o centro da peça nessa altura.
  No celular: o painel continua embaixo da foto, com a peça dentro.
- **Para lojistas (PC):** o botão estava preso à direita de uma coluna mais larga que o texto. Agora segue o eixo do texto (começa na margem dele, 24 abaixo); foto e texto centrados na altura. Regra da família: botão dentro de bloco de texto começa na margem do texto.
- Conserto: um comentário sem fechar (v12, depois das fotos) engolia as ferramentas no código; fechado.

## v14 (dono 21:49) — esboco-18-v14-pc/celular-lojistas-rodape.jpg
- Para lojistas (PC): metade e metade (foto | texto). A divisão cai no eixo do meio da página, o mesmo eixo do bloco centrado de novidades logo abaixo (antes: foto de 340 + texto solto, outro eixo).
- Rodapé: eram duas linhas seguidas (a de baixo das novidades + a do rodapé). Fica só a do rodapé.

## v15 (dono 21:54) — esboco-18-v15-pc/celular-lojistas.jpg
- Para lojistas = cartão de campanha largo (família .lfx-ft): foto de vitrine organizada, véu, título "Para lojistas" + uma linha + botão contornado branco (como a capa), tudo centrado.
  Saem: o título de fora, "PARA REVENDER" e "Compre em quantidade" (um rótulo só). Celular 4:3; PC largura total, 360 de altura (mais baixo que as fotos de categoria).
- Os estilos do bloco antigo (.hata) foram apagados no mesmo passo.

## v16 (dono 21:58) — esboco-18-v16-celular-lojistas.jpg (só o celular; o PC da v15 está aprovado e não mudou)
- Celular: cartão 4:5, vitrine limpa em cima, título + linha curta ("Preços especiais e atendimento exclusivo para lojas.") + botão embaixo à esquerda, sobre o véu de baixo — igual aos outros cartões de foto.

## v17 (dono 22:00: "alto demais") — esboco-18-v17-celular-lojistas.jpg
- Celular: cartão quadrado (1:1) em vez de 4:5; véu de baixo mais alto e um pouco mais escuro (o texto fica sobre a vitrine, então precisa de leitura firme).

## v18 (dono 22:02) — esboco-18-v18-celular-lojistas.jpg
- Celular = o MESMO cartão do PC, compacto: 4:3, composição centrada e véu por igual; encolhe o conteúdo (linha curta em 2 linhas, título 24, 8 e 16 de espaço, botão 44). As versões de texto embaixo (v16/v17) saíram do código.

## v19 (dono 22:04) — esboco-18-v19-pc/celular-novidades.jpg
- Novidades e ofertas: mantém o formato (momento calmo, só texto, antes do rodapé — não repete o cartão de foto). Sai a mancha rosada borrada atrás e o itálico do "primeiro"
  (itálico só na capa, em estilo e em rosto); espaços na escala: 48 acima e dentro, 24 até o botão, 16 até "Prefiro por e-mail".
- Causa da mancha, para o SITE: o loja.html tem duas regras brigando — `html.v5 .hnews.hn2{background:none}` e, mais forte, `html.v5 body .hnews.hn2{background:radial-gradient…}`.
  O jeito natural é apagar a do gradiente (e os números fora da escala: 26/28/18/14), não sobrepor.

## v20 (dono 22:09) — esboco-18-v20-pc/celular-novidades-rodape.jpg
- Causa do vão entre "Prefiro por e-mail" e o rodapé: os 48 do bloco + a margem de 42 do rodapé somados (88). Agora o rodapé não soma margem depois das novidades: 48 em cima, 48 embaixo.
- Conserto meu: na v19 (depois da correção da especificidade) o bloco ganhou 16 de lado e o título quebrava em 2 linhas no celular. O bloco já está dentro das margens da página: lado 0. O título ocupa a largura toda no celular (359 de 359): em espanhol ou com letra maior, vale a regra L4 (a letra do grupo diminui).

## v21 (dono 22:17, APROVADO a família de cor) — esboco-18-v21-celular-cor-topo.jpg · -cor-rodape.jpg (Hoje × Proposta) · esboco-18-v21-pc-cor-topo.jpg
- Uma cor de destaque só: a oficial da loja, CMYK C47 M91 Y29 K8 = #943D6F (perfil FOGRA39 → sRGB). Num lugar só: `:root:not([data-ev]){--ac:#943d6f;--ac2:#943d6f;--logo:…}`
  (as temáticas de evento ficam com as cores delas). Logo recolorido na cor oficial (logo-cor-oficial.png, mesma forma, só a cor).
- No esboço, os 7 #943d6f escritos à mão viraram var(--ac).
- Para o SITE: trocar o --ac de :root (#8D3A69 → #943D6F) e o arquivo do logo (#7E4A6E → #943D6F); nada de cor de destaque escrita à mão.

## v22 (dono 22:23, APROVADO) — esboco-18-v22-pc/celular-capa-margaux.jpg
- Capa: o título é só o nome do modelo, "Margaux" (Fraunces, sem itálico); formato e material na frase de baixo. Sai "Armação LaFouch quadrada" (a marca já está no logo, logo acima).
- Os nomes das peças vêm do SEMP no cadastro (som francês, um por modelo; o dono aprova). Com isso, o itálico da página fica só em "Escolha o seu *estilo*" e "Como fica no *rosto*".

## v23 (dono 22:26) — esboco-18-v23-celular-capa-tela.jpg · esboco-18-v23-pc-capa-tela.jpg (fotos do tamanho exato da tela)
- Causa de a capa não ocupar a tela no celular (aparecia a fila de selos embaixo): o site usa zoom na letra, então a altura em px do CSS ficava ~4% menor na tela (terminava em 813 de 844).
  Agora uma conta só mede quanto 1 px do CSS vale na tela e põe a capa exatamente da altura visível menos o topo; refeita quando a barra do navegador aparece/some ou a tela gira. Medido: celular 74→844 de 844; PC 82→900 de 900.
- A frase de baixo quebra em linhas equilibradas (text-wrap: balance): sem "haste." sozinha.
- Para o SITE: a mesma conta vale para toda tela que ocupa a tela inteira (não usar vh/dvh enquanto houver zoom na letra).

## v24 (dono 22:30–22:32) — esboco-18-v24-pc/celular-capa-lamina2.jpg (lamina2.py gera lamina2.js = proposta + a lâmina 2)
- Lâmina 2 da capa = natureza-morta do Semp: fundo rosé suave, "Novo modelo" + o nome grande (Fraunces 144 no PC, 72 no celular), as cores do MESMO modelo lado a lado (PC) / uma embaixo da outra (celular) com o nome da cor, frase curta e "Ver a peça" contornado na cor oficial; o 2º ponto aceso.
- Peças de desenho no lugar das cores da Margaux: GR3340 (preto) e GR3350 (cristal). A capa alterna: lâmina 1 = campanha com modelo; lâmina 2 = natureza-morta.

## v25 (dono 22:34–22:43) — esboco-18-v25-pc/celular-capa-lamina2.jpg (substitui a v24, que montava recortes)
- Lâmina 2 = UMA foto de estúdio gerada no Flow (semp/natureza-morta-pc.jpg 1376×768 e semp/natureza-morta-celular.jpg 768×1361): as duas cores em 3/4, pousadas no rosé suave, luz de lado, sombra real.
- Por cima: "Margaux" em Fraunces fina (peso 300, tamanho óptico 144; 168 px no PC, 76 no celular) e a frase ao lado (PC) / embaixo (celular). Sem nome de cor e sem botão — a lâmina inteira é tocável; os pontos ficam (o 2º aceso).
- Descoberta: o simulador do kit não tem a Fraunces (bloqueia a internet), então todos os títulos dos esboços saíam em Georgia. Para esta lâmina, baixei pelo navegador do dono só as letras de "Margaux" no peso 300 (semp/fraunces-300-margaux.woff2).
- Para o SITE: carregar a Fraunces também no peso 300 (hoje só 500 e 600).

## v26 (dono 22:48) — esboco-18-v26-pc/celular-capa-lamina1-margaux.jpg · -lamina2-odeon.jpg
- Cada armação tem o SEU nome: a da cafeteria é "Margaux"; a natureza-morta (preto e cristal) passa a "Odéon".
- Frases do Semp (no lugar da descrição técnica): Margaux = "Leve como uma tarde sem pressa." · Odéon = "Para quem fala pouco e é sempre lembrado."
  Seguem a VOZ-LAFOUCH: curtas, humanas, sem exclamação, sem "luxo" e sem superlativo; falam de quem usa, não da ficha técnica (formato e material ficam na página da peça).
- Letra: semp/fraunces-300-titulos.woff2 (letras de "Margaux" e "Odéon").

## v27 (dono 22:53) — esboco-18-v27-pc/celular-capa-lamina2-odeon.jpg
- Proporção título × frase: PC 168→120 e 18→24 (de ~9:1 para ~5:1); celular 76→64 e 15→17, frase em 2 linhas equilibradas (máx. 280).

## v28 (dono 22:57, estudo §18 APROVADO) — esboco-18-v28-pc/celular-capa-lamina2-odeon.jpg
- Nome em 144 no PC (ponto ótimo do tamanho óptico da Fraunces) e 80 no celular (~60% da largura); frase em Inter leve (300), 28 no PC e 20 no celular, cor do texto principal.
- Frase do Semp pelo método (história do nome → quem usa → ritmo de verso): Odéon = "Presença que dispensa palco."
- Obs.: o simulador pode não ter a Inter 300 instalada; no site real a Inter vem do Google (incluir o peso 300).

## v29 (dono 22:59) — esboco-18-v29-pc-capa-lamina2-odeon.jpg (só o PC; o celular da v28 está perfeito)
- O texto conversa com a foto: grade de 2 metades — "Odéon" centrado sobre a armação preta, a frase sobre a de cristal; os dois na MESMA linha de base (align-items: last baseline).
- O bloco desce até perto das armações (fundo do bloco a 64% da altura, acima da haste mais alta, a do cristal); o respiro fica em cima.
- Para o Semp: a foto da natureza-morta segue uma "zona do título" fixa (peças da metade para baixo, a de trás mais alta à direita), para o texto sempre cair no lugar certo. Conferir em 1920 e 2560 na implementação.

## v30 (dono 23:00–23:02: "a anterior estava melhor, só posicionar para não competir") — esboco-18-v30-pc-capa-lamina2-odeon.jpg
- Volta a dupla da v28 (nome + frase ao lado). Lição: texto nunca em cima de uma peça — sempre no espaço vazio, com folga das armações (ESTUDO §18).
- Posição: começa na borda esquerda da armação preta (6%) e fica no meio da faixa vazia de cima (até 62% do fim), longe da haste do cristal, que é o ponto mais alto da foto, à direita.

## v31 (dono 23:03, comparando com a Évora) — esboco-18-v31-pc-capa-lamina2-odeon.jpg
- Causa da disputa entre a frase e o nome: a frase estava centrada pela CAIXA do nome (que inclui o acento e a haste do "d"), então flutuava acima do miolo das letras; e estava na mesma cor escura do nome, com o mesmo peso visual.
- Agora: a última linha da frase apoia na linha de base do "Odéon" (fica na altura do miolo das letras, como na Évora) e a frase vai para o tom secundário (#6B5A66): o nome manda, a frase acompanha. Posição horizontal da v28 (centrada).

## v33 — Visto na foto com a peça REAL do catálogo (SL2290 "Lucien")
- Foto: Flow (Nano Banana 2.1) recebeu a foto do catálogo SL2290 enviada pelo dono e gerou o mesmo modelo usando ESSA armação (tartaruga, lente âmbar, rebites). Capturada em 896×1200 (4 ladrilhos, emenda suavizada) → semp/visto-modelo-SL2290.jpg.
- Cartão no PC: centro do cartão na linha dos óculos — `top: calc(var(--oy)*100%); translate: 0 -50%`, um dado só (--oy = .37, altura dos óculos na foto). Sai o "−24%" chutado.
- Celular: igual ao v32 (cartão sobe no canto de baixo, sem cobrir rosto nem armação).

## v34 — Visto na foto sem frase e sem botão (dono 27/11 07:00: "quebra o ambiente de luxo"; PC "mal dá pra ver")
- Causa: a lição da lâmina 2 ("sem botão: a lâmina inteira é tocável") ficou presa àquele bloco; aqui o cartão já era link e a frase explicava o que a foto mostra. Saem .lfx-vtx (frase + "Ver modelo") e todo o CSS dele.
- PC: mesma ordem do celular (título no alto, como os outros blocos) e foto + cartão como UMA peça centrada: foto 50%, cartão sai 24% da foto, margem esquerda 31% (= 50% − 0,38 × 50%). Cartão maior no PC (48% da foto, nome 20, preço 16), centro na linha dos óculos (--oy).

## v35 — "Lucien" no lugar de "Visto na foto"; no PC o cartão à direita (dono 27/11 07:39)
- Título = a própria peça: nome em Fraunces fina + frase do Semp "Sol no rosto, calma no olhar." em tom secundário (padrão da lâmina 2). Lucien vem de lux (luz). O cartão fica só com peça + preço (o nome já está no título — §24).
- PC: cartão à direita, entra só 16% na foto (não toca orelha nem haste), centro na linha dos óculos; foto + cartão = 66% da largura, centrados (margem 17%); o nome começa na borda esquerda da foto (um eixo). Nome e frase na mesma linha de base.
- Simulador sem Fraunces 300 para estas letras: o nome aparece em Georgia (no site, Fraunces 300).

## v36 — os 4 pontos do ESTUDO §25 (dono 27/11 07:45: "estão corretos")
- Sem caixa: semp/SL2290-recorte.png (recorte da foto do catálogo, sem a sombra dura do estúdio) pousa no fundo da página e cruza a borda da foto. Classe .cart → .solta; o CSS do cartão saiu inteiro.
- Tamanho ~70% da armação no rosto (celular 30% da foto, PC 32%). Sombra suave do lado da luz da foto: drop-shadow(4px 8px 6px #3a281c1f).
- Preço como etiqueta: Inter 400, 13/14 px, #6b5a66, centrado sob a peça. A peça + o preço são o link; no PC a peça sobe 8 px ao passar o mouse.
- PC: a peça vai de 88% a 120% da foto, na linha dos óculos (--oy); conjunto centrado com margem 20%; o nome alinhado à borda da foto.
- v36 RECUSADO (dono 07:49 "piorou consideravelmente") → work/obsoletos/. Motivo e correção no ESTUDO §26. Próximo: trocar .solta por uma natureza-morta da SL2290 (Flow, mesma pedra e luz da campanha) como placa retangular sobre a borda da foto; o recorte sai.
- v35 volta como base PROVISÓRIA (dono 07:50); o .solta e o recorte saíram do proposta.py.

## v37 — a peça numa segunda foto, na pedra da campanha (dono 27/11 07:56: "ainda não ficou bom"; Flow no limite)
- semp/SL2290-pedra.jpg: a foto do catálogo multiplicada pela textura da parede da própria campanha (o branco vira pedra, a sombra do estúdio vira sombra na pedra). Provisório até a natureza-morta do Flow (pedido pronto na conversa).
- Placa retangular (.placa) cruzando a borda da foto, plano sobre plano; aro de 8 px da cor da página (var(--bg)) separa os planos — sem caixa branca e sem sombra de interface.
- Celular: a placa está NO FLUXO (margin-top −96 px sobre a foto), então o bloco seguinte se ajeita sozinho — saiu o padding-bottom chutado. PC: absoluta à direita, centro na linha dos óculos.
- Preço como etiqueta (Inter 400, 14, #6b5a66), sempre do lado de fora da foto (no PC, alinhado à direita da placa).

## v38 — padrão Madë (ESTUDO §27; dono 27/11 08:10 "sim")
- Foto fechada no rosto: semp/visto-modelo-SL2290-rosto.jpg (recorte 4:5 da campanha; a armação ocupa ~45% da largura).
- Palco: a PÁGINA sobe sobre a borda da foto (.palco, fundo var(--bg), cantos redondos do lado da foto, 32 px por cima); dentro, o palco branco quadrado (.pc) com a foto do catálogo a 86%. Sem sombra, sem aro.
- Celular: palco embaixo, recuado 16 px de cada lado. PC: foto 7/12 + palco 5/12, entrando 32 px pela borda direita da foto, no meio da altura.
- Preço pequeno (Inter 400, 14) alinhado à esquerda do palco; o nome continua no título (Lucien + frase).
- v37 (placa em pedra) superado → work/obsoletos/. Saíram .placa, --oy e SL2290-pedra no código.
- v38 RECUSADO (dono 08:12: 'copy paste' da Madë; falta identidade própria) → obsoletos. Ver ESTUDO §28.

## v39 — LaFouch como revista (aprovado 27/11 08:28; ESTUDO §28)
- Página 1: retrato fechado no rosto (4:5) + legenda de crédito ao pé: "Ele usa Lucien, âmbar · R$ 125" (Inter 13, #6b5a66).
- Página 2: a peça de estúdio pousada no papel — semp/SL2290-catalogo-justo.jpg com mix-blend-mode:multiply (o branco vira o fundo da página, a sombra do estúdio fica); embaixo o nome (Fraunces 300, 40/64) e a frase, centrados. A página 2 inteira é o link.
- PC: página dupla (1fr 1fr, 48 entre as páginas), a página 2 no meio da altura. Celular: uma página depois da outra (48).
- Saíram: título .lfx-vnome no alto, .palco/.pc (v38).

## v40 — uma folha só (dono 08:33: crédito desnecessário; peças separadas) — ESTUDO §29
- .lfx-vf = folha branca (radius 18, sem sombra). Foto sangra em cima/lados; .pag2 no branco: peça, nome, frase, 'Âmbar · R$ 125'. PC: folha deitada 1fr 1fr. Saíram a legenda .cred e .pag1. v39 → obsoletos.

## v41 — ferramentas em folhas (ESTUDO §30)
- Cada ferramenta numa folha branca (radius 18, sem sombra), gap 16 (PC 24); saíram a linha de cima e a linha em pé. Cartãozinho do teste de leitura: contorno de tinta #2a1f27, sem sombra; cresce com o personagem no PC. PC: folhas largas (2 colunas na largura da página), personagem 160×200, título 24.

## v42 — ferramentas com cara de ferramenta (dono 27/11 08:41–08:42)
- Ícone de traço (24×24, traço redondo 1,5, o mesmo desenho dos ícones do site), em vinho (ação); nome com "›" (leva a outra tela) e uma linha. Cada ferramenta numa folha; bloco próprio, separado dos serviços.
- Provador: rosto entre cantos de câmera; Teste de leitura: óculos sobre linhas de texto. Os personagens saíram do Início (ficam dentro das ferramentas); F['pm'/'ph'] saiu do proposta.py.
- PC: folha deitada (ícone ao lado do nome). v41 → obsoletos.

## v43 — PC: folhas das ferramentas pelo tamanho do conteúdo (máx. 360 cada), par centrado no eixo da faixa de serviços (dono 08:45: 'grande demais'). v42 → obsoletos.

## v44 — ícones refinados da "prateleira" (dono 08:49: os do Flow ficaram infantis)
- Serviços só em texto (os ícones saem; rótulo em tinta #2a1f27, peso 500 — o vinho fica só para ação).
- Ferramentas: ícones abstratos de traço fino (1,1): provador = quatro cantos de câmera + óculos redondos no meio (sem rosto); teste = óculos redondos sobre duas linhas. v43 → obsoletos; a imagem do Flow reprovada em obsoletos/icones-flow-infantis-27-11.jpg.

## v45 — ícones das ferramentas escolhidos no Flow, refeitos em vetor (dono 27/11 08:57–09:01)
- Provador (APROVADO 08:58): óculos redondos entre quatro cantos de câmera (semp/icone-provador-aprovado.png), vetor 28×20, traço .6.
- Teste de leitura: o 1º da 2ª folha (semp/icones-flow-leitura-27-11.jpg) SEM os cantos — cantos = câmera = provador; os mesmos óculos sobre três linhas que encurtam (tabela de leitura do óptico). v44 → obsoletos.

## v46 — Feminino | Masculino como GUIA (dono 09:04–09:05: revista só no conteúdo; função clara)
- Sai o título "Escolha o seu estilo" (a escolha é para quem, não de estilo; itálico numa palavra só era enfeite). As fotos com o nome + "›" dizem tudo (regra 16). 48 acima do par.
- PC: retrato 4:5, par centrado (máx. 440 cada) no eixo da faixa de serviços/ferramentas — antes 4:3 de meia página cortava a cabeça.
- Fotos atuais são provisórias: a feminina repete o cenário de café da capa e mostra a marca de outro (copo); trocar por um PAR feito pelo Semp (mesma luz e fundo, ambos com óculos como estrela, sem objetos nas mãos).

## v47 — ferramentas numa FAIXA colada embaixo da capa (dono 27/11 09:22–09:24; ESTUDO §32)
- .lfx-fers sai do meio da página e entra logo depois da capa, borda com borda, com a MESMA largura da capa (margens copiadas da própria capa). Fundo tinta #2a1f27 (continua o véu de baixo da capa), ícones aprovados em #f1dbe6, nome branco com ›, linha #ffffffb3, linha fina entre os dois. PC: par centrado (máx. 360 cada), ícone ao lado do nome.
- Serviços em texto logo abaixo da faixa (24), rótulos em tinta. Seletores com 'html body' porque capa e faixa ficam fora do #home.
- Lâmina de ferramenta na capa (tentativa errada de interpretação) apagada (lamina3.*). v45 → obsoletos.

## v48 — serviços no 2º andar da faixa + WhatsApp sempre no canto (dono 27/11 09:36–09:38)
- .htr entra DENTRO da faixa (.lfx-fers), ocupando as duas colunas: linha fina #ffffff1f, texto pequeno (12/13), rótulo branco 500 e detalhe #ffffffb3; sem ícone, sem ›. Some a linha solta embaixo da faixa.
- WhatsApp (a.wa): redondo 56, 16 do canto de baixo à direita, sombra leve; sai o "esconder ao rolar" do site (translate) — sempre visível. Para a implementação: espaço no fim da página (o botão nunca cobre a última peça/preço) e, na página da peça, acima da barra de Comprar.
- v47 → obsoletos.

## v49 — WhatsApp: como fica (dono 09:44 pediu para ver)
- html body::after com 88 de altura no fim da página (botão 56 + 16 + 16): no fim da rolagem nada fica embaixo do botão. 3 quadros: rolando · fim da página · página do óculos (hoje sem barra fixa de Comprar; o anel em volta do botão nessa página é o 'pulso' que o site já tem).

## v50 — WhatsApp no MESMO lugar em todas as páginas (dono 09:46)
- Achado: o site HOJE sobe e encolhe o botão na página da peça (index.html: html.onprod a.wa{bottom:92px/144px}, html:has(#layer .buyrow) …). Sai: a.wa:not(#lfx) fixa 56 a 16 do canto em todas as páginas. A linha de Comprar da peça está no fluxo da página (não é barra fixa), então não há conflito; se um dia houver barra fixa, é a BARRA que deixa o canto livre, nunca o botão que muda de lugar.
- Pendente de conferência: no simulador, depois de abrir a peça, a foto não mostrou o botão (o cálculo diz que ele está por cima, no canto) — conferir na implementação.

## v51 — Acabou de chegar (e toda a família de cartão de peça: vale também para "Os mais pedidos")
- Cada peça numa folha branca (radius 18, padding 16/24): a foto de estúdio é branca → vira o papel; saem o multiply e a sombra desenhada embaixo (flutuava sem chão).
- Texto pelo sistema aprovado: nome do Semp (Fraunces 18) + "Cor · preço" (Inter 14) — a mesma linha do bloco do Lucien. Sai a descrição técnica ("Redonda rosa"); bolinhas de cor só com 2+ cores.
- Nomes/cores PROVISÓRIOS (produtos de teste): Céleste·Rosé, Bastien·Ônix, Clémence·Cristal, Sabine·Ouro, Marceau·Grafite, Juliette·Ônix, Élise·Ametista, Colette·Pérola, Rémy·Ônix, Inès·Conhaque.
