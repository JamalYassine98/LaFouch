# Item 38 — giro mais rápido sem mudar o resultado · plano (S436 APP, 21/11/2026)

Decisões do dono (21/11 09:51 e 10:01): o tratamento CERTO vem primeiro; a meta de tempo não é dura; menos quadros e resolução
menor estão REPROVADOS; a placa gráfica do celular (WebGL/WebGPU) está APROVADA; tudo no celular; tratar por trás enquanto ele
grava a próxima cor. Números do simulador: TEMPOS-ITEM-38.md (ir ao quadro 36% · ler 8% · conta + codificação 56%).

## O que falta saber antes de escolher (não dá para decidir às cegas)
Os números são do simulador. No celular a proporção pode ser outra: lá "ir ao quadro" usa o decodificador do aparelho e pode pesar
muito mais (5 min ÷ 744 idas ≈ 0,4 s por ida, se fosse só isso). A v607 grava `[LF-CAM] tempos {…}` — **um giro do dono na v607
+ o comando do diário** dizem qual das opções abaixo vale a pena. Sem isso, qualquer escolha é sorte (regra 12).

## Opções, da mais segura para a mais arriscada

### A. Ler cada quadro UMA vez (corta a 2ª ida: até ~1/3 do tempo no simulador; mais no celular se a ida for cara)
- Hoje: 1ª passada mede os 360 quadros; 2ª passada volta a cada um para recortar, porque o recorte ("caixa") só existe depois de medir todos.
- Guardar os 360 quadros crus não cabe (360 × 960×540×4 ≈ 746 MB). Caminhos:
  - A1: guardar cada quadro da 1ª passada **comprimido sem perda** (PNG/`VideoFrame` na memória da placa) — custa memória e tempo de comprimir; medir.
  - A2: **decodificar em fila** (WebCodecs `VideoDecoder`): os quadros chegam em ordem, sem "ir ao quadro"; precisa separar o MP4/WebM em pedaços (um leitor de arquivo novo dentro do app.js). É a mudança que mais corta, e a mais trabalhosa.
- Igualdade: o quadro lido tem de ser o MESMO que a ida mostra hoje (mesmo tempo → mesmo quadro). Provar comparando os pontos dos 360 quadros um a um antes de trocar.

### B. Tirar a conta da tela principal (Worker + OffscreenCanvas)
- Não acelera sozinha; **destrava a tela**: o dono grava a próxima cor enquanto a anterior é tratada (pedido dele).
- A conta (`gtTratador`) já é uma peça só e não toca na tela: pode rodar igual dentro de um Worker. O vídeo (`<video>`, ida ao quadro) fica na tela principal e manda os pontos.
- Igualdade: mesma função, mesmos números → resultado idêntico por construção; provar com a prova de ponta a ponta (info, fotos, capa, quadro).
- É a de MENOR risco para o resultado e atende um pedido direto do dono.

### C. Placa gráfica (WebGL) para a conta dos pontos
- Diferença para o fundo, máscara e nitidez viram programas da placa. Ganho grande onde a conta pesa.
- Risco: a placa arredonda diferente de aparelho para aparelho → o resultado pode mudar em 1 ponto aqui e ali. Só entra parte por parte, cada uma com prova ponto a ponto contra a versão de hoje em mais de um aparelho; onde não der igual, não entra.

## Ordem proposta
1. **Esperar o diário do celular (v607)** — decide entre A e C.
2. **B primeiro** (não depende do diário, resultado idêntico por construção, pedido do dono): tratar por trás, com a fila de giros esperando e o aviso de pronto.
3. Depois a opção que o diário apontar (A se a ida ao quadro dominar; C se a conta dominar), sempre com a prova de igualdade.

## Pendências do celular que não são de velocidade
- Lente apagada na foto da frente (v587): corrigida para armação clara (v588/v589), **não reproduzida com o vídeo do dono** — precisa de uma gravação dele.
- Nota 100 em foto com um lado apagado: a nota não olha se a peça está inteira. Proposta: comparar a largura da peça na foto com a largura medida no giro (a "caixa") — se a foto tem menos de ~85% da largura, a nota cai e o app avisa. Precisa de esboço (muda texto/aviso na tela).
