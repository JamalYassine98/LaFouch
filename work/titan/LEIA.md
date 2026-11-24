# TITAN · conferência do app (ESBOCO) — parte 1 feita em 24/11/2026
Comando: `python3 work/titan/titan.py [Tela,Tela…]` → relatorio/diferencas.json + uma imagem por tela (HOJE × APROVADO, diferença em vermelho).
- compara.py: abre a mesma tela duas vezes, ao vivo — app real e app com o gabarito (work/kit/base_app.py) — e compara peça por peça (posição, tamanho, letra, cor, fundo, borda, raio). O deslocamento em cascata é descontado (só acusa onde começa).
- familia.py + medir.py: medidor de família (parte 2) — junta o que tem a mesma função em todas as telas e exige o desenho aprovado: título, frase de baixo do título (sai), "+" redondo, janela de baixo sem Fechar/×, um título e um voltar por tela, sem trilha, linha de lista 16/500 + frase 13/400 (86), texto que quebrou (L4), fileira de quadros alinhada e linha de base (L2), número grande numa letra só.
- prova_medidor.py: o medidor tem de achar sozinho os 12 erros reais de 24/11 (hoje: 12 de 12). Os medidores velhos (alin, alin2, olho, centro, abas_dist, sobre, verif) saem quando este pegar também os 5 erros de referência do plano das ferramentas.
- roteiro.py: provisório (15 telas); a parte 3 troca por um explorador que toca em tudo.

## Achado da conferência do gabarito (24/11)
1. O gabarito (base_app.py) tem 53 itens aprovados em 18–19/11 que NUNCA entraram no app real (ex.: acabJan = janela de baixo; 149n = Início; "+" redondo de Caixa/Despesas/Atacado). Os esboços sempre pareciam certos porque o simulador aplica esses itens por cima — no aparelho do dono eles não existem. É a causa de boa parte do "não está como aprovamos".
2. Os aprovados depois de 19/11 (44 a 106) nunca entraram no gabarito. Para o Titan valer para eles, cada esboço aprovado precisa deixar o seu molde no gabarito (parte 1b).

## Parte 3 · explorador (24/11)
`python3 work/titan/explorador.py [profundidade] [cenário]` — toca em tudo a partir das 5 abas (nunca em apagar/vender/salvar/publicar/mandar), descobre cada lugar, mede a família e testa o voltar em cada um. Cenários: normal · nomes (nomes compridos) · cheio (417 referências, 6 mil vendas) · vazio · sem_internet.
Primeira rodada (profundidade 1, normal): 56 lugares, 0 toques falhados. Achados novos:
- **Voltar** ainda erra quando se entra pelo sino/Pendências ("Ver preços", "Completar") e pelo Dashboard (uma venda do dia): o voltar vai ao Início em vez da tela de onde veio. Causa provável: essas portas abrem a tela sem passar pela pilha do 99c.
- **Lentidão com a loja cheia**: de 0,4–1,3 s para 8–23 s (work/s435/lista-erros/COMO-FAZER-LENTIDAO.md).
Falta (parte 3b): rodar todas as temáticas/datas com as variáveis (embrulho, mimo, kits, ofertas, retirada × delivery), sem internet, profundidade 2, e o emulador Android.
