# Limpeza do app — 14/11/2026 (v509)

Regra aprovada pelo dono: só sai o que o programa provar que é velho; função com uma única porta não sai; tudo pode voltar.

## 1 · Código que nada no app chamava (35 itens, 678 linhas)

Como foi provado: um analisador de JavaScript (acorn) leu os 144 módulos; cada função e cada ação `ACT.x` foi procurada no app inteiro e nos testes; saiu só o que aparecia uma única vez (a própria declaração). Foram 3 rodadas, porque ao tirar uma função outras ficam sem uso. Script: `work/s270/limpa.js`.

| Rodada | Tipo | Nome | Módulo | Linhas |
|---|---|---|---|---|
| 1 | função | `btolSugere` | `00b-busca-tolerante.js` | 28 |
| 1 | função | `splitAbre` | `40-formatos-venda.js` | 20 |
| 1 | função | `usdParaCampo` | `41-moeda-campos.js` | 5 |
| 1 | função | `metaDiaHtml` | `54-analises.js` | 42 |
| 1 | função | `perigosoHtml` | `57-financas.js` | 21 |
| 1 | função | `siteSwitch` | `64-identidade.js` | 43 |
| 1 | função | `nvAutoCard` | `85-novo-modelo.js` | 39 |
| 1 | função | `nvCampo` | `85-novo-modelo.js` | 13 |
| 1 | função | `nvOpcoes` | `85-novo-modelo.js` | 49 |
| 1 | função | `nvFld` | `85-novo-modelo.js` | 21 |
| 1 | função | `marcaOk` | `88-movimento.js` | 14 |
| 1 | função | `periodoHtml` | `89-dash-abas.js` | 29 |
| 1 | função | `dTabsHtml` | `89-dash-abas.js` | 10 |
| 1 | função | `faltamHtml` | `91-cambio.js` | 14 |
| 1 | função | `trocarMoedasHtml` | `91-cambio.js` | 29 |
| 1 | função | `fxGraficos` | `91-cambio.js` | 17 |
| 1 | função | `pedImg` | `95-pedidos.js` | 14 |
| 1 | função | `pedStLabel` | `95-pedidos.js` | 6 |
| 1 | função | `resRestaDe` | `95-reserva.js` | 7 |
| 1 | função | `resLibera` | `95-reserva.js` | 4 |
| 1 | ação | `volauto` | `96-ajustes.js` | 6 |
| 1 | ação | `faixaauto` | `96-ajustes.js` | 8 |
| 1 | ação | `fdel` | `96-ajustes.js` | 18 |
| 1 | ação | `fadd` | `96-ajustes.js` | 10 |
| 1 | ação | `lojaRecarregar` | `96-loja-online.js` | 4 |
| 1 | ação | `cupVip` | `97-cupons.js` | 21 |
| 1 | função | `mcAjHtml` | `97-modo-cliente.js` | 9 |
| 1 | função | `avSomDe` | `97-push.js` | 4 |
| 1 | função | `apHistHtml` | `97-sync.js` | 15 |
| 1 | ação | `fnVolta` | `97u-navegacao-s184.js` | 2 |
| 1 | função | `pixLojaEsperando` | `97z-pix-email.js` | 6 |
| 2 | função | `parGaugeHtml` | `91-cambio.js` | 18 |
| 2 | função | `fxGrafico` | `91-cambio.js` | 37 |
| 2 | ação | `precoap` | `98-financeiro.js` | 21 |
| 3 | função | `lineSvg` | `91-cambio.js` | 82 |

Para devolver um item: `git show 40da984:src/<módulo>` traz o módulo como era antes; copia-se a função de volta.

## 2 · Portas repetidas

- **Compartilhar uma peça:** havia duas portas (a janela antiga com Folha/Fotos/apps e o Compartilhar novo, por link). O botão de compartilhar da peça e o gesto de deslizar abrem agora direto o novo.
- **Ficha da peça:** a aba "Vender" e o botão flutuante "Vender esta" saíram do Inventário; as abas Estoque/Histórico/Site/Preço saíram do Catálogo (S267).

## 3 · Parece velho, mas é a única porta — NÃO apaguei (decisão do dono)

- **Janela antiga "Compartilhar" do catálogo inteiro** (Folha · Fotos · Só texto + WhatsApp/Instagram/Copiar link): é a única forma de mandar o catálogo filtrado de uma vez. O Compartilhar novo trabalha com peças escolhidas. Se o catálogo inteiro passar a sair pelo novo (por exemplo, o PDF do lojista), esta janela e o módulo `97-enviar-catalogo.js` podem sair.
- **Marketing, Estúdio, Lista de compras e convite de atacado:** cada um tem a própria saída de compartilhar; não conferi na tela se são repetidas.

## 4 · O que esta limpeza NÃO cobre

- Telas que existem mas a que nenhum botão chega: precisa do explorador (bloco 5), que ainda não foi construído.
- Estilos (CSS) sem uso.
- Dados da loja: nada foi tocado.
