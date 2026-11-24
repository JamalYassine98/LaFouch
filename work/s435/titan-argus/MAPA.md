# Mapa · TITAN (app) e ARGUS (site) — esboço ESBOCO, 24/11/2026
Pedido do dono (24/11 07:35): uma entidade só por lado — **Argus no site, Titan no app** — com várias ferramentas, cada uma para uma utilidade diferente; nada de ferramenta solta sem dono, nada de duas fazendo o mesmo.
Base: docs/PLANO-FERRAMENTAS-21-11.md (Argus, partes 1 e 4 feitas; 2, 3a e 3b esperando), docs/APROVADOS-POR-FAMILIA.md, tests/run.py, tools/teste-android/telas.py.

## Motor comum (uma vez só, os dois usam)
| Peça | Arquivo | Estado |
|---|---|---|
| Simulador (abre site/app em qualquer aparelho, letra, claro/escuro) | work/kit/sim.py | feito (21/11) |
| Medidor (sobreposto, cortado, fora, toque < 44, margens/eixo/linha de base, espaços, contraste) | work/kit/mede.js | falta: parte 2 + 2 regras novas de hoje — **mesma fileira alinhada** e **texto que quebrou** |
| Comparador (tela × referência, lista toda diferença) | o do site (compara.py) | falta: roteiro do app (parte 3b) e comparar com o **esboço aprovado**, não só com a versão publicada |

## ARGUS — o site · um comando: `python3 work/fiscal/argus.py`
Provas (221) · comparador publicado × o que vai subir (feito) · roteiro de todas as telas do site (3a, falta) · regras do Firestore e CSP · selos · aparelho real (Test Lab).
Sai quando o comparador cobrir os mesmos aparelhos: o fiscal visual e a linha de base dele.

## TITAN — o app · uma entidade, duas metades
**A) Dentro do app (o que você vê):** preços, margem e contador (Guardião + Contador já são um só), setores Regras, Ofertas, Atacado, Ferramentas, Histórico, preço de mercado (95), reserva suspeita. (Parte 4 do plano.)
**B) Antes de publicar o app · um comando: `python3 work/titan/titan.py`** — sem ele em 0 falhas, o app não sobe (regra 21):
1. **Provas de lógica** — tests/run.py (390, já com "um voltar só").
2. **Índice dos aprovados** — docs/APROVADOS-POR-FAMILIA.md vira o lugar único "tela → último esboço aprovado" (o erro do Início 149n veio de não ter isso). Tela sem esboço no índice = falha.
3. **Comparar com o esboço** — cada tela mexida (roteiro das 60 telas do telas.py + dobras abertas + nomes compridos; claro/escuro; 3 letras) fotografada e posta lado a lado com o esboço do índice; diferença sem motivo trava. Junto, a foto vai para a ESBOCO olhar (regra 18) e dar o OK (1b).
4. **Medidor** — o mede.js com as regras novas.
5. **Código morto** — tools/deadcode.py com o app rodando.
6. **Android de verdade (emulado), sem cota** — o Titan roda as mesmas telas no emulador Android do GitHub (.github/workflows/teste-android.yml, já pedido pelo dono; grátis no repositório público) a cada conferência; as fotos passam pelo mesmo comparador.
7. **Cenários da loja (dono 24/11 07:46)** — o Titan roda o app em cada cenário, não só na Black Friday: **dia normal**, **cada temática/data do calendário** (Natal, Black Friday de CDE etc., lidas da lista real de datas do app, não escritas à mão) e **loja cheia** (milhares de peças, centenas de pedidos). Em cada um entram as variáveis da data: embrulho de presente, mimo extra (spray + cartão), kits, ofertas da data, retirada × delivery. Mede: telas certas (comparador + medidor), contas certas (preço, IVA 10% em G$, oferta, embrulho) e **tempo de abrir cada tela** — acima do limite trava.
8. **Internet ruim** — o explorador roda também sem internet e com internet fraca: cada tela mostra o mesmo estado padrão (regra 17) e nada se perde.
9. **Celular físico** — Test Lab só na conferência final, dentro dos 30 min grátis (pago só com autorização, regra 23).

**Saem** (para work/obsoletos, cada um só depois de o Titan pegar tudo o que ele pegava): work/s436/compara_app.py · work/verif/* (alin2, botoes, estilos, familias2) · medidores velhos do kit (alin, centro, abas_dist, sobre, olho) · os scripts soltos de conferência (work/s435/conf634, conf640, lista-erros, voltar — viram roteiro do Titan) · inventários feitos à mão.

## Como sei que funciona (fecha só assim)
Plantando de volta os erros reais de hoje, o Titan reprova sozinho cada um: Adicionar abrindo no topo · legenda dos quadrados quebrando · três topos na peça do Catálogo · voltar do navegador pulando tela · frase de baixo do título. O Argus, os 5 erros de referência do plano.

## É remendo? (regra 12)
Não: nenhuma ferramenta nova fica ao lado da velha — cada uma entra e a velha sai no mesmo passo; o motor é um só para os dois lados.

## Decidido pelo dono (24/11 07:40–07:43)
- Titan primeiro; a ESBOCO constrói a conferência do Titan (work/, sem mexer em src/).
- Ferramentas de "ferro" no lugar das velhas (cada uma entra e a velha sai no mesmo passo): comparador peça por peça (tela real × tela "como foi aprovado", ao vivo) · medidor de família · explorador que toca em tudo (voltar, dados difíceis, 3 letras, claro/escuro) · relatório em imagem com a diferença marcada · prova do próprio Titan (erros plantados).
- Gabarito APROVADO: antes de usar, conferir que a base aprovada (work/kit/base_app.py) está igual aos esboços aprovados.
- Emulador Android do GitHub entra no Titan (item 6).
