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
