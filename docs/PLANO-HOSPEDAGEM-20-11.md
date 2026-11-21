# Plano da hospedagem (20/11/2026 23:59, NUVEM — só estudo, nada mudado)

## Correção primeiro
A minha lista FALTA-PARA-LANCAR dizia que o site ainda estava no GitHub Pages. **Errado:** o dono já mudou o SITE para a **Cloudflare Pages** em 16/11 (docs/SITE-COMO-FUNCIONA.md, 16/11 15:15). lafouch.com e www.lafouch.com estão lá, ativos.

## O que ainda está no GitHub Pages
**O APP** (pasta `www/` do repositório LaFouch, workflow `publicar-app.yml`), incluindo a cópia do site do modo loja (`www/loja`).
- O APK e o instalador do Windows trazem o app dentro deles (o endereço interno é do próprio aparelho). Do GitHub Pages eles só BAIXAM AS ATUALIZAÇÕES: `UPD_URL = 'https://jamalyassine98.github.io/LaFouch/'` em src/97-atualiza.js.
- Tamanho: 21 MB, 123 arquivos. Hoje sai uma publicação por versão (10 só em 20/11).

## Precisa mudar?
As regras do GitHub Pages dizem que ele não pode ser usado para loja ou site voltado a vender. O app é a ferramenta da loja, e o modo loja mostra o catálogo para a cliente: não é a vitrine pública, mas é trabalho da loja. Para não depender disso, a recomendação é tirar também o app do GitHub Pages antes de lançar.

## Para onde: as duas opções
| | **A. Firebase Hosting** (recomendado) | B. Cloudflare Pages (como o site) |
|---|---|---|
| Configuração | Nenhuma conta nova: o projeto Firebase já existe e a conta de publicação do GitHub já tem a permissão de Hosting (firebase.developAdmin) | 2º projeto na Cloudflare + uma chave da Cloudflare nos segredos do GitHub (o dono cria) |
| Limite que pesa | Grátis até 10 GB guardados e 360 MB/dia de download (depois US$ 0,15/GB). O app tem 21 MB e só os aparelhos do dono baixam: fica muito longe do limite | 500 publicações por mês **na conta toda**, somando com o site. O app publica até 10 vezes por dia: estoura em poucos dias (a não ser publicando por "envio direto", que ainda precisa ser confirmado) |
| Endereço | lafouch-2f6bd.web.app (ou app.lafouch.com, se quiser, apontando o DNS na Cloudflare) | lafouch-app.pages.dev (ou app.lafouch.com) |
| Publicar | O mesmo workflow da nuvem ganha a opção "app" | Workflow novo |

## Como fazer (opção A), em partes — cada parte consultando o dono
1. ✅ **21/11 08:05 (run 44897070745)** — **NUVEM:** `firebase.json` ganha `hosting` com a pasta `www`; o workflow `publicar-nuvem` ganha a opção `app`; primeira publicação; conferir no ar que app.js, style.css e version.json abrem no endereço novo (sonda). Nada muda para os aparelhos ainda.
2. **APP:** `UPD_URL` passa para o endereço novo; `publicar-app.yml` passa a publicar no Firebase (sai o GitHub Pages). Como tudo é teste (dono 20/11 15:28), sem período de transição: gerar o APK novo e reinstalar nos aparelhos.
3. **Dono:** instalar o APK novo (e o instalador do Windows, se usar), e no fim desligar o GitHub Pages do repositório (Settings › Pages).
4. **Opcional:** `app.lafouch.com` apontando para o Firebase (um registro no DNS da Cloudflare).

Riscos: (1) um aparelho com o APK velho para de receber atualização quando o GitHub Pages desligar → por isso a parte 3 vem por último; (2) se o app for aberto pelo navegador (não pelo APK) no endereço antigo, os dados guardados só no aparelho não vão junto para o endereço novo; o que está na nuvem volta sozinho.

## Decisão do dono
21/11 08:00 — "Aprovado A, parte 1 agora e o resto no fim": Firebase Hosting. Parte 1 no ar (lafouch-2f6bd.web.app, em paralelo; nada mudou nos aparelhos). Partes 2 e 3 só no fim, antes de lançar.
