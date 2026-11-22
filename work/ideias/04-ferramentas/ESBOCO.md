# IDEIAS 04 · Ferramentas que pegam o erro antes do dono (esboço, 22/11/2026)

Pedido do dono (04:52, "sim"): fazer de regra o que deu certo no bug das abas da Minha conta (B5).
Não é ferramenta nova ao lado das velhas: são 4 opções/regras que entram nas peças que o plano das ferramentas (docs/PLANO-FERRAMENTAS-21-11.md, da SITE) já tem — simulador único (`work/kit/sim.py`), medidor único (parte 2, `mede.js`), roteiro de todas as telas (parte 3a) e Argus.

## Prova de que funciona (protótipo `prova_movimento.py`, simulador, 22/11 04:55)
| Prova | Site do ar (cópia 1795333368) | Proposta das abas (pintura do B5) |
|---|---|---|
| B4 · rolar e abrir o menu: topo e faixa continuam na tela | **reprova** no PC e no celular (topo em y = −700) | reprova (B4 ainda não tem proposta) |
| B5 · trocar de aba na Minha conta: sem barra e sem conteúdo de outra aba em nenhum momento | **reprova** nas 5 trocas, PC e celular | **passa** |
O Argus de hoje passa os dois (por isso chegaram até o dono).

## As 4 regras
1. **Barras como no Windows** — `sim.navegador(pw, barras=True)` (hoje o Chromium de teste esconde as barras de rolagem, `--hide-scrollbars`). Provas, comparador e roteiro rodam com barras no PC; o celular continua como o aparelho.
2. **Conta de teste com dados** — um só lugar (`sim.contexto(..., conta=True)`): conta logada simulada no aparelho (sem senha, sem nuvem) com 2 endereços e 5 pedidos (pagos e um cancelado); a resposta dos Cartões vem de um arquivo de teste. Sai a conta de teste repetida do `kit.py` (`CONTA`/`AUTH`) e a do protótipo. Assim a Minha conta logada entra no roteiro da parte 3a com dados, não vazia.
3. **Olho em movimento** — depois de cada toque do roteiro (abrir menu, trocar aba, abrir janela, voltar), o medidor olha a tela a cada 40 ms por ~1,2 s, não só no fim. Duas regras novas no medidor único: "caixa com barra de rolagem que não devia" e "conteúdo de outra aba/tela ainda visível"; e uma de lugar: "o topo grudado continua na tela".
4. **Reproduzir antes de consertar** — todo erro que o dono mostrar vira primeiro uma prova que **reprova no site do ar** (como as 2 acima); só depois vem o conserto, que tem de fazer a mesma prova passar. Prova que nunca foi vista reprovando não vale como trava (regra 12e).

## Como fazer (jeito natural, regra 12)
- `sim.py`: parâmetros `barras` (navegador) e `conta` (contexto); nada de launch/new_context fora dele.
- A conta de teste: um arquivo de dados (`work/kit/conta_teste.json`) lido pelo `sim.py`; Cartões pelo mesmo desvio de rede que o simulador já usa.
- O "olho em movimento" é uma função do medidor único (parte 2), chamada pelo roteiro (parte 3a) — não um medidor a mais.
- B4 e B5 entram no Argus já com o defeito plantado achado (fecham quando o conserto deles passar).
- Custo: ~1–2 min a mais no portão (as telas com movimento são poucas).

## O que o dono decide
- "Aprovado" para as 4 regras, encaixadas nas partes 3a e 2 do plano das ferramentas (quem implementa é a SITE, que é dona do plano).

## Testado / não testado
- Simulador: as 2 provas no site do ar e na proposta das abas, PC 1128 e celular 390. Não testado em aparelho real.
