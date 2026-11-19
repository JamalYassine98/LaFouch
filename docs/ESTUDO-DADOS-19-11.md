# Estudo da base de dados do app e do site — 19/11/2026 (S436, só leitura)

Pedido do dono (13:21): "O que é uma boa estrutura de base de dados?" → estudar como o app e o site guardam os dados hoje. NADA foi mudado. Fontes: src/99-render-persistencia.js, src/05-sync.js, src/97-sync*.js, src/97-nuvem-segura.js, src/96-loja-online.js, firestore.rules, CODEMAP.md, docs/SINCRONIZACAO-ANALISE.md (02/11) e leitura pública da nuvem (produtos 19, fotos 20, estoque 5, config 1).
Limite: não vi os dados reais do celular do dono (tamanho, anos de vendas); a sincronização liga e desliga por aparelho (S.syncOn) e não sei se está ligada no aparelho dele.

## Como é hoje
- **App:** tudo fica num objeto só (`S`), com 199 "gavetas" (lista PERSIST), gravado no próprio aparelho: localStorage (uma chave só, JSON) + IndexedDB para as listas grandes (vendas, fechamentos, registros, contas pagas, sincronização) e para as fotos (`lafouch-fotos`). Cada aparelho tem a sua cópia.
- **Nuvem do app:** cópia de segurança inteira em `backups/` (dividida em partes), automática a cada hora se mudou; registro dos aparelhos (`backups/zap-<aparelho>`, desconectar). Sincronização entre aparelhos por MOVIMENTOS (`mov/`): estoque e caixa viajam como diferença (+2, −1), cada movimento com id `<aparelho>-<contador>` (aplicar duas vezes não muda nada).
- **Site:** lê `produtos/<ref>` (vitrine publicada pelo app), `fotos/<ref>~n` (foto em texto, em partes), `config/` e `estoque/<ref>` (reservas de 10 min, só a função grava). Cliente só CRIA pedido (nunca lê nem muda). `clientes/<uid>` = conta de cada cliente; `pisos/` nunca vai para o site.

## O que já está bom
1. **Segurança:** regras no projeto (firestore.rules), dono identificado por conta + e-mail, cliente só cria pedido, piso fechado, coleções sem regra ficam fechadas.
2. **História que não se apaga:** movimentos com id único por aparelho; dois aparelhos vendendo somam, nada é sobrescrito.
3. **Não lota o aparelho:** as listas que crescem (vendas etc.) já saíram do localStorage para o IndexedDB.
4. **Cópia automática** de hora em hora.

## O que poderia melhorar (cada um vira estudo/esboço antes; nada decidido)
| # | Hoje | Risco | Ideia |
|---|---|---|---|
| A | Um "baú" único com 199 gavetas, regravado inteiro a cada mudança | fica lento com os anos; difícil saber o que é de quê; uma gaveta estragada pode afetar o resto | separar por assunto (Peças, Vendas, Dinheiro, Clientes, Site, Ajustes), cada um com a versão do seu formato |
| B | A ficha de uma peça está espalhada em várias gavetas por código (nome, preço, piso, fotos, memória do modelo…) | apagar ou renomear uma peça deixar restos (já houve "limpaRefExcluido"/"S.excl" para isso) | uma ficha por peça com tudo dentro |
| C | O site tem estoque em dois lugares (`produtos.est/qs` e `estoque/<ref>` das reservas) | os dois discordarem (peça "disponível" que não está) | uma fonte só de estoque para o site; `produtos` fica só com a vitrine |
| D | Nomes curtos de campo no site (`n`, `est`, `fv`, `gq`, `l2`, `mv`…) | ninguém lembra o que é; erro ao mexer | dicionário dos campos num doc (sem mudar o formato) |
| E | Fotos guardadas como texto dentro de documentos, em partes | limite de 1 MB por documento; pesa na leitura | guardar no Storage do Firebase (conferir custo antes) |
| F | Regras com o dono fixo | funcionário/segundo usuário exige reescrever | papéis (dono, vendedor) quando chegar a hora |
