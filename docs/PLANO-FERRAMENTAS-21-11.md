# Plano das ferramentas — esboço para o dono (SITE · implementa, 21/11/2026)

Pedido do dono (20/11 00:30, recado da NUVEM): uma ferramenta para cada trabalho, sem duas fazendo o mesmo. Em partes, esboço antes.
Nada aqui muda o site nem o app: é só o jeito de conferir. Nada foi mexido ainda (fora a trava do status.py, ver o fim).

## O que existe hoje (contado no projeto em 21/11)
| Trabalho | Ferramentas hoje | Quem usa |
|---|---|---|
| Abrir o site/app no simulador | **5 jeitos**: `work/kit/kit.py` (site e app, para esboço), `work/s349/ap.py` (app, por cima do kit), `work/testes/base.py` + `novo()` do `provas.py` (site, para as provas), o abre do `compara.py` (site), `work/mkcopy.sh` (cópia de teste com 20 peças) | 39 + 233 + 84 scripts (a maioria é de sessões antigas em work/sNNN) |
| Medir a tela | **9 medidores**: `alin.js` (2 usos), `alin2.js` (23), `olho.js` (69), `centro.js` (6), `abas_dist.js` (5), `sobre.js` (5), `verif.js` (2), `tools/detector-colisoes-site.py` (1), `work/fiscal/audita.js` (2) + as medidas de dentro do `compara.py` e do `selos.py` | cada um mede "sobreposto", "cortado", "alinhado" do seu jeito |
| Conferir telas | `compara.py` (Hoje × Proposta), `fiscal.py` (visual do porteiro, com linha de base própria), `work/verif/*` (varredura de padrões do app), inventários 1/2 e de botões | três que olham a mesma coisa |
| Portão antes de publicar | `work/fiscal/porteiro.py` (221 provas no rápido) | SITE |
| Contas e regras | `tests/run.py`, testes da nuvem, `regras.py`, `csp.py` | ficam |
| Aparelho real, sessões, código morto | Test Lab, `tools/status.py`, `tools/deadcode.py` + medição com o site rodando | ficam |

## As partes (uma por vez; cada uma só fecha com o porteiro em 0 falhas e o mesmo número de provas)
1. **Um simulador só** — um módulo `work/kit/sim.py` com "abre o site" e "abre o app" (aparelho, letra, idioma, claro/escuro, cópia de teste ou endereço). `provas.py`, `fiscal.py`, `compara.py`, `kit.py` e `ap.py` passam a chamar ele; os abre-telas de cada um saem no mesmo passo. Prova: porteiro com as mesmas 221 provas e comparador com 0 diferenças entre a tela aberta pelo jeito velho e pelo novo.
2. **Um jeito de medir** — uma biblioteca `work/kit/mede.js` (caixa, texto, camada de rolagem, sobreposto, cortado, fora da tela, alinhado, contraste). O comparador, o fiscal e as provas usam a mesma; os 9 medidores saem um a um, cada um só depois de a biblioteca pegar tudo o que ele pegava (defeito plantado: o erro antigo é recolocado de propósito e a biblioteca tem de achar).
3. **O comparador é o único que confere telas** — ganha a 2ª lista de telas (as 60 do app, aprovado 20/11 08:17) e os relatórios que hoje são os inventários. As ideias do designer só entram se pegarem sozinhas 3 erros reais do dono: faixa da Black Friday cobrindo o topo na conta; nome da cliente abrindo tela vazia; piscada de animação. O que não pegar, não entra.
4. **O porteiro vira só o portão** — roda o comparador (publicado × o que vai subir: toda diferença tem de estar na lista do que foi aprovado) e as provas, e diz "pode" ou "não pode". O fiscal visual e a linha de base dele saem quando o comparador cobrir os mesmos aparelhos.

## É remendo? (regra 12)
Não: cada parte tira o que substitui no mesmo passo e nenhuma ferramenta nova fica ao lado da velha. O risco é o contrário — mexer no portão e ele passar a deixar erro entrar. Por isso a regra de fechamento de cada parte (mesmas provas, 0 falhas, defeito plantado achado).

## O que o dono decide
- "Aprovado" para as 4 partes nessa ordem, ou trocar a ordem (minha sugestão: 1 → 4 → 2 → 3, porque o portão com o comparador é o que mais evita erro novo no ar).

## Já feito nesta noite (era urgente, não muda tela)
- `tools/status.py`: a memória e a lista viva só crescem; se a cópia do aparelho encolheu, o comando PARA antes de enviar (prova 5 no `tools/teste-status.py`). Motivo: dois commits de 20/11 regravaram os dois arquivos só com a linha nova (1,3 MB sumiram); foi tudo recuperado do histórico.
