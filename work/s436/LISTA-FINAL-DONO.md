# LaFouch · app — lista final do "implementar tudo" (v589 → v624)

> **GUARDADA (dono 22/11 01:46):** entregar de novo DEPOIS da próxima fase de implementação (a do esboço "famílias", que o dono está fechando com a sessão de esboço). Antes de reentregar: atualizar com o que a fase nova mudar e tirar o que ela resolver. As correções desta lista se aplicam depois, com calma.

Sessão APP · 22/11/2026. Tudo abaixo foi publicado e **testado só no simulador** (porteiro com 375 provas + provas próprias).
**Nada foi testado em celular de verdade.** O app do celular se atualiza sozinho para a v624 (5.50.49).

---

## 1. Conferir no celular — nesta ordem

### 1.1 Câmera do giro — CONFERIR PRIMEIRO (v615, v616)
Se isto estiver errado, o botão de gravar o giro não acende.
1. Estúdio › uma peça da fila › a câmera abre. Deite o celular e deixe reto.
   - "Câmera reta" tem de ficar **verde** com o celular reto.
   - Torto: amarelo, com os graus e o lado certos ("Endireite o celular: 3° para a direita").
2. Com a armação reta no prato, "Peça reta" fica verde. Com um lado caído, amarelo, dizendo o lado certo, com a seta.
3. No modo Foto, o "Reto" usa a mesma leitura: conferir também.
Se "Câmera reta" não ficar verde com o celular reto, me avise na hora.

### 1.2 Giro tratado (v617, v618)
- Grave um giro com a peça um pouco torta (uns 2°): a frente tem de sair reta e o giro sem "pulo".
- Peça bem torta (5°): o app avisa "A peça ficou torta no giro… grave de novo".
- Peça reta: o giro sai igual ao de antes.
- Faça com armações diferentes (clara, escura, metal fino): no simulador só havia uma peça clara.

### 1.3 Diário do giro, para eu acelerar o tratamento (v607)
Depois de gravar um giro, com o celular no cabo, rode no PowerShell:

```
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" logcat -d | Select-String "LF-CAM" | ForEach-Object { $_.Line } | Set-Content "$HOME\LaFouch-Mobile\camera.txt" -Encoding utf8
```

### 1.4 Estúdio (v619, v621, v622)
- Cada peça da fila mostra **Frente · 3/4 · Giro** (bolinha = tem, anel = falta).
- A câmera diz **para qual peça** vai ("GIRO PARA" / "FOTO PARA" + nome, cor, código).
- **Galeria ›** de cada peça: frente, 3/4 e giro. Arrastar o giro com o dedo: gira liso? "Refazer ›", "Tirar agora ›", "Gravar agora ›", "Ver a ficha da peça ›".

### 1.5 Editar produto (v604, v605, v623, v624)
- Abre na janela de baixo, com um "Salvar"; mudar algo e sair pergunta "Sair sem salvar?".
- Cores e fotos: sem "Trocar foto" no topo; tocar na miniatura da cor abre a câmera do Estúdio.
- **+ Nova cor ›**: escolher a cor, quantidade e custo; salvar; a cor aparece na lista e na fila do Estúdio.

### 1.6 Ajustes (v591, v611, v612)
- 3 blocos: Loja · Contas ligadas · Este aparelho, sem cartão. Abrir cada linha. Arrastar uma linha (só dentro do bloco).
- Loja › **Marca**: janela com "Salvar". Loja › **Preços**: o interruptor do preço automático e "Contas, taxas e meta".
- Cópias e nuvem: as 4 linhas numa linha só cada.

### 1.7 Aviso curto (v613, v614)
- Cor pelo tipo: verde certo · amarelo atenção · vermelho erro · neutro em andamento.
- Fica acima da barra de baixo; com janela aberta, acima do botão dela.
- No Início, arrastar um atalho: o chip de dica e a lixeira desceram um pouco.

### 1.8 Navegação e visual (v594–v603, v608–v610)
- Tocar num grupo no Início abre a lista de telas dele (Marketing abre direto).
- Ícones das listas em cinza. "Gerenciar grupo ›" cinza. Busca do Início normal.
- Reservas dentro de Dinheiro; "Giro e preços"; Histórico com "Semana…" abrindo no lugar; dobras em linha.
- Ficha da peça sem caixas; Fornecedores; links no fim da ficha.

### 1.9 Preços, Pendências e pedidos (v590–v593, v606, v620)
- Black Friday: só a de Ciudad del Este (cupons, tema, marketing).
- Preços: ferramentas, decisões agrupadas, "Aceitar os N".
- Pendências: PIX sem par com "Ligar" a um pedido (não testado com a nuvem de verdade).
- Pedido antigo com o desconto do Leve 2 mostra "Desconto do site".

