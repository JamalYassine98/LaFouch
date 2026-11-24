# TITAN · conferência do app (ESBOCO) — parte 1 feita em 24/11/2026
Comando: `python3 work/titan/titan.py [Tela,Tela…]` → relatorio/diferencas.json + uma imagem por tela (HOJE × APROVADO, diferença em vermelho).
- compara.py: abre a mesma tela duas vezes, ao vivo — app real e app com o gabarito (work/kit/base_app.py) — e compara peça por peça (posição, tamanho, letra, cor, fundo, borda, raio). O deslocamento em cascata é descontado (só acusa onde começa).
- roteiro.py: provisório (15 telas); a parte 3 troca por um explorador que toca em tudo.

## Achado da conferência do gabarito (24/11)
1. O gabarito (base_app.py) tem 53 itens aprovados em 18–19/11 que NUNCA entraram no app real (ex.: acabJan = janela de baixo; 149n = Início; "+" redondo de Caixa/Despesas/Atacado). Os esboços sempre pareciam certos porque o simulador aplica esses itens por cima — no aparelho do dono eles não existem. É a causa de boa parte do "não está como aprovamos".
2. Os aprovados depois de 19/11 (44 a 106) nunca entraram no gabarito. Para o Titan valer para eles, cada esboço aprovado precisa deixar o seu molde no gabarito (parte 1b).
