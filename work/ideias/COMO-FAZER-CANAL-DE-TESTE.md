# Canal de teste — o "LaFouch Teste" recebe primeiro, o oficial só recebe o que passou (esboço · IDEIAS · 28/11/2026)

Pedido do dono: celular de testes (aprovado 28/11 08:22) + "começar pela atualização ao vivo e o app de testes" (28/11 16:55).
Base: work/esboco/atualiza/COMO-FAZER-ATUALIZA-AO-VIVO.md (ramo app/atualiza-ao-vivo) e work/nuvem/AREA-TESTES-28-11.md.
Tipo: por dentro (regra 6b) para o app oficial — nenhuma tela dele muda. Só o app de teste ganha uma marca "TESTE" (abaixo).
Publicação: Fases 2 e 3 JUNTAS (dono 28/11 16:55) — o APK único leva o atualizador ao vivo e o canal.

## A ideia em uma frase
O MESMO pacote (`www-<v>.zip`, mesma soma) vai primeiro para o canal de teste; o oficial só recebe esse mesmo arquivo depois
que ele passou no celular de testes e o dono disse PUBLICAR. O que vai para o dono é byte a byte o que foi testado.

## 1. Dois apps, um código (um lugar só decide o canal)
| | Oficial | Teste |
|---|---|---|
| Nome no celular | La Fouch | LaFouch Teste |
| appId (Android) | com.lafouch.app | com.lafouch.app.teste |
| Dados no aparelho | os da loja | separados (outro appId = outro armazenamento) |
| Nuvem | projeto real | projeto "lafouch-teste" (NUVEM) |
| Canal da atualização ao vivo | `/version.json` | `/teste/version.json` |
| Marca visual | nenhuma | faixa fina "TESTE · vNNN" no topo + ícone com a marca T |

- O canal NÃO é uma escolha dentro do app: vem do build. Um arquivo só, `src/01-canal.js`, gerado pelo build a partir da
  variante (`APP_CANAL = 'oficial' | 'teste'`) — dele saem o endereço do version.json, a configuração da nuvem e a marca.
  Nenhum outro arquivo testa "se é teste".
- O app de teste não contém o identificador do projeto real (trava da NUVEM, conferida no build).
- O build-apk.yml gera os DOIS APKs na mesma rodada (mesmo código, só a variante muda): `LaFouch.apk` e `LaFouch-Teste.apk`.

## 2. Publicar = sempre primeiro no teste
- `publicar-app.yml` (push em main): monta `www-<v>.zip` + soma e publica SÓ em `/teste/` no GitHub Pages
  (`/teste/version.json` + `/teste/www-<v>.zip`). O `/version.json` oficial não é tocado.
- O LaFouch Teste baixa, instala e abre sozinho (mesmo mecanismo do atualizador ao vivo: notifyAppReady no 1º desenho,
  volta para a última boa se não desenhar em 10 s).

## 3. Passar no teste
Uma versão está "boa no teste" quando:
1. o Argus deu SELO para o commit (regra 21), e
2. o LaFouch Teste abriu essa versão (notifyAppReady) e rodou o roteiro de toques sem nenhum relatório de erro novo
   (relatórios: área de testes da NUVEM, lidos por `tools/relatorios.py`), e
3. a ESBOCO deu "OK ESBOCO" nas telas mexidas.

## 4. Promover = o dono diz PUBLICAR
- Novo workflow `promover-app.yml` (disparado só com o PUBLICAR do dono, como hoje o APK):
  copia `/teste/www-<v>.zip` para a raiz e grava o `/version.json` oficial com a MESMA `soma`.
  Não reconstrói nada (reconstruir = arquivo diferente do testado).
```
gh api -X POST repos/JamalYassine98/LaFouch/actions/workflows/promover-app.yml/dispatches -f ref=main -f inputs[versao]=NNN
```
- O app oficial recebe pelo atualizador ao vivo como sempre ("Atualização pronta · Atualizar agora" — tela igual).
- Voltar atrás: promover a versão anterior (o zip dela continua publicado) — sem APK.

## 5. Relatório de erro (só no app de teste)
- Um lugar só, `src/97-relatorio.js`, carregado só quando `APP_CANAL === 'teste'`: pega erro (`error`, `unhandledrejection`)
  e falha de tela do Argus, grava na área de testes da NUVEM: versão, tela, ação, mensagem, pilha e a foto da tela.
- O app oficial não tem esse arquivo (nada sai do celular do dono para relatórios).

## 6. PC (Windows)
Agora não: o celular de testes cobre o app. O PC oficial recebe a versão promovida pelo mesmo `/version.json`
(o pacote é o mesmo). Instalador de teste para PC só se o dono pedir depois.

## Fatias para a APP (uma por vez, cada uma com porta rápida; a completa e o selo no fim)
1. `src/01-canal.js` + build com a variante; endereço do version.json a partir dele (o oficial continua igual).
2. `publicar-app.yml` publica só em `/teste/`; `promover-app.yml` copia o mesmo zip para o oficial.
3. Variante teste no build-apk.yml (appId, nome, ícone com T, faixa TESTE) → dois APKs.
4. Relatório de erro (com a NUVEM: projeto de teste + interruptor da configuração pelo `src/01-canal.js`).
5. Junto com a Fase 2: subir `APP_NAT` para 2 e gerar os dois APKs (pedido do dono, regra 21).

## Apaga o que substitui (regra 12d)
- A publicação direta no `/version.json` oficial a cada push sai do publicar-app.yml (passa a ser só o promover).

## Trava no Argus (regra 12e)
1. O app oficial nunca lê `/teste/` e o de teste nunca lê o `/version.json` oficial.
2. `promover-app.yml` não reconstrói: a soma do oficial = a soma do teste da mesma versão.
3. O APK de teste não contém o identificador do projeto real; o oficial não contém `97-relatorio.js`.
4. "Se é teste" só existe em `src/01-canal.js`.

## O que o dono faz (uma vez)
1. Criar o projeto Firebase "lafouch-teste" (passos virão da NUVEM; Blaze com alerta de US$ 1).
2. Instalar o `LaFouch-Teste.apk` no celular de testes (fica ao lado do oficial).
3. Depois disso, para cada versão: dizer PUBLICAR quando ela passar no teste.

## Telas
Oficial: nenhuma muda. Teste: faixa fina "TESTE · vNNN" no topo e ícone com a marca T (para nunca confundir os dois apps).

## Não testado
Estudo e desenho. Nada rodado no simulador nem em aparelho.
