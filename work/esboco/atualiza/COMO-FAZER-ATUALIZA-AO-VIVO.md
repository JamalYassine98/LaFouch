# Atualização ao vivo do APK — sem versão velha embaixo (esboço · ESBOCO · 26/11/2026)

Pedido do dono (26/11 12:04–12:05): "não tem algum método para ele ser limpo como se eu tivesse gerado?" → "Sim, vamos primeiro por isto".
Tipo: **conserto por dentro (regra 6b)** — nenhuma tela, botão ou texto muda. O APK novo (uma vez) e a publicação seguem as regras 20/21.

## O que o dono viu
Abriu o app e "voltou versões": o Guardião de novo, sumiram os botões do início. Depois de tocar em Atualizar, voltou para a v641.

## Causa (regra 12a)
1. O APK de 15/11 traz dentro a cópia do app daquele dia (www/ empacotado). Cada versão nova é baixada por cima
   (src/97-atualiza.js: app.js + style.css no cache `lafouch-upd`) e o carregador do index.html (`/*LOADER*/`, EMB) escolhe a mais nova.
2. A confirmação de que a versão nova abriu bem é um **cronômetro de 4 s** (fim de src/97-atualiza.js: zera `tent`).
   Abrir e fechar (ou o Android matar o app) antes de 4 s, duas vezes → `tent ≥ 2` → o carregador **apaga** a versão baixada
   e volta para a cópia de 15/11. A reserva é sempre a do pacote, que fica mais velha a cada dia sem APK.
3. Só app.js e style.css são trocados: index.html, sw.js, imagens e sons ficam os de 15/11 (meio velho, meio novo).

## Jeito natural (regra 12b): o app inteiro troca e vira a base
Usar o mecanismo próprio do Capacitor para isso: o plugin **@capgo/capacitor-updater** (código aberto, MPL-2.0, sem nuvem paga),
linha compatível com o Capacitor 6 do projeto, em **modo manual** (sem o servidor da Capgo):
- `capacitor.config.json` → `plugins.CapacitorUpdater = { autoUpdate: false, statsUrl: "", appReadyTimeout: 10000 }`
  (statsUrl vazio = nada sai do aparelho para terceiros).
- **Publicar (build):** a cada versão, junto do www/ no GitHub Pages, sai `www-<v>.zip` (a pasta www inteira) e o version.json
  ganha `zip` (endereço) e `soma` (sha256). Arquivo cortado não instala (o plugin confere a soma).
- **Baixar:** a busca de hoje (updBusca) passa a chamar `CapacitorUpdater.download({ url, version, checksum })`.
  O aviso "Atualização pronta" e a janela "Atualizar agora" ficam **iguais**; "Atualizar agora" chama `CapacitorUpdater.set({ id })`.
- **Confirmar que abriu (um lugar só):** `CapacitorUpdater.notifyAppReady()` é chamado **quando a primeira tela termina de desenhar**
  (fim do primeiro render), não por tempo. Se a versão nova não desenhar em 10 s, o próprio plugin volta para **a última versão que
  abriu bem** — nunca para a de 15/11.
- **Limpeza:** depois do notifyAppReady de uma versão nova, `list()` e `delete()` de tudo que não for a atual nem a anterior boa.
  No aparelho ficam no máximo duas: a atual e a reserva recente.
- **Navegador (PWA):** continua com o sw.js como hoje — nada muda ali.

## PC (Windows) — o mesmo jeito (dono 26/11 12:08: "que funcione para PC também")
Hoje o PC tem o mesmo problema: o servidor local do desktop/main.js serve o app (raiz) da cópia do **instalador** e o mesmo
`/*LOADER*/` põe app.js/style.css por cima (mesmo cronômetro de 4 s, mesma volta para a cópia velha). Só a /loja/ já troca inteira
(desktop/pc-atualiza.js, pasta `lojaupd`).
- **Um pacote só para os dois:** o PC baixa o **mesmo** `www-<v>.zip` (mesma `soma`) para a pasta de dados do Windows
  (`userData/app/<v>/`), e o servidor local passa a servir **o app inteiro** (raiz e /loja/) da última versão boa —
  é a mesma ideia do `lojaupd`, estendida à pasta toda (a parte /loja/ separada sai: vem dentro do mesmo pacote).
- **Confirmar que abriu (o mesmo lugar do Android):** uma função só no app, `appPronto()`, chamada no fim do primeiro render:
  no Android chama `CapacitorUpdater.notifyAppReady()`, no PC faz `POST /__pronto` ao servidor local (só da própria janela,
  como o `origemOk` de hoje). Sem o "pronto" em 10 s, o main.js volta para a versão boa anterior e recarrega.
- **Limpeza:** no máximo duas pastas (atual + anterior boa); a cópia do instalador fica só como a primeira de todas.
- **"Atualizar agora":** mesmo botão e mesma janela; no PC recarrega a janela já servindo a pasta nova.
- **O instalador novo (LaFouch-Setup) continua** só para mudança do Electron; uma vez só agora, para levar este mecanismo:
```
gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-windows.yml/dispatches -f ref=main
```
- **Trava (Argus):** `node desktop/teste-pc.js` ganha: versão A boa → B sem "pronto" → volta para A; nunca mais de duas pastas;
  zip com soma errada não instala.

## Apaga o que substitui (regra 12d), no mesmo passo
- O carregador `/*LOADER*/` do www/index.html (EMB, `lf_upd`, `tent`, cache `lafouch-upd`) → volta a ser só `<script src="app.js">`.
- Em src/97-atualiza.js: o download de app.js/style.css para o cache, `lf_upd`/`lf_updok`/`tent` e o cronômetro de 4 s.
- Limpar uma vez no aparelho: `caches.delete('lafouch-upd')` e as chaves `lf_upd`, `lf_updok`.
- No PC: a parte separada da /loja/ (`lojaupd`, buscaLoja) do desktop/pc-atualiza.js — o pacote inteiro a substitui.
- **Fica:** src/97-atualiza-apk.js, a busca do instalador no PC e o `APP_NAT` (mudança no Android — câmera, biometria, sons — ainda pede APK novo).

## Uma vez só: APK novo
O plugin é parte do Android, então precisa **um APK novo** (subir `APP_NAT` para 2: o app de hoje avisa "precisa de um APK novo").
Gerar só com o pedido do dono (regra 21):
```
gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/build-apk.yml/dispatches -f ref=main
```
Depois desse, as atualizações do app chegam inteiras sem APK.

## Trava no Argus (regra 12e) — setor_app
1. Nenhum `/*LOADER*/`, `lafouch-upd`, `lf_upd` nem cronômetro de confirmação no código.
2. `notifyAppReady` chamado uma vez, no fim do primeiro render (simulado com um CapacitorUpdater falso no simulador).
3. No Android emulado: instalar versão A boa → versão B que não desenha → o app volta para **A** (não para a do pacote).
4. version.json com `zip` e `soma` que batem com o zip publicado.

## Telas
Nenhuma muda (Ajustes › Atualização do app, a faixa "Atualização pronta" e a janela "Atualizar o La Fouch?" ficam iguais).
Comparador Hoje × Proposta: não se aplica (sem tela).

## Não testado
Estudo do código e da documentação do plugin. Nada rodado no simulador nem no aparelho ainda.
