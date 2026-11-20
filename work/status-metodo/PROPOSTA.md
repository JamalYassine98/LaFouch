# Esboço · status entre sessões sem conflito (S435, 19/11/2026 23:30)

**Problema hoje:** todas as sessões editam o mesmo `docs/STATUS.md` → conflitos (só a S435 desfez marcas de conflito ~6 vezes em 19/11), recado esquecido, linha velha em "Em andamento", e o dono precisa pedir "atualiza o status".

## Como fica
- `docs/status/sessoes/<SESSÃO>.json` — cada sessão escreve **só no seu** (o que está fazendo, arquivos marcados, últimas mudanças).
- `docs/status/fila/<NN>-<assunto>.md` — um item da Fila por arquivo.
- `docs/status/recados/para-<SESSÃO>/…md` — um recado por arquivo; quem lê apaga.
- `docs/STATUS.md` — **montado sozinho** pelo comando a cada começo/fim (ninguém edita à mão → sem conflito).

## Um comando (tools/status.py — protótipo em work/status-metodo/status.py)
| Comando | Faz |
|---|---|
| `status.py ler APP` | puxa o mais novo e mostra quem está em quê, a Fila e **os recados para a APP** |
| `status.py comeco APP "item 17" src/96-loja-online.js` | marca o que vai mexer; **PARA** se outra sessão já marcou o arquivo |
| `status.py fim APP "publicado v569"` | tira a marca, anota em "últimas", monta o STATUS.md e envia; **BARRADO** se houver recado não lido |
| `status.py recado ESBOCO APP "texto"` | deixa recado |
| `status.py lido APP` | apaga os recados já lidos |
Cada comando faz fetch + rebase antes e commit + push depois (tenta de novo se der conflito; se o fetch raso falhar, busca mais fundo).

## Demonstração (rodada de verdade numa cópia, demo.txt)
1. APP marca `src/96-loja-online.js` → ok.
2. Outra sessão tenta marcar o mesmo arquivo → **PARE: já marcado por outra sessão**.
3. Esboço deixa recado para a APP.
4. APP tenta terminar sem ler → **BARRADO: há 1 recado que ainda não foi lido**.
5. APP roda `ler` → vê o recado → termina → STATUS.md montado sozinho (demo_STATUS_montado.md).

## Regra 1 do CLAUDE.md (texto proposto)
> **Várias sessões:** no começo de CADA pedido do dono, rodar `python3 tools/status.py ler <SESSÃO>`; antes de mexer, `comeco`; ao terminar, `fim`. Nunca editar docs/STATUS.md à mão. O dono não precisa pedir "atualizar status".

## Migração (uma vez)
Passar a Fila, os recados abertos e "Em andamento" de hoje para os arquivos novos; o STATUS.md antigo vai para work/obsoletos/.
