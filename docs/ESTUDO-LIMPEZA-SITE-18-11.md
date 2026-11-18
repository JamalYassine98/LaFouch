# Estudo de limpeza do site (18/11/2026, S422) — proposta, esperando o dono

Pedido do dono (11:15): "tem coisa velha no site também?". Regra: a limpeza NÃO muda nada que o cliente vê (exceto o item 1, que troca peças inventadas por "carregando"/última cópia guardada).

## O que foi medido (site 1795009087, simulador, 7 temáticas, celular/tablet/PC, 14 telas)
| O quê | Medida |
|---|---|
| `js/lf-site.js` | 851 KB, 818 funções com nome, 1.937 no total |
| Funções que nunca rodaram num passeio completo | 1.080 de 1.937 (inclui pagamento e partes da Mochi que o passeio não abre — não é tudo lixo) |
| Funções declaradas e nunca chamadas em lugar nenhum | 11: amCard, apos, bagDados, bagFx, bvMostra, confete, faceName, foneErro, gzPeca, pgFavBtn, srSug |
| `index.html` | 346 KB, sendo 313 KB de estilos em 30 blocos `<style>` |
| Seletores de estilo | 3.025; 1.681 não acharam nenhum elemento em nenhuma tela do passeio (candidatos — a conferir um a um) |
| Seletores definidos 3 vezes ou mais (um por cima do outro) | 126; `!important` usado 811 vezes |
| Textos do tradutor (`lf-i18n.js`) sem uso no site | 164 de 732 |
| Vozes fora da lista de falas | 14 em português (gravações antigas), 0 em espanhol |

## Coisa velha já identificada
1. **Lista reserva de 20 peças dentro do código** (`var P=[…]` em `lf-site.js`): mesmos códigos das peças de teste do app, mas com nomes inventados ("Armação redonda rosa") e preços antigos (Gs. 105.000). Aparece quando a nuvem não responde. Proposta: sai; sem nuvem o site usa a última cópia guardada no aparelho (`lf_pdocs`) ou mostra "carregando".
2. **Menu antigo** (Idioma/Tema/Texto em trilhos `.seg`): escondido desde o menu novo com listas ✓, mas o HTML, o estilo e o código (`prefSync`) continuam.
3. **Leve 2**: retirado em 17/11, código morto (`l2Info` devolve zero).
4. **Pílula antiga da Minha conta (S288)** e a entrada vertical do B1: desligadas pelo trilho único (S420), código ainda no arquivo.
5. **`TRF_AUTO`**: variável sem uso desde o pagamento novo (S400).
6. **Minha conta reescrita 5 vezes** (`minhaConta` embrulhada em 5 camadas: 1942, 1991, 2786, 4505, S420).

## Proposta em 3 fases (cada uma publicada só com a prova)
- **Fase 1 — sem risco**: itens 1 a 5, as 11 funções nunca chamadas, os 164 textos sem uso, as 14 vozes fora da lista.
- **Fase 2 — estilos**: cada um dos 1.681 seletores candidatos é conferido num passeio ampliado (carrinho com peça, pagamento PIX e transferência, ajudas abertas, atacado logado, todas as temáticas, 3 letras); só sai o que nunca acha nada. Os 126 seletores repetidos viram um só, com o resultado final idêntico.
- **Fase 3 — Minha conta**: as 5 camadas viram uma função só.

## Prova (para cada fase)
1. Porteiro com 0 falhas.
2. Estilo final de TODOS os elementos idêntico antes × depois, em todos os estados do passeio (comparação por programa).
3. Fotos antes × depois com as PEÇAS REAIS (GitHub Actions) idênticas, celular/tablet/PC.
4. Modo loja (cópia do site no app) conferido do mesmo jeito.

Ferramentas: `work/s422/cobre.py` (funções que rodam), `work/s422/css_t.py` (seletores que acham elementos).
