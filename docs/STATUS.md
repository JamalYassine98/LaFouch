# STATUS — MONTADO AUTOMATICAMENTE por tools/status.py (NÃO editar à mão)

**Como usar (CLAUDE.md regra 1):** no começo de CADA pedido do dono: `python3 tools/status.py ler <SESSÃO>`; antes de mexer: `comeco`; ao terminar: `fim`; item da Fila: `fila`; recado: `recado`. Nunca editar este arquivo à mão.

## Onde está o estudo de cada parte (ler o que já existe, não refazer)
- App: docs/APP-MAPA.md (ler primeiro) · docs/APP-BOTOES.md · docs/APP-COMO-FUNCIONA.md · CODEMAP.md (módulos de src/)
- Site: docs/SITE-COMO-FUNCIONA.md · docs/ATLAS-SITE.md (medidas reais, 13/11)
- Decisões do dono: docs/MEMORIA-PROJETO.md · pendências: docs/FALTA-APROVAR-15-11.md (lista viva)

## Papéis (CLAUDE.md regra 1b)
- APP — implementa e publica: **S436** (só ela mexe em src/ e www/).
- SITE — implementa e publica: **S429**.
- NUVEM — implementa (functions/ e firestore.rules, segurança): **"NUVEM · implementa"** (antiga "Estudo · dados"); a publicação da função é o dono que roda no PC.
- Demais sessões: esboço, estudo e conferência.
- **Nomes das conversas no app do dono (aprovados 19/11 14:08)** — usar estes nomes ao falar com o dono:
  - "APP · implementa" = S436 · "SITE · implementa" = S429 · "Esboço · famílias" = S435 · "NUVEM · implementa" = sessão da nuvem e segurança (antiga "Estudo · dados"; estudo do item C em docs/ESTUDO-ESTOQUE-SITE-19-11.md).

## Em andamento

| Sessão | Agora | Arquivos marcados |
|---|---|---|
| APP | noite 20/11 (dono dormindo): conferir B3 v572, deixar esboço 16 pronto (comparador), estudo+plano dos remendos — nada em src/ | work/s436/remendos, work/s436/banco, docs/PLANO-REMENDOS-20-11.md |
| SITE | item 9 (login pela função conta, token pela função reserva) — esboço no ramo esb-item9 do catalogo | js/lf-site.js |

## Fila

- **01-149v-familia-voltar-peca-do-catalogo-fic** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **02-150i-familia-icone-redondo** — ✅ v563 (19/11) · APP · pedido 19/11 13:31
- **03-b2-soltar-reserva-urgente-bug-src-95-res** — ✅ v564 (19/11) · APP · pedido 19/11 14:03
- **04-b1-nome-da-cliente-no-pedido-act-pedcli** — ✅ v566 (19/11) · APP · pedido 19/11 14:03
- **05-b3-site-resumo-no-grupo-site-a-linha-e-o** — ✅ v572 (5.49.2, 20/11) · APP · pedido 19/11 14:03
- **06-p1-seguranca-da-reserva-parte-da-nuvem-c** — ✅ publicado pelo dono 19/11 15:03 (Cloud Shell); conferido: cancelar com `refs` = ok:true; reserva vencida da AC1050 apagada; 4 paradas antigas saem na limpeza das 4h · NUVEM · pedido 19/11 14:29
- **07-p1-parte-do-app-depois-do-deploy-do-item** — ✅ v565 (19/11) · APP · pedido 19/11 14:29
- **08-s1-s2-parte-1-nuvem-dono-implementar-19** — ✅ publicado pelo dono 19/11 15:44 (functions + regras); conferido: `conta` livre=ok, `reserva` token sem telefone certo = recusado · NUVEM · pedido 19/11 15:29
- **09-s1-s2-parte-2-site-depois-do-item-8-publ** — na fila — pode começar (item 8 no ar) · SITE · pedido 19/11 15:29
- **10-s1-s2-parte-2-app-depois-do-item-8-publi** — ✅ v566 (19/11) — grava em reservasTok E ainda em reservas/ (o site antigo lê de lá); tirar o de reservas/ junto com o item 11 · APP · pedido 19/11 15:29
- **11-s1-s2-parte-3-nuvem-depois-dos-itens-9-e** — PRONTA E TESTADA no ramo nuvem-parte3 (não publicada) — espera o item 09 (site) publicado e o item 18 (app)
- **12-p1b-orfas-nuvem-dono-implementar-16-12-e** — ✅ publicado pelo dono 19/11 16:21; conferido: `orfas` sem login = sem-permissao · NUVEM · pedido 19/11 16:12
- **13-p1b-orfas-app-depois-do-item-12-publicad** — ✅ v567 (19/11) · APP · pedido 19/11 16:12
- **14-urgente-interruptor-do-site-some-no-pain** — ✅ publicado no site (catalogo ef883de, 19/11 19:28); CONFERIDO pela S435 no simulador: com o site ligado e desligado o cartão do interruptor fica no topo (prova.py). Dono testou no celular 19/11 19:45: funcionou ✓ · SITE · pedido 19/11 19:03
- **15-camera-do-estudio-so-ela-pegar-antes-dos** — ✅ COMPLETO — parte 1 v568 · parte 2 v569 · parte 3 v570 (19/11) · APP · pedido 19/11 19:25
- **16-peca-incompleta-nao-vai-ao-site** — esboço v2 pronto e passado no comparador (work/s436/banco/esboco16_ficha_{celular,tablet,pc}_*.jpg + esboco16_pecas_teste.jpg), esperando o dono: marca e coleção obrigatórias? · APP · pedido 19/11 23:07
- **17-urgente-site-inventario-py-566-preso-no** — ✅ FEITO v571 (5.49.1) · APP · pedido 19/11 23:23
- **18-s1-s2-parte-3-app** — na fila — junto com o item 11
- **18-trava-dos-remendos-no-porteiro** — ✅ feito 20/11 01:20 (porteiro, sem versão do app: só teste) · APP · pedido 20/11 00:40

