## Parte 9 — Estilo (`www/style.css`): `!important` e seletores repetidos

**O que é hoje:** 988 `!important` em 3.073 linhas e 73 seletores escritos 3+ vezes (`.go` 11×, `html` 11×, `.mini` 9×…): regra nova por cima da velha.

**Como fica:** cada família com o seu bloco (já é regra 1b); dentro do bloco, uma regra por seletor; `!important` só onde não há outro jeito (estilo de estado contra estilo posto pelo programa).

**Como fazer sem quebrar:** o estilo de cada família é limpo **junto** com a parte da família (4–7). Para a base (botões `.go`/`.mini`/`.btn`/`.chip`, `html`, `:root`) fica esta parte, no fim. Método: o mesmo comparador (ele mede cor, letra, borda, lugar e tamanho de cada peça nas 60 telas × 3 aparelhos × claro/escuro) — junta as regras do seletor numa só, tira o `!important`, roda: 0 diferenças ou volta. A SITE já faz isso no site com o "medidor de cascata" (S430); vale combinar a mesma ferramenta.

**Risco:** baixo por passo (cada passo é pequeno e medido), longo no total. O teto do porteiro (988 / 73) desce a cada passo.

## Parte 10 — Restos

- **Pontes `window.__nome` entre arquivos** ({PONTLISTA}): os arquivos já dividem o mesmo escopo; a ponte some quando a família dos dois lados é limpa.
- **Tabelas com chave repetida** (resolvidas na parte 2):
{TABLISTA}
- **Tocos** (5, do inventário de 19/11) e **função morta** (`avMin` em 97-push.js:57).
- **Vigias** (13): conferir um a um se ainda consertam alguma coisa depois que a tela passar a nascer certa; o que não consertar mais, sai.
- **Trava mais fina:** `tools/remendos.py` passa a usar o leitor de verdade (`analisa.js`) — hoje ele conta por texto (serve como teto, mas tem 2 falsos e não vê nome repetido na lista inicial de ações).

## Ordem e dependências

1 → 2 → 3 (espinha: tudo o que as famílias penduram) → 4 → 5 → 6 → 7 (famílias, com os aprovados) → 8 (dados) → 9 (estilo que sobrou) → 10 (restos).
As partes 1, 2 e 3 não mudam nada na tela e destravam as outras: sem elas, cada família teria de continuar embrulhando o `render` e o `inicioGo`.
Não depende de outras sessões, mas a parte 6 conversa com a NUVEM/SITE (`vitProduto` e a "ficha só de fatos") — recado antes de começar.

## Ensaio da parte 1 (feito nesta madrugada, numa cópia em /tmp — o projeto não foi mexido)

- Troca: `python3 work/s436/remendos/parte1_render.py <cópia>` → 16 embrulhos trocados, nenhum `render = function` sobrou; o app monta sem erro.
- Prova das telas (`prova.py`, 60 telas, antes × depois): **0 diferenças de verdade em 60 telas × 3 aparelhos (celular escuro, tablet escuro, PC claro). O comparador marcou 2 peças que mudam sozinhas e foram conferidas uma a uma: a frase "cotação da loja travada [desde 20/11]" do Câmbio (depende de quanto o aparelho demora; variou nos dois sentidos e também abrindo só o "antes") e um traço animado de 23→24 px na Lista de compras. Nenhum erro novo. Relatórios: work/s436/remendos/prova1/*.json.**
- Testes do porteiro na cópia: **327/327 passaram.**
- Teto dos remendos na cópia: **embrulhos 72 → 57 e reescritas 74 → 58 (na conta por texto do porteiro); ações, !important e seletores iguais.**

## Ferramentas deixadas (todas só leem)

- `work/s436/remendos/analisa.js` — o inventário com leitor de JavaScript (cadeias, tipos, guardas, tabelas, pontes, vigias) → `analise.json`. `--lista` mostra as cadeias.
- `work/s436/remendos/refs.js nome…` — quem guarda uma função sem chamar (os "buracos").
- `work/s436/remendos/prova.py` — antes × depois em todas as telas (0 diferenças = não mudou).
- `work/s436/compara_app.py` — o comparador Hoje × Proposta do APP (regra 11), usado também no esboço 16.
- `work/s436/remendos/plano.py` — monta este arquivo.
