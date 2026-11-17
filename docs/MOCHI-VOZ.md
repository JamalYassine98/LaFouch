# Voz da Mochi — referência (guardado em 13/11/2026 a pedido do dono)

Consultar ANTES de gravar qualquer fala nova. Histórico completo em docs/MEMORIA-PROJETO.md (09/11 a 11/11). Regra: nunca gravar (nem teste) sem o dono autorizar o valor em créditos; a chave do ElevenLabs nunca vai para o site nem para o projeto.

## 1. O que foi aprovado

| Item | Português | Espanhol |
|---|---|---|
| Voz (ElevenLabs) | "Mochi PT" · SvXoJJzLNRI3wECTYrmU | "Mochi ES" · 3vRJJjv6BIKZYw2NzOER |
| Modelo | eleven_v3 · stability 0.5 · sem tags | igual |
| Tratamento | "vos" não se aplica | espanhol latino com "vos" (hacé, tocá, podés) |
| Falas no site | 184 (media/voz/pt/lista.json) | 170 (media/voz/es/lista.json) |
| Aprovação final | 11/11 "o português tá perfeito" | 11/11 "voz ES aprovada" |

## 2. Receita de gravação (a que deu a qualidade aprovada)
- Gravar em CENAS (conversa inteira), nunca frase solta emendada; cortar no ponto mais silencioso entre frases (work/voz/cenas.py, gera.py, gera2.py, textos.py).
- Textos = os do site (LFI.tr), números por extenso (0,75 = "zero setenta e cinco"; ,50 = "e meio"/"y medio").
- Tratamento: aparar silêncio das pontas, compressor + loudnorm + limitador. SEM atempo e SEM lowpass. MP3 128k.
- Até 3 tentativas por cena; escolher a melhor versão POR FRASE.

## 3. Perfil de qualidade (medido nas 160 falas PT aprovadas — work/s164/mede.py)
| Medida | Faixa aprovada |
|---|---|
| Silêncio no começo | 30–40 ms |
| Silêncio no fim | 60–210 ms |
| Pausa dentro da frase | até 400 ms |
| Pico | 0,40–0,55 (nunca perto de 1,0 = estouro) |
| Volume | −18,5 LUFS (±0,5) |
| Tom mediano | 302 Hz (258–356); cada frase a ±5% do padrão da cena |
| Ritmo (ES × PT) | por SÍLABA, 0,90–1,20× a mesma cena em PT |
| Semelhança com a voz aprovada | ≥ 0,93 na cena e ≥ 0,85 por frase (resemblyzer, work/voz/voz.py) |
| Frase mais alta que as vizinhas | no máximo 3 dB |

## 4. Defeitos que já aconteceram e a causa (não repetir)
| O que o dono ouviu | Causa | Como evitar |
|---|---|---|
| Frases cortadas, nenhuma terminava | corte (-ss/-to) medido depois do atempo | cortar antes de qualquer efeito; não usar atempo |
| "¡Hola!" estourado | 4 dB acima do resto, pico −1 dB | conferir pico e diferença para as vizinhas |
| Trava entre frases | silêncio sobrando nas pontas (até 1 s) | aparar pontas; pausa máx. 0,4 s |
| "Fala atravessado"/ritmo estranho | frase gravada sozinha e emendada | gravar em cena; ritmo por sílaba |
| "acá" saiu "ata" | erro de pronúncia do modelo | o dono ouve TUDO antes de publicar; regravar a cena |
| "Voz de velha", R estranho | voz Laura (feita para inglês) | usar só Mochi PT / Mochi ES |
| Boca mexe sem som | site em segundo plano / áudio pausado ao silenciar | já corrigido no site (muted em vez de pause) |
- Eu NÃO consigo ouvir: só meço duração, volume, tom e semelhança. A aprovação final é sempre de ouvido, pelo dono (página de escuta antes de ligar no site: gravar em lista-teste.json, só virar lista.json depois do OK).

## 5. Como as falas tocam no site
- Uma voz por consulta; frase sem áudio gravado aparece só no balão (nunca a voz do celular no meio).
- Rodízio de frases (não repete a do degrau anterior); a boca (m.fala/m.calou) acompanha o áudio.

