# Como o site lafouch.com funciona (memória técnica)

Ler antes de mexer no site. Atualizar este arquivo SEMPRE que o site mudar (estrutura, rota, dado, regra).
Última revisão: 11/11/2026 (bloco 1 publicado: S176 1–2, S168/S169, S170).

## Onde está
- Repositório `catalogo` (`/home/claude/catalogo`), publicado pelo GitHub Pages ao dar push em `main` (domínio no `CNAME`). Sempre `git pull --rebase` antes.
- Não tem build: o que está no repositório é o que vai ao ar.
- Antes de publicar: `python3 /home/claude/lafouch/work/fiscal/porteiro.py` com 0 falhas (provas em `work/fiscal/provas.py`).
- Versão do cache: o número de `version.json` (`{"v":…}`) aparece 3 vezes no `index.html` (`?v=` dos scripts). Trocar todos pelo `date +%s` a cada publicação.
- Cópia de teste: `bash /home/claude/lafouch/work/mkcopy.sh <pasta> <porta>` num comando SEPARADO (o `pkill` mata o próprio shell se a linha tiver "http.server <porta>"). Serve em `/tmp/<pasta>`; o servidor some depois de cada resposta, então subir de novo no mesmo comando que usa: `(cd /tmp/x && python3 -m http.server P &)`.
- Simulador: Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`), bloquear tudo que não for localhost.

## Arquivos
- `index.html` (~280 KB): página única. Todo o CSS fica aqui (inclui os temas `html[data-ev=…]`, ~linha 1780), mais pequenos scripts de partida (`bootgz`, `bootp`, `bootprod`).
- `js/lf-site.js` (~680 KB): todo o comportamento (vitrine, peça, carrinho, conta, consulta do Mochi, temas, analisador, rotas).
- `js/lf-i18n.js`: traduções PT→ES. `LFI.tr('texto PT')`. O idioma fica em `localStorage lf_lang` e a moeda em `lf_cur`. Toda frase nova precisa entrar aqui (o porteiro tem a prova `r_idioma`).
- `admin.html`: o Painel (6 abas: Vitrine, Modelos, Mensagens, Temática, Analisador, Ajustes). Tem `noindex`. Também abre dentro do app (pnlAba, mensagens `lfPronto`/`lfResumo`/`lfGo`).
- Páginas de rota (`sol.html`, `lectura-mujer.html`, `descubra-o-grau.html`…): só SEO/og + `location.replace("/?r=<slug>")`.
- `modelo/<REF>.html` → `/?ref=<REF>`. `p/<REF>.html|.jpg|.fv`: página de compartilhar a peça (og próprio), feitas por `tools/gen_produtos.py`.
- `og/`: imagens de prévia do WhatsApp. Teste do Mochi: `og/mochi-pt.jpg`/`mochi-es.jpg` (v7) e `og/mochi-<tema>-pt|es.jpg` (natal, anonovo, maes, pais, bf, halloween). A Action `.github/workflows/og-mochi.yml` (todo dia 00:05 do Paraguai, ou manual) roda `tools/og_mochi.py`: lê `config/site` (evento manual > calendário `cal`) e troca o `og:image` de `descubra-o-grau.html` e `descubri-tu-graduacion.html`. `media/i/`: fotos. `media/voz/pt|es/`: áudios do Mochi (`lista.json` liga frase → arquivo). `lfx/`: face-api (teste de rosto), qr.js (PIX), bandeiras, `fone.json`.
- `privacidade.html`, `termos.html`, `404.html`.

## Rotas (`rtMapa`, `rtEntra`, `urlSync`)
- `?r=<slug>` abre um painel: `home`, `vitrine` (com tipo/gênero pelo slug: `lentes-de-sol-mujer` etc.), `rosto`, `atacado`, `como`, `duvidas`; os slugs existem em PT e ES (`RT.pt` / `RT.es`). Os antigos `recetados*` viram `lectura`.
- `?r=descubra-o-grau` / `descubri-tu-graduacion` abre a consulta do Mochi (`__lfGzAbre`, classe `bootgz`).
- `?ref=<REF>` abre a peça. Outros parâmetros: `busca`, `carrinho`, `conta`, `evp=<tema>` (prévia do tema, não conta no analisador), `cliente=1` (o dono vendo como cliente).

## Dados (Firebase, projeto em `FB.p`, chave pública `FB.k`)
- Leitura: `produtos?pageSize=300` (o APP publica preço, estoque `qs` por cor, fotos, `fv`, `gv` do giro 360°, ofertas `de`/`n`) e `config/site` (destaque `dmodo`/`dauto`/`dmot`, `slide`, `evento`, `cal`, `calv`, aviso de site fora do ar). Cópia local em `localStorage lf_pdocs`.
- O site nunca decide preço: vem do app. Oferta = `p.de > p.n` (`isOf`).
- Escrita: `pedidos` (regras com `hasOnly`, incluindo `depE`, `uq`, `pagar`), `vistas`, `clientes/<uid>` (conta), avaliações.
- Funções (`southamerica-east1`): `reserva` (reserva de estoque por pedido/cor; o servidor decide a hora), `codigo` (código de 6 números por e-mail para a conta, via Resend), `mensagem` (contato e atacado), `analise` (contagens anônimas por visita; o painel lê o resumo com `ehDono`), `midia` (fotos e vídeos ao GitHub com a chave só no servidor). Código em `/home/claude/lafouch/functions`.
- Pagamento: PIX com QR gerado (`loadQr`) ou Itaú; retirada em CDE ou delivery.

## Partes principais
- **Início:** destaque (Nada/Automático/Um produto/Vídeo/Slide; zoom lento + bolinha com barra), selos Delivery/Pago seguro/Retiro, "Comprá por categoria", Novidades, "Empieza por aquí" (Mochi, rosto, dúvidas), atacado, rodapé.
- **Vitrine/catálogo:** `#grid` com `.card`; abas de gênero; filtros (`.chip[aria-pressed]` usa `--ac`); etiquetas do tipo, "Llegó esta semana", "Últimas N unidades"; a busca é tolerante (`btol`: sinônimos em `BTOL_SIN`, ex. piloto=aviador; número 0,5–6 vira grau `+2.00` e casa com `p.gr` com estoque, sem casar com códigos; `btolEntende` mostra "Mostrando X (é o mesmo que Y)" / "Entendido: leitura +2,00"; sem resultado mostra as categorias `socats()`).
- **Peça:** rótulos "Cor"/"Grau" ficam em `<span>` para a tradução pegar (COLOR); o material não repete quando é igual à etiqueta; WhatsApp na peça fica acima da barra Comprar (`--buyh`, style `#s176wa` no fim do body, `scale:.78`). Galeria (tocar para ampliar, 360°), cor, medidas (lente/ponte/haste), chips (gênero, material, UV400), quantidade + Comprar fixo embaixo, favoritos, compartilhar.
- **Consulta do Mochi (`#gw`):** personagem em SVG (`__LFGZ.Z.m`: `acena`, `vira`, `cara`, `calou`, `paraGesto`, `vara`), voz PT/ES gravada (ElevenLabs; nada de gravar sem autorização de créditos), rodízio de frases (`roda`, `frRoda`, `fLenteD`, `temVoz`), puxar para atualizar dentro do `#gw`.
- **Temas:** `html[data-ev=natal|halloween|bf|anonovo-d|anonovo-n|maes|pais]`; S170 (bloco no fim do CSS dos temas + bloco no fim do lf-site.js): todos no mesmo padrão (catálogo claro, cor forte só na faixa/destaque/rodapé; Halloween claro; Mães e Pais com tema), `--evb` = cor do contorno (2 px, 72%) dos cards, animação leve `.evfx` só no destaque (para em ~10 s, some com menos movimento), selo `.evse` nos 4 primeiros cards do Início e do catálogo (no catálogo no lugar da etiqueta), faixa `.evlf` acima do `#grid`; textos em PT traduzidos por `LFI.tr`. As etiquetas pretas `.tg` dos cards do catálogo ficam escondidas sempre (inclusive NUEVO); `evAtivo` = evento manual (prioridade) ou calendário (`calOc`/`calProx`/`calSt`); chapéus e óculos do Mochi em `TEMA_M`. A barra do tema fica em `#evbar`.
- **Analisador:** `anEnvia` manda ao sair da visita (não manda em frame, com `cliente=1` nem com `evp`).
- **Conta:** e-mail com código, favoritos, pedidos.
- **Peça esgotada (S173-3A):** `voltaSec` mostra e-mail + "Avisar-me quando voltar" → função `volta` (`functions/volta.js`, coleção `voltas`, máx. 10 pendentes por e-mail, campo escondido anti-robô, e-mail entra nos inscritos); o gatilho `voltaAvisa` (produtos/{ref} sai de "Esgotado") manda 1 e-mail só (Resend). Já pedido: `localStorage lf_voltas`.
- **Favorito que voltou (S173-3B):** `favVolta` (depois do estoque real do Firestore) compara com `lf_favesg` (favoritos esgotados na visita anterior) e mostra a faixa `#fvolta` no topo (12 s, Ver/×).

## Aprovado e ainda NÃO implementado (conferir em MEMORIA-PROJETO.md)
S172 A–D, S173-4 (oferta de parado no site), Leve 2 no site, S174 (cupons/cartões virtuais), segurança do painel (2FA TOTP, passkey, sessão, aviso de login, regras, App Check, retenção 12 meses, CSP).
