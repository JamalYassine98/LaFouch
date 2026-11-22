# Esboço 40 — para a lista final do dono

## 40a (v615) "Câmera reta" — CONFERIR PRIMEIRO NO CELULAR
A conta do sensor de nível foi feita pela regra do navegador e testada só no simulador (com leituras de mentira).
No celular: Estúdio › Começar › Vídeo, deitar o celular e deixar reto.
- "Câmera reta" tem de ficar verde com o celular reto, e amarelo com os graus certos quando torto (o lado dito tem de ser o lado certo).
- Se NÃO ficar verde com o celular reto, não dá para gravar o giro: avisar na hora (eu corrijo a conta).
- O modo Foto ("Reto") passou a usar a mesma conta: conferir também.
Foto: camera_torta_3graus.png.

## 40b (v616) "Peça reta"
Medida pela imagem (topo de cada lado da armação). No simulador a cena é um desenho; no celular conferir com uma armação de verdade:
- reta no prato → "Peça reta" verde; um lado caído → amarelo, com o lado certo na frase e a seta do lado certo.
- Se ficar amarelo com a peça reta (armação de formato diferente nos dois lados, haste aparecendo), avisar: a tolerância é 2% da altura do quadro.
Fotos: peca_torta_4graus_844.png e _740.png.
Conserto junto: na v615 "Câmera reta" podia continuar amarela com o celular bem reto (a folga pedia no mínimo 0,3°). Corrigido na v616.

## 40c (v617) o tratamento endireita
Prova no simulador com um giro gravado de verdade (peça clara), a cena inteira girada (saída em endireita_ponta_a_ponta_saida.txt, fotos endireita_*_graus_frente.jpg):
- 0° → não mexe: frente, 3/4 e capa IGUAIS ponto a ponto às da versão anterior (mesmo vídeo).
- 2° e −2° → a frente sai reta (−0,3° e 0,2°).
- −3° (medido 3,2°) → não mexe e avisa "A peça ficou torta no giro (3°): endireite a armação no prato e grave de novo".
- 3° e 5° para o outro lado → o app NÃO acha a frente certa (pega uma vista de lado). Isso já acontecia antes desta versão; a correção percebe
  (a "frente" não é simétrica) e não mexe, mas também não avisa. Vou consertar a escolha da frente na parte seguinte.
Para o dono saber:
1. O esboço dizia "reta = 2% da altura do quadro (≈ 0,5°)". Na conta real 2% dá ≈ 3°. Ficou assim: o item "Peça reta" da câmera avisa acima de 2% (≈ 3°);
   o tratamento considera reta até 0,5° e endireita de 0,5° a 3°. Os dois se completam, mas é diferente do texto do esboço.
2. O tratamento gira os 360 quadros no mesmo ângulo (como aprovado). Isso corrige bem câmera torta; se só a ARMAÇÃO estiver caída no prato,
   de lado ela aparece inclinada para a frente/trás e o giro não fica perfeito — por isso o aviso "Peça reta" antes de gravar continua importante.
3. Nada disso rodou no celular: conferir com um giro de verdade (a frente tem de sair reta; o resto do giro, sem "pulo").
