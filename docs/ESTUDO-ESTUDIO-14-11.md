# Estúdio do app e o 360° completo — estudo e propostas (14/11/2026, S258)

Só leitura do código (`src/97-estudio.js`, `97-estudio-giro.js`, `97-giro-site.js`, `97-fotos-padrao.js`) e 3 telas vistas no simulador com câmera falsa (`work/s258/ve.py`). Nada implementado.

## Como é hoje
- Tela do Estúdio: 1 botão ("Começar · N peças na fila"), "Peça nova", a fila (no simulador: 24 peças, quase todas com "falta a foto de 3/4") e "Padronizar N fotos".
- Caminho principal: uma peça por vez, foto de frente e depois a de 3/4. O app clareia o fundo até 255 sem mexer na armação, enquadra em 3:2 e dá nota.
- Câmera: lente, ISO, velocidade, branco, foco, histograma, nível, moldura, avisos, 2 s, peaking.
- O giro (360) está escondido dentro do "?": filma 12 s no prato, guarda um quadro a cada 0,25 s (cerca de 48), o dono confirma numa régua o quadro da frente (o app sugere o mais simétrico) e o da 3/4. Saem frente + 3/4 + o VÍDEO do giro.
- O vídeo é comprimido e vai sozinho para o site; lá aparece o botão "360°" na peça e o selo "↻ 360°" no Destaque. É um vídeo que toca: o cliente não gira a peça.

## Leitura
- O 360 é tratado como extra, não como caminho. Por isso a fila acumula "falta a 3/4": cada ângulo é uma foto à parte.
- Do giro só se aproveitam 2 quadros e um vídeo. Os outros ~46 quadros, já filmados, são jogados fora.
- No site o 360 é passivo (vídeo), sem luz de estúdio quadro a quadro e sem fundo 255 garantido.

## Propostas — 360 completo ("um giro = tudo")
1. **O giro vira o caminho principal.** Uma volta no prato gera de uma vez: frente, 3/4 dos dois lados, perfil e costas (fotos), a peça giratória e o vídeo. A fila de "falta a 3/4" acaba.
2. **Peça giratória de verdade.** Dos quadros do giro saem 36 ângulos iguais (o app acha a volta completa comparando com o primeiro quadro e reparte por ângulo, não por tempo), todos com a mesma luz de estúdio, fundo 255, mesmo centro e mesmo tamanho, e a volta fecha sem pulo.
3. **No site:** na página da peça o cliente arrasta para girar, com inércia; ao chegar, a peça dá uma volta lenta e para (regra de luxo); toque duplo aproxima. Carrega 1 quadro e busca o resto só quando o cliente toca. Sem 360, tudo fica como hoje.
4. **No app:** girar com o dedo na ficha e no Catálogo (modo cliente no iPad da loja).
5. **Trocar de cor mantém o ângulo:** se a pessoa está vendo de 3/4 e toca em outra cor, a outra cor aparece no mesmo ângulo.
6. **Marketing:** o vídeo sai do giro tratado (rotação suave, fundo infinito, aproximações) em vez da gravação ao vivo que você reprovou como amadora; serve para Status e Destaque.
7. **Guia ao vivo na câmera:** anel de 0 a 360° que enche enquanto a peça gira, aviso de "prato rápido/lento demais" e de volta incompleta, antes de salvar.

## Propostas — Estúdio em geral
8. **Fila que mostra o que cada peça tem:** frente, 3/4, 360, nota — em vez de só "falta a 3/4"; ordenar por "mais vendidas sem 360".
9. **Câmera no padrão de luxo** (mesma linguagem do leitor aprovado): cantos finos, réguas próprias, menos caixas pretas; controles avançados recolhidos.
10. **Resultado em uma tela:** os ângulos escolhidos lado a lado, a nota de cada um e "refazer só este".
11. **Fundo infinito como segundo acabamento** (pergunta sua de 11/11): fundo 255 para catálogo; sombra suave de chão para Destaque e Marketing.
12. **Coerência entre peças:** o app compara tamanho, centro e clareza de cada peça com a média da loja e avisa a que destoa.

## O que eu não sei (preciso de você)
- Qual é o seu equipamento de 360: prato motorizado? quantos segundos por volta? tem luz/caixa próprias?
- O que "completo" quer dizer para você: girar com o dedo no site, mais ângulos de foto, vídeo melhor, ou tudo.
- Peso: 36 quadros por cor pesam mais que um vídeo; preciso medir com um giro real seu antes de prometer tamanho e velocidade no site.
- Não vi o giro funcionando (o simulador não tem prato nem câmera real) nem as telas de resultado.

## S260 (14/11 02:18) · O giro real do dono, o conceito dele e o desenho novo dos controles

### O vídeo que o dono mandou (medido)
- 1080×1920, 30 quadros por segundo, 11,6 s, 5 MB. A peça gira cerca de 150° (de −22° até 131° em relação à frente), a uns 13° por segundo: uma volta inteira nessa velocidade leva perto de 27 s.
- A frente foi achada SOZINHA pela simetria (quadro de 1,7 s; nota 0,39 contra ~0,2 dos vizinhos). 3/4 e perfil saem contando o ângulo a partir dela.
- Fundo filmado em cinza-lilás; o tratamento (`work/s260/trata.py`) deixa branco e mantém o mesmo recorte em todos os quadros. Sobra um halo fraco da borda do prato e as lentes transparentes clareiam demais.
- No perfil a haste sai do quadro: falta distância (o dono já avisou que altura e ângulo serão ajustados com o tripé).
- Peso medido: 70 quadros de 720×480 = 1,1 MB; 36 quadros ≈ 570 kB; o 1º quadro ≈ 16 kB. O vídeo original pesa 5 MB.

