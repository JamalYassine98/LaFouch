# Estudo — efeitos do destaque do site (ESBOCO/S435, 22/11/2026)

Pedido do dono (22/11 01:41): um estudo de marketing sobre os efeitos. "Tem efeito que parece coisa de videogame; tem de ser elegante, do jeito que o site está agora."

## O que as marcas de luxo fazem

- **Movimento com contenção.** A animação não está ali para entreter. Ela mostra refinamento: um fade suave, um parallax que parece respirar e não pular (appnova.com, "9 Secrets to Designing a High-Converting Luxury Website").
- **Lento, suave e com propósito.** No luxo o movimento é coreografia, não festa; o objetivo não é chamar a atenção (iiad.edu.in).
- **Câmera lenta dá valor.** Produto de luxo atrai mais em câmera lenta (Jung & Dubois, 2023, Journal of Marketing Research), e por isso os sites de luxo usam fades longos (nickkolenda.com).
- **Excesso parece truque.** Animação demais deixa o site com cara de "gimmick", o oposto do que uma marca de alto padrão quer (businessabc.net).

## Os 4 efeitos de hoje (painel › Destaque › Efeitos)

| Efeito | O que faz (código do site) | Veredito |
|---|---|---|
| Entrada em cascata | o cartão sobe e o óculos desliza, uma vez, ao abrir a página (index.html:892–895) | **Fica**, como o movimento padrão, sempre ligado, sem botão. Respeita "reduzir movimento". |
| Respiração | o óculos aproxima e volta em loop de 3,4 s (index.html:897) | **Fica, mais lenta**: um ciclo de uns 10 s, crescendo só de 2 a 3%. Hoje 3,4 s é rápido demais para luxo. |
| Inclinação 3D | o cartão gira seguindo o dedo ou o mouse, com brilho (lf-site.js:3187) | **Sai**: é reação de brinquedo. É o "videogame". |
| Reflexo nas lentes | uma faixa de luz atravessa as lentes de tempos em tempos (lf-site.js:3183) | **Sai**: brilho que passa é clichê de loja barata. |

E as 6 animações do slide (fade, deslize, virar, zoom, círculo, pilha) viram **uma só: fade longo** (decidido no formato).

## Resultado

Sem a seção "Efeitos" no app: o site tem **um jeito só de se mover**, elegante e sempre igual:
- a entrada suave ao abrir;
- a respiração lenta;
- o fade longo entre as fotos.

Regra 17: uma curva e um tempo para tudo. Como é movimento, o esboço vai em **vídeo MP4** (a regra proíbe GIF).
