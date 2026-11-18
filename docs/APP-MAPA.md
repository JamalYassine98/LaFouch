# APP — MAPA RÁPIDO (ler PRIMEIRO em qualquer trabalho do app)
Criado em 18/11/2026 19:40 a pedido do dono: o estudo do app + tudo o que foi aprovado, num lugar só.
Manter ATUALIZADO a cada aprovação, mudança ou implementação (no mesmo commit). A lista viva (FALTA-APROVAR-15-11.md) continua sendo o histórico completo; este arquivo é o retrato de agora.

## 1. Onde está cada coisa
- Regras (alinhamento 1–11, padrões de luxo P1–P6, A1–A6, W/N/C/T/E, formulários, confirmação, símbolos › e ⌄): CLAUDE.md.
- Botões de cada tela (o que cada um FAZ, tocado de verdade, e a CARA): docs/APP-BOTOES.md (63 telas, 1.179 toques). Dados brutos: work/verif/res/.
- Achados da varredura dos padrões: docs/VARREDURA-PADROES-18-11.md.
- Base aprovada (o que já foi aprovado e ainda não está no app, aplicada sozinha no simulador): work/kit/base_app.py.
- Última versão publicada do app: v561 / 5.44.0 (18/11 08:16). Tudo aprovado ANTES dela foi publicado ou consta como sobra na lista viva.

## 2. Padrões do app (resumo para decidir rápido)
| Coisa | Padrão |
|---|---|
| Adicionar | "+" redondo ao lado do título (P1). Dentro do conteúdo: em discussão (ver 4). |
| Criar/editar | janela de baixo, um "Salvar", sem × nem Fechar; "Sair sem salvar?" só se mudou (formulários). |
| Confirmação | janela própria: botão vermelho + "Voltar" escrito embaixo. |
| Campos | linha fina, nome à esquerda, valor à direita (P3). |
| Escolher 2–5 opções | controle .trk do Pagamento/Marketing: fundo cinza, marca cinza que desliza (proposta 138, esperando). Exceção: Câmbio "Venda ⇅" botão único. |
| Botão secundário | contorno fino 1 px, sem fundo (.btn-sc de luxo). Principal: contorno rosa, largura toda. |
| Links | "›" sai (outra tela ou janela de baixo); "⌄" abre no lugar. Link sozinho = centralizado no fim do bloco. |
| Tela vazia | ícone + frase + explicação, centralizados (P5). |
| Distâncias | escala 8/12/16/24/32/48; abas → 1º conteúdo = 32 px. Toque 44 px = área (desenho pode ser menor). |
| Sem caixas | nada de cartão envolvendo tela/ficha; linhas finas e versalete (padrão do Dashboard). |

## 3. APROVADO, esperando "implementar" (app) — tudo na base
| Item | Tela | O que muda | Esboço |
|---|---|---|---|
| 132 | Guardião | grupos em versalete, linhas finas; ✓ verde à direita; "Ver ›"/"Conferir ›" rosa; "Silenciar 7 dias" cinza | work/s419 |
| 133a + 133j | Clientes › Novo cliente / ficha | linhas finas, título à esquerda, campos sem repetir o nome; abre na janela de baixo | work/s419 |
| 133b | Atacado › Tabela/Lojistas/Lotes/Mensagens | sem o fundo do grupo | work/s419 |
| 134 | Inventário › ficha | sem cartão e sem caixas; "Sem detalhe" fino; abas Histórico/Site/Preço; links no fim; 32 px abas→conteúdo | work/s420/r |
| 134b | Inventário › Fornecedores | compra em linha fina; Editar/lixeira alinhados; "Ver peças ⌄" centralizado | work/s420/r |
| 134c/134d | Inventário › Adicionar / Editar produto | janela de baixo; Ler haste + Foto lado a lado; um Salvar | work/s420/r |
| 32 px | todas as abas | 32 px entre a linha das abas e o 1º conteúdo | — |
| links | vários | ⌄ em Ver peças, Carregar mais 30 dias, como calcula, ver os 14, Ver todos os movimentos | — |
| 135a | Despesas | "+" redondo no título; linhas | work/s425 |
| 135b | Caixa › Objetivos/aviso/Movimentos | sem cartão; aviso em frase vermelha com linha acima; Movimentos em linhas | work/s425 |
| 135c | Atacado › Lojistas | "+" redondo; tela vazia centralizada | work/s425 |
| 135d | Giro | dobras sem cartão | work/s425 |
| 135e | Caixa › Retirada do dono | moeda em escolha; campos em linha (o controle muda se o 138m for aprovado) | work/s425 |
| 135f | Câmbio › Registrar troca | De/Para em escolha; campos em linha (idem 138m) | work/s425 |
| 135g | Pendências | linhas; "Ver ›" rosa | work/s425 |
| 135h | Preços | números na letra do texto; "1 dia" | work/s425 |
| 135i | Câmbio | botão único Venda ⇅/Compra ⇅, 36 px, toque 44, no centro do título | work/s425 |
| 136a | Inventário › ficha | "Lucro real" e "De onde vem o preço" com ⌄ | work/s425 |
| 136b | Inventário › Fornecedores | lixeira usa a janela de confirmação única | work/s425 |
| 136c | Inventário | "EM ESTOQUE (FILTRO) ⌄" | work/s425 |
| 136d | Despesas › Nova despesa | janela de baixo, campos em linha, um Salvar | work/s425 |
Obs.: 132 na base é só visual (ao implementar, ligar as ações de verdade).

## 4. ESPERANDO decisão do dono (app)
- 138 (substitui 137c/d/e/f/k/l): c Reservas 30/60/90 + Livre para você · d Novo acesso · e Usar G$/Informar · f Me lembra · l Dashboard moeda · m Retirada/Registrar troca (muda 135e/f) · o Paraguaio/Estrangeiro (todos os catbar3). "+ Receber parte em outra moeda" fica como hoje.
- 137a sino/Ações do caixa redondos · 137b ficha Voltar/Editar redondos + toque 44 no "Ficha 4/6" · 137g Vitrine · 137h Conferir o caixa sem Fechar · 137i Novo objetivo "Salvar" · 137j "+ Criar lote".
- Sugestões: "+" dentro do conteúdo (hoje texto; o dono rejeitou rosa centralizado no 137k) · "Salvar" só quando só salva dados, senão o verbo da ação.
- Sobras da lista S384 (Catálogo, Marketing, Preços Contador) e varredura tablet/PC/letra grande.

## 5. Mudanças que o dono quer fazer em aprovados (18/11 19:37)
(espaço para os pontos que ele vai mandar — anotar aqui e na lista viva)
1. Barras deslizantes (todas as escolhas) harmoniosas com o design → esboço 139, opções A contorno fino × B linha rosa (work/s429). Esperando escolha.

## 6. Ferramentas
- Simulador: work/s349/ap.py (abre(pw, tela, escuro, base=True)); telas e passos: tools/teste-android/telas.py.
- Olho: work/kit/olho.js · alinhamento: work/verif/alin2.js · abas: work/kit/abas_dist.js.
- Função dos botões: work/verif/botoes.py → work/verif/res/botoes_*.json · cara: work/verif/estilos.py → res/estilos.json · regerar docs/APP-BOTOES.md com o script do commit S425 (18/11 19:40).
- Celular real: .github/workflows/teste-celular.yml (cota grátis 30 min/dia).