### Conceito do dono (registrado)
1. O sistema vai gravando até completar as informações.
2. Com isso ele mesmo pega a frente e a 3/4.
3. Se detectar tudo certo, fecha a câmera sozinho.
4. Quando entram peças novas, o sistema padroniza o perfil de todos os produtos: mesmo ângulo, mesma distância, mesmo manuseio no site.

### Como eu elaboro esse conceito
- **Lista ao vivo do que já tem:** enquanto grava, o app marca Frente, 3/4, Perfil e Volta completa conforme acha cada um; o anel de 0–360° enche. Quando tudo está marcado e a qualidade passa (foco, peça inteira no quadro, velocidade), a câmera fecha com uma confirmação curta. Nada de botão de parar.
- **Avisa o que impede de completar**, no momento: "a haste está saindo do quadro — afaste", "prato rápido demais", "fundo escuro".
- **Perfil padrão da loja:** a primeira peça boa define distância, altura e tamanho. Em toda peça nova o app compara com esse perfil e orienta antes de gravar ("afaste um pouco", "suba o celular").
- **Padronização depois de gravar:** ângulo zero = frente achada pela simetria; os mesmos 36 ângulos; mesma largura da peça de frente dentro do quadro; mesma linha das lentes na vertical; mesmo nível; mesmo branco. Assim toda peça gira igual no site, e trocar de cor ou de peça mantém o ângulo.
- **Peças antigas:** quando o padrão muda, o app refaz o recorte das que já existem para todas ficarem iguais.

### Controles no site — desenho novo (S260)
- Sai a fileira de 4 botões do S259. Entra uma **régua fina** sob a foto, com marcas e três paradas escritas (FRENTE · 3/4 · PERFIL); o ponto mostra o ângulo; tocar numa parada faz a peça girar até lá; arrastar a peça ou a régua gira. Com a volta inteira filmada, a régua vira um ciclo sem começo nem fim.
- **Ampliar é por gesto** (pinça, toque duplo, roda do mouse), sem botão.
- **Um único ícone** (canto de cima, espelhando o coração): "ver em grande" — tela inteira branca, peça grande, a mesma régua, ✕ para fechar.
- A dica "Arrastá para girar" aparece uma vez e some no primeiro toque. Ao chegar, a peça gira devagar até a 3/4 e volta para a frente.
- Folhas: `work/s260/s260_site_celular_peca.jpg`, `s260_site_celular_manuseio.jpg`, `s260_site_pc_peca.jpg`, `s260_giro_tratado.jpg`; vídeo `s260_video_site_peca_giratoria_real.mp4` (14 s, quadros reais).

## S260 v2/v3 (14/11 02:29) · aro e manchas corrigidos; manuseio mais simples

### O que o dono apontou
1. No fim da armação aparece um ARO que não foi tratado. 2. Há MANCHAS no fundo, perto da armação. 3. Quer um jeito de mover mais minimalista e mais simples para o cliente.

### Por que apareciam
- O aro é a borda de trás do prato giratório. Meu primeiro tratamento adivinhava o fundo quadro a quadro (borrando a imagem) e uma borda nítida como a do prato não some assim.
- As manchas são a sombra da peça no prato e o tom lilás visto através das lentes; o primeiro tratamento só clareava, não separava "peça" de "resto".

### Tratamento novo (`work/s260/trata2.py`)
- A câmera fica parada e só a peça se move. Então, em cada ponto da imagem, o que aparece na maior parte do tempo É o fundo. O sistema monta o fundo vazio a partir do próprio giro e divide cada quadro por ele: o aro some por inteiro, porque ele está parado.
- Depois separa o que é peça (mais escuro que o fundo, ou colorido) do resto, e o resto vira branco puro: sombras e manchas saem.
- Medido nos seus quadros: sujeira longe da peça caiu de 4,7% da imagem para 0,3% (frente), 4,6% → 0,25% (3/4). Peso: 36 quadros ≈ 485 kB.
- Preço: partes muito claras da peça (ponta prateada da haste, fio de baixo das lentes) ficam fracas ou falhadas contra o branco. Solução no produto: filmar 2 s do prato vazio no começo de cada sessão (fundo exato) e proteger as bordas finas; e a opção de deixar uma sombra de chão suave e regular, em vez de apagar tudo.

### Manuseio simples — "só a peça" (S260 v3, `gera3.py`)
- Sai a régua e sai o ícone. Fica a peça e três pontinhos (frente, 3/4, perfil), como numa galeria.
- Arrastar gira; ao soltar, a peça encaixa sozinha na parada mais próxima e o nome da parada aparece por um instante e some.
- Um toque na peça abre em tela inteira; lá, arrastar gira igual e pinça amplia; toque duplo volta.
- A altura da página não muda em relação a hoje.
- Folhas: `s260_tratamento_v1_x_v2.jpg`, `s260_site_celular_peca_v3.jpg`, `s260_site_celular_manuseio_v3.jpg`; vídeo `s260_video_site_manuseio_v3.mp4`.
- olho.js: celular parado 0 pioras; rolado 1 aviso ("Hablar por WhatsApp" colado) que não vem da proposta (a altura da página é a mesma; é o estado da lingueta do WhatsApp no instante da medição) — a confirmar.