---

## 2. Para você decidir ("sai" / "fica" / "faz")

**Giro e câmera**
1. Letra pequena na câmera deitada: com o nome da peça + frase + 11 itens, a coluna só cabe com letra de 11–13 px. Quer um esboço (nome ao lado do ×, ou mostrar só o que falta)?
2. O esboço 40 dizia "reta = 2% da altura (≈ 0,5°)"; 2% dá ≈ 3°. Ficou: a câmera avisa acima de ~3°; o tratamento endireita de 0,5° a 3°. Serve assim?
3. O tratamento gira os 360 quadros no mesmo ângulo (como aprovado). Corrige bem câmera torta; armação caída no prato não fica perfeita de lado.

**Estúdio e Editar**
4. Vinda do Editar, a câmera do Estúdio abre no modo Vídeo (giro). Prefere que abra no modo Foto?
5. "Não sei o nome: tirar uma foto e o app sugere" não entrou na Nova cor (no Editar a foto nunca sugeriu o nome). Quer um esboço para isso?
6. A cor nova é criada na hora, ao salvar a janela (antes ficava em rascunho). Fica assim?
7. No modo Foto mantive a linha do passo ("Frente · 1 de 2 · peça 3 de 24"), que o esboço não mostrava.

**Ajustes**
8. **Instagram** (Contas ligadas) não entrou: o app não tem a ligação. Precisa do esboço da janela "Conectar" e do trabalho da nuvem.
9. Janela Marca: os campos seguem em caixas; a regra pede linhas finas — precisa de esboço. E agora só grava no "Salvar".
10. Celular estreito (360) com letra 1,3×: três linhas de Ajustes ainda não cabem.

**Linhas vestidas de link** (a adivinhação antiga pintava de rosa; mantive igual para não mudar tela sem você ver)
11. Dashboard: "Resultado do mês", "Vendas do período", "Quanto separar…" (rosa quando fechadas) e o período "Este mês ›".
12. Pedidos e Câmbio: linhas com 44 px de altura (o estilo delas pede 56 px).
Voltam ao estilo de linha normal?

**Código que não roda mais**
13. A sugestão **"Leve 2" do balcão** (quando o cliente acha caro, o pedido sugere "Leve 2: + peça por G$…"). Não era do site e está em uso. Sai ou fica?
14. A folha "VER" e o **arrastar uma tela da folha para a barra de baixo** ficaram sem caminho desde a navegação nova (19/11). Quer de volta (arrastando da lista do grupo) ou apago o código?

**Superfície sem cartão (149s — Fila 44)**
15. Tirar o cartão das 9 telas aprovadas também muda Caixa e Vender/Catálogo (imagens já enviadas: work/s436/4d/149s/). Pode mudar as duas? Sem resposta, não publiquei nada do 149s.

**Miúdos**
16. Texto do "Sair sem salvar?" ("O que você mudou nesta janela não fica guardado.").
17. Preços: uma linha por tabela; "Aceitar os N" aceita só os mostrados. Evento em andamento: "em 0 dias" / "começou" / "no ar".
18. Pendências PIX: "pedido de hoje HH:MM" no lugar de "reserva até".
19. Grupo "Giro e preços": a frase é igual ao nome.

---

## 3. O que espera você ou outra sessão

**Aprovado depois do "implementar tudo" (21/11 08:03) — precisa de um novo "implementar":**
41c Galeria do app e "giro sem peça" (esboço pronto, esperando) · 43 Estúdio no padrão · 44 Cadastro do Inventário no padrão · 45 Peça nasce no Estúdio · 46 Liga/desliga na tela do assunto · 52 partes 1 e 2 · 54 Preços, escritório do Guardião · 55 Desconto do Guardião no Vender.

**Esperando o seu "sim" ou "não" no esboço:** 48 · 49b · 50 · 53.

**Esperando material:**
- Item 38 etapa 2 (giro mais rápido): o diário do celular (comando do item 1.3).
- Resto dos 52: o "como fazer" por família, da sessão de esboço.
- Nota 100 em foto meio apagada: precisa de esboço.

**Provas instáveis do porteiro (não são erro do app):** "v468 nuvem segura" e "S370: computador… leitor de código" falham de vez em quando no porteiro cheio e passam sozinhas (Fila 36).

---

## 4. Erros meus neste trabalho, já consertados
- v615: "Câmera reta" podia ficar amarela com o celular bem reto → consertado na v616.
- v617: com a cena torta 3°+, o app pegava uma vista de lado como frente (já era assim antes) → consertado na v618.

Detalhes de cada assunto: work/s436/37c, 37d, 40, 41, 42 e leve2 (arquivos PENDENTE-DONO.md, com fotos).
