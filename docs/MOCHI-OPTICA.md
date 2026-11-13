# Presbiopia e precisão do teste da Mochi — estudo (13/11/2026)
Estudo de leitura, NÃO é orientação médica. Eu não sou oftalmologista; antes de mudar o cálculo, validar com um profissional e com clientes reais na loja. Nada implementado.

## 1. O que é presbiopia (vista cansada)
- O olho perde a capacidade de focar de perto com a idade (amplitude de acomodação). Tabela de Donders: 45 anos ≈ 3,50 D · 50 ≈ 2,50 D · 55 ≈ 1,75 D · 60 ≈ 1,00 D.
- Para ler com conforto a pessoa usa no máximo metade (até dois terços) da amplitude; o resto fica de reserva.
- O grau de perto (adição) = o que a distância pede − a metade da amplitude. A distância pede 1/distância em metros: 40 cm = 2,50 D · 33 cm = 3,00 D · 30 cm = 3,33 D · 60 cm = 1,67 D.
- Por isso o grau DEPENDE DA DISTÂNCIA de uso. Tabela por idade (Borish): aos 50 anos, +1,25 a 40 cm e +2,00 a 33 cm.
- Óculos de leitura prontos: +1,00 a +3,50 de 0,25 em 0,25; mesmo grau nos dois olhos; não corrigem astigmatismo; não substituem o exame.
- Com um grau de perto +2,00 a visão nítida vai só até 50 cm: óculos de leitura não servem para a tela do computador (50–70 cm). Para computador usa-se cerca de metade do grau de perto.
- Distâncias reais medidas em estudos: celular 36,8 cm em média (39 cm em quem tem presbiopia; outro estudo 32 cm); computador 61 cm.

## 2. Como a Mochi calcula hoje (lido no código, js/lf-site.js)
1. Quadro de frases a 30 cm: 9 tamanhos de letra (em pixels do site, ×0,75 porque o teste passou de 40 para 30 cm). A menor frase lida escolhe o grau pela tabela GK = [3 · 2,5 · 2 · 1,75 · 1,5 · 1,25 · 1 · 0,75 · 0].
2. "Lentes" de prova: aumentam a letra na tela (não mudam o foco do olho — é simulação).
3. Só com câmera: ponto próximo (aproximar até embaçar). Conta: grau = 3,33 − (100/distância)/2. Serve de conferência (bate se ficar a ±0,25 do quadro).

## 3. Onde a precisão pode melhorar
| # | Ponto fraco | Por quê | Proposta |
|---|---|---|---|
| 1 | Letra em pixels, não em milímetros | o tamanho real muda de celular para celular (pendência antiga S89 B) | calibrar o tamanho real (cartão/moeda na tela ou tabela de aparelhos) |
| 2 | Distância fixa de 30 cm | a adição muda ~0,8 D entre 30 e 40 cm; quem tem presbiopia segura o celular a ~39 cm | perguntar o uso (celular/livro/costura) e calcular para ESSA distância; com câmera, medir |
| 3 | Sem conferência por idade | idade e adição andam juntas (r ≈ 0,73–0,81), mas com muita variação | perguntar a faixa de idade só para CONFERIR; se o resultado fugir muito, sugerir exame |
| 4 | Ponto próximo "até embaçar" | esse método superestima a amplitude (profundidade de foco) → grau menor | manter só como conferência, nunca como resultado |
| 5 | Um grau para os dois olhos | óculos prontos têm o mesmo grau; olhos muito diferentes não se resolvem | teste rápido um olho de cada vez; se diferem, avisar para fazer exame |
| 6 | Computador | hoje manda "celular a 30 cm" na tela do PC | ver seção 4 |
| 7 | Resultado único | perto ≠ computador | mostrar "para ler de perto: +X" e, se usar computador, "para a tela: cerca de metade" (com aviso) |

## 4. Teste no computador (distância diferente)
- No computador a pessoa fica a 50–70 cm; a 60 cm a tela pede 1,67 D (metade do que pede a 30 cm).
- Para o MESMO teste valer, a letra tem de crescer na mesma proporção da distância (60 cm = letra 2× a de 30 cm) e o cálculo tem de usar a distância real.
- Com webcam: medir a distância (o site já mede no celular e já ajusta a letra entre 20 e 40 cm) e escalar a letra. Sem webcam: pedir "um braço esticado até a tela" (≈ 60 cm) — menos preciso.
- O resultado continua sendo o grau para LER DE PERTO (o que a loja vende); a distância do computador só muda como se mede.
- Risco: tela grande e longe mede pior letras pequenas; por isso o celular continua sendo o recomendado (motivo do QR).
- Falas que mudam no computador: as 7 que citam "celular" (lista em docs/MOCHI-VOZ.md).

## 5. Como validar antes de mudar (sugestão)
- Na loja, com lentes de prova: 20–30 clientes fazem o teste da Mochi e depois escolhem a lente com que leem melhor a 35–40 cm. Comparar. Meta: 8 em 10 dentro de ±0,25.
- Repetir no computador com os mesmos clientes.

## Fontes
- Tabelas e métodos da adição: https://www.slideshare.net/Alpa40/presbyopiapptx
- Limite das tabelas por idade: https://spiedigitallibrary.org/conference-proceedings-of-spie/11207/112070Y/Limitation-of-tables-indicating-the-relation-between-age-and-reading/10.1117/12.2527291.full
- Distância do celular: https://pmc.ncbi.nlm.nih.gov/articles/PMC8093538
- Distância do computador × celular: https://aminer.org/pub/62abfd715aee126c0f8e3535/characterization-of-working-and-mobile-phone-usage-distances-in-common-users-of
- Faixa de visão e intermediário: https://open-exam-prep.com/study-guides/noce/lens-characteristics-calculations/usable-accommodation-range-of-vision
- Ponto próximo superestima: https://avehjournal.org/index.php/aveh/article/view/358/652
- Óculos prontos: https://open-exam-prep.com/study-guides/noce/specialty-products-low-vision/preassembled-eyewear-otc-readers
