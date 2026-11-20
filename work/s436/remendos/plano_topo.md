# Plano para tirar os remendos do APP — em partes (S436 · 20/11/2026, madrugada)

Pedido do dono (20/11 01:40): começar pelo inventário dos remendos (docs/INVENTARIO-REMENDOS.md, da S435) e montar o plano em partes para **trocar no lugar** (regra 12). **Só estudo e esboço: nada foi mexido em `src/` nem em `www/`.** Cada parte só começa com o "implementar" do dono.

Como ler: o resumo e as decisões estão no começo; cada parte diz o que é, como fica do jeito natural, o que sai, como se prova e qual o risco. As tabelas vêm do programa `work/s436/remendos/analisa.js` (rodar de novo para atualizar).

## 1. O que o estudo achou (medido com leitor de JavaScript de verdade, não por texto)

| O quê | Hoje |
|---|---|
| Funções/ações com remendo em cima | **{NOMES}** |
| Remendos (cada "camada" por cima da primeira) | **{ELOS}** |
| Que tipo de remendo | {TIPOS} |
| Guardas da versão velha (`var _x = x`) | {GUARDAS} |
| Tabelas com a mesma chave escrita 2+ vezes (nomes e frases da barra/grupos) | {TABDUP} |
| Pontes `window.__nome` (um arquivo entrega função a outro por fora, sem precisar) | {PONTES} ({PENTRE} usadas entre arquivos) |
| Vigias que consertam a tela depois de desenhada (MutationObserver/ResizeObserver) | {OBS} |
| Estilo: `!important` / seletores escritos 3+ vezes | 988 / 73 |
| Estilo criado pelo programa (CSS dentro do JS) | 0 (bom: o estilo está todo no style.css) |

**O que muda em relação ao inventário de 19/11:** o leitor de texto contava `mk` e `T` (não são remendos: são nomes locais) e não via 5 ações que nascem na lista inicial (`estorno`, `notifLimpa`, `inicioReset`, `impdel`, `stAbre`). Também acertei quem "vale" quando a função é declarada duas vezes (a última declarada ganha: `salvarAgora`, `saveFotos`, `nvToken`).

### Três coisas que o remendo esconde (achados de verdade, com prova)

1. **BUG no ar — aparelho novo não consegue entrar na nuvem pelo cartão do Início.** Duas ações têm o mesmo nome (`nvIr`): a do cartão "Seus dados estão na nuvem? · Entrar" (97-nuvem-segura.js) e a da navegação nova (99c, 19/11). A última ganhou; tocar em "Entrar" dá **tela vazia** (endereço `#null`). Medido no simulador. Só aparece em aparelho vazio e sem login (novo, roubado/desconectado, recém-instalado) — por isso ninguém viu. Esboço do conserto: `work/s436/bug-nvir/esboco_bug_entrar_nuvem_{escuro,claro}.jpg`. **Não consertei** (regra 5 e a sua ordem de não implementar nada). É a decisão nº 1 abaixo.
2. **Buraco do embrulho:** quem guardou a função ANTES do embrulho continua chamando a versão velha. Exemplo medido: os campos Código, Grau, Cor e Custo do "Adicionar" (`12-estoque-filtros-cadastro.js:86`, `oninput = render`) redesenham a tela **sem nenhum dos 16 acabamentos** (navegação, links, PC…) a cada letra digitada. Trocando no lugar (parte 1), isso se conserta sozinho.
3. **Remendo sobre remendo que cala o de baixo:** as 15 confirmações novas (98z-s418) guardam a ação antiga (`A0`) e a chamam depois da janela nova. Em 2 delas (Atacado: cancelar conta e cancelar lote) a antiga ainda faz a pergunta cinza do navegador, e a nova **troca o `window.confirm` por um "sim" falso** para ela não aparecer; em outras 4 (estorno, desligar PIN, sair da nuvem, importar cópia) a antiga ainda carrega o seu próprio "toque de novo para confirmar". Funciona, mas cada ação fica escrita em dois lugares.

## 2. Decisões que esperam o dono

1. **Bug do "Entrar" na nuvem (aparelho novo):** posso consertar? Esboço pronto (Hoje: tela vazia × Proposta: Ajustes › Cópias e nuvem aberta, cursor no e-mail). É pequeno e urgente; sugiro antes de tudo.
2. **Parte 1 (render):** já ensaiei numa cópia, com prova (resultado no fim deste arquivo). Se disser "implementar parte 1 dos remendos", é o mesmo ensaio aplicado ao projeto.
3. **Ordem das partes 4–7 (famílias):** sugiro a do inventário de aprovados (Resultados/Preços primeiro, 15 aprovados). Se preferir outra família antes, é só dizer.

## 3. Como cada parte é feita (igual para todas — regra 12 a–e)

- **(a) causa:** a tabela da parte mostra cada função, quem vale hoje e cada remendo em cima, na ordem em que roda.
- **(b) jeito natural:** escrito em cada parte ("Como fica").
- **(c) um lugar só:** a função fica no arquivo da família; o que é comum (render, destinos, confirmação) fica num ponto que serve todas.
- **(d) apaga o que substitui:** os remendos da tabela e as guardas `var _x` saem no mesmo commit; arquivo `98z…` que ficar vazio some. Função preparada e ainda não ligada **não** é apagada.
- **(e) trava:** `python3 tools/remendos.py --grava` baixa o teto no mesmo commit (o porteiro não deixa voltar) + teste próprio do comportamento.
- **Prova de que a tela não mudou** (partes sem mudança visual): `work/s436/remendos/prova.py` abre as 60 telas do app antes × depois, em celular, tablet e PC, e compara peça por peça (texto, lugar, tamanho, cor, letra) — tem que dar **0 diferenças**. Abre o "antes" duas vezes para descartar o que muda sozinho (relógio).
- **Prova nas partes com aprovados** (4–7): a tela de depois tem que ser igual a "hoje + aprovados" (a base dos esboços, `work/kit/base_app.py`): mesmo comparador, 0 diferenças fora do que foi aprovado; o item sai da base quando entra no app.
- **Uma parte = uma publicação**, testada (`python3 tests/run.py`), com conferência da ESBOCO depois (regra 1b). Partes grandes são divididas (4a, 4b…) e o dono é consultado a cada uma (regra 3).