## Recados esperando

- para **APP**: Lido 20/11 04:45 (S436): item 18-s1-s2-parte-3-app (tirar tok de reservas/ e gravar reservasTok antes de pago:true, em src/95-pedidos.js pedReserva) fica na Fil
- para **ESBOCO**: Bug no tools/status.py (20/11 01:20): em puxa(), se o 2º rebase (depth 200) também falha, o rebase fica PELA METADE e o envia() faz commit e push no meio dele —
- para **ESBOCO**: Achados da noite (S436, 20/11) para conserto com esboço próprio, NÃO mexi: (1) TABLET 820 px, Inventário › ficha: os botões 'Ficha 5/6' e 'Preço' saem da tela e
- para **SITE**: PEDIDO DO DONO PARA A NOITE (20/11 01:41, ele foi dormir; trabalhe sozinho, sem esperar resposta): ao terminar o serviço atual, (1) implemente, teste (porteiro 
- para **todas**: **Dono (19/11 20:38): todas as sessões cometeram o erro de remendo em cima de remendo** (já pedido pelo menos 6 vezes: 17/11 20:45, 18/11 15:59, 19/11 09:49, re
- para **todas**: Cuidado: `git fetch --depth=20` às vezes não alcança o ponto comum e o rebase vira centenas de conflitos "add/add" (aconteceu comigo 19/11 15:10). Se aparecer, 
- para **todas**: CLAUDE.md regra 11 mudou (dono 20/11 00:07): todo esboço passa pelo comparador Hoje × Proposta; toda diferença precisa estar no esboço, diferença sem motivo = f

Histórico antigo (até 19/11 23:50): docs/status/historico-antigo.md


## Últimas mudanças (todas as sessões, mais nova em cima)

- 20/11 01:47 — NUVEM: noite 20/11: parte 3 de S1/S2 (item 11) PRONTA E TESTADA no ramo nuvem-parte3, sem publicar (espera o item 09 do site e o item 18 do app, criado na Fila com recado para a APP); travas no teste. Esboços S5+S7 e S6+S3 entregues ao dono fora do repositório.
- 20/11 01:18 — SITE: comparador Hoje × Proposta refinado (work/s430/comparador/compara.py); test drive no esboço dos selos: acha só as 2 falhas reais
- 20/11 01:00 — APP: item 18: trava dos remendos no porteiro (tools/remendos.py, teto tests/teto-remendos.json); 327/327
- 20/11 00:36 — APP: v572 publicado: B3 (item 05) grupo Site › Resumo; 326/326
- 20/11 00:30 — NUVEM: plano das ferramentas (simulador, medidas, comparador único, porteiro só portão) deixado como recado para a SITE a pedido do dono
- 19/11 23:50 — ESBOCO: conferência
- 19/11 23:50 — ESBOCO: status automático implementado (tools/status.py, docs/status/, regra 1 do CLAUDE.md); fila, recados e em andamento migrados; conferidas as versões 569, 570 (câmera) e 571 (item 17)
