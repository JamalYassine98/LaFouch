# PROJETO MOCHI (guardado a pedido do dono, 16/11/2026 17:28)

Tudo sobre a Mochi (mascote e teste de leitura do site lafouch.com) num lugar só. Detalhes técnicos por versão: docs/SITE-COMO-FUNCIONA.md (S369–S388). Voz: docs/MOCHI-VOZ.md.

## 1. O que está no ar (site 1794856943, hospedado na Cloudflare Pages)
- Teste no celular (30 cm) e no computador (60 cm, resultado como estimativa).
- Voz: 22 falas novas ligadas (pt 195 / es 181 no lista.json). Teto de créditos ElevenLabs dado pelo dono: 6.000 (1.006 gastos). Nunca gravar sem ele autorizar o valor. Chave nunca no projeto.
- Fluidez de movimento (S370): salto pela distância, flutuar, olhar que antecipa, boca pelo volume da voz. Não feito: mão chegando depois do braço.
- Distância certa (S381): usa o lado maior da imagem da câmera. Conferido pelo dono (21–25 cm, câmera 720×1280).
- Resultado (S381): o quadro de leitura manda; faixa provável = grau ± 0,25. Ponto próximo que não combina é descartado.
- Medição a cada 0,35 s (o dono quer FREQUENTE; não espaçar).

## 2. Desempenho — o que foi feito em 16/11 e os números do aparelho do dono (Xiaomi 13T)
| Hora | Versão | Travadas | Tempo travado | Medição da câmera |
|---|---|---|---|---|
| 12:26 | antes | 91 | 8.175 ms | 85× · 5.988 ms |
| 12:58 | teste: trabalhador ao lado | 23 | 2.918 ms | 54× · 2.460 ms |
| 13:53 | S386 modo normal | 6 | 465 ms | 34× · 1.487 ms |
| 15:22 | mesmo código, celular quente | 33 | 1.924 ms | 90× · 4.294 ms |
| 15:53 | S387 claridade 1 a cada 4 | 12 | 1.053 ms | 18× · 938 ms |
| 17:00 | S388 claridade no trabalhador | 10 | 654 ms | 11× · 506 ms |
- S384–S386: leitura do rosto num trabalhador ao lado (`lfx/mp/mp-trab.js`); leitor preparado na abertura (só com arquivo guardado ou Wi-Fi); contorno do braço/corpo calculado por conta. `?camt=0` volta ao jeito antigo para comparar.
- S387: correção de erro meu (a regra "claridade 1 a cada 4" tinha parado de valer com o trabalhador).
- S388: claridade medida no trabalhador; o fio principal não copia mais a câmera.
- Medidor: `lafouch.com/?medir=1` (travadas, quem travou, câmera, leitor, distância).
- SOBRA (sem ordem): 11 quadros longos de ~46 ms na medição (causa ainda não medida); travadas únicas da abertura (textos, reCAPTCHA, toque em Começar).

## 3. Decisões e preferências do dono
- Testar primeiro num modo de teste por endereço, mandar vídeo/print do medidor, e só então "implementar".
- Não chutar causa de lentidão: medir no aparelho dele.
- "Brilho dos ícones por contorno": reprovado. Carregar o site por partes: ele desconfia, não fazer sem pedir.
- Um trabalhador basta para a câmera; trabalhador não mexe na tela.
- 13:56: a etapa "aproxime até embaçar" FICA ("toque especial, os clientes adoraram"). 17:06: mas quer ela automática, mais rápida e com um botão só (ver 4).

## 4. Esperando o dono
- ✔ 56a/56b APROVADO e PUBLICADO no S400 (17/11): botão único "Embaçou"; a fala nova aparece só no balão (voz não gravada, créditos). Texto original do esboço: etapa "aproxime até embaçar" com UM botão ("Embaçou") e UM toque; usa a distância daquele instante; botão trava ("Pronto") e a Mochi diz "Pronto, medi! Pode afastar o celular."; quem não toca e chega bem perto (ou passa o tempo) = "não embaça", concluído sozinho. Perguntas abertas: usar a distância de ~0,3 s antes do toque? manter a regra de só confirmar o quadro? gravar as 2 falas novas (créditos)?
- Motivo dele: acha que essa etapa erra (nos prints de hoje nunca apareceu "✓ combinam") e pede duas vezes.
- Mochi do modo loja: voz vem do site (não cabe na cópia); conferir no aparelho.

- 17/11 15:50 — ESBOÇO 104 (work/s410: edita.py, video2.py) Mochi 'a mão chega depois do braço': o braço dobra de leve na ponta quando gira (até 16°) e endireita com mola; braço com o ponteiro fica reto (senão a luva solta). Vídeo Hoje × Proposta no mesmo relógio (normal + 0,4x) + imagem de 4 quadros. ESPERANDO; nada no site. Se aprovar: primeiro modo de teste por endereço + medidor no aparelho dele (a dobra redesenha o braço enquanto ele mexe).

- 17/11 16:05 — DONO: **104 APROVADO** (Mochi: mão chega depois do braço; braço da varinha fica reto). Plano: primeiro modo de teste por endereço + medidor no aparelho dele, depois modo normal. ESPERANDO 'implementar'.

- 17/11 17:59 — DONO aprovou os TEXTOS da etapa 'aproxime' (meio-termo: parar o celular OU tocar Embaçou, vale o que vier primeiro): 1 'Agora vou ver de quão perto você consegue ler. Aproxime o celular do rosto bem devagar, sem parar de ler as letras.' 2 'Quando as letras começarem a embaçar, pare o celular ali, ou me avise apertando o botão Embaçou.' 3 'Não embaçou? Tudo bem, já medi.' 4 'Pronto, medi! Pode afastar o celular.' Voz NÃO autorizada ainda (teto estimado ~1.600 créditos). Próximo: ESBOÇO 105 do meio-termo.

- 17/11 18:20 — ESBOÇO 105 enviado (work/s410: edita105.py, video105.py, monta105.py): meio-termo da etapa 'aproxime' — parar (já aproximou 5 cm+, último 2 s varia até 1,2 cm, acima de 15 cm) mede sozinho; Embaçou continua; 'Não embaçou? Tudo bem, já medi.' quando chega a 15 cm sem parar. Falas novas só no balão (sem voz). ESPERANDO.

- 17/11 18:20 — ESBOÇO 105 enviado (work/s410: edita105.py, video105.py, monta105.py): meio-termo da etapa 'aproxime' — parar (já aproximou 5 cm+, último 2 s varia até 1,2 cm, acima de 15 cm) mede sozinho; Embaçou continua; 'Não embaçou? Tudo bem, já medi.' quando chega a 15 cm sem parar. Falas novas só no balão (sem voz). ESPERANDO.

## 5. Lições minhas
- Ao mexer numa parte, procurar tudo que depende dela (erro do S384 → S387).
- Número estranho no medidor do dono se investiga na hora.
- Rota do Playwright desliga a memória do navegador; `wait_for_function` precisa de função "()=>…" por causa da CSP; `__LFGZ.pp(G)` abre a etapa do ponto próximo direto nos testes.
