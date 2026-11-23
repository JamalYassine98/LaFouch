# COMO FAZER — Marketing do Semp (itens 70 e 68 da Fila) · S435 ESBOCO, 22/11/2026 22:00

**Ordem do dono:**
- 70: "implementar" dito em 22/11 às 15:49 ("Sim"), esperando os esboços dos setores.
- Setores: aprovados em 22/11 às 21:56 (72 Agenda, 73s com os 5 setores, Marca só no Marketing).
- 68 (Destaque, esboço 71): sai do PARADO junto com o 70.

**Regra:** fazer EXATAMENTE os esboços abaixo; nada a mais. Na dúvida, perguntar.

## Imagens aprovadas (a base é esta, não o app de hoje)
| Tela | Imagem |
|---|---|
| Marketing (escritório do Semp) | work/s435/semp/esboco_70_marketing_semp_{escuro,claro}.jpg |
| Setor sem informação (vazio) | work/s435/semp/esboco_70b_mercado_vazio.jpg |
| Destaque da semana | work/s435/semp/esboco_71_destaque_semana.jpg + esboco_71b_destaque_formatos.jpg (detalhes em COMO-FAZER-DESTAQUE-53.md, parte "ATUALIZADO 15:48") |
| Agenda | work/s435/semp/esboco_72_agenda.jpg + esboco_72b_agenda_na_pratica.jpg (só o fluxo; veja §4) |
| Criar · Resultados · Temática · Cartões · Marca | work/s435/semp/esboco_73s_setores_semp_{escuro,claro}.jpg |

## 1. Início › Marketing (70)
- **Sai o GRUPO Marketing do Início** (Marketing · Temática · Cartões · Analisador). A linha "Marketing" abre direto o escritório, com "‹ Início". É o mesmo jeito do 52a.
- **Topo:** h1 "Marketing", **sem subtítulo**. Sai o "foco: …" (dono, 14:46).
- **"O Semp sugere hoje · N":** uma linha por assunto, só com o que existe hoje. Vêm de:
  - **Status de hoje** (mkAbre): vira "Postar às 20h · ‹peça› · N vendas no mês".
  - **Datas que vêm aí:** vira "Natal em N dias", quando faltam ≤ 40 dias.
  - **"Mais vistas e não vendidas · site" e "Status com o giro":** viram linha só quando houver dado.
  - O **N conta só as linhas que aparecem**. Lote de compra NUNCA entra (regra H do Titan).
- **Setores** (ícones e rótulos cinza, 37b), nesta ordem:
  1. Destaque da semana
  2. Agenda
  3. Mercado
  4. Criar
  5. Resultados
  6. Temática
  7. Cartões
  8. Marca
  - Cada um abre a sua tela (lugar ›). A **exceção é a Marca**, que é tarefa: abre a janela e não tem ›.
- **Setor sem informação** = o vazio padrão `lfVazioHtml(ícone, frase, explicação)`. Hoje isso vale para Mercado e Resultados. O setor aparece SEMPRE na lista.
- **"Objetivo do mês" sai da tela** (dono, 14:46: "meu foco é vender"). O plano da semana usa "vender" como base. **Não apagar a função** (mkPlano lê o objetivo): ela fica com o valor fixo.

## 2. Destaque da semana (71) = item 68
Siga o COMO-FAZER-DESTAQUE-53.md, com as mudanças do 71:
- sem subtítulo;
- Titan;
- desconto = a folga do Titan;
- peças reais;
- nome curto (Leitura…/Solar…);
- linha Site pelo formato (71b).

## 3. Mercado (70b)
- Por enquanto, só o vazio: "O Semp ainda não achou nada" + explicação.
- As tendências e distribuidoras vêm depois, em esboço próprio.

## 4. Agenda (72)
- **"‹ Marketing", h1 "Agenda" e o + na linha do título** (L2: centro com centro). O + cria um post fora do plano.
- **"Esta semana · X de 6 feitos":** os itens do Plano da semana de hoje (mkPlano). Cada um tem a bolinha de feito, "Dia · Formato · hora" e a peça em nome curto.
- **"Datas que vêm aí":** as datas de hoje, com "em N d" à direita.
- **"Próxima semana ⌄":** abre no lugar, "o Semp monta na segunda".
- **Tocar num item (72b):** abre a **janela de criar de HOJE** (.mkCrJn) com aquela peça e aquele formato.
  - ⚠ O visual da janela do post **NÃO muda agora**: o dono reprovou o novo, e isso fica para o Estúdio.
  - Ao fechar depois de postar, o item fica feito ("1 de 6 feitos").
- **Saem da tela Marketing:** "Plano da semana" e "Datas que vêm aí". Moram só aqui.

## 5. Criar (73s)
- **"Formato":** 6 linhas com ícone cinza, nome e frase curta:
  - Post · uma peça · foto e legenda
  - Carrossel · até 10 fotos
  - Story · vertical · 15 s
  - Status · WhatsApp · some em 24 h
  - Vídeo · 15 s com o giro da peça
  - Roteiro · o texto para você gravar
  - Tocar abre a janela de criar de hoje com o formato escolhido. É tarefa: **sem ›**.