## 6. Estudo para o computador (13/11/2026) — NADA GRAVADO
Achado: no computador a Mochi hoje fala do CELULAR em várias falas. Não é só a dos 30 cm.
- PT: 7 falas com "celular" (411 letras): "…e segure o celular a 30 centímetros, um palmo." · "Chegue o celular um pouquinho mais perto." · "Afaste um pouquinho o celular." · "É só para medir a distância do celular até o seu rosto." · "Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo." · "Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar." · "Você afastou o celular para conseguir ler — isso é sinal de vista cansada."
- ES: 7 falas com "celular" (405 letras): "…y sostené el celular a 30 centímetros, un palmo." · "Acercá un poquito el celular." · "Alejá un poquito el celular." · "Es solo para medir la distancia del celular hasta tu cara." · "Vamos sin la cámara: sostené el celular a unos 30 centímetros, un palmo." · "Ahora una última cosa: acercá el celular despacio y tocá cuando las letras empiecen a verse borrosas." · "Alejaste el celular para poder leer — eso es señal de vista cansada."

Falas novas do aviso do QR (estilo das falas aprovadas; ES com "vos"):
- PT: "Este teste fica melhor no celular." / "Aponte a câmera para este código…" / "…ou seguimos aqui, como preferir."
- ES: "Este test sale mejor en el celular." / "Apuntá la cámara a este código…" / "…o seguimos acá, como prefieras."

Custo estimado (1 crédito ≈ 1 letra no eleven_v3; gravar em cena custa a cena inteira e pode levar até 3 tentativas):
- Só o aviso do QR (2 idiomas): ~198 letras → até ~594 créditos com 3 tentativas.
- Aviso + versões "tela" de todas as falas que citam o celular (2 idiomas): ~1014 letras → até ~3042 créditos com 3 tentativas.
- As falas com grau NÃO mudam.

## 7. Ordem combinada com o dono (13/11)
1. Esboço em VÍDEO da animação (work/s218/s218_mochi_qr.mp4) → dono aprova.
2. Dono confirma os textos e o teto de créditos.
3. Gravar em cena com a receita acima, conferir pelo perfil, publicar em lista-teste + página de escuta.
4. Dono ouve tudo → só então ligar no site.

