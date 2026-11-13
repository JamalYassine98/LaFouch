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
