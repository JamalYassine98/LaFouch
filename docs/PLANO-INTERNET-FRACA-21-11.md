# Internet fraca — o que foi medido e o plano em partes (SITE · implementa, 21/11/2026) — esboço para o dono

## Medido (rede limpa do GitHub, site no ar 1795225493, visita nova, celular; arquivo work/s430/rede/medida_github_21-11.txt)
| | topo aparece | 1º cartão | 1ª foto | baixado até a 1ª foto |
|---|---|---|---|---|
| 4G fraco (400 kbps, 3 medidas) | 4,7–5,3 s | 19,9–21,2 s | 30,3–31,9 s | ~1.150 KB |
| 4G bom (4 Mbps) | 0,6 s | 4,9 s | 6,1 s | ~1.290 KB |

A medida de ontem no simulador (13 s / 16 s) estava otimista: a rota do simulador guarda arquivos. Vale esta.

## Onde o tempo vai (4G fraco)
1. **Programa do site: 271 KB**, de 1,8 s a 15,2 s. Nada de peça aparece antes dele terminar.
2. **Junto com ele descem:** a foto grande do destaque em PNG (154 KB), duas letras do Google (114 KB) e o logo (18 KB).
3. **Selo do reCAPTCHA (App Check): 353 KB + até 8 s de espera.** As peças só eram pedidas 4 s depois de o programa rodar, e as fotos mais 4 s depois: a leitura do catálogo (que é pública) ficava esperando o selo. Mesmo em 4G bom isso custava ~4 s.
4. **Fotos:** cada foto é um documento da nuvem (20–25 KB), pedidas uma a uma depois das peças: 5–7 s.

## Partes
- **Parte 0 — FEITA nesta noite (por dentro, regra 6b, nenhuma tela muda):** a leitura pública do catálogo não espera mais o selo; o selo só é pedido depois que as fotos da primeira tela chegaram. Prova nova no porteiro. Ganho esperado: ~8 s no 4G fraco e ~4 s no bom (será medido no ar depois de publicar).
- **Parte 1 — a página já chega com a primeira tela:** o topo e as primeiras peças (nome, preço, foto pequena) vão escritos na própria página pelo robô que já gera as páginas das peças. A pessoa vê a loja em ~5 s no 4G fraco em vez de 20–30 s; o programa completa o resto depois. Não muda o desenho de nenhuma tela. Precisa da NUVEM/APP: as fotos também como arquivo do site (hoje moram só na nuvem).
- **Parte 2 — programa em pedaços:** o que só serve depois (consulta do grau com câmera, conta, pagamento, atacado, formato do rosto) é baixado quando a pessoa abre. A varredura de código morto diminui o que sobra.
- **Parte 3 — o que desce junto:** foto do destaque em formato leve e no tamanho do aparelho (154 KB → ~30 KB); letras guardadas no próprio site, só os pesos usados.

## É remendo? (regra 12)
A parte 0 tira a espera na raiz (quem lê o que é público não precisa de selo) e fica num lugar só (`acFetch`/`fbg`). As partes 1–3 mudam a ordem em que as coisas chegam, não escondem demora com tela de carregando.

## O que o dono decide
- "Aprovado" para as partes 1 → 2 → 3 nessa ordem (a 1 é a que mais aparece). Cada uma vem com a medida antes × depois na mesma rede.
- A parte 1 pede trabalho do APP/NUVEM (fotos como arquivo). Se preferir não mexer nisso agora, a ordem vira 2 → 3 → 1.