## 7. Falas do computador gravadas (16/11/2026, S369b)
- 11 falas × 2 idiomas, 6 cenas, até 3 tentativas, melhor versão por frase: 1.006 créditos (teto do dono 6.000). Gravador: `work/s369/grava.py` (chave só por variável de ambiente).
- Limites usados = faixa medida nas falas já aprovadas com as mesmas ferramentas: tom 250–370 Hz, semelhança ≥ 0,84 (cena ≥ 0,90), pausa ≤ 450 ms, silêncio ≤ 80 ms no começo e ≤ 260 ms no fim, volume −19,7 a −17 LUFS, pico < 0,62. Falas no site agora: PT 195, ES 181.
- Aprovadas de ouvido pelo dono em 16/11 06:26 (inclusive as 4 em espanhol que saíram com ressalva de medida: pausa de 0,49 s, tom 242 Hz e ritmo mais rápido que o PT).
- 17/11 20:02 — VOZ das 4 falas do 107 GRAVADA (dono autorizou até 1.764 créditos e mandou a chave às 19:57; chave NÃO guardada): work/s410/grava410.py, brutos em /home/claude/voz_s410 (fora do projeto), escolha em /home/claude/voz_s410/escolha/escolha.json. 3 tentativas: gastou 714 créditos (total ElevenLabs 1.720 de 6.000). Frases curtas ficaram abaixo da semelhança 0,84 (medida fraca em fala curta) — escolhi a melhor de cada. ESPERANDO o dono ouvir (mochi-falas-novas-pt/es.mp3). Nada no site.
- 17/11 20:12 — Fala 1 PT regravada com vírgula ('Agora, vou ver…'; dono 20:09): 3 tentativas, 57 créditos (total da gravação 771 de 1.764 autorizados; ElevenLabs 1.777 de 6.000). Escolhida a 3ª (começa a 291 Hz, como a aprovada ~300; pausa 90 ms). ESPERANDO o dono ouvir.
- 17/11 20:20 — Fala 2 PT regravada sozinha (dono 20:14: 'AaProxime' e áudio abafado na escolhida): 3 tentativas, 81 créditos (gravação 852 de 1.764; ElevenLabs 1.858 de 6.000). Candidatas: t22 (A 80 ms, som até 12.400 Hz) e t23 (A 90 ms, 11.600 Hz). ESPERANDO o dono ouvir.
- 17/11 20:25 — Dono 20:15: gravada sozinha a voz muda. Regravei as falas 1 e 2 JUNTAS como cena (com a vírgula do Agora): 3 tentativas, 138 créditos (gravação 990 de 1.764; ElevenLabs 1.996 de 6.000). Lição: frase sozinha muda a voz — sempre gravar em cena; a medida 'semelhança da cena' (≥0,90) pegou isso. Candidatas t31 e t33. ESPERANDO o dono ouvir.
- 17/11 20:30 — DONO aprovou PT falas 1+2 = opção A (t31, cena). ES: 'Ahora' com o mesmo problema → regravadas ES 1+2 juntas com vírgula ('Ahora, voy a ver'): 3 tentativas, 141 créditos (gravação 1.131 de 1.764; ElevenLabs 2.137 de 6.000). A ES escolhida antes (t1) tinha som só até 5.200 Hz (abafada). Candidatas t31 e t33. ESPERANDO o dono ouvir.
- 17/11 20:19 — DONO aprovou ES falas 1+2 = opção A (t31). VOZ DAS 4 FALAS DO 107 PRONTA (PT e ES; escolha em /home/claude/voz_s410/escolha/escolha.json; arquivos finais work/s410/mochi-falas-novas-pt/es-final.mp3). Gasto: 1.131 de 1.764 autorizados (ElevenLabs 2.137 de 6.000). Lições: gravar SEMPRE em cena (frase sozinha muda a voz; 'semelhança da cena' ≥0,90 pega); frase que começa com vogal depois de pausa sai 'Aa-' → vírgula depois da 1ª palavra ajuda; conferir nitidez (som até onde vai) comparando com fala aprovada de sons parecidos (frase sem 's' é naturalmente mais baixa, ex.: 'Pronto!' aprovado vai só até 1.700 Hz). Entra no site junto com o 'implementar' do 107. Próximo da lista: item 4 (modo de teste com 104, 107–110) — precisa do 'implementar' do dono.
- 17/11 20:35 — DONO 20:29: 'Leu!'/'¡Leíste!' fora do padrão → opção B: gravar 'Muito bem!'/'¡Muy bien!' (em cena com a frase seguinte). 3 tentativas cada, 243 créditos (gravação 1.374 de 1.764; ElevenLabs 2.380 de 6.000). Semelhança de palavra curta é baixa por natureza (aprovadas 'Isso!' 0,70, 'Leu!' 0,69): as novas ficaram 0,68–0,74, normal. Código: trocar T('Leu! Agora vou…') por 'Muito bem! Agora vou…' junto com o 107. ESPERANDO o dono ouvir.
- 17/11 20:40 — 'Muito bem!' regravado no MEIO da conversa (depois de 'Consegue ler a última frase?'), para não começar do silêncio (dono 20:35: 'mmuito', quer manter as palavras). 2 tentativas nos dois idiomas + 1 PT; o gravador PAROU sozinho no teto (1.630 de 1.764 autorizados; ElevenLabs 2.636 de 6.000). Candidatas t51 e t52. ESPERANDO o dono ouvir.
- 17/11 20:50 — Dono autorizou teto de 2.200 créditos (20:40). Nova rodada 'Isso, muito bem!' recortada (work/s410/grava_mb.py): 3 tentativas por idioma, 108 créditos (gravação 1.738 de 2.200; ElevenLabs 2.744 de 6.000). ACHADO: a Mochi JÁ TEM 'Muito bem.' (pt4_011) e 'Muy bien.' (es7_012) gravados e em uso (lista 'ok'); medidos com o mesmo método, o 'm' deles é curto como as outras aprovadas. Correção minha: a medida espectral do 'm' (115–135 ms) era inflada pelo 'u' escuro; pela subida de volume, o 'm' das novas fica 5–40 ms, perto das aprovadas — não acho o defeito por medida, só pelo ouvido do dono. Proposta: usar as já aprovadas. ESPERANDO.
- 17/11 20:44 — DONO: troca do 'Leu!'/'¡Leíste!' APROVADA SEM ESBOÇO: no momento da lente ('… Agora vou tirando um pouquinho de grau…') ela usa as mesmas comemorações já gravadas do quadro (rodízio 'ok': Isso!, Muito bem., Ótimo., …), PT e ES. Sem voz nova. ESPERANDO 'implementar' (junto com 104, 107–110). As gravações 'Muito bem!' novas NÃO serão usadas.
- LIÇÃO / REGRA (dono 20:44: 'você devia ter me avisado antes de gastarmos os créditos'): ANTES de propor ou gravar qualquer fala, procurar na lista de falas já gravadas (media/voz/pt|es/lista.json e a página Falas da Mochi) se já existe uma igual ou que sirva, e avisar o dono antes de gastar crédito.
