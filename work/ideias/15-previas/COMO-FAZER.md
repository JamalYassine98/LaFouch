# IDEIAS 15 · prévias de link (WhatsApp) · esboço pronto — esperando o dono (26/11)

**Pedido do dono (26/11 08:26):** análise rígida das prévias de link; depois "vamos elaborar essas propostas".

## Hoje (achados, conferidos nas 51 imagens de og/ e p/ do catalogo 17f3e97)
1. Início e Mochi com fundo rosa em degradê (#f8ebf2): contraria o "fundo branco em tudo" (23/11) e o rosa reprovado nos anúncios (25/11).
2. No quadradinho do meio (miniatura do WhatsApp) somem o logo e metade da frase (Início, Mochi).
3. Categorias (solar, armacao, grau, todos): faixa roxa #8c3a6b (não é a oficial #943d6f) com "LA FOUCH" em letra comum, sem dizer a categoria.
4. Peça: só a armação, sem marca nem nome.
5. Mochi como capa: desenho infantil como primeira impressão da marca.
6. Textos: "La Fouch" e "LaFouch" misturados; Início mistura pt e es na mesma descrição; descrição do X diferente da do WhatsApp; preço como "Gs. 46.000" (a regra 17 manda "G$ 46.000").

## Proposta (um padrão só para todas as prévias)
- Fundo branco, 1200×630. **Tudo o que importa fica no quadrado do meio (x 285–915)**: no grande e no quadradinho aparece igual.
- De cima para baixo: logo do site na cor oficial #943d6f (84 px) · a peça real (até 520×230) · título em Fraunces 600 46 px, cor do texto #2a1f27 · linha pequena em maiúsculas, Fraunces 600 20 px, #6b5a66.
- Início: "Óculos de sol e de grau" / "Lentes de sol y recetados" (o logo já diz "Tudo em óculos").
- Categoria: o nome dela ("Solar · Feminino"). Peça: o tipo ("Armação quadrada") e o código na linha pequena (o nome do Semp entra quando existir). Grau: "Descubra o seu grau · em 1 minuto, pelo celular", com uma armação real; o Mochi fica dentro da página.
- Sem preço na imagem: o WhatsApp guarda a prévia por dias e o preço podia ficar velho.

Pranchas: esboco-15-1-inicio-pt · 2-inicio-es · 3-sol-feminino · 4-peca-AC1050 · 5-grau (HOJE × PROPOSTA, grande + quadradinho). Gerador: previas.py (`python3 previas.py <catalogo>`; confere que a Fraunces carregou e que nada sai do quadrado).
Aprovados incluídos: 87 cor oficial (#943d6f), fundo branco em tudo (23/11), padrão editorial do Semp (25/11). Letra: só a Fraunces 600 (a do site); a linha pequena usaria Inter no site, que não está nas letras do Argus.

## Para o dono decidir
- Nome único nos textos: "La Fouch" (como no logo) ou "LaFouch".
- Prévias das datas (hoje o Mochi com chapéu, trocado todo dia pelo og-mochi.yml): ficam no mesmo padrão, só com o título da data, ou saem?

## Como fazer (regra 12)
- Um gerador só para TODAS as prévias (Início, categorias, peças, grau, datas), com o molde acima; sai o código das prévias rosas, da faixa roxa e da composição do Mochi, no mesmo passo.
- Textos das metatags vêm do mesmo lugar que os títulos das páginas: um idioma por página, nome da marca único, G$.
- Argus: (a) o logo, a peça e o título dentro do quadrado do meio; (b) fundo branco; (c) cor do logo = oficial; (d) og:title, og:description e twitter iguais por página e no idioma da página.
