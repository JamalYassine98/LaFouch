# Plano de modularização do app LaFouch (ESBOCO · 27/11/2026 · pedido do dono 10:37)
Dono: "não quero implementar nada ainda… modularize o projeto em partes bem organizadas para a implementação sair o mais limpa,
polida e correta possível, para evitar erros, bugs e remendos sujos". **Até o dono dizer, nada é implementado** (Fila pausada).

## Diagnóstico (medido no código de hoje, v641)
- **173 arquivos JS / 53 mil linhas**, nomeados pela ORDEM em que foram feitos, não pela família: 69 arquivos "97-…", 31 "98…",
  nomes de sessão/versão (98z-s374, 98z-s418, 99c-…-s435). A mesma família espalhada (câmbio: 40-formatos, 91-cambio,
  97-cambio-aba, 97-lamoneda…).
- **22 funções/ações definidas duas vezes** (a de baixo apaga a de cima em silêncio = remendo).
- **1 CSS de 3.146 linhas com 866 "!important"** — regra por cima de regra; é daí que vêm alinhamentos que quebram ao mexer.
- Por isso um conserto numa tela quebra outra: ninguém sabe qual das cópias está valendo.

## Estrutura alvo (um lugar para cada coisa)
```
src/nucleo/      estado · nuvem/sync · navegação · janela de baixo · formatos (G$, US$, datas) · plural · lfCabe · ícones
src/estilo/      tokens.css (cores, espaços 8/16/24/32/48, letras, curva) · base.css (famílias de peças: linha, título, botão, janela)
src/familias/<família>/   logica.js · tela.js · estilo.css      (uma pasta por família da barra/Início)
     inicio · vender (caixa, carrinho) · pecas · dinheiro (caixa, despesas, câmbio) · precos (Titan) · site · marketing (Semp)
     clientes · atacado · resultados · ajustes
src/cerebro/     cliente do Titan e do Semp (só lê a nuvem)
src/atualiza/    ao vivo · loja · apk
```
- O build.js junta na ordem: núcleo → estilo → famílias → cérebro → atualiza.
- **Regras que o Argus passa a travar** (antes de qualquer migração — para não piorar):
  1. nenhuma função/ação definida duas vezes; 2. o número de "!important" só pode cair; 3. arquivo novo só dentro de família
  (sem nome de sessão/versão); 4. cor, espaço e letra só por token (nada de px solto).

## Partes (uma por vez, cada uma até o fim, sem mudar NENHUMA tela)
- **P0 · Rede de segurança:** gravar as plantas das 17 telas que faltam + o Início (fotos de hoje, escuro/claro/3 letras) e ligar as
  4 travas acima no Argus. Só máquina; quase não gasta conversa.
- **P1 · Núcleo e tokens:** juntar utilitários repetidos e criar tokens.css/base.css; tirar os !important que os tokens substituem.
- **P2… · Uma família por parte**, começando pelas que já têm consertos aprovados: Início → Dinheiro/Câmbio → Preços → as outras.
  Em cada uma: mover o código da família para a pasta, apagar a cópia velha e as definições duplicadas, CSS da família sem !important.
  **Prova:** as plantas antes e depois precisam sair IGUAIS (pixel e ligações) — se não, a parte volta.
- **Depois** de modularizado, os aprovados entram limpos, cada um na sua pasta: consertos do Início, atualização ao vivo, Titan, Semp.

## Custo e cuidado (dono 27/11 10:40: "tome muito cuidado para não quebrar o código ou deletar nossos dados")
- Nenhuma parte toca os dados da loja (nuvem, aparelho, firestore.rules): só move código; antes de cada parte, cópia (ramo + tag) para voltar em 1 comando.
Cada parte é "por dentro" (6b) mas grande: o dono autoriza parte a parte. Estimativa: P0 = 1 sessão curta de máquina;
cada família = 1 parte. O que mais economiza crédito: P0 primeiro (o Argus pega o erro sozinho, sem ida e volta).

## Acréscimo do dono (28/11 08:06–08:08, via IDEIAS)
- **O SITE entra no mesmo plano** (www/loja: loja.html, lf-site.js), com as mesmas fotos (plantas) e as mesmas travas do Argus. Achado de exemplo: "Últimas unidades" com o limiar em 2 lugares diferentes (96-loja-online: até 3 × 97-marketing: até 2) e o estilo .ulin escrito 3 vezes no loja.html (S239/S240/S429).
- **EXTREMAMENTE fragmentado, com muita calma:** a limpeza do dia 19 que bugou tudo (e obrigou a voltar semanas) foi feita de uma vez. Agora: fatias MÍNIMAS (uma regra ou um bloco de estilo por vez), cada fatia com as plantas antes/depois iguais, seu próprio commit e volta de 1 comando; nada de duas fatias juntas.
