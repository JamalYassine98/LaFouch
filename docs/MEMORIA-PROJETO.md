# Memória do projeto LaFouch (decisões do dono, Jamal)

Este arquivo é lido no início de cada sessão (CLAUDE.md aponta para ele). Atualizar a cada decisão nova.

## Regras de trabalho
- Fidelidade visual: o app deve ficar EXATAMENTE como as imagens/vídeos aprovados. Referência única das telas de cadastro: as 10 folhas `p_1..p_10.png` (geradas por `/tmp/ad/nv2/gen.js`; se sumirem, ver `docs/`). Sempre comparar print real do app com a imagem antes de mostrar.
- Ideias novas: só mostrar imagens; implementar quando o dono avisar ("Perfeito, pode implementar", "Pode implementar tudo").
- Cada release: testes (`python3 tests/run.py`) → sw.js (lafouch-vNNN) → commit/push main. NÃO gerar APK nem Windows (ordem do dono em 27/10/2026, para economizar tokens), só se ele pedir.
- Dono escreve em português; respostas curtas, sem jargão.

## Decisões de cadastro (aprovadas, v328–v332)
- Pré-graduado = modelo + cor + grau; mesmo grau pode vir em cores diferentes; um pacote pode gerar várias linhas.
- Foto da cor OBRIGATÓRIA e trava a entrada; sem ícone "Sem foto" (Início mostra "N modelos sem foto" + "Completar fotos").
- O app lê quantidade da etiqueta ("24 pc"), grau e código quando legíveis; senão o dono digita. Lembra a cor do mesmo pacote ("como da última vez").
- Semelhança por foto: mostrar só ≥80%; abaixo disso "Não achei parecido". Sempre o dono confirma.
- Foto de UMA peça vira foto da cor; foto de pacote/etiqueta/caixa só é lida e descartada. Memória do modelo (cor habitual, graus) fica dentro do modelo (`S.memo`) e some ao excluir o produto.
- Botão: "Foto da etiqueta, da caixa ou do pacote".
- Chegou mercadoria: Foto da nota / Preencher à mão → Nota lida (total = soma das linhas) → Entrada da compra com barra por linha (Ler haste / Foto / À mão ou Detalhar depois).

## Pendências conhecidas
- Oferta (piso/trava): v319 já tem oferta no Inventário com piso/trava e data final. O dono diz que aprovou propostas de Oferta; o histórico anterior ao resumo não permite confirmar qual. Pedir a imagem aprovada antes de mexer.
- Etapa 3 incompleta: tela de detalhar uma linha da compra (tipo/custo da linha, qtd ≤ faltam) e lembrete no Início de peças sem detalhe.
- Notificações push; "grau não identificado"; OCR de etiqueta de grau; confirm() ao desligar o site; páginas de rodapé/privacidade; keystore fixa do APK; regras do Firestore.

## Histórico de versões
Ver `git log` (v300 → v332). Resumos de cada versão estão nas mensagens de commit.

## Falas do dono (literais, as que definem regras)
- "você ficava fazendo diferente toda vez" / "me mostre EXATAMENTE, como ficaria" → fidelidade total às imagens aprovadas.
- "analise COM EXTREMA calma para não errar de novo".
- "Vamos elaborar ainda mais antes de implementar" / "só implementar quando eu avisar".
- "Perfeito, pode implementar" (10 folhas de cadastro) e "Pode implementar tudo" (27/10/2026, 12:47).
- "Eu não aprovei as proposta de oferta?" (27/10/2026, 13:12): ele afirma que aprovou propostas de Oferta; reenviar imagem para confirmar qual.
- "Melhor a exigência da foto, pq a idéia é o catalogo ser completo".
- "A foto trava a entrada ... remova esse icone de sem foto, pq não faz sentido".
- "eu não quero que guarde a foto do pacote ... se eu excluir um produto ele exclui essas informações".
- "Se não da pra ler o grau significa que eu tenho que inserir manualmente, não tem problema".
- "Pode ser abaixo dos 20% quando tem uma discrepância muito grande, mas priorizar a semelhança acima de 80%".
- "cada grau pode ser da mesma cor ou ter cores diferentes".
- Quer ter os dois sistemas: leitura da haste e cadastro por foto (óculos de grau quase nunca têm informação na haste).
- Outras decisões antigas: remover fundo branco automático da foto (foto entra como foi tirada); projeto de 5 imagens aprovado (v328); não voltar o app para a versão antiga.

## Aviso
O histórico bruto anterior a 27/10/2026 foi condensado pelo sistema e não é mais legível. Este arquivo e o git log são a memória durável. Se uma decisão do dono não estiver aqui, pedir a ele a imagem/mensagem em vez de supor.

## Pedidos de 27/10/2026 13:32
- Formato/Material/Gênero/Tipo: trocar chips por seletor estilo 'Label Select' (campo com lupa + seta, lista abaixo); o botão Formato não respondia ao clique. Resolver toda interação parecida.
- Vendas: filtros Todos…Pré-graduados dentro de um filtro chamado 'Produto', alinhado.
- Aba Site: ao abrir um produto, permitir ir ao Inventário (ex.: modelo sem foto).
- Backup: fotos se perdem ao importar (ex.: Solar aviador rosa). Corrigir.

## Feito em 27/10/2026 (v333)
- Seletor Label Select nos campos Tipo/Formato/Material/Gênero do Novo modelo (Formato não abria em modelo existente: corrigido).
- Vendas: chips de tipo e graus agora ficam no filtro 'Produto' (botão de filtro).
- Painel do site (repo catalogo, admin.html): botão 'Abrir no Inventário' no produto; o app trata a mensagem lfAbrir.
- Backup: importar não apaga mais as fotos que já estão no aparelho (antes o import substituía S.fotos e saveFotos apagava o resto do IndexedDB).

## v334 (27/10/2026 14:06)
- Classe de cor lida da haste (ex.: C4) não volta mais para C1 (sobra de NVC.vr de cadastro anterior; fillAdd e Preencher à mão agora zeram).
- Câmera (haste e fotos): sem zoom nativo, aparece slider de zoom digital.
- 'Tirar a foto' / 'Fotografar' / 'Foto da cor' abrem a câmera do app (não a galeria); ícone novo (SVG) no lugar do emoji.
- Todos os botões têm animação ao apertar (scale + brilho).
- Busca do seletor sem borda amarela/rosa.