- **"Listas de transmissão ⌄"** (ler): é o "Listas por perfil" de hoje, que abre no lugar. Sem cliente com telefone, mostra "nenhum cliente com telefone ainda".
- **Sai da tela Marketing:** "Criar com um toque" (os 6 botões-pílula).

## 6. Resultados (73s)
- O "Resultados ⌄" de hoje (mkAbre, details.mkDt) vira tela própria.
- Sem post medido, mostra o vazio: "Nenhum post medido ainda" + "Poste pelo app: dois dias depois o Semp mede…".
- Com dados, mostra as linhas que hoje existem dentro do details, sem inventar métrica nova.

## 7. Temática (73s) — o calendário do comércio vira tela do app
- **Hoje** é o painel web dentro do app (onlPainel('tem'), que fica branco sem internet).
- **Passa a ser tela do app**, com a MESMA lógica do painel (catalogo/admin.html: calOc, calProx, calSt, CAL_IDS):
  - **"No ar":** o evento ligado agora. Mostra "dd a dd de mês · desliga sozinho hoje às 23:59" ou "liga sozinho às 00:00", e "Ver prévia do site ›".
  - **"Próximas":** as próximas datas, cada uma com o **interruptor** do app (.sw, item 46: liga-desliga na tela do assunto). Ligado = "Automático", desligado = "Desligado".
  - **"Calendário completo ›":** os próximos 12 meses, tela própria.
- **Uma lógica só:** passar calOc/calProx para um arquivo que o app e o painel leiam juntos, ou o painel lê do app. NÃO copiar as datas em dois lugares.
- **Gravar** em config/site.cal e config/site.calv pelo mesmo caminho do vitApi PATCH com updateMask (como a cotação, src/97-nuvem.js:383). Se as regras não deixarem gravar esses campos, **parar e pedir à NUVEM**.

## 8. Cartões (73s)
É a tela 'cup' de hoje (src/97-cupons.js, cupDesenha) no padrão novo:
- **"‹ Marketing", h1 "Cartões" e o + na linha do título** = criar o **cupom do evento**. É o mesmo formulário de hoje (cevCod, cevPct, cevMax, simulação, "Publicar e baixar post + story"), mas em janela de baixo com "Salvar".
- **"Cartões":** linhas com ícone de linha cinza:
  - Boas-vindas
  - Próxima compra
  - Indique uma amiga
  - Cliente fiel
  - Cliente VIP
  - Cada uma com a frase de hoje e, à direita, "usados de gerados" vindo da nuvem.
  - **SAEM OS EMOJIS** (regra 17: um conjunto de ícones). Vale também para os avisos (🔒🎄⏸️ℹ️).
- **"Este mês":**
  - Descontos de cupons (valor à direita)
  - O que o app fez sozinho ⌄
  - Proteções ⌄
  - Códigos ativos › (lista longa, tela própria com "Usar"/"Cancelar" de hoje)
- **Sem internet:** o aviso padrão de "sem internet" do app, o mesmo de todo lugar. Hoje aparece "Entre na nuvem…" em texto solto.
- **Clientes:** se houver outra entrada para Cartões em Clientes, ela aponta para esta mesma tela. Uma tela só.

## 9. Marca (73s) — só no Marketing (dono, 21:56)
- **Sai de Ajustes › Loja** a linha "Marca" (src/96-ajustes.js:156). A janela ACT.ajMarca é a mesma.
- **Campos em linhas finas** (regra 15): rótulo cinza à esquerda e valor à direita, sem caixa. Vale para o select de Idiomas também.
- **Hashtags:** a linha mostra "#lafouch e mais N" (L4: nunca cortar). Tocar abre o campo inteiro.
- Um "Salvar". Fecha arrastando ou tocando fora. Se mudou, pergunta "Sair sem salvar?".
- Os dados continuam em S.mkt.kit (mkKit).

## 10. Sai no mesmo passo (regra 12d)
- O grupo Marketing do Início, e as entradas Temática/Cartões/Analisador dele.
- As seções da tela Marketing que viraram setores:
  - Objetivo
  - Status de hoje (vira sugestão)
  - Criar com um toque
  - Plano
  - Datas
  - Listas
  - Resultados
- A linha Marca de Ajustes.
- A Temática do painel dentro do app (onlPainel('tem')).
- Os emojis dos Cartões.

## 11. Travas no Argus (regra 12e)
- Início não tem grupo Marketing, e Marketing abre com "‹ Início".
- Os 8 setores estão sempre presentes, e o setor vazio usa lfVazioHtml.
- "O Semp sugere hoje · N": o N é igual ao número de linhas, e nenhuma é lote de compra.
- Ajustes não tem a linha Marca; existe uma janela Marca só.
- Cartões não tem emoji.
- A Temática do app e a do painel dão as mesmas datas (uma lógica só).

## 12. Entrega em partes (regra 3; publicar e marcar cada uma)
1. Marketing (70 + 70b) e a saída do grupo.
2. Agenda + Criar.
3. Resultados + Mercado + Marca.
4. Temática (pode precisar da NUVEM).
5. Cartões.
6. Destaque da semana (68).

Depois de cada publicação, o ESBOCO confere as telas.
